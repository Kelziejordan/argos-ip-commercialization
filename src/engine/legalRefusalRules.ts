/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// legalRefusalRules.ts
// Canonical refusal rules for all legal-related questions.
// This file ensures the system NEVER performs legal analysis,
// NEVER implies legal certainty, and ALWAYS refuses unsafe requests
// using approved legal grammar phrases.

import { LegalPhraseId, LEGAL_PHRASES } from "./legalGrammar";

export type LegalRefusalReasonId =
  | "LEGAL_CONCLUSION_REQUESTED"
  | "PROVENANCE_VERIFICATION_REQUESTED"
  | "PATENT_NOVELTY_REQUESTED"
  | "CLEANROOM_VERIFICATION_REQUESTED"
  | "LICENSE_COMPLIANCE_REQUESTED"
  | "OWNERSHIP_DETERMINATION_REQUESTED"
  | "COPYRIGHT_STATUS_REQUESTED"
  | "TRADE_SECRET_STATUS_REQUESTED"
  | "LEGAL_RISK_SCORE_REQUESTED"
  | "MISSING_EVIDENCE";

export interface LegalRefusal {
  refused: true;
  reason: LegalRefusalReasonId;
  message: string;
  global_disclaimer: string;
  legal_review_required: true;
}

// Mapping of refusal reasons to safe, approved phrase ID arrays.
const REFUSAL_PHRASE_MAPPINGS: Record<LegalRefusalReasonId, LegalPhraseId[]> = {
  LEGAL_CONCLUSION_REQUESTED: [
    "CANNOT_DETERMINE",
    "NOT_LEGAL_ADVICE",
    "REQUIRES_HUMAN_REVIEW"
  ],

  PROVENANCE_VERIFICATION_REQUESTED: [
    "CANNOT_DETERMINE",
    "NON_FORENSIC",
    "REQUIRES_HUMAN_REVIEW"
  ],

  PATENT_NOVELTY_REQUESTED: [
    "CANNOT_DETERMINE",
    "NON_FORENSIC",
    "REQUIRES_HUMAN_REVIEW"
  ],

  CLEANROOM_VERIFICATION_REQUESTED: [
    "CANNOT_DETERMINE",
    "NON_FORENSIC",
    "REQUIRES_HUMAN_REVIEW"
  ],

  LICENSE_COMPLIANCE_REQUESTED: [
    "CANNOT_DETERMINE",
    "NON_FORENSIC",
    "REQUIRES_HUMAN_REVIEW"
  ],

  OWNERSHIP_DETERMINATION_REQUESTED: [
    "CANNOT_DETERMINE",
    "NOT_LEGAL_ADVICE",
    "REQUIRES_HUMAN_REVIEW"
  ],

  COPYRIGHT_STATUS_REQUESTED: [
    "CANNOT_DETERMINE",
    "NON_FORENSIC",
    "REQUIRES_HUMAN_REVIEW"
  ],

  TRADE_SECRET_STATUS_REQUESTED: [
    "CANNOT_DETERMINE",
    "NON_FORENSIC",
    "REQUIRES_HUMAN_REVIEW"
  ],

  LEGAL_RISK_SCORE_REQUESTED: [
    "CANNOT_DETERMINE",
    "NOT_LEGAL_ADVICE",
    "REQUIRES_HUMAN_REVIEW"
  ],

  MISSING_EVIDENCE: [
    "INSUFFICIENT_EVIDENCE",
    "REQUIRES_HUMAN_REVIEW"
  ]
};

// Global disclaimer injected into ALL refusal outputs.
const GLOBAL_DISCLAIMER =
  "All legal-related outputs are heuristic indicators based on code patterns. " +
  "They are not legal advice, not provenance verification, not patent novelty analysis, " +
  "and not license compliance confirmation. Human legal review required.";

export function refuseLegal(reason: LegalRefusalReasonId): LegalRefusal {
  const phraseIds = REFUSAL_PHRASE_MAPPINGS[reason] || [
    "CANNOT_DETERMINE",
    "NOT_LEGAL_ADVICE",
    "REQUIRES_HUMAN_REVIEW"
  ];

  const message = phraseIds.map(id => LEGAL_PHRASES[id]).join(" ");

  return {
    refused: true,
    reason,
    message,
    global_disclaimer: GLOBAL_DISCLAIMER,
    legal_review_required: true
  };
}

export class LegalRefusalClassifier {
  /**
   * Evaluates if a query is attempting to elicit a legal conclusion
   * and returns the canonical refusal if detected.
   */
  public static evaluateQuery(query: string): LegalRefusal | null {
    const lower = query.toLowerCase();

    if (lower.includes("patentable") || lower.includes("is this novel") || lower.includes("patent novelty")) {
      return refuseLegal("PATENT_NOVELTY_REQUESTED");
    }
    if (lower.includes("cleanroom") || lower.includes("clean room") || lower.includes("cleanroom verified")) {
      return refuseLegal("CLEANROOM_VERIFICATION_REQUESTED");
    }
    if (lower.includes("who owns") || lower.includes("ownership") || lower.includes("chain of title")) {
      return refuseLegal("OWNERSHIP_DETERMINATION_REQUESTED");
    }
    if (lower.includes("is this compliant") || lower.includes("license compliance") || lower.includes("violate gpl")) {
      return refuseLegal("LICENSE_COMPLIANCE_REQUESTED");
    }
    if (lower.includes("is this a trade secret") || lower.includes("trade secret confirmed")) {
      return refuseLegal("TRADE_SECRET_STATUS_REQUESTED");
    }
    if (lower.includes("legal defensibility score") || lower.includes("moat percentage")) {
      return refuseLegal("LEGAL_RISK_SCORE_REQUESTED");
    }
    if (lower.includes("legal opinion") || lower.includes("legal conclusion")) {
      return refuseLegal("LEGAL_CONCLUSION_REQUESTED");
    }

    return null;
  }
}
