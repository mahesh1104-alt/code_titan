'use client';

import {
  UserProfile,
  ContentItem,
  Finding,
  Comment,
  BrandFact,
  TerminologyRule,
  AuditLogEntry,
  NotificationItem,
  AmbiguityInsight,
  PlanType,
  ContentStatus,
  UserRole,
} from './types';
import {
  DEMO_ACCOUNTS,
  SEEDED_CONTENT_ITEMS,
  TECHNOVA_FACTS,
  TECHNOVA_TERMINOLOGY,
  SEEDED_AMBIGUITY_INSIGHTS,
  SEEDED_AUDIT_LOGS,
  SEEDED_NOTIFICATIONS,
} from './seed-data';
import { calculateComplianceScore } from './ai/scoring';
import { hasPermission } from './rbac';

const STORAGE_KEY_PREFIX = 'inkloom_brandguard_';

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function getCurrentUser(): UserProfile {
  return getStorageItem<UserProfile>('current_user', DEMO_ACCOUNTS[1]); // Default to Elena (Pro Creator)
}

export function setCurrentUser(user: UserProfile): void {
  setStorageItem('current_user', user);
}

export function getContentItems(): ContentItem[] {
  return getStorageItem<ContentItem[]>('content_items', SEEDED_CONTENT_ITEMS);
}

export function getContentItemById(id: string): ContentItem | undefined {
  const items = getContentItems();
  return items.find((i) => i.id === id);
}

