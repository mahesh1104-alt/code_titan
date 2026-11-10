'use client';

import React, { useState, useEffect } from 'react';
import { Settings, User, Building, Sun, Moon, RotateCcw, ShieldCheck } from 'lucide-react';
import { useTheme } from 'next-themes';
import { getCurrentUser, resetDemoState } from '@/lib/store';
import { UserProfile } from '@/lib/types';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser());

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleResetDemo = () => {
    resetDemoState();
    toast.success('Demo state reset to original TechNova seed data!');
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Settings & Profile
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">
          Configure profile details, interface theme, and governance preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-brand-500" />
          <span>Active User Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={currentUser.fullName}
              readOnly
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              value={currentUser.email}
              readOnly
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Assigned Role</label>
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 font-bold uppercase text-brand-600 dark:text-brand-300">
              {currentUser.role}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Organization & Plan</label>
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {currentUser.orgName} ({currentUser.plan})
            </div>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-brand-500" />
          <span>Interface Appearance</span>
        </h3>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              theme === 'light'
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Light Mode
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              theme === 'dark'
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Dark Mode
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              theme === 'system'
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            System Default
          </button>
        </div>
      </div>

      {/* Reset Demo State */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-red-600">
          <RotateCcw className="w-4 h-4" />
          <h3 className="font-bold text-sm">Demo State Reset</h3>
        </div>
        <p className="text-xs text-slate-500 max-w-xl">
          Restore the sample TechNova ad, guidelines, facts, comments, and audit logs to their pristine demo state.
        </p>
        <button
          onClick={handleResetDemo}
          className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-semibold text-xs transition"
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  );
}
