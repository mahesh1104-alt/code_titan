'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  Edit3,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  Info,
  Clock,
  History,
  Palette,
  Eye,
  Sliders,
  Filter,
  Search,
  MessageSquare,
  Lock,
} from 'lucide-react';
import {
  getContentItemById,
  updateFindingDecision,
  getCurrentUser,
  transitionContentStatus,
  getComments,
  addComment,
} from '@/lib/store';
import { ContentItem, Finding, Severity, FindingType, UserProfile } from '@/lib/types';
import { calculateComplianceScore } from '@/lib/ai/scoring';
import { TECHNOVA_VISUAL_IDENTITY } from '@/lib/seed-data';
import { getContrastRatio } from '@/lib/ai/rules';
import { toast } from 'sonner';

export default function ReviewWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const contentId = (params?.id as string) || 'cnt_technova_sample_ad';

  const [item, setItem] = useState<ContentItem | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser());
  const [activeTab, setActiveTab] = useState<'text' | 'visual' | 'history'>('text');

  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('open');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected / Active Finding
  const [focusedFindingId, setFocusedFindingId] = useState<string | null>(null);
  const [hoveredFinding, setHoveredFinding] = useState<Finding | null>(null);

  // Modals
  const [overrideModalFinding, setOverrideModalFinding] = useState<Finding | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [editModalFinding, setEditModalFinding] = useState<Finding | null>(null);
  const [editedText, setEditedText] = useState('');

  // Interactive Contrast Checker state
  const [contrastFg, setContrastFg] = useState('#A0AEC0');
  const [contrastBg, setContrastBg] = useState('#FFFFFF');

  // Comments
  const [comments, setComments] = useState(getComments(contentId));
  const [newCommentBody, setNewCommentBody] = useState('');

  const findingsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded = getContentItemById(contentId);
    if (loaded) setItem(loaded);
    setCurrentUser(getCurrentUser());
    setComments(getComments(contentId));
  }, [contentId]);

  const currentVersion = useMemo(() => {
    if (!item || !item.versions.length) return null;
    return item.versions[item.versions.length - 1];
  }, [item]);

  const scoreSummary = useMemo(() => {
    if (!currentVersion) return null;
    return calculateComplianceScore(currentVersion.findings);
  }, [currentVersion]);

  // Keyboard shortcuts (J/K/A/R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const findings = currentVersion?.findings || [];
      const openFindings = findings.filter((f) => f.status === 'open');
      if (!openFindings.length) return;

      const currentIndex = openFindings.findIndex((f) => f.id === focusedFindingId);

      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        const nextIndex = currentIndex < openFindings.length - 1 ? currentIndex + 1 : 0;
        setFocusedFindingId(openFindings[nextIndex].id);
        scrollToCard(openFindings[nextIndex].id);
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : openFindings.length - 1;
        setFocusedFindingId(openFindings[prevIndex].id);
        scrollToCard(openFindings[prevIndex].id);
      } else if ((e.key === 'a' || e.key === 'A') && focusedFindingId) {
        e.preventDefault();
        handleAccept(focusedFindingId);
      } else if ((e.key === 'r' || e.key === 'R') && focusedFindingId) {
        e.preventDefault();
        handleReject(focusedFindingId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedFindingId, currentVersion]);

  const scrollToCard = (findingId: string) => {
    const cardEl = document.getElementById(`card-${findingId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAccept = (findingId: string) => {
    if (!item || !currentVersion) return;
    const res = updateFindingDecision({
      contentItemId: item.id,
      versionId: currentVersion.id,
      findingId,
      action: 'accept',
      actor: currentUser,
    });
    if (res.success && res.item) {
      setItem({ ...res.item });
      toast.success('Suggestion accepted! Document updated.');
    }
  };

  const handleReject = (findingId: string) => {
    if (!item || !currentVersion) return;
    const res = updateFindingDecision({
      contentItemId: item.id,
      versionId: currentVersion.id,
      findingId,
      action: 'reject',
      actor: currentUser,
    });
    if (res.success && res.item) {
      setItem({ ...res.item });
      toast.info('Finding marked as rejected.');
    }
  };

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideModalFinding || !item || !currentVersion) return;
    if (!overrideReason.trim()) {
      toast.error('A written override rationale is required.');
      return;
    }

    const res = updateFindingDecision({
      contentItemId: item.id,
      versionId: currentVersion.id,
      findingId: overrideModalFinding.id,
      action: 'override',
      overrideReason,
      actor: currentUser,
    });

    if (res.success && res.item) {
      setItem({ ...res.item });
      setOverrideModalFinding(null);
      setOverrideReason('');
      toast.success('Finding overridden with recorded justification.');
    } else {
      toast.error(res.error || 'Override failed');
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalFinding || !item || !currentVersion) return;

    const res = updateFindingDecision({
      contentItemId: item.id,
      versionId: currentVersion.id,
      findingId: editModalFinding.id,
      action: 'edit',
      editedText,
      actor: currentUser,
    });

    if (res.success && res.item) {
      setItem({ ...res.item });
      setEditModalFinding(null);
      toast.success('Custom edit applied to document.');
    }
  };

  const handleRequestApproval = () => {
    if (!item) return;
    if (scoreSummary?.isApprovalBlocked) {
      toast.error('Cannot submit for approval: critical issues must be resolved or overridden.');
      return;
    }

    const res = transitionContentStatus({
      contentItemId: item.id,
      nextStatus: 'pending_approval',
      actor: currentUser,
      comment: 'Creator addressed findings and requested formal sign-off.',
    });

    if (res.success && res.item) {
      setItem({ ...res.item });
      toast.success('Status updated to Pending Approval!');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentBody.trim() || !item) return;

    addComment({
      contentItemId: item.id,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      body: newCommentBody,
    });

    setComments(getComments(item.id));
    setNewCommentBody('');
    toast.success('Comment posted');
  };

  if (!item || !currentVersion) {
    return (
      <div className="p-12 text-center text-slate-500">
        Loading review workspace...
      </div>
    );
  }

  // Filter findings
  const filteredFindings = currentVersion.findings.filter((f) => {
    const matchesSev = selectedSeverity === 'all' || f.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || f.type === selectedType;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'open' ? f.status === 'open' : f.status === selectedStatus);
    const matchesSearch =
      !searchQuery ||
      f.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesType && matchesStatus && matchesSearch;
  });

  const contrastCalculated = getContrastRatio(contrastFg, contrastBg);
  const isContrastPassAA = contrastCalculated >= 4.5;

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/app/content"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300">
                {item.channel}
              </span>
              <span className="text-xs text-slate-400">Version {currentVersion.versionNo}</span>
              <span className="text-xs text-slate-400">• Guideline {currentVersion.guidelineVersion}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              {item.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Shortcuts indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            <span>Shortcuts:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] font-mono">J / K</kbd>
            <span>cards</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] font-mono">A</kbd>
            <span>accept</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] font-mono">R</kbd>
            <span>reject</span>
          </div>

          <button
            onClick={handleRequestApproval}
            disabled={scoreSummary?.isApprovalBlocked || item.status === 'approved'}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition ${
              scoreSummary?.isApprovalBlocked || item.status === 'approved'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>
              {item.status === 'approved'
                ? 'Signed Off & Approved'
                : item.status === 'pending_approval'
                ? 'Under Review'
                : 'Request Formal Sign-off'}
            </span>
          </button>
        </div>
      </div>

      {/* Quality Gate Banner */}
      <div
        className={`p-4 rounded-2xl flex items-center justify-between border ${
          scoreSummary?.isApprovalBlocked
            ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300'
            : scoreSummary?.highCount && scoreSummary.highCount > 0
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300'
            : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {scoreSummary?.isApprovalBlocked ? (
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          )}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              {scoreSummary?.isApprovalBlocked ? 'Approval Gate: BLOCKED' : 'Approval Gate: OPEN'}
            </div>
            <div className="text-xs font-medium mt-0.5">{scoreSummary?.statusMessage}</div>
          </div>
        </div>

        {/* Animated Compliance Score Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              Compliance Score
            </div>
            <div className="text-2xl font-extrabold">{currentVersion.score}%</div>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-20"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * currentVersion.score) / 100}
                className="transition-all duration-700 ease-out"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Split Review Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Document / Visual Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Viewer Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 text-xs">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl font-medium transition ${
                activeTab === 'text'
                  ? 'border-b-2 border-brand-500 text-brand-600 dark:text-brand-300 bg-white dark:bg-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Document Text & Inline Highlights</span>
            </button>

            <button
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl font-medium transition ${
                activeTab === 'visual'
                  ? 'border-b-2 border-brand-500 text-brand-600 dark:text-brand-300 bg-white dark:bg-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Visual & WCAG Contrast Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl font-medium transition ${
                activeTab === 'history'
                  ? 'border-b-2 border-brand-500 text-brand-600 dark:text-brand-300 bg-white dark:bg-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Version Timeline ({item.versions.length})</span>
            </button>
          </div>

          {/* Tab Content 1: Document Text with Inline Highlights */}
          {activeTab === 'text' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold uppercase tracking-wider">
                  Live Highlighted Document Viewer
                </span>
                <span>Click highlight to focus finding card</span>
              </div>

              {/* Document Text Rendering */}
              <div className="text-sm font-mono leading-loose text-slate-800 dark:text-slate-200 p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800">
                {(() => {
                  const raw = currentVersion.extractedText;
                  // For the TechNova sample ad, render highlight spans
                  return (
                    <div className="space-y-4">
                      <p>
                        &quot;TechNova is the{' '}
                        <span
                          className={`highlight-high ${focusedFindingId === 'fnd_1' ? 'active ring-2 ring-orange-500' : ''}`}
                          onClick={() => {
                            setFocusedFindingId('fnd_1');
                            scrollToCard('fnd_1');
                          }}
                          onMouseEnter={() => setHoveredFinding(currentVersion.findings.find(f => f.id === 'fnd_1') || null)}
                          onMouseLeave={() => setHoveredFinding(null)}
                        >
                          world&apos;s No. 1
                        </span>{' '}
                        <span
                          className={`highlight-medium ${focusedFindingId === 'fnd_2' ? 'active ring-2 ring-yellow-500' : ''}`}
                          onClick={() => {
                            setFocusedFindingId('fnd_2');
                            scrollToCard('fnd_2');
                          }}
                          onMouseEnter={() => setHoveredFinding(currentVersion.findings.find(f => f.id === 'fnd_2') || null)}
                          onMouseLeave={() => setHoveredFinding(null)}
                        >
                          AI robot
                        </span>{' '}
                        company, delivering{' '}
                        <span
                          className={`highlight-critical ${focusedFindingId === 'fnd_3' ? 'active ring-2 ring-red-500' : ''}`}
                          onClick={() => {
                            setFocusedFindingId('fnd_3');
                            scrollToCard('fnd_3');
                          }}
                          onMouseEnter={() => setHoveredFinding(currentVersion.findings.find(f => f.id === 'fnd_3') || null)}
                          onMouseLeave={() => setHoveredFinding(null)}
                        >
                          100% guaranteed protection
                        </span>{' '}
                        and{' '}
                        <span
                          className={`highlight-high ${focusedFindingId === 'fnd_4' ? 'active ring-2 ring-orange-500' : ''}`}
                          onClick={() => {
                            setFocusedFindingId('fnd_4');
                            scrollToCard('fnd_4');
                          }}
                          onMouseEnter={() => setHoveredFinding(currentVersion.findings.find(f => f.id === 'fnd_4') || null)}
                          onMouseLeave={() => setHoveredFinding(null)}
                        >
                          300% better productivity
                        </span>{' '}
                        to every{' '}
                        <span
                          className={`highlight-medium ${focusedFindingId === 'fnd_5' ? 'active ring-2 ring-yellow-500' : ''}`}
                          onClick={() => {
                            setFocusedFindingId('fnd_5');
                            scrollToCard('fnd_5');
                          }}
                          onMouseEnter={() => setHoveredFinding(currentVersion.findings.find(f => f.id === 'fnd_5') || null)}
                          onMouseLeave={() => setHoveredFinding(null)}
                        >
                          consumer
                        </span>
                        . Our service is available{' '}
                        <span
                          className={`highlight-high ${focusedFindingId === 'fnd_6' ? 'active ring-2 ring-orange-500' : ''}`}
                          onClick={() => {
                            setFocusedFindingId('fnd_6');
                            scrollToCard('fnd_6');
                          }}
                          onMouseEnter={() => setHoveredFinding(currentVersion.findings.find(f => f.id === 'fnd_6') || null)}
                          onMouseLeave={() => setHoveredFinding(null)}
                        >
                          24/7 to everyone
                        </span>
                        .&quot;
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Floating Tooltip preview on hover */}
              {hoveredFinding && (
                <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1 shadow-xl animate-in fade-in">
                  <div className="flex items-center justify-between font-bold">
                    <span>{hoveredFinding.issue}</span>
                    <span className="uppercase text-[10px] text-accent-400">
                      {hoveredFinding.severity}
                    </span>
                  </div>
                  <div className="text-slate-300">
                    Suggested replacement:{' '}
                    <strong className="text-emerald-400">{hoveredFinding.suggestion.text}</strong>
                  </div>
                </div>
              )}

              {/* Creator Intended Purpose banner */}
              <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/40 text-xs text-brand-900 dark:text-brand-200">
                <div className="font-bold mb-1 flex items-center gap-1.5 text-brand-600 dark:text-brand-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Creator&apos;s Intended Message (Used by AI Engine)</span>
                </div>
                <p>{item.intendedMessage || 'Highlight robust data protection and enterprise productivity.'}</p>
              </div>
            </div>
          )}

          {/* Tab Content 2: Visual & WCAG Contrast Inspector */}
          {activeTab === 'visual' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-500" />
                <span>Interactive WCAG 2.2 AA Contrast & Palette Validator</span>
              </h3>

              {/* Contrast formula tool */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Live Contrast Calculator (Relative Luminance Formula)
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Text Color (Hex)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={contrastFg}
                        onChange={(e) => setContrastFg(e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                      />
                      <input
                        type="text"
                        value={contrastFg}
                        onChange={(e) => setContrastFg(e.target.value)}
                        className="w-full text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Background Color (Hex)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={contrastBg}
                        onChange={(e) => setContrastBg(e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                      />
                      <input
                        type="text"
                        value={contrastBg}
                        onChange={(e) => setContrastBg(e.target.value)}
                        className="w-full text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Box */}
                <div
                  className="p-4 rounded-xl text-center font-bold text-sm transition shadow-inner"
                  style={{ backgroundColor: contrastBg, color: contrastFg }}
                >
                  TechNova Enterprise Brand Headline
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <div>
                    Measured Contrast Ratio:{' '}
                    <strong className="text-base font-extrabold">
                      {contrastCalculated.toFixed(2)}:1
                    </strong>
                  </div>
                  <div>
                    Status:{' '}
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        isContrastPassAA
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      }`}
                    >
                      {isContrastPassAA ? 'PASS (WCAG AA ≥ 4.5:1)' : 'FAIL (Below 4.5:1 AA)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Version Timeline */}
          {activeTab === 'history' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-brand-500" />
                <span>Version Timeline & Audit Trail</span>
              </h3>
              <div className="space-y-3">
                {item.versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        Version {ver.versionNo} • Score {ver.score}%
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {ver.changesSummary || 'Document update'} • Guideline {ver.guidelineVersion}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(ver.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Threaded Comments Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-500" />
              <span>Review Discussion ({comments.length})</span>
            </h3>

            <div className="space-y-3">
              {comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {cmt.authorName} ({cmt.authorRole})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(cmt.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{cmt.body}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Add a review note with @mention..."
                value={newCommentBody}
                onChange={(e) => setNewCommentBody(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Findings Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4" ref={findingsContainerRef}>
          {/* Findings Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Compliance Findings ({filteredFindings.length})
              </div>
              <div className="text-xs text-slate-400">
                {currentVersion.findings.filter((f) => f.status === 'open').length} open
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="high">High Only</option>
                <option value="medium">Medium Only</option>
                <option value="low">Low Only</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open Only</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="overridden">Overridden</option>
              </select>
            </div>
          </div>

          {/* Finding Cards List */}
          <div className="space-y-4">
            {filteredFindings.map((finding) => {
              const isFocused = focusedFindingId === finding.id;

              return (
                <div
                  key={finding.id}
                  id={`card-${finding.id}`}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-3 transition duration-150 ${
                    isFocused
                      ? 'border-brand-500 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                  onClick={() => setFocusedFindingId(finding.id)}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            finding.severity === 'critical'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                              : finding.severity === 'high'
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                          }`}
                        >
                          {finding.severity}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          {finding.type.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {finding.issue}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        finding.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-700'
                          : finding.status === 'overridden'
                          ? 'bg-blue-100 text-blue-700'
                          : finding.status === 'rejected'
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {finding.status}
                    </span>
                  </div>

                  {/* Original Text Snippet */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs font-mono">
                    <span className="text-slate-400 line-through mr-1">Flagged:</span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      &quot;{finding.original}&quot;
                    </span>
                  </div>

                  {/* Reason & Guideline Reference */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p>{finding.reason}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Info className="w-3 h-3 text-brand-500 shrink-0" />
                      <span>{finding.guidelineRef.title} ({finding.guidelineRef.section})</span>
                    </div>
                  </div>

                  {/* Evidence Quote if available */}
                  {finding.evidence && (
                    <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-xs text-blue-900 dark:text-blue-300">
                      <div className="font-semibold text-[10px] uppercase tracking-wider mb-0.5">
                        Verified Evidence Citation:
                      </div>
                      <p className="italic">&quot;{finding.evidence.quote}&quot;</p>
                    </div>
                  )}

                  {/* Intent-Preserving Suggestion Diff */}
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Intent-Preserving Correction</span>
                      </span>
                      <span className="text-[10px] font-mono">
                        {(finding.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <div className="text-emerald-900 dark:text-emerald-200 font-semibold">
                      &quot;{finding.suggestion.text}&quot;
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      {finding.suggestion.rationale}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  {finding.status === 'open' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleAccept(finding.id)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-sm transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Fix</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditModalFinding(finding);
                          setEditedText(finding.suggestion.text);
                        }}
                        className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleReject(finding.id)}
                        className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-500 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Reviewer / Admin Override Button */}
                      {(currentUser.role === 'reviewer' || currentUser.role === 'admin') && (
                        <button
                          onClick={() => {
                            setOverrideModalFinding(finding);
                            setOverrideReason('');
                          }}
                          className="py-1.5 px-3 rounded-xl bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 text-amber-800 dark:text-amber-300 text-xs font-semibold transition"
                        >
                          Override
                        </button>
                      )}
                    </div>
                  )}

                  {/* Overridden state details */}
                  {finding.status === 'overridden' && (
                    <div className="text-[11px] text-slate-500 pt-1">
                      Overridden by <strong>{finding.decidedBy}</strong>. Reason:{' '}
                      <em>&quot;{finding.overrideReason}&quot;</em>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Reviewer Override (Reason Required) */}
      {overrideModalFinding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Authorised Reviewer Override
              </h3>
              <button onClick={() => setOverrideModalFinding(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Overriding &quot;<strong>{overrideModalFinding.original}</strong>&quot; ({overrideModalFinding.issue}).
              Every override is permanently logged in the audit trail.
            </p>

            <form onSubmit={handleOverrideSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-semibold">
                  Written Justification / Legal Rationale *
                </label>
                <textarea
                  placeholder="e.g. Approved by General Counsel based on European customer exception..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent h-24"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOverrideModalFinding(null)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600"
                >
                  Confirm Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Custom Edit */}
      {editModalFinding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Customize Suggestion</h3>
              <button onClick={() => setEditModalFinding(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Original Text</label>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                  {editModalFinding.original}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Edited Replacement Text</label>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalFinding(null)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600"
                >
                  Apply Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
