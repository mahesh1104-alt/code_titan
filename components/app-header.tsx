'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Sun,
  Moon,
  Search,
  Keyboard,
  ShieldCheck,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { DEMO_ACCOUNTS } from '@/lib/seed-data';
import { getCurrentUser, setCurrentUser, getNotifications, markNotificationRead } from '@/lib/store';
import { UserProfile } from '@/lib/types';
import { CommandPalette } from './command-palette';
import { ShortcutsDialog } from './shortcuts-dialog';

export function AppHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [currentUser, setUser] = useState<UserProfile>(DEMO_ACCOUNTS[1]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [notifications, setNotifications] = useState(getNotifications(currentUser.id));

  useEffect(() => {
    setUser(getCurrentUser());
    setNotifications(getNotifications(getCurrentUser().id));

    const handleOpenCmd = () => setShowCommandPalette(true);
    window.addEventListener('open-command-palette', handleOpenCmd);
    return () => window.removeEventListener('open-command-palette', handleOpenCmd);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const planBadges: Record<string, { bg: string; text: string; label: string }> = {
    starter: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300', label: 'Starter' },
    pro: { bg: 'bg-brand-50 dark:bg-brand-900/40', text: 'text-brand-600 dark:text-brand-300', label: 'Professional' },
    enterprise: { bg: 'bg-accent-100 dark:bg-accent-900/40', text: 'text-accent-700 dark:text-accent-300', label: 'Enterprise' },
  };

  const roleLabels: Record<string, string> = {
    creator: 'Creator',
    manager: 'Brand Manager',
    reviewer: 'Authorised Reviewer',
    admin: 'Org Admin',
  };

  const currentBadge = planBadges[currentUser.plan] || planBadges.starter;

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-brand-500/20">
              BG
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight hidden sm:inline">
              BrandGuard
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          {/* Plan badge */}
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${currentBadge.bg} ${currentBadge.text} border border-current/10`}
          >
            {currentBadge.label}
          </span>

          {/* Role badge */}
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium hidden md:inline">
            {roleLabels[currentUser.role] || currentUser.role}
          </span>
        </div>

        {/* Right action bar */}
        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setShowCommandPalette(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
            title="Open Command Palette (Cmd + K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search / Jump</span>
            <kbd className="px-1.5 py-0.2 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 text-[10px]">
              ⌘K
            </kbd>
          </button>

          {/* Keyboard shortcut help button */}
          <button
            onClick={() => setShowShortcuts(true)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle theme"
          >
            <Sun className="w-4 h-4 hidden dark:block" />
            <Moon className="w-4 h-4 block dark:hidden" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {showNotifDropdown && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Notifications
                  </span>
                  <span className="text-xs text-brand-500 font-medium">{unreadCount} unread</span>
                </div>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        setShowNotifDropdown(false);
                        router.push(n.link);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer text-xs transition ${
                        n.read
                          ? 'opacity-60 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          : 'bg-brand-50/50 dark:bg-brand-900/20 hover:bg-brand-50 dark:hover:bg-brand-900/40'
                      }`}
                    >
                      <div className="font-semibold text-slate-800 dark:text-slate-100 mb-0.5">
                        {n.title}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 line-clamp-2">
                        {n.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Demo User Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-500 to-accent-400 text-white font-bold text-xs flex items-center justify-center">
                {currentUser.fullName.charAt(0)}
              </div>
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200 hidden sm:inline">
                {currentUser.fullName.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {currentUser.fullName}
                  </div>
                  <div className="text-xs text-slate-400">{currentUser.email}</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300">
                      {currentUser.plan}
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Switch Demo Persona (1-Click)
                </div>
                <div className="space-y-1">
                  {DEMO_ACCOUNTS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setUser(user);
                        setShowUserDropdown(false);
                        router.push(user.initialRoute);
                        window.location.reload();
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                        currentUser.id === user.id
                          ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div>{user.fullName}</div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {user.role} • {user.plan}
                        </div>
                      </div>
                      {currentUser.id === user.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} />
      <ShortcutsDialog isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  );
}
