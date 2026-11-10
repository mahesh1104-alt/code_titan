'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  Scale,
  Volume2,
  Palette,
  Eye,
  GitPullRequest,
  BarChart3,
  Layers,
  Check,
  ChevronRight,
} from 'lucide-react';
import { SAMPLE_TECHNOVA_AD_TEXT } from '@/lib/seed-data';

export default function LandingPage() {
  // Animated before-and-after typing demo state
  const [demoState, setDemoState] = useState<'typing' | 'highlighted' | 'corrected'>('highlighted');

  useEffect(() => {
    const timer1 = setTimeout(() => setDemoState('highlighted'), 2000);
    const timer2 = setTimeout(() => setDemoState('corrected'), 5500);
    const timer3 = setTimeout(() => setDemoState('highlighted'), 10000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [demoState]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Navigation Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-brand-500/20">
            BG
          </div>
          <span className="font-bold text-lg tracking-tight">Inkloom AI – BrandGuard</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Link href="#problem" className="hover:text-brand-500 transition">
            The Problem
          </Link>
          <Link href="#checks" className="hover:text-brand-500 transition">
            Six Checks
          </Link>
          <Link href="#workflow" className="hover:text-brand-500 transition">
            Workflow
          </Link>
          <Link href="/pricing" className="hover:text-brand-500 transition">
            Pricing
          </Link>
          <Link href="/demo" className="hover:text-brand-500 transition text-brand-600 dark:text-brand-400">
            Live Playground
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
          >
            Demo Logins
          </Link>
          <Link
            href="/app/dashboard"
            className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition flex items-center gap-1.5"
          >
            <span>Open App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 border border-brand-100 dark:border-brand-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Evidence-Grounded • Multimodal • Human-Controlled</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Brand Governance Before Content Is Published
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Employees, agencies, and generative AI publish in parallel without a shared quality gate.
          BrandGuard checks drafts against approved brand knowledge, explains findings with evidence,
          and generates intent-preserving corrections.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/demo"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-xl shadow-brand-500/20 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try Live Playground (No Login)</span>
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition"
          >
            Explore 6 Demo Personas
          </Link>
        </div>

        {/* Interactive Typing & Highlight Demo Card */}
        <div className="pt-8 max-w-3xl mx-auto text-left">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-slate-400 ml-2 font-mono">TechNova Flagship Ad Copy</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemoState('highlighted')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    demoState === 'highlighted'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  6 Issues Flagged
                </button>
                <button
                  onClick={() => setDemoState('corrected')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    demoState === 'corrected'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  After BrandGuard
                </button>
              </div>
            </div>

            {demoState === 'highlighted' ? (
              <div className="space-y-4">
                <p className="font-mono text-sm md:text-base leading-loose text-slate-800 dark:text-slate-200">
                  &quot;TechNova is the{' '}
                  <span className="highlight-high" title="Unsupported ranking superlative">
                    world&apos;s No. 1
                  </span>{' '}
                  <span className="highlight-medium" title="Approved term is AI-powered platform">
                    AI robot
                  </span>{' '}
                  company, delivering{' '}
                  <span className="highlight-critical" title="Absolute warranty; legal liability">
                    100% guaranteed protection
                  </span>{' '}
                  and{' '}
                  <span className="highlight-high" title="Unsupported quantitative claim">
                    300% better productivity
                  </span>{' '}
                  to every{' '}
                  <span className="highlight-medium" title="Approved term is customer">
                    consumer
                  </span>
                  . Our service is available{' '}
                  <span className="highlight-high" title="24/7 SLA restricted to enterprise tier">
                    24/7 to everyone
                  </span>
                  .&quot;
                </p>

                <div className="pt-2 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <span>Grammatically perfect, brand-wise dangerous. 6 compliance issues identified.</span>
                  <button
                    onClick={() => setDemoState('corrected')}
                    className="text-brand-500 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Apply intent-preserving fixes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <p className="font-mono text-sm md:text-base leading-loose text-slate-800 dark:text-slate-200">
                  &quot;TechNova is an{' '}
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">
                    AI-powered platform
                  </span>{' '}
                  that helps{' '}
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">
                    customers
                  </span>{' '}
                  strengthen{' '}
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">
                    data protection
                  </span>
                  , with{' '}
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">
                    24/7 support for enterprise customers
                  </span>
                  .&quot;
                </p>

                <div className="pt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <span>Same commercial intent, fully aligned to verified SLA facts and brand rules.</span>
                  <button
                    onClick={() => setDemoState('highlighted')}
                    className="text-slate-400 hover:underline"
                  >
                    Replay comparison
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              The Problem
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Brand Trust Breaks Before Anyone Notices
            </h2>
            <p className="text-sm text-slate-500">
              Employees, agencies, social teams, and AI tools publish content simultaneously with no shared quality gate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-red-500 font-bold text-sm">Incorrect Claims</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Unsupported superlatives, zero-risk warranties, and absolute guarantees create legal liability.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-orange-500 font-bold text-sm">Outdated Information</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Old corporate facts, stale statistics, and expired promotional offers stay in active circulation.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-amber-500 font-bold text-sm">Inconsistent Language</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Banned terminology and off-brand casual tone vary unpredictably between authors and agencies.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-purple-500 font-bold text-sm">Off-Brand Visuals</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Distorted logos, incorrect palette hex codes, and sub-threshold WCAG accessibility contrast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Six Product Checks */}
      <section id="checks" className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Hybrid AI Engine
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Six Specialized Governance Checks</h2>
          <p className="text-sm text-slate-500">
            Strict rules stay deterministic; the LLM reasons only where judgement and intent preservation are needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: '1. Terminology Engine',
              desc: 'Normalized exact match, word-boundary regex, and fuzzy edit distance. Flags banned terms and substitutes approved vocabulary.',
              icon: Scale,
              badge: 'Deterministic',
            },
            {
              title: '2. Tone & Voice',
              desc: 'Compares text against enterprise tone attributes (trustworthy, authoritative, clear). Identifies informal slang and hyperbole.',
              icon: Volume2,
              badge: 'AI SDK',
            },
            {
              title: '3. Fact Verification',
              desc: 'Validates factual claims against structured facts first, then pgvector passage retrieval. Unsupported claims are never called false.',
              icon: FileCheck2,
              badge: 'Hybrid RAG',
            },
            {
              title: '4. Promotional Claims',
              desc: 'Detects superlatives, 100% guarantees, and unverified numerical metrics. High-risk claims trigger mandatory review gates.',
              icon: AlertTriangle,
              badge: 'Pattern + LLM',
            },
            {
              title: '5. Visual Consistency',
              desc: 'CIEDE2000 color distance against approved palette swatches (#164E8A, #F4B942) and logo clear-space aspect ratios.',
              icon: Palette,
              badge: 'Pro & Enterprise',
            },
            {
              title: '6. WCAG 2.2 AA Accessibility',
              desc: 'Relative luminance contrast ratio verification (4.5:1 AA standard), font-size validation, and alt-text presence.',
              icon: Eye,
              badge: 'Pro & Enterprise',
            },
          ].map((check, idx) => {
            const Icon = check.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-500 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {check.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{check.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{check.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Human Workflow Section */}
      <section id="workflow" className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Human-in-the-Loop
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Collaborative Review & Approval Workflow
            </h2>
            <p className="text-sm text-slate-500">
              Clear segregation of duties between creators, brand managers, and legal reviewers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="font-bold text-base">Creator Uploads & Refines</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submits draft copy or presentation decks. Reviews inline highlights, inspects evidence quotes, and accepts or rejects intent-preserving fixes.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="font-bold text-base">Manager Monitors & Configures</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tracks team turnaround on the Kanban board, updates guidelines and facts, and investigates unclear rules flagged by ambiguity intelligence.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="font-bold text-base">Reviewer Signs Off or Overrides</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Conducts final compliance checks. Overrides false alarms only with a mandatory written legal reason, permanently logged to the audit trail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800 px-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto w-full">
        <div>
          Inkloom AI – BrandGuard © 2026. Built by <strong>Team Dev Code</strong>.
        </div>
        <div className="flex gap-4">
          <Link href="/pricing" className="hover:underline">Pricing</Link>
          <Link href="/demo" className="hover:underline">Playground</Link>
          <Link href="/login" className="hover:underline">Demo Accounts</Link>
        </div>
      </footer>
    </div>
  );
}
