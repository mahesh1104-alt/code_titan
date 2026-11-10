'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  BookOpen,
  Upload,
  FileCheck2,
  GitPullRequest,
  BarChart3,
  Users,
  CreditCard,
  ShieldAlert,
  UserCheck,
  X,
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '@/lib/seed-data';
import { setCurrentUser, getCurrentUser } from '@/lib/store';

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const currentUser = typeof window !== 'undefined' ? getCurrentUser() : DEMO_ACCOUNTS[1];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-command-palette'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems = [
    { label: 'Executive Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Brand Knowledge Center', href: '/app/knowledge', icon: BookOpen },
    { label: 'Submit Content for Review', href: '/app/submit', icon: Upload },
    { label: 'Review Workspace (TechNova Ad)', href: '/app/content/cnt_technova_sample_ad', icon: FileCheck2 },
    { label: 'Approvals Kanban Board', href: '/app/approvals', icon: GitPullRequest },
    { label: 'Governance Analytics', href: '/app/analytics', icon: BarChart3 },
    { label: 'Team & Permissions', href: '/app/team', icon: Users },
    { label: 'Subscription & Billing', href: '/app/billing', icon: CreditCard },
    { label: 'Compliance Audit Log', href: '/app/audit', icon: ShieldAlert },
  ];

  const filteredNav = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredUsers = DEMO_ACCOUNTS.filter(
    (u) =>
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase()) ||
      u.plan.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search (e.g. submit, kanban, switch user)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none dark:text-white"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Navigation Section */}
          <div>
            <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            <div className="space-y-1">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-left transition"
                  >
                    <Icon className="w-4 h-4 text-brand-500" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Switch Demo Role */}
          <div>
            <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Switch Demo Persona
            </div>
            <div className="space-y-1">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    router.push(user.initialRoute);
                    onClose();
                    window.location.reload();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl text-left transition ${
                    currentUser?.id === user.id
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span>{user.fullName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="capitalize px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700">
                      {user.role}
                    </span>
                    <span className="capitalize px-2 py-0.5 rounded-full bg-accent-100 dark:bg-accent-900/50 text-accent-700 dark:text-accent-300">
                      {user.plan}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or shortcuts</span>
          <span>
            ESC to close • <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">⌘K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
