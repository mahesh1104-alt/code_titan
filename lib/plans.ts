import { PlanType } from './types';

export interface PlanConfig {
  id: PlanType;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  badge: string;
  limits: {
    maxMembers: number;
    reviewsPerMonth: number;
    brandProfiles: number;
    brandFacts: number;
    allowedFormats: ('txt' | 'docx' | 'pdf' | 'png' | 'jpg')[];
    versionHistoryDepth: number; // -1 for unlimited
  };
  features: {
    textChecks: boolean;
    visualChecks: boolean;
    accessibilityChecks: boolean;
    approvalWorkflow: 'self_review' | 'team_workflow' | 'enterprise_gates';
    guidelineVersioning: boolean;
    analyticsLevel: 'basic' | 'team_violations' | 'enterprise_ambiguity';
    auditLogRetentionDays: number; // 0 for locked, -1 for unlimited
    auditExportCsv: boolean;
    bulkUpload: boolean;
    confidentialAiMode: boolean;
    ssoPlaceholder: boolean;
    supportLevel: 'community' | 'email' | 'priority';
  };
}

export const PLANS: Record<PlanType, PlanConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Essential governance for individuals and solo creators.',
    badge: 'Free Tier',
    limits: {
      maxMembers: 3,
      reviewsPerMonth: 50,
      brandProfiles: 1,
      brandFacts: 25,
      allowedFormats: ['txt', 'docx'],
      versionHistoryDepth: 3,
    },
    features: {
      textChecks: true,
      visualChecks: false,
      accessibilityChecks: false,
      approvalWorkflow: 'self_review',
      guidelineVersioning: false,
      analyticsLevel: 'basic',
      auditLogRetentionDays: 0,
      auditExportCsv: false,
      bulkUpload: false,
      confidentialAiMode: false,
      ssoPlaceholder: false,
      supportLevel: 'community',
    },
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    priceMonthly: 49,
    priceAnnual: 470,
    description: 'Full multimodal checks and team workflows for marketing teams & agencies.',
    badge: 'Pro Tier',
    limits: {
      maxMembers: 15,
      reviewsPerMonth: 500,
      brandProfiles: 3,
      brandFacts: 999999, // unlimited
      allowedFormats: ['txt', 'docx', 'pdf', 'png', 'jpg'],
      versionHistoryDepth: -1,
    },
    features: {
      textChecks: true,
      visualChecks: true,
      accessibilityChecks: true,
      approvalWorkflow: 'team_workflow',
      guidelineVersioning: false,
      analyticsLevel: 'team_violations',
      auditLogRetentionDays: 90,
      auditExportCsv: false,
      bulkUpload: false,
      confidentialAiMode: false,
      ssoPlaceholder: false,
      supportLevel: 'email',
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 299,
    priceAnnual: 2870,
    description: 'Configurable multi-step gates, ambiguity intelligence and governance at scale.',
    badge: 'Enterprise',
    limits: {
      maxMembers: 999999,
      reviewsPerMonth: 5000,
      brandProfiles: 999999,
      brandFacts: 999999,
      allowedFormats: ['txt', 'docx', 'pdf', 'png', 'jpg'],
      versionHistoryDepth: -1,
    },
    features: {
      textChecks: true,
      visualChecks: true,
      accessibilityChecks: true,
      approvalWorkflow: 'enterprise_gates',
      guidelineVersioning: true,
      analyticsLevel: 'enterprise_ambiguity',
      auditLogRetentionDays: -1,
      auditExportCsv: true,
      bulkUpload: true,
      confidentialAiMode: true,
      ssoPlaceholder: true,
      supportLevel: 'priority',
    },
  },
};

export type FeatureKey = keyof PlanConfig['features'];

export function can(plan: PlanType, feature: FeatureKey): boolean {
  const planConfig = PLANS[plan] || PLANS.starter;
  const val = planConfig.features[feature];
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val !== 0;
  return Boolean(val);
}

export function checkLimit(
  plan: PlanType,
  metric: 'maxMembers' | 'reviewsPerMonth' | 'brandProfiles' | 'brandFacts',
  currentCount: number
): { allowed: boolean; max: number; current: number } {
  const planConfig = PLANS[plan] || PLANS.starter;
  const max = planConfig.limits[metric];
  return {
    allowed: currentCount < max,
    max,
    current: currentCount,
  };
}

export function isFormatAllowed(plan: PlanType, ext: string): boolean {
  const normalized = ext.toLowerCase().replace('.', '') as any;
  const planConfig = PLANS[plan] || PLANS.starter;
  return planConfig.limits.allowedFormats.includes(normalized);
}
