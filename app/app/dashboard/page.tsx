'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileCheck,
  Clock,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Upload,
  BookOpen,
  GitPullRequest,
  Sparkles,
  Lock,
} from 'lucide-react';
import { getCurrentUser, getContentItems } from '@/lib/store';
import { UserProfile, ContentItem } from '@/lib/types';
import { DEMO_ACCOUNTS } from '@/lib/seed-data';
import { UpgradeDialog } from '@/components/upgrade-dialog';

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_ACCOUNTS[1]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [upgradeDialogFeature, setUpgradeDialogFeature] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setItems(getContentItems());
  }, []);

  const totalReviewed = 1248;
  const pendingApprovals = items.filter(
    (i) => i.status === 'pending_approval' || i.status === 'resubmitted'
  ).length;

  const sampleAdItem = items.find((i) => i.id === 'cnt_technova_sample_ad');
  const sampleAdVersion = sampleAdItem?.versions[0];
  const complianceScore = sampleAdVersion?.score ?? 34;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-500 to-brand-700 text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-brand-500/10">
        <div>
          <div className="flex items-center gap-2 text-accent-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Brand Governance Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {currentUser.fullName.split(' ')[0]}
          </h1>
          <p className="text-white/80 text-sm mt-1 max-w-xl">
            Governing content for <strong>{currentUser.orgName}</strong> under the{' '}
            <span className="capitalize underline decoration-accent-400 font-medium">
              {currentUser.plan} tier
            </span>
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app/submit"
            className="px-4 py-2.5 rounded-xl bg-accent-400 hover:bg-accent-500 text-slate-900 font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-accent-400/20 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Submit Content</span>
          </Link>
          <Link
            href="/app/knowledge"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs md:text-sm backdrop-blur-md transition flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Base</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>Overall Brand Compliance</span>
            <ShieldCheck className="w-4 h-4 text-brand-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {complianceScore}%
            </span>
            <span className="text-xs font-semibold text-emerald-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +8.4%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                complianceScore > 80
                  ? 'bg-emerald-500'
                  : complianceScore > 50
                  ? 'bg-accent-400'
                  : 'bg-red-500'
              }`}
              style={{ width: `${complianceScore}%` }}
            />
          </div>
        </div>

        {/* Total Reviewed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>Reviewed This Month</span>
            <FileCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalReviewed}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 5,000 quota</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Across ads, email, social & decks</p>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>Pending Approvals</span>
            <GitPullRequest className="w-4 h-4 text-accent-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {pendingApprovals}
            </span>
            <span className="text-xs text-amber-500 font-medium">Require reviewer sign-off</span>
          </div>
          <div className="mt-3">
            <Link
              href="/app/approvals"
              className="text-xs text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1"
            >
              Open Kanban Board <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Turnaround Time */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>Avg Turnaround Time</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">3.8h</span>
            <span className="text-xs font-semibold text-emerald-500">-42% faster</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">From submission to publication</p>
        </div>
      </div>

      {/* Featured Review Item (TechNova Ad) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                Action Required
              </span>
              <span className="text-xs text-slate-400">Sample Campaign Content</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {sampleAdItem?.title || 'Q4 Enterprise Launch Campaign - Flagship Ad'}
            </h2>
          </div>

          <Link
            href="/app/content/cnt_technova_sample_ad"
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto shadow-md shadow-brand-500/20 transition"
          >
            <span>Open Review Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Unreviewed Ad Draft:
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
              &quot;TechNova is the{' '}
              <span className="highlight-high">world&apos;s No. 1</span>{' '}
              <span className="highlight-medium">AI robot</span> company, delivering{' '}
              <span className="highlight-critical">100% guaranteed protection</span> and{' '}
              <span className="highlight-high">300% better productivity</span> to every{' '}
              <span className="highlight-medium">consumer</span>. Our service is available{' '}
              <span className="highlight-high">24/7 to everyone</span>.&quot;
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Analysis Summary:
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-red-600 dark:text-red-400 font-medium">Critical Issues:</span>
              <span className="font-bold">1 (Blocks Approval)</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-orange-600 dark:text-orange-400 font-medium">High-Risk Claims:</span>
              <span className="font-bold">3</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-yellow-600 dark:text-yellow-400 font-medium">Terminology / Tone:</span>
              <span className="font-bold">2</span>
            </div>
            <div className="pt-1">
              <div className="text-[11px] text-slate-500">
                Gate Status: <strong className="text-red-500">BLOCKED</strong> until critical fix accepted.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions & Governance Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Content Queue</h3>
            <Link
              href="/app/content/cnt_technova_sample_ad"
              className="text-xs text-brand-500 hover:text-brand-600 font-medium"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/app/content/${item.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/50 transition group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-brand-500 transition">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-400 capitalize mt-0.5">
                    {item.channel} • Created by {item.creatorName}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      item.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : item.status === 'pending_approval'
                        ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Plan Feature Gate Showcase */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Plan Capabilities</h3>
            <span className="text-xs font-semibold capitalize px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300">
              {currentUser.plan} Plan
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-700 dark:text-slate-300">Deterministic Terminology & Claims</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-700 dark:text-slate-300">Tone & Fact RAG Verification</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-700 dark:text-slate-300">Visual Identity & WCAG 2.2 Contrast</span>
              {currentUser.plan === 'starter' ? (
                <button
                  onClick={() => setUpgradeDialogFeature('Visual & Accessibility Checks')}
                  className="flex items-center gap-1 font-semibold text-accent-600 hover:underline"
                >
                  <Lock className="w-3 h-3" /> Locked (Upgrade)
                </button>
              ) : (
                <span className="font-semibold text-emerald-600">Active</span>
              )}
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-700 dark:text-slate-300">Guideline Ambiguity Intelligence</span>
              {currentUser.plan === 'enterprise' ? (
                <span className="font-semibold text-emerald-600">Active</span>
              ) : (
                <button
                  onClick={() => setUpgradeDialogFeature('Guideline Ambiguity Intelligence')}
                  className="flex items-center gap-1 font-semibold text-accent-600 hover:underline"
                >
                  <Lock className="w-3 h-3" /> Enterprise Only
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <UpgradeDialog
        isOpen={Boolean(upgradeDialogFeature)}
        onClose={() => setUpgradeDialogFeature(null)}
        featureName={upgradeDialogFeature || ''}
      />
    </div>
  );
}
