'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { getCurrentUser, getAmbiguityInsights } from '@/lib/store';
import { UserProfile, AmbiguityInsight } from '@/lib/types';
import { UpgradeDialog } from '@/components/upgrade-dialog';

export default function AnalyticsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser());
  const [ambiguityInsights, setAmbiguityInsights] = useState<AmbiguityInsight[]>([]);
  const [upgradeDialogFeature, setUpgradeDialogFeature] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setAmbiguityInsights(getAmbiguityInsights());
  }, []);

  const violationsByType = [
    { type: 'Terminology', count: 320, color: '#164E8A' },
    { type: 'Claims', count: 210, color: '#EF4444' },
    { type: 'Tone', count: 180, color: '#F4B942' },
    { type: 'Visual', count: 160, color: '#8B5CF6' },
    { type: 'Accessibility', count: 130, color: '#10B981' },
  ];

  const trendData = [
    { month: 'Jun', violations: 142, complianceScore: 82 },
    { month: 'Jul', violations: 185, complianceScore: 84 },
    { month: 'Aug', violations: 220, complianceScore: 88 },
    { month: 'Sep', violations: 195, complianceScore: 89 },
    { month: 'Oct', violations: 160, complianceScore: 92 },
    { month: 'Nov', violations: 125, complianceScore: 95 },
  ];

  const isStarter = currentUser.plan === 'starter';
  const isEnterprise = currentUser.plan === 'enterprise';

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Governance Intelligence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Brand Compliance Analytics
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Identify repeated mistakes, velocity bottlenecks, and ambiguous guidelines across your organization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold capitalize px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300">
            {currentUser.plan} Tier
          </span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-400 font-medium mb-1">Corporate Compliance Avg</div>
          <div className="text-3xl font-extrabold text-emerald-500">94.6%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +8.2% from last quarter
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-400 font-medium mb-1">Suggestion Acceptance Rate</div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">87.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">Creators accept AI intent fixes</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-400 font-medium mb-1">Avg Review Turnaround</div>
          <div className="text-3xl font-extrabold text-brand-500">3.8 hrs</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            42% faster publication cycle
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-400 font-medium mb-1">High-Risk Claims Caught</div>
          <div className="text-3xl font-extrabold text-red-500">210</div>
          <div className="text-[11px] text-slate-400 mt-1">Prevented before publishing</div>
        </div>
      </div>

      {/* Main Charts Row */}
      {isStarter ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Detailed Analytics Locked on Starter Tier
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Upgrade to Professional or Enterprise to unlock multi-period violation trends, channel distributions, and guideline ambiguity intelligence.
          </p>
          <button
            onClick={() => setUpgradeDialogFeature('Governance Analytics')}
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-md transition"
          >
            Upgrade to Pro ($49)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Violations by Category */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Violations by Category (Per 1,000 Items)
                </h3>
                <p className="text-[11px] text-slate-400">Directly matches governance slide 14</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={violationsByType} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="type" type="category" textAnchor="end" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {violationsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Governance Trend */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Compliance Score Trend & Violation Reduction
              </h3>
              <p className="text-[11px] text-slate-400">6-Month historical governance progress</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="complianceScore"
                    name="Score %"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="violations"
                    name="Violations"
                    stroke="#164E8A"
                    fill="#164E8A"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Feature: Guideline Ambiguity Detection */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-500" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Guideline Ambiguity Intelligence
              </h3>
              <p className="text-xs text-slate-400">
                Identifies rules repeatedly overridden or disputed by creators & legal teams.
              </p>
            </div>
          </div>

          {!isEnterprise && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300 flex items-center gap-1 self-start sm:self-auto">
              <Lock className="w-3 h-3" /> Enterprise Tier Feature
            </span>
          )}
        </div>

        {!isEnterprise ? (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Ambiguity intelligence aggregates reviewer overrides across thousands of items to highlight unclear brand rules before they cause confusion.
            </p>
            <button
              onClick={() => setUpgradeDialogFeature('Guideline Ambiguity Intelligence')}
              className="px-4 py-2 rounded-xl bg-accent-400 text-slate-900 font-semibold text-xs shadow-sm hover:bg-accent-500 transition"
            >
              Simulate Upgrade to Enterprise ($299)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {ambiguityInsights.map((insight) => (
              <div
                key={insight.id}
                className="bg-accent-50/50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-900/40 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-accent-900 dark:text-accent-200">
                    Rule Friction: &quot;{insight.term}&quot;
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-200 dark:bg-accent-800 text-accent-900 dark:text-accent-100">
                    {insight.overrideCount} overrides
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {insight.recommendation}
                </p>

                <div className="pt-2 border-t border-accent-200/60 dark:border-accent-900/40">
                  <Link
                    href="/app/knowledge"
                    className="text-xs font-semibold text-brand-600 dark:text-brand-300 hover:underline flex items-center gap-1"
                  >
                    <span>Open Terminology Editor</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UpgradeDialog
        isOpen={Boolean(upgradeDialogFeature)}
        onClose={() => setUpgradeDialogFeature(null)}
        featureName={upgradeDialogFeature || ''}
      />
    </div>
  );
}
