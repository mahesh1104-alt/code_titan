'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle,
  Plus,
} from 'lucide-react';
import { getContentItems, getCurrentUser } from '@/lib/store';
import { ContentItem } from '@/lib/types';

export default function ContentListPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const currentUser = typeof window !== 'undefined' ? getCurrentUser() : null;

  useEffect(() => {
    setItems(getContentItems());
  }, []);

  const filtered = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesChannel = channelFilter === 'all' || item.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Governance Review Queue</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Content Submissions
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Track and inspect marketing drafts, advertising copy, and campaign assets.
          </p>
        </div>

        <Link
          href="/app/submit"
          className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Submission</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search campaigns or documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
          >
            <option value="all">All Channels</option>
            <option value="ad">Advertising (Ad)</option>
            <option value="social">Social Media</option>
            <option value="email">Email</option>
            <option value="deck">Sales Deck</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const currentVersion = item.versions[item.versions.length - 1];
          const score = currentVersion?.score ?? 0;
          const openFindings = currentVersion?.findings.filter((f) => f.status === 'open').length ?? 0;

          return (
            <Link
              key={item.id}
              href={`/app/content/${item.id}`}
              className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-brand-500 dark:hover:border-brand-500 shadow-sm transition group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.channel}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : item.status === 'pending_approval'
                          ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-brand-500 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    Intended message: {item.intendedMessage || 'General commercial announcement'}
                  </p>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-auto shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-400">Compliance</div>
                    <div
                      className={`text-lg font-extrabold ${
                        score > 80
                          ? 'text-emerald-500'
                          : score > 50
                          ? 'text-accent-500'
                          : 'text-red-500'
                      }`}
                    >
                      {score}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-400">Open Issues</div>
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {openFindings}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-500 group-hover:text-white flex items-center justify-center transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
