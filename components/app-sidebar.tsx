'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  UploadCloud,
  FileCheck2,
  GitPullRequest,
  BarChart3,
  Users,
  CreditCard,
  ShieldAlert,
  Settings,
  Lock,
  Sparkles,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/store';
import { can } from '@/lib/plans';
import { hasPermission } from '@/lib/rbac';
import { UpgradeDialog } from './upgrade-dialog';

export function AppSidebar() {
  const pathname = usePathname();
  const currentUser = typeof window !== 'undefined' ? getCurrentUser() : null;
  const plan = currentUser?.plan || 'pro';
  const role = currentUser?.role || 'creator';

  const [upgradeFeature, setUpgradeFeature] = useState<string | null>(null);

  const navLinks = [
    {
      label: 'Dashboard',
      href: '/app/dashboard',
      icon: LayoutDashboard,
      allowed: true,
      locked: false,
    },
    {
      label: 'Knowledge Center',
      href: '/app/knowledge',
      icon: BookOpen,
      allowed: true,
      locked: false,
    },
    {
      label: 'Submit Content',
      href: '/app/submit',
      icon: UploadCloud,
      allowed: true,
      locked: false,
    },
    {
      label: 'Review Workspace',
      href: '/app/content/cnt_technova_sample_ad',
      icon: FileCheck2,
      allowed: true,
      locked: false,
    },
    {
      label: 'Approvals Kanban',
      href: '/app/approvals',
      icon: GitPullRequest,
      allowed: role !== 'creator', // Manager, Reviewer, Admin
      locked: plan === 'starter', // Starter is self-review only
      lockFeature: 'Team Approval Workflow',
    },
    {
      label: 'Governance Analytics',
      href: '/app/analytics',
      icon: BarChart3,
      allowed: role === 'manager' || role === 'admin',
      locked: plan === 'starter',
      lockFeature: 'Advanced Governance Analytics',
    },
    {
      label: 'Team & Roles',
      href: '/app/team',
      icon: Users,
      allowed: role === 'admin',
      locked: false,
    },
    {
      label: 'Billing & Plan',
      href: '/app/billing',
      icon: CreditCard,
      allowed: role === 'admin',
      locked: false,
    },
    {
      label: 'Audit Log',
      href: '/app/audit',
      icon: ShieldAlert,
      allowed: role === 'admin' || role === 'manager',
      locked: plan === 'starter',
      lockFeature: 'Compliance Audit Trail',
    },
    {
      label: 'Settings',
      href: '/app/settings',
      icon: Settings,
      allowed: true,
      locked: false,
    },
  ];

  return (
    <>
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Platform Governance
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/app/dashboard' && pathname.startsWith(link.href));

            if (!link.allowed && !link.locked) {
              return null;
            }

            if (link.locked) {
              return (
                <button
                  key={link.href}
                  onClick={() => setUpgradeFeature(link.lockFeature || link.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-500" />
                    <span>{link.label}</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-accent-500" />
                </button>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Plan Upgrade Promo box for Starter users */}
        {plan === 'starter' && (
          <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50/50 dark:from-slate-800 dark:to-slate-800/80 border border-brand-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-brand-700 dark:text-brand-300 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span>Unlock Team Workflows</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
              Upgrade to Pro for multimodal checks, team approvals and audit logs.
            </p>
            <button
              onClick={() => setUpgradeFeature('Multimodal & Team Workflows')}
              className="w-full py-1.5 px-3 bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium rounded-xl transition shadow-sm"
            >
              Upgrade to Pro ($49)
            </button>
          </div>
        )}
      </aside>

      <UpgradeDialog
        isOpen={Boolean(upgradeFeature)}
        onClose={() => setUpgradeFeature(null)}
        featureName={upgradeFeature || ''}
      />
    </>
  );
}
