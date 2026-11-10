'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileCode,
  Image as ImageIcon,
} from 'lucide-react';
import {
  SAMPLE_TECHNOVA_AD_TEXT,
  SAMPLE_TECHNOVA_INTENDED_MESSAGE,
} from '@/lib/seed-data';
import { getCurrentUser, saveContentItem } from '@/lib/store';
import { runAnalysisPipeline } from '@/lib/ai/orchestrator';
import { ContentItem } from '@/lib/types';
import { toast } from 'sonner';

export default function SubmitContentPage() {
  const router = useRouter();
  const currentUser = typeof window !== 'undefined' ? getCurrentUser() : null;

  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState<'ad' | 'email' | 'social' | 'blog' | 'deck'>('ad');
  const [intendedMessage, setIntendedMessage] = useState('');
  const [rawText, setRawText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Stepper state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Extracting document content',
    'Retrieving brand knowledge & facts',
    'Running deterministic terminology check',
    'Detecting promotional warranties & superlatives',
    'Verifying factual claims against corporate SLA',
    'Evaluating brand voice & tone consistency',
    'Analyzing visual identity & contrast compliance',
    'Synthesizing intent-preserving recommendations',
  ];

  const handlePreloadSampleAd = () => {
    setTitle('TechNova Q4 Flagship Commercial Launch Ad');
    setChannel('ad');
    setIntendedMessage(SAMPLE_TECHNOVA_INTENDED_MESSAGE);
    setRawText(SAMPLE_TECHNOVA_AD_TEXT);
    toast.info('TechNova sample non-compliant ad preloaded');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setRawText(text);
      };
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        // For binary/images, load sample placeholder text
        setRawText(`[Uploaded File: ${file.name}] Visual banner copy check.`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      toast.error('Please enter content or upload a document to review.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);

    // Simulate animated stepper progress
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((res) => setTimeout(res, 280));
    }

    try {
      const versionId = `ver_${Date.now()}`;
      const ext = selectedFile?.name.split('.').pop()?.toLowerCase();
      const fileType = (ext === 'png' || ext === 'jpg' ? ext : 'txt') as any;

      const result = await runAnalysisPipeline({
        text: rawText,
        intendedMessage: intendedMessage || 'General promotional communication',
        channel,
        versionId,
        fileName: selectedFile?.name || 'campaign_copy.txt',
        fileType,
      });

      const itemId = `cnt_${Date.now()}`;
      const newItem: ContentItem = {
        id: itemId,
        orgId: currentUser?.orgId || 'org_technova_pro',
        title: title || 'Untitled Campaign Draft',
        channel,
        creatorId: currentUser?.id || 'usr_pro_creator',
        creatorName: currentUser?.fullName || 'Content Creator',
        brandProfileId: 'bp_technova',
        status: result.scoreSummary.isApprovalBlocked ? 'changes_required' : 'pending_approval',
        intendedMessage,
        currentVersionId: versionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedReviewerId: 'usr_pro_reviewer',
        versions: [
          {
            id: versionId,
            contentItemId: itemId,
            versionNo: 1,
            fileName: selectedFile?.name || 'copy_v1.txt',
            fileType,
            extractedText: rawText,
            score: result.score,
            guidelineVersion: 'v4.1',
            createdAt: new Date().toISOString(),
            changesSummary: 'Initial automated analysis.',
            findings: result.findings,
          },
        ],
      };

      saveContentItem(newItem);
      toast.success(`Analysis complete! Identified ${result.findings.length} findings.`);
      router.push(`/app/content/${itemId}`);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to run analysis');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
            <UploadCloud className="w-4 h-4" />
            <span>Pre-Publication Quality Gate</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Submit Content for Governance Review
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Upload drafts, ad copy, or slide decks to automatically check against approved brand guidelines.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePreloadSampleAd}
          className="px-3.5 py-2 rounded-xl bg-accent-100 hover:bg-accent-200 dark:bg-accent-900/40 dark:hover:bg-accent-900/60 text-accent-800 dark:text-accent-300 font-semibold text-xs flex items-center gap-1.5 transition self-start sm:self-auto border border-accent-300 dark:border-accent-700"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Preload TechNova Sample Ad</span>
        </button>
      </div>

      {/* Form / Stepper Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        {isAnalyzing ? (
          <div className="py-12 px-4 text-center max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/40 text-brand-500 flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Multi-Agent Brand Analysis Running
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Evaluating against TechNova rules, facts, tone, and WCAG contrast standards.
              </p>
            </div>

            {/* Stepper list */}
            <div className="space-y-2.5 text-left bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {steps.map((s, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 text-xs transition ${
                      isDone
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : isCurrent
                        ? 'text-brand-600 dark:text-brand-300 font-bold'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin text-brand-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                    )}
                    <span>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Content Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Enterprise Campaign Ad"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Publishing Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="ad">Paid Advertising (Ad)</option>
                  <option value="social">Social Media (LinkedIn / X)</option>
                  <option value="email">Email Campaign / Newsletter</option>
                  <option value="deck">Sales Pitch Deck</option>
                  <option value="blog">Blog / Whitepaper</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Creator&apos;s Intended Message (One Sentence)
              </label>
              <input
                type="text"
                placeholder="What core outcome or idea should the audience remember? (e.g. Highlight data protection and productivity support)"
                value={intendedMessage}
                onChange={(e) => setIntendedMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The AI suggestion engine uses this to preserve your original purpose without altering your marketing goal.
              </p>
            </div>

            {/* Upload Zone & Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Content Draft (Paste or Upload)
                </label>
                <span className="text-xs text-slate-400">Supported: TXT, DOCX, PDF, PNG, JPG</span>
              </div>

              <div className="mb-3 p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".txt,.docx,.pdf,.png,.jpg,.jpeg"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {selectedFile ? selectedFile.name : 'Drop file here or click to browse'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Up to 25MB'}
                </div>
              </div>

              <textarea
                rows={6}
                placeholder="Or paste your marketing copy here..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-brand-500/20 transition"
              >
                <span>Run Governance Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
