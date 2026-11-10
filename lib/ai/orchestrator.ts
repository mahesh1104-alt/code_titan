import { Finding, ContentItem, ContentVersion } from '../types';
import {
  TECHNOVA_TERMINOLOGY,
  TECHNOVA_FACTS,
  TECHNOVA_TONE_PROFILE,
  TECHNOVA_VISUAL_IDENTITY,
} from '../seed-data';
import { checkTerminology, checkPromotionalClaims, getContrastRatio } from './rules';
import { calculateComplianceScore } from './scoring';

export interface AnalysisInput {
  text: string;
  intendedMessage?: string;
  channel?: string;
  brandProfileId?: string;
  versionId: string;
  fileName?: string;
  fileType?: 'txt' | 'docx' | 'pdf' | 'png' | 'jpg';
}

export interface AnalysisResult {
  findings: Finding[];
  score: number;
  scoreSummary: ReturnType<typeof calculateComplianceScore>;
  pipelineSteps: {
    name: string;
    status: 'completed' | 'skipped' | 'flagged';
    issuesFound: number;
  }[];
}

export async function runAnalysisPipeline(input: AnalysisInput): Promise<AnalysisResult> {
  const { text, versionId } = input;
  const findings: Finding[] = [];

  // Step 1: Deterministic Terminology Check
  const termFindings = checkTerminology(text, TECHNOVA_TERMINOLOGY, versionId);
  findings.push(...termFindings);

  // Step 2: Deterministic Promotional Claims & Guarantees
  const claimFindings = checkPromotionalClaims(text, versionId);
  findings.push(...claimFindings);

  // Step 3: Fact Verification Engine
  // Checks against structured facts
  const lowerText = text.toLowerCase();

  // Fact check 1: 24/7 availability
  if (
    lowerText.includes('24/7') &&
    (lowerText.includes('everyone') ||
      lowerText.includes('all') ||
      lowerText.includes('every consumer') ||
      lowerText.includes('all consumers'))
  ) {
    const matchIndex = text.search(/24\/7\s+(to\s+everyone|for\s+everyone|to\s+all)/i);
    const start = matchIndex >= 0 ? matchIndex : text.indexOf('24/7');
    const matchSlice = text.substring(start, start + 16);

    // Ensure we don't duplicate
    if (!findings.some((f) => f.type === 'fact' && f.location.start === start)) {
      findings.push({
        id: `fnd_fact_${Date.now()}_1`,
        contentVersionId: versionId,
        type: 'fact',
        severity: 'high',
        location: { start, end: start + matchSlice.length },
        original: matchSlice,
        issue: 'Factual inconsistency: 24/7 support tier restriction',
        reason:
          'TechNova published SLA explicitly limits 24/7 dedicated support to Enterprise subscription agreements.',
        guidelineRef: {
          id: 'doc_3',
          title: 'Customer SLA and Support Tiers',
          section: 'Section 3.1 - Tier Availability Matrix',
        },
        evidence: {
          sourceId: 'fact_3',
          sourceTitle: 'Corporate SLA Policy Handbook',
          quote:
            '24/7 dedicated support is exclusively provided to Enterprise plan customers; standard tiers receive email support.',
        },
        verdict: 'contradicted',
        suggestion: {
          text: '24/7 support for enterprise customers',
          rationale: 'Direct alignment with corporate customer support policy.',
        },
        confidence: 0.96,
        status: 'open',
      });
    }
  }

  // Fact check 2: Founded year or country claims
  if (lowerText.includes('countries') || lowerText.includes('country')) {
    const countryMatch = text.match(/(\d+)\s+countries/i);
    if (countryMatch && countryMatch[1] !== '12') {
      const start = countryMatch.index || 0;
      findings.push({
        id: `fnd_fact_country_${Date.now()}`,
        contentVersionId: versionId,
        type: 'fact',
        severity: 'high',
        location: { start, end: start + countryMatch[0].length },
        original: countryMatch[0],
        issue: `Inaccurate market presence count: "${countryMatch[0]}"`,
        reason: 'TechNova officially operates in exactly 12 countries.',
        guidelineRef: {
          id: 'doc_1',
          title: 'Corporate Fact Sheet',
          section: 'Global Markets',
        },
        evidence: {
          sourceId: 'fact_2',
          sourceTitle: 'Q3 2026 Investor Presentation',
          quote: 'TechNova operates in 12 countries across North America and Europe.',
        },
        verdict: 'contradicted',
        suggestion: {
          text: '12 countries',
          rationale: 'Corrects market presence number to verified fact.',
        },
        confidence: 0.99,
        status: 'open',
      });
    }
  }

  // Step 4: Tone Engine
  // Flag informal slang or hyperbole
  const toneDisallowed = [
    { term: 'crush the competition', replacement: 'outperform industry standards' },
    { term: 'killer app', replacement: 'high-impact solution' },
    { term: 'magic', replacement: 'intelligent automation' },
    { term: 'revolutionary miracle', replacement: 'breakthrough technology' },
  ];

  for (const t of toneDisallowed) {
    const idx = lowerText.indexOf(t.term.toLowerCase());
    if (idx !== -1) {
      findings.push({
        id: `fnd_tone_${Date.now()}_${idx}`,
        contentVersionId: versionId,
        type: 'tone',
        severity: 'medium',
        location: { start: idx, end: idx + t.term.length },
        original: text.substring(idx, idx + t.term.length),
        issue: `Off-brand informal hyperbole "${t.term}"`,
        reason:
          'TechNova brand voice is professional, trustworthy, and precise. Avoid casual colloquialisms.',
        guidelineRef: {
          id: 'doc_1',
          title: 'TechNova Global Brand Guidelines',
          section: 'Voice & Tone - Prohibited Slang',
        },
        evidence: null,
        verdict: 'n/a',
        suggestion: {
          text: t.replacement,
          rationale: 'Elevates sentence to professional enterprise tone.',
        },
        confidence: 0.91,
        status: 'open',
      });
    }
  }

  // Step 5: Visual & Accessibility Checks for image/PDF uploads or color checks
  if (input.fileType === 'png' || input.fileType === 'jpg') {
    // Seeded simulated visual findings for image uploads
    findings.push({
      id: `fnd_vis_1_${Date.now()}`,
      contentVersionId: versionId,
      type: 'visual',
      severity: 'high',
      location: { start: 0, end: 10, bbox: { x: 45, y: 30, width: 220, height: 60 } },
      original: 'Logo Clear-Space and Aspect Ratio',
      issue: 'Logo distortion and inadequate padding',
      reason:
        'Detected logo margin is 12px, below required 24px clear margin. Aspect ratio deviated by 8%.',
      guidelineRef: {
        id: 'doc_1',
        title: 'TechNova Global Brand Guidelines',
        section: 'Visual Identity - Logo Clear Margin',
      },
      evidence: null,
      verdict: 'n/a',
      suggestion: {
        text: 'Restore 1:1 proportion with minimum 24px padding',
        rationale: 'Preserves brand mark integrity.',
      },
      confidence: 0.95,
      status: 'open',
    });

    findings.push({
      id: `fnd_vis_2_${Date.now()}`,
      contentVersionId: versionId,
      type: 'accessibility',
      severity: 'medium',
      location: { start: 10, end: 20, bbox: { x: 100, y: 280, width: 350, height: 45 } },
      original: 'Banner Headline Text Contrast (#A0AEC0 on #FFFFFF)',
      issue: 'Sub-threshold contrast ratio (2.8:1)',
      reason:
        'WCAG 2.2 AA requires minimum 4.5:1 contrast for standard text. Detected contrast is 2.8:1.',
      guidelineRef: {
        id: 'doc_1',
        title: 'Brand Accessibility Standards',
        section: 'Section 6 - WCAG 2.2 AA Contrast Compliance',
      },
      evidence: null,
      verdict: 'n/a',
      suggestion: {
        text: 'Darken text color to TechNova Deep Navy (#164E8A) for 8.6:1 contrast ratio',
        rationale: 'Passes WCAG 2.2 AA accessibility requirements.',
      },
      confidence: 0.99,
      status: 'open',
    });
  }

  // De-duplicate findings by start/end location
  const uniqueFindings: Finding[] = [];
  const seenRanges = new Set<string>();

  for (const f of findings) {
    const key = `${f.location.start}-${f.location.end}-${f.type}`;
    if (!seenRanges.has(key)) {
      seenRanges.add(key);
      uniqueFindings.push(f);
    }
  }

  // Calculate score and gate status
  const scoreSummary = calculateComplianceScore(uniqueFindings);

  const pipelineSteps = [
    { name: 'Extract content', status: 'completed' as const, issuesFound: 0 },
    { name: 'Retrieve brand rules & facts', status: 'completed' as const, issuesFound: 0 },
    {
      name: 'Terminology engine',
      status: (uniqueFindings.some((f) => f.type === 'terminology') ? 'flagged' : 'completed') as any,
      issuesFound: uniqueFindings.filter((f) => f.type === 'terminology').length,
    },
    {
      name: 'Promotional claims & superlatives',
      status: (uniqueFindings.some((f) => f.type === 'promo_claim') ? 'flagged' : 'completed') as any,
      issuesFound: uniqueFindings.filter((f) => f.type === 'promo_claim').length,
    },
    {
      name: 'Fact verification',
      status: (uniqueFindings.some((f) => f.type === 'fact') ? 'flagged' : 'completed') as any,
      issuesFound: uniqueFindings.filter((f) => f.type === 'fact').length,
    },
    {
      name: 'Tone & voice evaluation',
      status: (uniqueFindings.some((f) => f.type === 'tone') ? 'flagged' : 'completed') as any,
      issuesFound: uniqueFindings.filter((f) => f.type === 'tone').length,
    },
    {
      name: 'Visual & accessibility checks',
      status: (uniqueFindings.some((f) => f.type === 'visual' || f.type === 'accessibility')
        ? 'flagged'
        : 'completed') as any,
      issuesFound: uniqueFindings.filter((f) => f.type === 'visual' || f.type === 'accessibility').length,
    },
    { name: 'Generate intent-preserving suggestions', status: 'completed' as const, issuesFound: 0 },
  ];

  return {
    findings: uniqueFindings,
    score: scoreSummary.score,
    scoreSummary,
    pipelineSteps,
  };
}
