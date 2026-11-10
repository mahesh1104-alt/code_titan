'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles, Check, ArrowRight, X } from 'lucide-react';
import { PLANS } from '@/lib/plans';
import { updateUserPlan } from '@/lib/store';
import { toast } from 'sonner';

export function UpgradeDialog({
  isOpen,
  onClose,
  featureName = 'This feature',
  recommendedPlan = 'pro',
}: {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  recommendedPlan?: 'pro' | 'enterprise';
}) {
  const router = useRouter();

  if (!isOpen) return null;

  const plan = PLANS[recommendedPlan];

  const handleSimulateUpgrade = (tier: 'pro' | 'enterprise') => {
    updateUserPlan(tier);
    toast.success(`Upgraded to ${PLANS[tier].name} Plan! Features unlocked.`);
    onClose();
    window.location.reload();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/40 text-accent-600 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
              Feature Locked on Starter
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Unlock {featureName}
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {featureName} is available on the <strong>{plan.name}</strong> plan and above. Upgrade
          today to access multimodal AI checks, enterprise review gates, and comprehensive brand analytics.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-semibold text-slate-900 dark:text-white">{plan.name} Plan</span>
            <span className="text-xl font-bold text-brand-500">
              ${plan.priceMonthly}
              <span className="text-xs font-normal text-slate-500">/mo</span>
            </span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Full Visual & Accessibility checks (WCAG 2.2 AA)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Team Kanban approval workflows & reviewer overrides</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>500+ document reviews per month & unlimited facts</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => handleSimulateUpgrade(recommendedPlan)}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Instant Demo Upgrade ({plan.name})</span>
          </button>
          <button
            onClick={() => {
              router.push('/pricing');
              onClose();
            }}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition"
          >
            View Pricing
          </button>
        </div>
      </div>
    </div>
  );
}
