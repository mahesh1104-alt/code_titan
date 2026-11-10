'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Sparkles, ArrowRight, UserCheck, Lock, Mail } from 'lucide-react';
import { DEMO_ACCOUNTS } from '@/lib/seed-data';
import { setCurrentUser } from '@/lib/store';
import { UserProfile } from '@/lib/types';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLink, setIsMagicLink] = useState(false);

  const handleSelectDemoUser = (user: (typeof DEMO_ACCOUNTS)[0]) => {
    setCurrentUser(user as UserProfile);
    toast.success(`Logged in as ${user.fullName} (${user.role} • ${user.plan})`);
    router.push(user.initialRoute);
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Match existing demo user or default to Pro Creator
    const match = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    const userToLogin =
      match || {
        ...DEMO_ACCOUNTS[1],
        email,
        fullName: email.split('@')[0],
      };

    setCurrentUser(userToLogin);
    toast.success(`Signed in as ${userToLogin.fullName}`);
    router.push(userToLogin.initialRoute);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center text-base shadow-md shadow-brand-500/20">
            BG
          </div>
          <span className="font-extrabold text-2xl tracking-tight">BrandGuard</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Sign in to your brand governance workspace</h2>
        <p className="text-xs text-slate-500">
          Select any seeded persona below for instant 1-click evaluation, or sign in with your email.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl px-4 space-y-6">
        {/* ONE-CLICK DEMO PERSONAS PANEL (Section 6.2) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Demo Accounts Panel (1-Click Sign In)
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-100 dark:bg-accent-900/40 text-accent-800 dark:text-accent-300">
              TechNova Seeding
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEMO_ACCOUNTS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectDemoUser(user)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 text-left transition hover:shadow-md bg-slate-50/50 dark:bg-slate-800/30 group flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        user.plan === 'enterprise'
                          ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/50 dark:text-accent-300'
                          : user.plan === 'pro'
                          ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {user.plan}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 capitalize">
                      {user.role}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-brand-500 transition pt-1">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">{user.email}</div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 pt-1">{user.description}</p>
                </div>

                <div className="pt-2 text-[10px] font-semibold text-brand-500 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-2">
                  <span>Lands on: {user.initialRoute.replace('/app/', '')}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Standard Email & Password Box */}
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Or Sign In With Custom Email
          </div>

          <form onSubmit={handleStandardLogin} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1 font-medium">Email address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            {!isMagicLink && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-500 font-medium">Password</label>
                  <Link href="/forgot-password" className="text-brand-500 hover:underline text-[11px]">
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-md transition"
            >
              {isMagicLink ? 'Send Magic Link' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsMagicLink(!isMagicLink)}
              className="hover:underline text-slate-600 dark:text-slate-300"
            >
              {isMagicLink ? 'Use password instead' : 'Sign in with Magic Link'}
            </button>
            <Link href="/signup" className="text-brand-500 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
