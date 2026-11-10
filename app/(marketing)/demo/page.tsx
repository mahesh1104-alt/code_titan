'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Check, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SAMPLE_TECHNOVA_AD_TEXT, SAMPLE_TECHNOVA_INTENDED_MESSAGE } from '@/lib/seed-data';
import { runAnalysisPipeline } from '@/lib/ai/orchestrator';
import { Finding } from '@/lib/types';
import { toast } from 'sonner';

export default function DemoPlaygroundPage() {
  const [text, setText] = useState(SAMPLE_TECHNOVA_AD_TEXT);
  const [intendedMessage, setIntendedMessage] = useState(SAMPLE_TECHNOVA_INTENDED_MESSAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [score, setScore] = useState<number | null>(null);

  const handleRunAnalysis = async () => {
    if (!text.trim()) return;
    setIsLoading(true);

    try {
      const res = await runAnalysisPipeline({
        text,
        intendedMessage,
        versionId: `ver_demo_${Date.now()}`,
      });

      setFindings(res.findings);
      setScore(res.score);
      toast.success(`Analysis complete: ${res.findings.length} compliance findings identified.`);
    } catch {
      toast.error('Failed to analyze sample');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">Evaluating TechNova Brand Rules</span>
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition"
          >
            Sign In / Test Personas
          </Link>
        </div>
      </header>

      <main className="py-12 px-6 max-w-5xl mx-auto space-y-8 flex-1 w-full">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-100 dark:bg-accent-900/40 text-accent-800 dark:text-accent-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo Playground</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Test Content Governance in Real Time
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Paste marketing copy below to see how BrandGuard flags prohibited terms, absolute guarantees, and fact inconsistencies.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Draft Content to Analyze
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setText(SAMPLE_TECHNOVA_AD_TEXT);
                  setIntendedMessage(SAMPLE_TECHNOVA_INTENDED_MESSAGE);
                }}
                className="text-xs text-brand-500 hover:underline font-semibold"
              >
                Reset TechNova Sample Ad
              </button>
            </div>
          </div>

          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-400">
              Sample contains 6 non-compliant claims (1 critical, 3 high, 2 medium).
            </div>
            <button
              onClick={handleRunAnalysis}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Analyzing...' : 'Run Instant Check'}</span>
            </button>
          </div>
        </div>

        {/* Results */}
        {score !== null && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Analysis Results
                </h3>
                <p className="text-xs text-slate-400">
                  {findings.length} compliance findings detected against TechNova guidelines
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                  <div className="text-2xl font-extrabold text-red-500">{score}%</div>
                </div>
                <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-xs font-bold uppercase">
                  Approval Blocked
                </div>
              </div>
            </div>

            {/* Findings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {findings.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/30 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-600 dark:text-red-400">
                      &quot;{f.original}&quot;
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                      {f.severity}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{f.reason}</p>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200 font-medium">
                    Suggested: &quot;{f.suggestion.text}&quot;
                  </div>
                </div>
              ))}
            </div>

            {/* Sign-up CTA Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm">Want to review PDFs, images & manage team approvals?</h4>
                <p className="text-xs text-white/80 mt-0.5">
                  Sign in to explore all 6 demo accounts and the full review workspace.
                </p>
              </div>
              <Link
                href="/login"
                className="px-4 py-2 bg-accent-400 hover:bg-accent-500 text-slate-900 rounded-xl text-xs font-bold transition shrink-0"
              >
                Open Demo Accounts
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
