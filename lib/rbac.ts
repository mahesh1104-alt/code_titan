import { UserRole } from './types';

export interface RolePermissions {
  submitAndOwnFindings: boolean;
  decideOwnSuggestions: boolean;
  viewTeamContent: boolean;
  assignReviewers: boolean;
  approveOrReject: boolean;
  overrideFinding: boolean;
  editBrandKnowledge: boolean;
  viewAnalytics: boolean;
  manageMembers: boolean;
  manageBilling: boolean;
  viewAuditLog: boolean | 'read_only';
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  creator: {
    submitAndOwnFindings: true,
    decideOwnSuggestions: true,
    viewTeamContent: false, // Own only
    assignReviewers: false,
    approveOrReject: false,
    overrideFinding: false,
    editBrandKnowledge: false,
    viewAnalytics: false,
    manageMembers: false,
    manageBilling: false,
    viewAuditLog: false,
  },
  manager: {
    submitAndOwnFindings: true,
    decideOwnSuggestions: true,
    viewTeamContent: true,
    assignReviewers: true,
    approveOrReject: true,
    overrideFinding: false,
    editBrandKnowledge: true,
    viewAnalytics: true,
    manageMembers: false,
    manageBilling: false,
    viewAuditLog: 'read_only',
  },
  reviewer: {
    submitAndOwnFindings: true,
    decideOwnSuggestions: false,
    viewTeamContent: true, // Assigned / review queue
    assignReviewers: false,
    approveOrReject: true,
    overrideFinding: true, // Reason required
    editBrandKnowledge: false,
    viewAnalytics: false,
    manageMembers: false,
    manageBilling: false,
    viewAuditLog: false,
  },
  admin: {
    submitAndOwnFindings: true,
    decideOwnSuggestions: true,
    viewTeamContent: true,
    assignReviewers: true,
    approveOrReject: true,
    overrideFinding: true,
    editBrandKnowledge: true,
    viewAnalytics: true,
    manageMembers: true,
    manageBilling: true,
    viewAuditLog: true,
  },
};

export function hasPermission(
  role: UserRole,
  permission: keyof RolePermissions
): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  const val = perms[permission];
  return Boolean(val);
}
