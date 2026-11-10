export type PlanType = 'starter' | 'pro' | 'enterprise';

export type UserRole = 'creator' | 'manager' | 'reviewer' | 'admin';

export type FindingType =
  | 'terminology'
  | 'tone'
  | 'fact'
  | 'promo_claim'
  | 'visual'
  | 'accessibility';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type FindingVerdict =
  | 'supported'
  | 'contradicted'
  | 'unsupported'
  | 'outdated'
  | 'needs_human_review'
  | 'n/a';

export type FindingStatus = 'open' | 'accepted' | 'edited' | 'rejected' | 'overridden';

export type ContentStatus =
  | 'draft'
  | 'ai_review'
  | 'changes_required'
  | 'resubmitted'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'archived';

export interface LocationRange {
  start: number;
  end: number;
  page?: number;
  bbox?: { x: number; y: number; width: number; height: number };
}

export interface GuidelineRef {
  id: string;
  title: string;
  section: string;
}

export interface Evidence {
  sourceId: string;
  sourceTitle?: string;
  quote: string;
  url?: string;
}

export interface Suggestion {
  text: string;
  rationale: string;
}

export interface Finding {
  id: string;
  contentVersionId: string;
  guidelineVersionId?: string;
  type: FindingType;
  severity: Severity;
  location: LocationRange;
  original: string;
  issue: string;
  reason: string;
  guidelineRef: GuidelineRef;
  evidence: Evidence | null;
  verdict: FindingVerdict;
  suggestion: Suggestion;
  confidence: number; // 0 to 1
  status: FindingStatus;
  decidedBy?: string;
  decidedAt?: string;
  overrideReason?: string;
}

export interface ContentVersion {
  id: string;
  contentItemId: string;
  versionNo: number;
  filePath?: string;
  fileName?: string;
  fileType?: 'txt' | 'docx' | 'pdf' | 'png' | 'jpg';
  extractedText: string;
  score: number;
  guidelineVersion: string;
  findings: Finding[];
  createdAt: string;
  changesSummary?: string;
}

export interface ContentItem {
  id: string;
  orgId: string;
  title: string;
  channel: 'ad' | 'email' | 'social' | 'blog' | 'deck' | 'other';
  creatorId: string;
  creatorName: string;
  brandProfileId: string;
  status: ContentStatus;
  intendedMessage: string;
  currentVersionId: string;
  versions: ContentVersion[];
  createdAt: string;
  updatedAt: string;
  assignedReviewerId?: string;
}

export interface Comment {
  id: string;
  contentItemId: string;
  findingId?: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  body: string;
  parentId?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  orgId: string;
  orgName: string;
  email: string;
  fullName: string;
  role: UserRole;
  plan: PlanType;
  avatarUrl?: string;
}

export interface BrandFact {
  id: string;
  brandProfileId: string;
  key: string;
  value: string;
  sourceDocument: string;
  validFrom: string;
  validUntil?: string;
  status: 'active' | 'outdated';
}

export interface TerminologyRule {
  id: string;
  brandProfileId: string;
  term: string;
  kind: 'approved' | 'prohibited';
  replacement?: string;
  severity: Severity;
  matchMode: 'exact' | 'regex' | 'fuzzy';
  explanation?: string;
}

export interface VisualIdentity {
  primaryColor: string;
  accentColor: string;
  approvedFonts: string[];
  logoProportionRule: string;
  minLogoSizePx: number;
  palette: Array<{ name: string; hex: string }>;
}

export interface ToneProfile {
  attributes: string[];
  doExamples: string[];
  dontExamples: string[];
}

export interface BrandGuidelineDoc {
  id: string;
  title: string;
  version: string;
  fileSize: string;
  updatedAt: string;
  status: 'active' | 'archived';
  chunkCount: number;
}

export interface AmbiguityInsight {
  id: string;
  term: string;
  flagCount: number;
  overrideCount: number;
  recommendation: string;
  ruleCategory: string;
}

export interface AuditLogEntry {
  id: string;
  orgId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, any>;
  modelUsed?: string;
  guidelineVersion?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}
