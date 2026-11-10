'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';

export function ShortcutsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'J', action: 'Next finding card' },
    { key: 'K', action: 'Previous finding card' },
    { key: 'A', action: 'Accept current suggestion' },
    { key: 'R', action: 'Reject current suggestion' },
    { key: 'E', action: 'Edit current suggestion' },
    { key: 'O', action: 'Override finding (Reviewer/Admin only)' },
    { key: '⌘ + K / Ctrl + K', action: 'Open Command Palette' },
    { key: '?', action: 'Toggle this keyboard shortcut guide' },
    { key: 'Esc', action: 'Close dialog or modal' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-500 flex items-center justify-center">
            <Keyboard className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Keyboard Shortcuts
          </h2>
        </div>

        <div className="space-y-2 mb-4">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-sm"
            >
              <span className="text-slate-600 dark:text-slate-400">{s.action}</span>
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
