/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// legalGrammar.ts
// Canonical, locked legal output grammar.
// All legal-related text in the system MUST be composed from these phrases.
// No freeform legal language is allowed beyond this file.

export type LegalPhraseId =
  // General nature
  | 'HEURISTIC_INDICATOR'
  | 'NOT_LEGAL_ADVICE'
  | 'NON_FORENSIC'
  | 'CANNOT_DETERMINE'
  | 'INSUFFICIENT_EVIDENCE'
  | 'REQUIRES_HUMAN_REVIEW'

  // License / provenance
  | 'LICENSE_TEXT_DETECTED'
  | 'LICENSE_TEXT_NOT_DETECTED'
  | 'PROVENANCE_SIGNALS_PRESENT'
  | 'PROVENANCE_SIGNALS_ABSENT'

  // Risk bands
  | 'RISK_LOW'
  | 'RISK_MEDIUM'
  | 'RISK_HIGH'
  | 'RISK_INSUFFICIENT'

  // Novelty / trade secret
  | 'NOVELTY_INDICATORS_PRESENT'
  | 'NOVELTY_INDICATORS_ABSENT'
  | 'TRADE_SECRET_EXPOSURE_POSSIBLE'
  | 'TRADE_SECRET_EXPOSURE_UNCLEAR'

  // Outreach / recommendation
  | 'LEGAL_REVIEW_RECOMMENDED'
  | 'LEGAL_REVIEW_REQUIRED_BEFORE_LICENSE'
  | 'LEGAL_REVIEW_REQUIRED_BEFORE_OUTREACH';

// Canonical phrase text (approved by human legal review).
export const LEGAL_PHRASES: Record<LegalPhraseId, string> = {
  HEURISTIC_INDICATOR:
    'Heuristic indicator only — not a legal conclusion.',
  NOT_LEGAL_ADVICE:
    'This output is not legal advice.',
  NON_FORENSIC:
    'Non-forensic pattern detection — cannot determine legal status.',
  CANNOT_DETERMINE:
    'This system cannot determine legal status for this question.',
  INSUFFICIENT_EVIDENCE:
    'Insufficient evidence to form a legal-related heuristic.',
  REQUIRES_HUMAN_REVIEW:
    'Human legal review is required before relying on this output.',

  LICENSE_TEXT_DETECTED:
    'License-related text was detected in one or more files.',
  LICENSE_TEXT_NOT_DETECTED:
    'No license-related text was detected in the analyzed files.',
  PROVENANCE_SIGNALS_PRESENT:
    'Provenance-related signals were detected (e.g., author names, external references).',
  PROVENANCE_SIGNALS_ABSENT:
    'No explicit provenance-related signals were detected.',

  RISK_LOW:
    'Risk band: LOW (based on detected patterns).',
  RISK_MEDIUM:
    'Risk band: MEDIUM (based on detected patterns).',
  RISK_HIGH:
    'Risk band: HIGH (based on detected patterns).',
  RISK_INSUFFICIENT:
    'Risk band: INSUFFICIENT_EVIDENCE (not enough data to assess).',

  NOVELTY_INDICATORS_PRESENT:
    'Novelty-related indicators were detected in the architecture or implementation.',
  NOVELTY_INDICATORS_ABSENT:
    'No clear novelty-related indicators were detected.',
  TRADE_SECRET_EXPOSURE_POSSIBLE:
    'Patterns suggest possible trade secret exposure risk.',
  TRADE_SECRET_EXPOSURE_UNCLEAR:
    'Trade secret exposure risk is unclear based on available evidence.',

  LEGAL_REVIEW_RECOMMENDED:
    'Legal review is recommended before acting on this information.',
  LEGAL_REVIEW_REQUIRED_BEFORE_LICENSE:
    'Legal review is required before entering into any licensing agreement.',
  LEGAL_REVIEW_REQUIRED_BEFORE_OUTREACH:
    'Legal review is required before initiating outreach based on this information.',
};

// Forbidden phrases (for static linting / tests only).
// The engine MUST NEVER output any of these.
export const FORBIDDEN_LEGAL_PHRASES: string[] = [
  'patentable',
  'novel invention',
  'cleanroom verified',
  'legally defensible',
  'no GPL dependencies',
  'trade secret confirmed',
  'license compliant',
  'ownership established',
  'provenance verified',
];

// Helper: assemble safe legal text from approved phrases only.
export function composeLegalText(ids: LegalPhraseId[]): string {
  return ids.map(id => LEGAL_PHRASES[id]).join(' ');
}

export class LegalGrammarValidator {
  /**
   * Scans target text for any forbidden legal claims or conclusions.
   */
  public static checkViolations(text: string): string[] {
    const lower = text.toLowerCase();
    const violations: string[] = [];

    for (const forbidden of FORBIDDEN_LEGAL_PHRASES) {
      if (lower.includes(forbidden.toLowerCase())) {
        violations.push(forbidden);
      }
    }

    return violations;
  }

  /**
   * Sanitizes input text by replacing forbidden legal conclusions with approved safe phrases.
   */
  public static sanitize(text: string): string {
    let sanitized = text;
    sanitized = sanitized.replace(/patentable/gi, "patterns warranting legal review");
    sanitized = sanitized.replace(/novel invention/gi, "architectural pattern detected");
    sanitized = sanitized.replace(/cleanroom verified/gi, "non-forensic scan (unverified)");
    sanitized = sanitized.replace(/legally defensible/gi, "heuristic risk indicator");
    sanitized = sanitized.replace(/no gpl dependencies/gi, "no GPL text detected in parsed files");
    sanitized = sanitized.replace(/trade secret confirmed/gi, "trade secret exposure risk evaluated");
    sanitized = sanitized.replace(/guaranteed non-infringing/gi, "non-forensic heuristic indicator");
    sanitized = sanitized.replace(/license compliant/gi, "license presence scanned");
    sanitized = sanitized.replace(/ownership established/gi, "ownership unverified");
    sanitized = sanitized.replace(/provenance verified/gi, "non-forensic provenance signals");
    return sanitized;
  }

  public static assertCompliant(text: string, contextDescription = "Output text"): void {
    const violations = this.checkViolations(text);
    if (violations.length > 0) {
      throw new Error(
        `Legal Grammar Violation in ${contextDescription}: Contains forbidden terms [${violations.join(', ')}]. Must use approved legal grammar only.`
      );
    }
  }
}
