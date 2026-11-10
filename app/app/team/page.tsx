'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Shield, UserPlus, Check, X } from 'lucide-react';
import { DEMO_ACCOUNTS } from '@/lib/seed-data';
import { getCurrentUser } from '@/lib/store';
import { UserProfile, UserRole } from '@/lib/types';
import { PLANS } from '@/lib/plans';
import { toast } from 'sonner';

export default function TeamManagementPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser());
  const [members, setMembers] = useState(DEMO_ACCOUNTS.filter(a => a.plan === currentUser.plan));
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('creator');

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setMembers(DEMO_ACCOUNTS.filter(a => a.plan === user.plan));
  }, []);

  const planConfig = PLANS[currentUser.plan] || PLANS.pro;
  const maxAllowed = planConfig.limits.maxMembers;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    if (members.length >= maxAllowed) {
      toast.error(`Team member limit reached (${maxAllowed} members on ${planConfig.name} plan). Upgrade to invite more.`);
      return;
    }

    const newMember: any = {
      id: `usr_${Date.now()}`,
      orgId: currentUser.orgId,
      orgName: currentUser.orgName,
      email: inviteEmail,
      fullName: inviteEmail.split('@')[0],
      role: inviteRole,
      plan: currentUser.plan,
    };

    setMembers([...members, newMember]);
    setInviteEmail('');
    toast.success(`Invitation sent to ${inviteEmail} with role ${inviteRole}!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12 max-w-5xl">
      <div>
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          <span>Organization & Access Control</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Team Members & Permissions
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">
          Manage creator access, brand manager controls, and reviewer sign-off privileges.
        </p>
      </div>

      {/* Plan quota meter */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs shadow-sm">
        <div>
          <span className="text-slate-400">Team seats: </span>
          <strong className="text-slate-900 dark:text-white font-bold">
            {members.length} / {maxAllowed > 1000 ? 'Unlimited' : maxAllowed}
          </strong>{' '}
          used on <span className="capitalize font-semibold">{currentUser.plan}</span> plan.
        </div>
        <div className="w-32 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand-500 h-full"
            style={{ width: `${Math.min(100, (members.length / maxAllowed) * 100)}%` }}
          />
        </div>
      </div>

      {/* Invite Member Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-brand-500" />
          <span>Invite New Collaborator</span>
        </h3>

        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="colleague@technova.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />

          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as UserRole)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs focus:outline-none"
          >
            <option value="creator">Creator (Submit & Fix)</option>
            <option value="manager">Brand Manager (Kanban & Rules)</option>
            <option value="reviewer">Authorised Reviewer (Sign-Off & Override)</option>
            <option value="admin">Org Admin (Full Control)</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-sm transition shrink-0"
          >
            Send Invitation
          </button>
        </form>
      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-5 py-3">Member</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Permissions Scope</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="px-5 py-3.5">
                  <div className="font-bold text-slate-900 dark:text-white">{member.fullName}</div>
                  <div className="text-[11px] text-slate-400">{member.email}</div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {member.role}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500">
                  {member.role === 'admin'
                    ? 'Full platform authority, billing, team & audit'
                    : member.role === 'reviewer'
                    ? 'Review queue sign-off & written reason override'
                    : member.role === 'manager'
                    ? 'Brand rules editing, Kanban approvals & analytics'
                    : 'Submit content drafts & accept AI intent suggestions'}
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
