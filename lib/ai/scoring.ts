import { Finding, Severity } from '../types';

export const SEVERITY_PENALTIES: Record<Severity, number> = {
  critical: 25,
  high: 15,
  medium: 7,
  low: 2,
};

export interface ComplianceScoreResult {
  score: number;
  openCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  penalties: Record<Severity, number>;
  totalPenalty: number;
  isApprovalBlocked: boolean;
  statusMessage: string;
}

export function calculateComplianceScore(findings: Finding[]): ComplianceScoreResult {
  const openFindings = findings.filter(
    (f) => f.status === 'open' || f.status === 'edited'
  );

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  for (const f of openFindings) {
    if (f.severity === 'critical') criticalCount++;
    else if (f.severity === 'high') highCount++;
    else if (f.severity === 'medium') mediumCount++;
    else if (f.severity === 'low') lowCount++;
  }

  const penalties: Record<Severity, number> = {
    critical: criticalCount * SEVERITY_PENALTIES.critical,
    high: highCount * SEVERITY_PENALTIES.high,
    medium: mediumCount * SEVERITY_PENALTIES.medium,
    low: lowCount * SEVERITY_PENALTIES.low,
  };

  const totalPenalty =
    penalties.critical + penalties.high + penalties.medium + penalties.low;
  const score = Math.max(0, 100 - totalPenalty);

  // Approval gate: Critical blocks approval until resolved or overridden
  const isApprovalBlocked = criticalCount > 0;

  let statusMessage = 'Ready for approval';
  if (criticalCount > 0) {
    statusMessage = `Blocked: ${criticalCount} critical ${
      criticalCount === 1 ? 'issue' : 'issues'
    } must be resolved or overridden`;
  } else if (highCount > 0) {
    statusMessage = `Requires review: ${highCount} high-risk ${
      highCount === 1 ? 'claim' : 'claims'
    }`;
  } else if (mediumCount > 0 || lowCount > 0) {
    statusMessage = 'Minor recommendations remaining';
  } else if (findings.length > 0) {
    statusMessage = 'All findings accepted or resolved. Excellent brand compliance!';
  }

  return {
    score,
    openCount: openFindings.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    penalties,
    totalPenalty,
    isApprovalBlocked,
    statusMessage,
  };
}
