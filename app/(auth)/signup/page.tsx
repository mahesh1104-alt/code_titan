'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { setCurrentUser } from '@/lib/store';
import { PlanType } from '@/lib/types';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [plan, setPlan] = useState<PlanType>('pro');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setCurrentUser({
      id: `usr_${Date.now()}`,
      orgId: `org_${Date.now()}`,
      orgName: orgName || 'My Organization',
      email,
      fullName,
      role: 'admin',
      plan,
    });

    toast.success(`Account created for ${orgName || 'organization'}!`);
    router.push('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center text-base shadow-md shadow-brand-500/20">
            BG
          </div>
          <span className="font-extrabold text-2xl tracking-tight">BrandGuard</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Create your organization account</h2>
        <p className="text-xs text-slate-500">
          Get started with automated brand governance in less than 2 minutes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1 font-medium">Your Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-medium">Work Email</label>
              <input
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-medium">Organization / Brand Name</label>
              <input
                type="text"
                placeholder="Acme Global Inc"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-medium">Select Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as PlanType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
              >
                <option value="starter">Starter (Free, Self-Review)</option>
                <option value="pro">Professional ($49/mo, Multimodal + Kanban)</option>
                <option value="enterprise">Enterprise ($299/mo, Ambiguity + Gates)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-md transition mt-2"
            >
              Start Free Trial
            </button>
          </form>

          <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-500 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
