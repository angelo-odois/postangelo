import Stripe from "stripe";
import { AppDataSource } from "../data-source.js";
import { User, UserPlan, SubscriptionStatus } from "../entities/User.js";

// Initialize Stripe lazily to avoid errors in development
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error("Stripe API key not configured. Set STRIPE_SECRET_KEY environment variable.");
    }
    stripe = new Stripe(apiKey, {
      apiVersion: "2025-11-17.clover",
    });
  }
  return stripe;
}

function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

// Price IDs from environment
const PRICE_IDS = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || "",
  business_monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || "",
  business_yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || "",
};

// Map price IDs to plans
function getPlanFromPriceId(priceId: string): UserPlan {
  if (priceId === PRICE_IDS.pro_monthly || priceId === PRICE_IDS.pro_yearly) {
    return UserPlan.PRO;
  }
  if (priceId === PRICE_IDS.business_monthly || priceId === PRICE_IDS.business_yearly) {
    return UserPlan.BUSINESS;
  }
  return UserPlan.FREE;
}

// Map Stripe status to our status
function mapStripeStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "past_due":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return SubscriptionStatus.CANCELED;
    case "trialing":
      return SubscriptionStatus.TRIALING;
    default:
      return SubscriptionStatus.ACTIVE;
  }
}

export const stripeService = {
  /**
   * Get or create a Stripe customer for a user
   */
  async getOrCreateCustomer(user: User): Promise<string> {
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const customer = await getStripe().customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id,
      },
    });

    // Save customer ID to user
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update(user.id, { stripeCustomerId: customer.id });

    return customer.id;
  },

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(
    user: User,
    plan: "pro" | "business",
    billingPeriod: "monthly" | "yearly" = "monthly"
  ): Promise<string> {
    const customerId = await this.getOrCreateCustomer(user);

    const priceKey = `${plan}_${billingPeriod}` as keyof typeof PRICE_IDS;
    const priceId = PRICE_IDS[priceKey];

    if (!priceId) {
      throw new Error(`Price ID not configured for ${plan} ${billingPeriod}`);
    }

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL || "https://revuu.com.br"}/admin/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "https://revuu.com.br"}/admin/subscription/canceled`,
      metadata: {
        userId: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          plan,
        },
      },
      allow_promotion_codes: true,
    });

    return session.url || "";
  },

  /**
   * Create a customer portal session for managing subscription
   */
  async createPortalSession(user: User): Promise<string> {
    if (!user.stripeCustomerId) {
      throw new Error("User does not have a Stripe customer ID");
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL || "https://revuu.com.br"}/admin/subscription`,
    });

    return session.url;
  },

  /**
   * Handle checkout.session.completed event
   */
  async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.metadata?.userId;
    if (!userId) {
      console.error("[Stripe] No userId in checkout session metadata");
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      console.error(`[Stripe] User not found: ${userId}`);
      return;
    }

    // Get subscription details
    if (session.subscription) {
      const subscription = await getStripe().subscriptions.retrieve(
        session.subscription as string
      );

      const plan = getPlanFromPriceId(subscription.items.data[0]?.price.id || "");

      // Get billing period dates from the subscription
      const subData = subscription as any;
      const periodStart = subData.current_period_start || Math.floor(Date.now() / 1000);
      const periodEnd = subData.current_period_end || Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

      await userRepository.update(userId, {
        stripeSubscriptionId: subscription.id,
        plan,
        subscriptionStatus: mapStripeStatus(subscription.status),
        subscriptionStartedAt: new Date(periodStart * 1000),
        subscriptionEndsAt: new Date(periodEnd * 1000),
      });

      console.log(`[Stripe] User ${userId} subscribed to ${plan}`);
    }
  },

  /**
   * Handle subscription updated event
   */
  async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId;
    const userRepository = AppDataSource.getRepository(User);

    // Get billing period dates using type assertion
    const subData = subscription as any;
    const periodStart = subData.current_period_start || Math.floor(Date.now() / 1000);
    const periodEnd = subData.current_period_end || Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

    if (!userId) {
      // Try to find user by customer ID
      const user = await userRepository.findOne({
        where: { stripeCustomerId: subscription.customer as string },
      });

      if (!user) {
        console.error("[Stripe] Could not find user for subscription update");
        return;
      }

      const plan = getPlanFromPriceId(subscription.items.data[0]?.price.id || "");

      await userRepository.update(user.id, {
        stripeSubscriptionId: subscription.id,
        plan,
        subscriptionStatus: mapStripeStatus(subscription.status),
        subscriptionStartedAt: new Date(periodStart * 1000),
        subscriptionEndsAt: new Date(periodEnd * 1000),
      });

      console.log(`[Stripe] Updated subscription for user ${user.id}: ${subscription.status}`);
      return;
    }

    const plan = getPlanFromPriceId(subscription.items.data[0]?.price.id || "");

    await userRepository.update(userId, {
      stripeSubscriptionId: subscription.id,
      plan,
      subscriptionStatus: mapStripeStatus(subscription.status),
      subscriptionStartedAt: new Date(periodStart * 1000),
      subscriptionEndsAt: new Date(periodEnd * 1000),
    });

    console.log(`[Stripe] Updated subscription for user ${userId}: ${subscription.status}`);
  },

  /**
   * Handle subscription deleted event
   */
  async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId;

    const userRepository = AppDataSource.getRepository(User);

    let user: User | null = null;

    if (userId) {
      user = await userRepository.findOne({ where: { id: userId } });
    } else {
      user = await userRepository.findOne({
        where: { stripeCustomerId: subscription.customer as string },
      });
    }

    if (!user) {
      console.error("[Stripe] Could not find user for subscription deletion");
      return;
    }

    await userRepository.update(user.id, {
      plan: UserPlan.FREE,
      subscriptionStatus: SubscriptionStatus.CANCELED,
      stripeSubscriptionId: undefined,
    });

    console.log(`[Stripe] Subscription canceled for user ${user.id}`);
  },

  /**
   * Handle invoice paid event
   */
  async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    // Get subscription ID from invoice using type assertion
    const invoiceData = invoice as any;
    const subscriptionId = invoiceData.subscription as string;
    if (!subscriptionId) return;

    const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
    await this.handleSubscriptionUpdated(subscription);
  },

  /**
   * Handle invoice payment failed event
   */
  async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const customerId = invoice.customer as string;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (user) {
      await userRepository.update(user.id, {
        subscriptionStatus: SubscriptionStatus.PAST_DUE,
      });
      console.log(`[Stripe] Payment failed for user ${user.id}`);
    }
  },

  /**
   * Cancel a subscription
   */
  async cancelSubscription(user: User): Promise<void> {
    if (!user.stripeSubscriptionId) {
      throw new Error("User does not have an active subscription");
    }

    await getStripe().subscriptions.cancel(user.stripeSubscriptionId);
  },

  /**
   * Get Stripe instance for webhook verification
   */
  getStripeInstance(): Stripe {
    return getStripe();
  },

  /**
   * Check if Stripe is configured
   */
  isConfigured(): boolean {
    return isStripeConfigured();
  },
};
