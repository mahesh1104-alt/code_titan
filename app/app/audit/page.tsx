'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Download, Search, Filter, CheckCircle2 } from 'lucide-react';
import { getAuditLogs, getCurrentUser } from '@/lib/store';
import { AuditLogEntry, UserProfile } from '@/lib/types';
import { toast } from 'sonner';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser());

  useEffect(() => {
    setLogs(getAuditLogs());
    setCurrentUser(getCurrentUser());
  }, []);

  const filteredLogs = logs.filter((log) => {
    return (
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleExportCsv = () => {
    if (currentUser.plan !== 'enterprise') {
      toast.error('CSV Audit Export is an Enterprise-only feature.');
      return;
    }

    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Entity', 'Entity ID', 'Model', 'Guideline Version'];
    const rows = filteredLogs.map((l) => [
      l.createdAt,
      l.actorName,
      l.actorRole,
      l.action,
      l.entity,
      l.entityId,
      l.modelUsed || 'rule-engine-v1',
      l.guidelineVersion || 'v4.1',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `brandguard_compliance_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Audit log CSV exported successfully');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Immutable Governance Record</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Compliance Audit Log
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Full audit trail of content submissions, guideline changes, reviewer sign-offs, and written overrides.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 shadow-xs transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV {currentUser.plan === 'enterprise' ? '' : '(Enterprise)'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter audit events by actor, action (e.g. OVERRIDE, APPROVE), or entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">Actor & Role</th>
              <th className="px-5 py-3">Action Recorded</th>
              <th className="px-5 py-3">Target Entity</th>
              <th className="px-5 py-3">AI Model & Guideline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-bold text-slate-900 dark:text-white">{log.actorName}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{log.actorRole}</div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full font-mono ${
                      log.action.includes('OVERRIDDEN')
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        : log.action.includes('APPROVED')
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {log.action}
                  </span>
                  {log.metadata?.overrideReason && (
                    <div className="text-[11px] text-slate-500 italic mt-1">
                      Reason: &quot;{log.metadata.overrideReason}&quot;
                    </div>
                  )}
                </td>
                <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                  {log.entity} ({log.entityId})
                </td>
                <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">
                  {log.modelUsed || 'gemini-1.5-pro'} • {log.guidelineVersion || 'v4.1'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
