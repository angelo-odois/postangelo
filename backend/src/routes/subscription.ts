import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { User, UserPlan, SubscriptionStatus, Page } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate } from "../middlewares/auth.js";
import { PLAN_LIMITS, getPlanLimits, canCreatePortfolio } from "../config/plans.js";

const router: ReturnType<typeof Router> = Router();
const userRepository = () => AppDataSource.getRepository(User);
const pageRepository = () => AppDataSource.getRepository(Page);

/**
 * @swagger
 * /api/subscription/plans:
 *   get:
 *     summary: Get all available plans with their features
 *     tags: [Subscription]
 */
router.get(
  "/plans",
  asyncHandler(async (_req, res) => {
    const plans = Object.entries(PLAN_LIMITS).map(([key, limits]) => ({
      id: key,
      name: key === "free" ? "Grátis" : key === "pro" ? "Pro" : "Business",
      ...limits,
    }));
    res.json(plans);
  })
);

/**
 * @swagger
 * /api/subscription/current:
 *   get:
 *     summary: Get current user's subscription info
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/current",
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const user = await userRepository().findOne({
      where: { id: userId },
      select: [
        "id",
        "plan",
        "subscriptionStatus",
        "subscriptionStartedAt",
        "subscriptionEndsAt",
      ],
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Get current usage
    const portfolioCount = await pageRepository().count({
      where: { createdBy: { id: userId } },
    });

    const limits = getPlanLimits(user.plan);

    res.json({
      plan: user.plan,
      status: user.subscriptionStatus,
      startedAt: user.subscriptionStartedAt,
      endsAt: user.subscriptionEndsAt,
      limits,
      usage: {
        portfolios: portfolioCount,
        maxPortfolios: limits.maxPortfolios,
        canCreateMore: canCreatePortfolio(user.plan, portfolioCount),
      },
    });
  })
);

/**
 * @swagger
 * /api/subscription/check-limit:
 *   get:
 *     summary: Check if user can create more portfolios
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/check-limit",
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const user = await userRepository().findOne({
      where: { id: userId },
      select: ["id", "plan"],
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const portfolioCount = await pageRepository().count({
      where: { createdBy: { id: userId } },
    });

    const canCreate = canCreatePortfolio(user.plan, portfolioCount);
    const limits = getPlanLimits(user.plan);

    res.json({
      canCreate,
      current: portfolioCount,
      max: limits.maxPortfolios,
      plan: user.plan,
      upgradeRequired: !canCreate,
    });
  })
);

/**
 * @swagger
 * /api/subscription/upgrade:
 *   post:
 *     summary: Upgrade user's plan (mock - for real implementation use Stripe webhook)
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/upgrade",
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { plan } = req.body;

    if (!plan || !Object.values(UserPlan).includes(plan)) {
      throw new AppError("Invalid plan", 400);
    }

    const user = await userRepository().findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Prevent downgrade through this endpoint (should handle separately)
    const planOrder = { [UserPlan.FREE]: 0, [UserPlan.PRO]: 1, [UserPlan.BUSINESS]: 2 };
    if (planOrder[plan as UserPlan] <= planOrder[user.plan]) {
      throw new AppError("Cannot downgrade through this endpoint", 400);
    }

    // Update user's plan
    user.plan = plan as UserPlan;
    user.subscriptionStatus = SubscriptionStatus.ACTIVE;
    user.subscriptionStartedAt = new Date();

    // Set subscription end date (1 month from now for monthly plans)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    user.subscriptionEndsAt = endDate;

    await userRepository().save(user);

    res.json({
      message: "Plan upgraded successfully",
      plan: user.plan,
      status: user.subscriptionStatus,
      endsAt: user.subscriptionEndsAt,
    });
  })
);

/**
 * @swagger
 * /api/subscription/cancel:
 *   post:
 *     summary: Cancel user's subscription
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/cancel",
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const user = await userRepository().findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.plan === UserPlan.FREE) {
      throw new AppError("You don't have an active subscription to cancel", 400);
    }

    // Mark as canceled but keep active until end date
    user.subscriptionStatus = SubscriptionStatus.CANCELED;

    await userRepository().save(user);

    res.json({
      message: "Subscription canceled. You will continue to have access until the end of your billing period.",
      endsAt: user.subscriptionEndsAt,
    });
  })
);

/**
 * @swagger
 * /api/subscription/features:
 *   get:
 *     summary: Get features available for the current user's plan
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/features",
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const user = await userRepository().findOne({
      where: { id: userId },
      select: ["id", "plan"],
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const limits = getPlanLimits(user.plan);

    res.json({
      plan: user.plan,
      features: {
        customDomain: limits.hasCustomDomain,
        allTemplates: limits.hasAllTemplates,
        advancedAnalytics: limits.hasAdvancedAnalytics,
        teamAnalytics: limits.hasTeamAnalytics,
        removeBranding: limits.removeBranding,
        contactForm: limits.hasContactForm,
        prioritySupport: limits.hasPrioritySupport,
        dedicatedSupport: limits.hasDedicatedSupport,
        exportPdf: limits.hasExportPdf,
        whiteLabel: limits.hasWhiteLabel,
        apiAccess: limits.hasApiAccess,
        training: limits.hasTraining,
      },
    });
  })
);

export default router;
