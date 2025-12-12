"use client";

import { useEffect, useState } from "react";
import {
  Crown,
  Check,
  X,
  Loader2,
  Sparkles,
  Zap,
  Building2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore, UserPlan } from "@/lib/store";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PlanLimits {
  maxPortfolios: number;
  maxCustomDomains: number;
  hasCustomDomain: boolean;
  hasAllTemplates: boolean;
  hasAdvancedAnalytics: boolean;
  hasTeamAnalytics: boolean;
  removeBranding: boolean;
  hasContactForm: boolean;
  hasPrioritySupport: boolean;
  hasDedicatedSupport: boolean;
  hasExportPdf: boolean;
  hasWhiteLabel: boolean;
  hasApiAccess: boolean;
  hasTraining: boolean;
  priceMonthly: number;
  priceYearly: number;
}

interface Plan extends PlanLimits {
  id: string;
  name: string;
}

interface SubscriptionInfo {
  plan: UserPlan;
  status: string;
  startedAt: string | null;
  endsAt: string | null;
  limits: PlanLimits;
  usage: {
    portfolios: number;
    maxPortfolios: number;
    canCreateMore: boolean;
  };
}

const PLAN_ICONS: Record<string, React.ReactNode> = {
  free: <Sparkles className="h-6 w-6" />,
  pro: <Zap className="h-6 w-6" />,
  business: <Building2 className="h-6 w-6" />,
};

const PLAN_COLORS: Record<string, string> = {
  free: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  pro: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  business: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

export default function SubscriptionPage() {
  const { user, getValidToken, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = await getValidToken();
    if (!token) return;

    try {
      const [plansData, subData] = await Promise.all([
        api.getPlans<Plan[]>(token),
        api.getCurrentSubscription<SubscriptionInfo>(token),
      ]);
      setPlans(plansData);
      setSubscription(subData);
    } catch (error) {
      console.error("Failed to load subscription data:", error);
      toast({ title: "Erro ao carregar dados", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    const token = await getValidToken();
    if (!token) return;

    setUpgrading(planId);
    try {
      await api.upgradePlan(planId, token);
      updateUser({ plan: planId as UserPlan });
      await loadData();
      toast({ title: "Plano atualizado com sucesso!", variant: "success" });
    } catch (error: unknown) {
      console.error("Failed to upgrade:", error);
      const err = error as { message?: string };
      toast({ title: err.message || "Erro ao fazer upgrade", variant: "destructive" });
    } finally {
      setUpgrading(null);
    }
  };

  const handleCancel = async () => {
    const token = await getValidToken();
    if (!token) return;

    try {
      await api.cancelSubscription(token);
      await loadData();
      toast({ title: "Assinatura cancelada", variant: "success" });
    } catch (error: unknown) {
      console.error("Failed to cancel:", error);
      const err = error as { message?: string };
      toast({ title: err.message || "Erro ao cancelar", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  const currentPlan = user?.plan || "free";
  const planOrder = { free: 0, pro: 1, business: 2 };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meu Plano</h1>
          <p className="text-muted-foreground">Gerencie sua assinatura e recursos</p>
        </div>

        {/* Current Plan Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", PLAN_COLORS[currentPlan])}>
                  {PLAN_ICONS[currentPlan]}
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Plano {currentPlan === "free" ? "Gratis" : currentPlan === "pro" ? "Pro" : "Business"}
                    {currentPlan !== "free" && (
                      <Crown className="h-4 w-4 text-amber-500" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    {subscription?.status === "active" ? "Ativo" :
                     subscription?.status === "canceled" ? "Cancelado" :
                     subscription?.status === "past_due" ? "Pagamento pendente" : "Trial"}
                  </CardDescription>
                </div>
              </div>
              {subscription?.status === "canceled" && subscription?.endsAt && (
                <Badge variant="outline" className="text-amber-600">
                  Acesso ate {new Date(subscription.endsAt).toLocaleDateString("pt-BR")}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Portfolios</p>
                <p className="text-2xl font-bold">
                  {subscription?.usage.portfolios || 0}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{subscription?.usage.maxPortfolios === -1 ? "ilim." : subscription?.usage.maxPortfolios || 1}
                  </span>
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Dominios Custom</p>
                <p className="text-2xl font-bold">
                  {subscription?.limits.hasCustomDomain ? (
                    subscription?.limits.maxCustomDomains === -1 ? "Ilimitados" : subscription?.limits.maxCustomDomains
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground" />
                  )}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {subscription?.usage.canCreateMore ? (
                    <>
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-normal">Pode criar mais</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <span className="text-sm font-normal">Limite atingido</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {currentPlan !== "free" && subscription?.status === "active" && (
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancelar assinatura
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plans Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Todos os Planos</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrentPlan = plan.id === currentPlan;
              const canUpgrade = planOrder[plan.id as keyof typeof planOrder] > planOrder[currentPlan as keyof typeof planOrder];
              const isDowngrade = planOrder[plan.id as keyof typeof planOrder] < planOrder[currentPlan as keyof typeof planOrder];

              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "relative",
                    isCurrentPlan && "ring-2 ring-primary",
                    plan.id === "pro" && "md:scale-105 md:shadow-lg"
                  )}
                >
                  {plan.id === "pro" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500">
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", PLAN_COLORS[plan.id])}>
                        {PLAN_ICONS[plan.id]}
                      </div>
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>
                          {plan.priceMonthly === 0 ? (
                            "Gratis para sempre"
                          ) : (
                            <>
                              {formatPrice(plan.priceMonthly)}
                              <span className="text-xs">/mes</span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {plan.maxPortfolios === -1 ? "Portfolios ilimitados" : `${plan.maxPortfolios} portfolio${plan.maxPortfolios > 1 ? "s" : ""}`}
                      </li>
                      <li className="flex items-center gap-2">
                        {plan.hasCustomDomain ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={!plan.hasCustomDomain ? "text-muted-foreground" : ""}>
                          Dominio personalizado
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {plan.hasAllTemplates ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={!plan.hasAllTemplates ? "text-muted-foreground" : ""}>
                          Todos os templates
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {plan.hasAdvancedAnalytics ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={!plan.hasAdvancedAnalytics ? "text-muted-foreground" : ""}>
                          Analytics avancado
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {plan.removeBranding ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={!plan.removeBranding ? "text-muted-foreground" : ""}>
                          Remover branding
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {plan.hasContactForm ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={!plan.hasContactForm ? "text-muted-foreground" : ""}>
                          Formulario de contato
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {plan.hasPrioritySupport ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={!plan.hasPrioritySupport ? "text-muted-foreground" : ""}>
                          Suporte prioritario
                        </span>
                      </li>
                      {plan.id === "business" && (
                        <>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            White-label
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            Acesso API
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            Treinamento dedicado
                          </li>
                        </>
                      )}
                    </ul>

                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : canUpgrade ? "default" : "ghost"}
                      disabled={isCurrentPlan || isDowngrade || upgrading !== null}
                      onClick={() => canUpgrade && handleUpgrade(plan.id)}
                    >
                      {upgrading === plan.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isCurrentPlan ? (
                        "Plano Atual"
                      ) : canUpgrade ? (
                        "Fazer Upgrade"
                      ) : (
                        "Downgrade"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ or Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Duvidas sobre planos?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Entre em contato conosco pelo email{" "}
              <a href="mailto:suporte@revuu.com.br" className="text-primary hover:underline">
                suporte@revuu.com.br
              </a>{" "}
              ou acesse nossa{" "}
              <a href="/ajuda" className="text-primary hover:underline">
                Central de Ajuda
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
