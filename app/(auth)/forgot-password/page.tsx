'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSent(true);
    toast.success('Password reset link sent to your email.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Reset your password</h2>
        <p className="text-xs text-slate-500">
          Enter your email address and we will send you a password recovery link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          {isSent ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm">Check your inbox</h3>
              <p className="text-xs text-slate-500">
                We sent instructions to <strong>{email}</strong>.
              </p>
              <Link
                href="/login"
                className="inline-block mt-2 text-xs font-semibold text-brand-500 hover:underline"
              >
                Return to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-md transition"
              >
                Send Reset Link
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
