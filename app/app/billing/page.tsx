'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { getCurrentUser, updateUserPlan } from '@/lib/store';
import { UserProfile, PlanType } from '@/lib/types';
import { PLANS } from '@/lib/plans';
import { toast } from 'sonner';

export default function BillingPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser());
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const currentPlanConfig = PLANS[currentUser.plan] || PLANS.starter;

  const handleSimulateUpgrade = (tier: PlanType) => {
    updateUserPlan(tier);
    setCurrentUser(getCurrentUser());
    toast.success(`Plan updated to ${PLANS[tier].name}! Features immediately unlocked.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-12 max-w-5xl">
      <div>
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
          <CreditCard className="w-4 h-4" />
          <span>Subscription & Quotas</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Billing & Subscription Tier
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">
          Manage your organization&apos;s subscription plan, usage limits, and test upgrades.
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Plan
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {currentPlanConfig.name} Plan
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                Active Subscription
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentPlanConfig.description}</p>
          </div>

          <div className="text-right sm:text-right">
            <div className="text-2xl font-extrabold text-brand-500">
              ${billingPeriod === 'monthly' ? currentPlanConfig.priceMonthly : currentPlanConfig.priceAnnual}
              <span className="text-xs font-normal text-slate-400">
                /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Renews automatically (Stripe Test)</div>
          </div>
        </div>

        {/* Quota Usage Meters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500">Document Reviews</span>
              <span className="font-bold">
                142 / {currentPlanConfig.limits.reviewsPerMonth}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-500 h-full"
                style={{
                  width: `${Math.min(100, (142 / currentPlanConfig.limits.reviewsPerMonth) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500">Team Members</span>
              <span className="font-bold">
                {currentUser.plan === 'starter' ? '1 / 3' : currentUser.plan === 'pro' ? '4 / 15' : '12 / Unlimited'}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: currentUser.plan === 'starter' ? '33%' : '26%' }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500">Brand Facts & Rules</span>
              <span className="font-bold">
                {currentUser.plan === 'starter' ? '4 / 25' : '4 / Unlimited'}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-accent-500 h-full" style={{ width: '16%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Plans Comparison & Instant Upgrade Switch */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Available Subscription Tiers
            </h3>
            <p className="text-xs text-slate-500">
              Select or simulate an instant upgrade to test feature gating on Vercel.
            </p>
          </div>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto text-xs font-medium">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg transition ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-slate-900 shadow-xs font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-3 py-1.5 rounded-lg transition ${
                billingPeriod === 'annual'
                  ? 'bg-white dark:bg-slate-900 shadow-xs font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500'
              }`}
            >
              Annual (20% Off)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['starter', 'pro', 'enterprise'] as PlanType[]).map((tier) => {
            const plan = PLANS[tier];
            const isCurrent = currentUser.plan === tier;

            return (
              <div
                key={tier}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 flex flex-col justify-between shadow-sm relative transition ${
                  isCurrent
                    ? 'border-brand-500 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {tier === 'pro' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full bg-brand-500 text-white shadow-md">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      ${billingPeriod === 'monthly' ? plan.priceMonthly : plan.priceAnnual}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {plan.limits.reviewsPerMonth === 999999
                          ? 'Unlimited'
                          : plan.limits.reviewsPerMonth}{' '}
                        reviews/month
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        Up to{' '}
                        {plan.limits.maxMembers === 999999 ? 'Unlimited' : plan.limits.maxMembers}{' '}
                        team seats
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        Formats: {plan.limits.allowedFormats.join(', ').toUpperCase()}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {plan.features.visualChecks
                          ? 'Multimodal visual & contrast checks'
                          : 'Text-only checks (Visual locked)'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {plan.features.analyticsLevel === 'enterprise_ambiguity'
                          ? 'Guideline Ambiguity Intelligence'
                          : plan.features.analyticsLevel === 'team_violations'
                          ? 'Team governance analytics'
                          : 'Basic compliance score'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  {isCurrent ? (
                    <div className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs text-center">
                      Current Active Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSimulateUpgrade(tier)}
                      className={`w-full py-2.5 rounded-xl font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5 ${
                        tier === 'enterprise'
                          ? 'bg-accent-400 hover:bg-accent-500 text-slate-900 shadow-accent-400/20'
                          : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Switch to {plan.name} (1-Click)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
