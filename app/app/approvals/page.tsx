'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GitPullRequest,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { getContentItems, getCurrentUser, transitionContentStatus } from '@/lib/store';
import { ContentItem, ContentStatus, UserProfile } from '@/lib/types';
import { hasPermission } from '@/lib/rbac';
import { toast } from 'sonner';

export default function ApprovalsKanbanPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser());

  useEffect(() => {
    setItems(getContentItems());
    setCurrentUser(getCurrentUser());
  }, []);

  const columns: { id: ContentStatus; label: string; bg: string }[] = [
    { id: 'draft', label: 'Draft', bg: 'border-slate-300' },
    { id: 'ai_review', label: 'Under AI Review', bg: 'border-blue-400' },
    { id: 'changes_required', label: 'Changes Required', bg: 'border-red-400' },
    { id: 'resubmitted', label: 'Resubmitted', bg: 'border-amber-400' },
    { id: 'pending_approval', label: 'Pending Approval', bg: 'border-accent-400' },
    { id: 'approved', label: 'Approved', bg: 'border-emerald-400' },
  ];

  const handleStatusChange = (contentId: string, nextStatus: ContentStatus) => {
    const res = transitionContentStatus({
      contentItemId: contentId,
      nextStatus,
      actor: currentUser,
      comment: `Moved status to ${nextStatus.replace('_', ' ')} by ${currentUser.fullName}`,
    });

    if (res.success) {
      setItems(getContentItems());
      toast.success(`Content moved to ${nextStatus.replace('_', ' ')}!`);
    } else {
      toast.error(res.error || 'Transition denied');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
            <GitPullRequest className="w-4 h-4" />
            <span>Collaborative Review & Sign-Off</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Approvals Workflow Board
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Role-gated transition pipeline from draft submission to legal & brand publication sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Acting as:</span>
          <span className="text-xs font-bold capitalize px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {currentUser.fullName} ({currentUser.role})
          </span>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colItems = items.filter((i) => i.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col min-w-[240px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {col.label}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-xs">
                  {colItems.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="space-y-3 flex-1">
                {colItems.length === 0 ? (
                  <div className="h-28 flex items-center justify-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No items in {col.label.toLowerCase()}
                  </div>
                ) : (
                  colItems.map((item) => {
                    const latestVer = item.versions[item.versions.length - 1];
                    const openCritical = latestVer?.findings.filter(
                      (f) => f.severity === 'critical' && f.status === 'open'
                    ).length || 0;

                    return (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 shadow-sm space-y-2 hover:border-brand-500 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {item.channel}
                          </span>
                          <span
                            className={`text-xs font-extrabold ${
                              (latestVer?.score || 0) > 80
                                ? 'text-emerald-500'
                                : (latestVer?.score || 0) > 50
                                ? 'text-accent-500'
                                : 'text-red-500'
                            }`}
                          >
                            {latestVer?.score}%
                          </span>
                        </div>

                        <Link
                          href={`/app/content/${item.id}`}
                          className="font-bold text-xs text-slate-900 dark:text-white hover:text-brand-500 line-clamp-2 block"
                        >
                          {item.title}
                        </Link>

                        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                          <span>By {item.creatorName.split(' ')[0]}</span>
                          {openCritical > 0 && (
                            <span className="text-red-500 font-bold">
                              {openCritical} critical
                            </span>
                          )}
                        </div>

                        {/* Allowed transitions buttons */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap gap-1 text-[10px]">
                          {col.id === 'changes_required' && (
                            <button
                              onClick={() => handleStatusChange(item.id, 'resubmitted')}
                              className="px-2 py-1 bg-amber-500 text-white rounded font-medium hover:bg-amber-600 w-full"
                            >
                              Resubmit Draft
                            </button>
                          )}

                          {col.id === 'resubmitted' && (
                            <button
                              onClick={() => handleStatusChange(item.id, 'pending_approval')}
                              className="px-2 py-1 bg-brand-500 text-white rounded font-medium hover:bg-brand-600 w-full"
                            >
                              Request Approval
                            </button>
                          )}

                          {col.id === 'pending_approval' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(item.id, 'approved')}
                                className="px-2 py-1 bg-emerald-500 text-white rounded font-medium hover:bg-emerald-600 flex-1"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'changes_required')}
                                className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-slate-600 dark:text-slate-300 flex-1"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {col.id === 'approved' && (
                            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 w-full justify-center">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Ready to Publish</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
