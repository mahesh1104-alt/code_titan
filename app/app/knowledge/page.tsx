'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  FileCheck2,
  Sparkles,
  Plus,
  Trash2,
  Palette,
  Volume2,
  Scale,
  Shield,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import {
  getBrandFacts,
  saveBrandFact,
  deleteBrandFact,
  getTerminologyRules,
  saveTerminologyRule,
  getCurrentUser,
  logAuditEvent,
} from '@/lib/store';
import {
  TECHNOVA_GUIDELINES,
  TECHNOVA_TONE_PROFILE,
  TECHNOVA_VISUAL_IDENTITY,
} from '@/lib/seed-data';
import { BrandFact, TerminologyRule, Severity } from '@/lib/types';
import { hasPermission } from '@/lib/rbac';
import { toast } from 'sonner';

export default function KnowledgeCenterPage() {
  const [activeTab, setActiveTab] = useState<
    'guidelines' | 'facts' | 'terminology' | 'tone' | 'visual' | 'policies'
  >('guidelines');

  const currentUser = typeof window !== 'undefined' ? getCurrentUser() : null;
  const canEdit = currentUser ? hasPermission(currentUser.role, 'editBrandKnowledge') : true;

  const [facts, setFacts] = useState<BrandFact[]>([]);
  const [terms, setTerms] = useState<TerminologyRule[]>([]);
  const [showAddFactModal, setShowAddFactModal] = useState(false);
  const [showAddTermModal, setShowAddTermModal] = useState(false);
  const [showExtractAiModal, setShowExtractAiModal] = useState(false);

  // New Fact State
  const [newFactKey, setNewFactKey] = useState('');
  const [newFactValue, setNewFactValue] = useState('');
  const [newFactSource, setNewFactSource] = useState('Brand Guidelines 2026');

  // New Term State
  const [newTerm, setNewTerm] = useState('');
  const [newReplacement, setNewReplacement] = useState('');
  const [newSeverity, setNewSeverity] = useState<Severity>('medium');
  const [newExplanation, setNewExplanation] = useState('');

  useEffect(() => {
    setFacts(getBrandFacts());
    setTerms(getTerminologyRules());
  }, []);

  const handleCreateFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactKey || !newFactValue) return;

    const fact: BrandFact = {
      id: `fact_${Date.now()}`,
      brandProfileId: 'bp_technova',
      key: newFactKey,
      value: newFactValue,
      sourceDocument: newFactSource,
      validFrom: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    saveBrandFact(fact);
    setFacts(getBrandFacts());
    setShowAddFactModal(false);
    setNewFactKey('');
    setNewFactValue('');
    toast.success('Brand fact saved to knowledge base');

    if (currentUser) {
      logAuditEvent({
        orgId: currentUser.orgId,
        actorId: currentUser.id,
        actorName: currentUser.fullName,
        actorRole: currentUser.role,
        action: 'FACT_ADDED',
        entity: 'BrandFact',
        entityId: fact.id,
        metadata: { key: fact.key, value: fact.value },
      });
    }
  };

  const handleCreateTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm || !newReplacement) return;

    const term: TerminologyRule = {
      id: `term_${Date.now()}`,
      brandProfileId: 'bp_technova',
      term: newTerm,
      kind: 'prohibited',
      replacement: newReplacement,
      severity: newSeverity,
      matchMode: 'exact',
      explanation: newExplanation,
    };

    saveTerminologyRule(term);
    setTerms(getTerminologyRules());
    setShowAddTermModal(false);
    setNewTerm('');
    setNewReplacement('');
    setNewExplanation('');
    toast.success('Terminology rule registered');

    if (currentUser) {
      logAuditEvent({
        orgId: currentUser.orgId,
        actorId: currentUser.id,
        actorName: currentUser.fullName,
        actorRole: currentUser.role,
        action: 'TERMINOLOGY_ADDED',
        entity: 'TerminologyRule',
        entityId: term.id,
        metadata: { term: term.term, replacement: term.replacement },
      });
    }
  };

  const handleConfirmAiExtracted = () => {
    // Propose and confirm AI-extracted facts and terms
    const proposedFact: BrandFact = {
      id: `fact_ai_${Date.now()}`,
      brandProfileId: 'bp_technova',
      key: 'Data Storage Encryption',
      value: 'AES-256 encryption at rest and TLS 1.3 in transit across all environments',
      sourceDocument: 'TechNova Global Brand Guidelines v4.1',
      validFrom: '2026-11-10',
      status: 'active',
    };
    saveBrandFact(proposedFact);
    setFacts(getBrandFacts());
    setShowExtractAiModal(false);
    toast.success('AI-extracted fact confirmed and activated!');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Single Source of Truth</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Brand Knowledge Center
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-2xl mt-0.5">
            Verified corporate facts, terminology dictionaries, voice profiles, and visual standards for{' '}
            <strong>TechNova</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={() => setShowExtractAiModal(true)}
              className="px-3.5 py-2 rounded-xl bg-accent-400 hover:bg-accent-500 text-slate-900 font-semibold text-xs flex items-center gap-2 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Extract with AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'guidelines', label: 'Guidelines & Docs', icon: FileText },
          { id: 'facts', label: 'Verified Facts', icon: FileCheck2 },
          { id: 'terminology', label: 'Terminology Dictionary', icon: Scale },
          { id: 'tone', label: 'Voice & Tone', icon: Volume2 },
          { id: 'visual', label: 'Visual Identity', icon: Palette },
          { id: 'policies', label: 'Claim Policies', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-medium transition whitespace-nowrap ${
                isActive
                  ? 'border-b-2 border-brand-500 text-brand-600 dark:text-brand-300 bg-white dark:bg-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Guidelines */}
      {activeTab === 'guidelines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TECHNOVA_GUIDELINES.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                    {doc.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{doc.title}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Version {doc.version} • {doc.fileSize}
                  </div>
                </div>
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>{doc.chunkCount} vector passages</span>
                  <span className="text-emerald-600 font-medium">Embeddings synced</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Facts */}
      {activeTab === 'facts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Structured brand facts checked deterministically by the Fact Verification Engine.
            </p>
            {canEdit && (
              <button
                onClick={() => setShowAddFactModal(true)}
                className="px-3 py-1.5 rounded-xl bg-brand-500 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-brand-600 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Fact</span>
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Key Attribute</th>
                  <th className="px-4 py-3">Approved Fact Statement</th>
                  <th className="px-4 py-3">Source Citation</th>
                  <th className="px-4 py-3">Status</th>
                  {canEdit && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {facts.map((fact) => (
                  <tr key={fact.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {fact.key}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{fact.value}</td>
                    <td className="px-4 py-3 text-slate-400">{fact.sourceDocument}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {fact.status}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            deleteBrandFact(fact.id);
                            setFacts(getBrandFacts());
                            toast.success('Fact removed');
                          }}
                          className="text-slate-400 hover:text-red-500 p-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Terminology */}
      {activeTab === 'terminology' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Prohibited and preferred vocabulary evaluated with exact, regex, and fuzzy matching.
            </p>
            {canEdit && (
              <button
                onClick={() => setShowAddTermModal(true)}
                className="px-3 py-1.5 rounded-xl bg-brand-500 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-brand-600 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Term Rule</span>
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Prohibited Term</th>
                  <th className="px-4 py-3">Mandated Replacement</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Match Mode</th>
                  <th className="px-4 py-3">Policy Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {terms.map((term) => (
                  <tr key={term.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-semibold text-red-600 dark:text-red-400">
                      &quot;{term.term}&quot;
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      &quot;{term.replacement}&quot;
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          term.severity === 'critical'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                            : term.severity === 'high'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                        }`}
                      >
                        {term.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px] capitalize">
                      {term.matchMode}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-xs">
                      {term.explanation || 'Mandated by Brand Governance'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Voice & Tone */}
      {activeTab === 'tone' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-brand-500" />
              <span>Core Brand Attributes</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {TECHNOVA_TONE_PROFILE.attributes.map((attr, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-medium border border-brand-100 dark:border-brand-800"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-emerald-600 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Approved Examples (Do)</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {TECHNOVA_TONE_PROFILE.doExamples.map((ex, idx) => (
                <li key={idx} className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  &quot;{ex}&quot;
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 5: Visual Identity */}
      {activeTab === 'visual' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-brand-500" />
              <span>Official Color Palette (CIEDE2000 Baseline)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {TECHNOVA_VISUAL_IDENTITY.palette.map((swatch, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div
                    className="h-14 rounded-lg shadow-inner"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div>
                    <div className="font-semibold text-[11px] text-slate-900 dark:text-white truncate">
                      {swatch.name}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">{swatch.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                Logo Clear-Space Rules
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {TECHNOVA_VISUAL_IDENTITY.logoProportionRule}. Minimum rendering height:{' '}
                {TECHNOVA_VISUAL_IDENTITY.minLogoSizePx}px.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                Approved Typography
              </h4>
              <div className="flex gap-2">
                {TECHNOVA_VISUAL_IDENTITY.approvedFonts.map((font, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono"
                  >
                    {font}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Claim Policies */}
      {activeTab === 'policies' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-red-600">
            <Shield className="w-5 h-5" />
            <h3 className="font-bold text-base">Promotional Claim & Warranty Policy</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Legal and compliance standards mandate strict pre-publication review for all marketing collateral.
            Under no circumstances may published content contain absolute guarantees (e.g. &quot;100% security&quot;),
            unsubstantiated superlative rankings (&quot;world&apos;s No. 1&quot;), or unverified metrics without
            audited 3rd-party evidence.
          </p>
        </div>
      )}

      {/* Modal: Add Fact */}
      {showAddFactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Register Verified Brand Fact</h3>
              <button onClick={() => setShowAddFactModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateFact} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Fact Key</label>
                <input
                  type="text"
                  placeholder="e.g. European Data Residency"
                  value={newFactKey}
                  onChange={(e) => setNewFactKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Approved Fact Statement</label>
                <textarea
                  placeholder="e.g. Frankfurt and Dublin data centers comply with EU GDPR..."
                  value={newFactValue}
                  onChange={(e) => setNewFactValue(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent h-20"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFactModal(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600"
                >
                  Save Fact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Term */}
      {showAddTermModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Add Terminology Rule</h3>
              <button onClick={() => setShowAddTermModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateTerm} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Prohibited Term</label>
                <input
                  type="text"
                  placeholder="e.g. cheap pricing"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Mandated Replacement</label>
                <input
                  type="text"
                  placeholder="e.g. competitive pricing"
                  value={newReplacement}
                  onChange={(e) => setNewReplacement(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Severity</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as Severity)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                >
                  <option value="low">Low (Informational)</option>
                  <option value="medium">Medium (Recommended)</option>
                  <option value="high">High (Requires Review)</option>
                  <option value="critical">Critical (Blocks Approval)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Policy Explanation</label>
                <input
                  type="text"
                  placeholder="e.g. Emphasize value rather than low cost"
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTermModal(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600"
                >
                  Save Term Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Extract with AI */}
      {showExtractAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">AI Rule Proposal</h3>
              </div>
              <button onClick={() => setShowExtractAiModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Extracted from: TechNova Global Brand Guidelines v4.1 (pg 18)
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                <strong>Proposed Key:</strong> Data Storage Encryption
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                <strong>Proposed Fact:</strong> &quot;AES-256 encryption at rest and TLS 1.3 in
                transit across all environments.&quot;
              </div>
              <div className="text-[11px] text-accent-600 dark:text-accent-400 font-medium pt-1">
                ⚠️ Human confirmation required before activating as a governing rule.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                onClick={() => setShowExtractAiModal(false)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                Discard
              </button>
              <button
                onClick={handleConfirmAiExtracted}
                className="px-4 py-2 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm & Activate Fact</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