export function saveContentItem(item: ContentItem): void {
  const items = getContentItems();
  const index = items.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    items[index] = { ...item, updatedAt: new Date().toISOString() };
  } else {
    items.unshift({ ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  setStorageItem('content_items', items);
}

export function updateFindingDecision(params: {
  contentItemId: string;
  versionId: string;
  findingId: string;
  action: 'accept' | 'reject' | 'edit' | 'override';
  overrideReason?: string;
  editedText?: string;
  actor: UserProfile;
}): { success: boolean; item?: ContentItem; error?: string } {
  const { contentItemId, versionId, findingId, action, overrideReason, editedText, actor } = params;
  const items = getContentItems();
  const item = items.find((i) => i.id === contentItemId);
  if (!item) return { success: false, error: 'Content item not found' };

  const version = item.versions.find((v) => v.id === versionId);
  if (!version) return { success: false, error: 'Version not found' };

  const finding = version.findings.find((f) => f.id === findingId);
  if (!finding) return { success: false, error: 'Finding not found' };

  // Role validation
  if (action === 'override') {
    if (!hasPermission(actor.role, 'overrideFinding')) {
      return { success: false, error: 'Only Reviewers and Admins can override findings' };
    }
    if (!overrideReason || overrideReason.trim().length < 5) {
      return { success: false, error: 'A clear written override reason is mandatory' };
    }
  }

  // Apply action
  if (action === 'accept') {
    finding.status = 'accepted';
    // Replace original text in the document
    if (finding.suggestion && finding.suggestion.text) {
      const originalText = version.extractedText;
      const target = finding.original;
      if (originalText.includes(target)) {
        version.extractedText = originalText.replace(target, finding.suggestion.text);
      }
    }
  } else if (action === 'reject') {
    finding.status = 'rejected';
  } else if (action === 'override') {
    finding.status = 'overridden';
    finding.overrideReason = overrideReason;
    finding.decidedBy = actor.fullName;
    finding.decidedAt = new Date().toISOString();
  } else if (action === 'edit' && editedText) {
    finding.status = 'edited';
    finding.suggestion.text = editedText;
    const originalText = version.extractedText;
    const target = finding.original;
    if (originalText.includes(target)) {
      version.extractedText = originalText.replace(target, editedText);
    }
  }

  // Recalculate score
  const scoreResult = calculateComplianceScore(version.findings);
  version.score = scoreResult.score;

  // Audit log
  logAuditEvent({
    orgId: actor.orgId,
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    action: `FINDING_${action.toUpperCase()}`,
    entity: 'Finding',
    entityId: finding.id,
    metadata: { findingIssue: finding.issue, overrideReason },
  });

  saveContentItem(item);
  return { success: true, item };
}

export function transitionContentStatus(params: {
  contentItemId: string;
  nextStatus: ContentStatus;
  actor: UserProfile;
  comment?: string;
}): { success: boolean; item?: ContentItem; error?: string } {
  const { contentItemId, nextStatus, actor, comment } = params;
  const items = getContentItems();
  const item = items.find((i) => i.id === contentItemId);
  if (!item) return { success: false, error: 'Content item not found' };

  const currentVersion = item.versions.find((v) => v.id === item.currentVersionId);
  const criticalFindings = currentVersion?.findings.filter(
    (f) => f.severity === 'critical' && f.status === 'open'
  ) || [];

  // Approval gate check: cannot approve if critical issues are open
  if (nextStatus === 'approved' && criticalFindings.length > 0) {
    return {
      success: false,
      error: 'Approval blocked: Unresolved critical compliance issues remain.',
    };
  }

  // Role permissions check
  if (['approved', 'rejected', 'changes_required'].includes(nextStatus)) {
    if (!hasPermission(actor.role, 'approveOrReject')) {
      return { success: false, error: 'You do not have permission to change approval status.' };
    }
  }

  item.status = nextStatus;
  item.updatedAt = new Date().toISOString();

  if (comment) {
    addComment({
      contentItemId,
      authorId: actor.id,
      authorName: actor.fullName,
      authorRole: actor.role,
      body: comment,
    });
  }

  logAuditEvent({
    orgId: actor.orgId,
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    action: `STATUS_CHANGED_TO_${nextStatus.toUpperCase()}`,
    entity: 'ContentItem',
    entityId: item.id,
    metadata: { previousStatus: item.status, newStatus: nextStatus, comment },
  });

  saveContentItem(item);
  return { success: true, item };
}

export function getComments(contentItemId: string): Comment[] {
  const all = getStorageItem<Comment[]>('comments', [
    {
      id: 'cmt_1',
      contentItemId: 'cnt_technova_sample_ad',
      authorId: 'usr_pro_reviewer',
      authorName: 'Rachel Zane',
      authorRole: 'reviewer',
      body: 'Please address the 100% security claim immediately before resubmission.',
      createdAt: '2026-11-09T11:00:00Z',
    },
    {
      id: 'cmt_2',
      contentItemId: 'cnt_technova_sample_ad',
      authorId: 'usr_pro_creator',
      authorName: 'Elena Rostova',
      authorRole: 'creator',
      body: 'Understood, accepting the intent-preserving suggestion for enterprise-grade protection.',
      createdAt: '2026-11-09T11:20:00Z',
    },
  ]);
  return all.filter((c) => c.contentItemId === contentItemId);
}

export function addComment(comment: Omit<Comment, 'id' | 'createdAt'>): Comment {
  const all = getStorageItem<Comment[]>('comments', []);
  const newComment: Comment = {
    ...comment,
    id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  all.push(newComment);
  setStorageItem('comments', all);
  return newComment;
}

export function getBrandFacts(): BrandFact[] {
  return getStorageItem<BrandFact[]>('brand_facts', TECHNOVA_FACTS);
}

export function saveBrandFact(fact: BrandFact): void {
  const facts = getBrandFacts();
  const idx = facts.findIndex((f) => f.id === fact.id);
  if (idx >= 0) facts[idx] = fact;
  else facts.push(fact);
  setStorageItem('brand_facts', facts);
}

export function deleteBrandFact(id: string): void {
  const facts = getBrandFacts().filter((f) => f.id !== id);
  setStorageItem('brand_facts', facts);
}

export function getTerminologyRules(): TerminologyRule[] {
  return getStorageItem<TerminologyRule[]>('terminology_rules', TECHNOVA_TERMINOLOGY);
}

export function saveTerminologyRule(rule: TerminologyRule): void {
  const rules = getTerminologyRules();
  const idx = rules.findIndex((r) => r.id === rule.id);
  if (idx >= 0) rules[idx] = rule;
  else rules.push(rule);
  setStorageItem('terminology_rules', rules);
}

export function getAmbiguityInsights(): AmbiguityInsight[] {
  return getStorageItem<AmbiguityInsight[]>('ambiguity_insights', SEEDED_AMBIGUITY_INSIGHTS);
}

export function getAuditLogs(): AuditLogEntry[] {
  return getStorageItem<AuditLogEntry[]>('audit_logs', SEEDED_AUDIT_LOGS);
}

export function logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>): void {
  const logs = getAuditLogs();
  logs.unshift({
    ...entry,
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  });
  setStorageItem('audit_logs', logs.slice(0, 200)); // retain last 200
}

export function getNotifications(userId: string): NotificationItem[] {
  const notifs = getStorageItem<NotificationItem[]>('notifications', SEEDED_NOTIFICATIONS);
  return notifs.filter((n) => n.userId === userId || !n.userId);
}

export function markNotificationRead(id: string): void {
  const notifs = getStorageItem<NotificationItem[]>('notifications', SEEDED_NOTIFICATIONS);
  const found = notifs.find((n) => n.id === id);
  if (found) {
    found.read = true;
    setStorageItem('notifications', notifs);
  }
}

export function updateUserPlan(newPlan: PlanType): void {
  const user = getCurrentUser();
  user.plan = newPlan;
  setCurrentUser(user);
}

export function resetDemoState(): void {
  if (typeof window === 'undefined') return;
  const keys = [
    'current_user',
    'content_items',
    'brand_facts',
    'terminology_rules',
    'comments',
    'audit_logs',
    'notifications',
  ];
  for (const k of keys) {
    localStorage.removeItem(STORAGE_KEY_PREFIX + k);
  }
}
