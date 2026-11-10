'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { PLANS } from '@/lib/plans';

export default function PricingPage() {
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </Link>
        <Link
          href="/login"
          className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition"
        >
          Demo Sign In
        </Link>
      </header>

      <main className="py-16 px-6 max-w-6xl mx-auto space-y-12 flex-1">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Transparent Subscription Governance
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Plans for Creators, Teams & Global Enterprises
          </h1>
          <p className="text-sm text-slate-500">
            All plans include deterministic terminology and claim verification. Upgrade to unlock multimodal visual checks and multi-step reviewer gates.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-1.5 rounded-lg transition ${
                period === 'monthly'
                  ? 'bg-white dark:bg-slate-900 shadow-xs font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setPeriod('annual')}
              className={`px-4 py-1.5 rounded-lg transition ${
                period === 'annual'
                  ? 'bg-white dark:bg-slate-900 shadow-xs font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500'
              }`}
            >
              Annual Billing (20% Off)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['starter', 'pro', 'enterprise'] as const).map((key) => {
            const plan = PLANS[key];
            const isPro = key === 'pro';

            return (
              <div
                key={key}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative ${
                  isPro
                    ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-lg'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {isPro && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full bg-brand-500 text-white shadow-md">
                    Recommended for Teams
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">
                      ${period === 'monthly' ? plan.priceMonthly : plan.priceAnnual}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      /{period === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {plan.limits.reviewsPerMonth === 999999
                          ? 'Unlimited'
                          : plan.limits.reviewsPerMonth}{' '}
                        reviews per month
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
                      <span>Formats: {plan.limits.allowedFormats.join(', ').toUpperCase()}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {plan.features.visualChecks
                          ? 'Visual identity & WCAG 2.2 AA contrast'
                          : 'Deterministic text & fact checks only'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {plan.features.approvalWorkflow === 'enterprise_gates'
                          ? 'Configurable multi-step approval gates'
                          : plan.features.approvalWorkflow === 'team_workflow'
                          ? 'Creator, Manager & Reviewer workflow'
                          : 'Self-review only'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {plan.features.analyticsLevel === 'enterprise_ambiguity'
                          ? 'Guideline ambiguity intelligence'
                          : plan.features.analyticsLevel === 'team_violations'
                          ? 'Team governance analytics'
                          : 'Basic compliance score'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={`/login?plan=${key}`}
                    className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition ${
                      isPro
                        ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>Test {plan.name} Persona</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
