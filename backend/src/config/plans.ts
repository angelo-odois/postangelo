import { UserPlan } from "../entities/index.js";

export interface PlanLimits {
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

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  [UserPlan.FREE]: {
    maxPortfolios: 1,
    maxCustomDomains: 0,
    hasCustomDomain: false,
    hasAllTemplates: false,
    hasAdvancedAnalytics: false,
    hasTeamAnalytics: false,
    removeBranding: false,
    hasContactForm: false,
    hasPrioritySupport: false,
    hasDedicatedSupport: false,
    hasExportPdf: false,
    hasWhiteLabel: false,
    hasApiAccess: false,
    hasTraining: false,
    priceMonthly: 0,
    priceYearly: 0,
  },
  [UserPlan.PRO]: {
    maxPortfolios: 5,
    maxCustomDomains: 1,
    hasCustomDomain: true,
    hasAllTemplates: true,
    hasAdvancedAnalytics: true,
    hasTeamAnalytics: false,
    removeBranding: true,
    hasContactForm: true,
    hasPrioritySupport: true,
    hasDedicatedSupport: false,
    hasExportPdf: true,
    hasWhiteLabel: false,
    hasApiAccess: false,
    hasTraining: false,
    priceMonthly: 2900, // R$ 29,00 in cents
    priceYearly: 29000, // R$ 290,00 in cents (2 months free)
  },
  [UserPlan.BUSINESS]: {
    maxPortfolios: -1, // unlimited
    maxCustomDomains: -1, // unlimited
    hasCustomDomain: true,
    hasAllTemplates: true,
    hasAdvancedAnalytics: true,
    hasTeamAnalytics: true,
    removeBranding: true,
    hasContactForm: true,
    hasPrioritySupport: true,
    hasDedicatedSupport: true,
    hasExportPdf: true,
    hasWhiteLabel: true,
    hasApiAccess: true,
    hasTraining: true,
    priceMonthly: 9900, // R$ 99,00 in cents
    priceYearly: 99000, // R$ 990,00 in cents (2 months free)
  },
};

export function getPlanLimits(plan: UserPlan): PlanLimits {
  return PLAN_LIMITS[plan];
}

export function canCreatePortfolio(plan: UserPlan, currentCount: number): boolean {
  const limits = getPlanLimits(plan);
  if (limits.maxPortfolios === -1) return true; // unlimited
  return currentCount < limits.maxPortfolios;
}

export function canUseFeature(plan: UserPlan, feature: keyof Omit<PlanLimits, "maxPortfolios" | "maxCustomDomains" | "priceMonthly" | "priceYearly">): boolean {
  const limits = getPlanLimits(plan);
  return limits[feature] as boolean;
}

export function formatPrice(priceInCents: number): string {
  return `R$ ${(priceInCents / 100).toFixed(2).replace(".", ",")}`;
}
