import { Finding, Severity, TerminologyRule, VisualIdentity } from '../types';

// Levenshtein distance for fuzzy matching
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1).toLowerCase() === a.charAt(j - 1).toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// 1. Terminology Engine
export function checkTerminology(
  text: string,
  rules: TerminologyRule[],
  versionId: string
): Finding[] {
  const findings: Finding[] = [];

  for (const rule of rules) {
    if (rule.kind !== 'prohibited') continue;

    const term = rule.term;
    let matchFound = false;

    // Regex with word boundaries
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      matchFound = true;
      const start = match.index;
      const end = start + match[0].length;

      findings.push({
        id: `fnd_term_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        contentVersionId: versionId,
        type: 'terminology',
        severity: rule.severity,
        location: { start, end },
        original: match[0],
        issue: `Prohibited term "${match[0]}"`,
        reason:
          rule.explanation ||
          `Brand guidelines forbid using "${match[0]}". Approved replacement is "${rule.replacement || 'appropriate term'}".`,
        guidelineRef: {
          id: 'doc_1',
          title: 'Brand Guidelines - Terminology Rules',
          section: 'Section: Approved Terminology',
        },
        evidence: {
          sourceId: rule.id,
          sourceTitle: 'Approved Terminology Database',
          quote: `Prohibited: "${rule.term}". Preferred: "${rule.replacement}".`,
        },
        verdict: 'supported',
        suggestion: {
          text: rule.replacement || '',
          rationale: `Replaces prohibited term with approved brand terminology "${rule.replacement}".`,
        },
        confidence: 0.98,
        status: 'open',
      });
    }

    // Fuzzy check for near misses if not already matched
    if (!matchFound && rule.matchMode === 'fuzzy' && term.length >= 5) {
      const words = text.split(/\s+/);
      let currentOffset = 0;
      for (const word of words) {
        const cleanWord = word.replace(/[^a-zA-Z0-9-]/g, '');
        if (cleanWord.length >= 4) {
          const dist = levenshteinDistance(cleanWord, term);
          if (dist === 1) {
            const start = text.indexOf(word, currentOffset);
            findings.push({
              id: `fnd_term_fuzzy_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              contentVersionId: versionId,
              type: 'terminology',
              severity: 'low',
              location: { start, end: start + word.length },
              original: word,
              issue: `Possible misspelling of prohibited term "${term}"`,
              reason: `Detected "${word}" which closely resembles prohibited term "${term}".`,
              guidelineRef: {
                id: 'doc_1',
                title: 'Brand Guidelines - Terminology Rules',
                section: 'Fuzzy Match Detector',
              },
              evidence: null,
              verdict: 'supported',
              suggestion: {
                text: rule.replacement || '',
                rationale: `Use approved terminology "${rule.replacement}".`,
              },
              confidence: 0.85,
              status: 'open',
            });
          }
        }
        currentOffset += word.length + 1;
      }
    }
  }

  return findings;
}

// 2. Promotional Claims & Superlatives Engine
export interface ClaimPattern {
  name: string;
  regex: RegExp;
  severity: Severity;
  issue: string;
  reason: string;
  suggestReplacement: (matchText: string) => string;
}

export const CLAIM_PATTERNS: ClaimPattern[] = [
  {
    name: 'absolute_guarantee',
    regex: /\b(100%\s+guaranteed|guarantees?|guaranteed\s+protection|100%\s+protection|zero\s+risk|complete\s+data\s+security)\b/gi,
    severity: 'critical',
    issue: 'Absolute guarantee or unverified zero-risk security warranty',
    reason:
      'Advertising and compliance standards strictly forbid promising "100%", absolute guarantees, or zero risk, which creates strict legal liability.',
    suggestReplacement: () => 'designed to strengthen data protection',
  },
  {
    name: 'superlative_ranking',
    regex: /\b(world'?s\s+no\.?\s*1|number\s+one|world'?s\s+best|best-in-class|unmatched|unbeatable)\b/gi,
    severity: 'high',
    issue: 'Unsupported superlative ranking claim',
    reason:
      'Superlatives like "world\'s No. 1" or "best" require audited third-party benchmark citations before publication.',
    suggestReplacement: () => 'leading enterprise',
  },
  {
    name: 'unsupported_percentage',
    regex: /\b(\d+%\s+(better|increase|boost|more|productivity|reduction|faster))\b/gi,
    severity: 'high',
    issue: 'Unsupported quantitative performance claim',
    reason:
      'Specific statistical or percentage claims must link to an approved public whitepaper or documented customer study.',
    suggestReplacement: () => 'measurable productivity improvements',
  },
  {
    name: 'absolute_words',
    regex: /\b(always|never|flawless|foolproof|impossible\s+to\s+hack)\b/gi,
    severity: 'medium',
    issue: 'Absolute statement',
    reason: 'Absolutes are difficult to defend legally. Prefer nuanced, evidence-backed phrasing.',
    suggestReplacement: (match) => (match.toLowerCase() === 'always' ? 'consistently' : 'rarely'),
  },
];

export function checkPromotionalClaims(text: string, versionId: string): Finding[] {
  const findings: Finding[] = [];

  for (const pattern of CLAIM_PATTERNS) {
    let match: RegExpExecArray | null;
    while ((match = pattern.regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // Avoid duplicate location overlapping
      const alreadyCaptured = findings.some(
        (f) =>
          (start >= f.location.start && start < f.location.end) ||
          (end > f.location.start && end <= f.location.end)
      );
      if (alreadyCaptured) continue;

      const replacement = pattern.suggestReplacement(match[0]);

      findings.push({
        id: `fnd_claim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        contentVersionId: versionId,
        type: 'promo_claim',
        severity: pattern.severity,
        location: { start, end },
        original: match[0],
        issue: pattern.issue,
        reason: pattern.reason,
        guidelineRef: {
          id: 'doc_2',
          title: 'Legal Claims & Advertising Standards',
          section: 'Section 4 - Promotional Warranties & Substantiation',
        },
        evidence: null,
        verdict: 'unsupported',
        suggestion: {
          text: replacement,
          rationale:
            'Rewrites the claim to preserve promotional intent without creating strict compliance or legal exposure.',
        },
        confidence: 0.95,
        status: 'open',
      });
    }
  }

  return findings;
}

// 3. Contrast & Accessibility Formulas (WCAG 2.2 AA)
export function getRelativeLuminance(hexColor: string): number {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// 4. Color Distance (Euclidean RGB approximation)
export function getColorDistance(hex1: string, hex2: string): number {
  const h1 = hex1.replace('#', '');
  const h2 = hex2.replace('#', '');
  const r1 = parseInt(h1.substring(0, 2), 16);
  const g1 = parseInt(h1.substring(2, 4), 16);
  const b1 = parseInt(h1.substring(4, 6), 16);

  const r2 = parseInt(h2.substring(0, 2), 16);
  const g2 = parseInt(h2.substring(2, 4), 16);
  const b2 = parseInt(h2.substring(4, 6), 16);

  return Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );
}
