/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// charter.ts
// COMMERCIALIZATION ENGINE CHARTER
// Version 1.0 — Evidence‑Driven, Legally‑Bounded, Enterprise‑Ready
// Canonical governance document and programmatic constitutional constraints.

export const COMMERCIALIZATION_ENGINE_CHARTER_VERSION = "1.0";

export const COMMERCIALIZATION_ENGINE_CHARTER = {
  version: COMMERCIALIZATION_ENGINE_CHARTER_VERSION,
  title: "Commercialization Engine Charter",
  status: "LOCKED_AND_SIGN_OFF_READY",
  effectiveDate: "2026-08-21",
  
  purpose: {
    statement:
      "The Commercialization Engine exists to transform technical evidence into structured commercial intelligence by analyzing measurable artifacts (code, metrics, capabilities).",
    outputs: [
      "Screening valuation estimates",
      "Hypothetical buyer archetypes",
      "Draft outreach templates",
      "Heuristic legal risk indicators"
    ],
    boundaries:
      "The engine does not perform legal analysis, financial appraisal, marketing advice, or provenance verification. It provides structured, bounded, evidence-linked outputs that require human review before use."
  },

  corePrinciples: {
    evidenceFirst: {
      rule: "All outputs must be derived from observable, measurable evidence.",
      allowedSources: [
        "lines of code",
        "complexity metrics",
        "detected capabilities",
        "architectural patterns",
        "license text presence",
        "provenance signals"
      ],
      prohibition: "No output may rely on speculation, inference of ownership, or unverified claims."
    },
    boundedLanguage: {
      rule: "All legal-sensitive or commercial-sensitive language must be composed exclusively from the approved grammar in the Legal Grammar File.",
      prohibition: "No freeform legal or financial claims are permitted."
    },
    screeningOnlyValuation: {
      requiredLabel: "Screening Valuation Estimate (Evidence-Based, Non-Appraisal)",
      prohibitions: ["market value", "fair value", "investment value", "legal defensibility", "accounting compliance"]
    },
    hypotheticalBuyerArchetypes: {
      requiredLabel: "Hypothetical buyer archetype inferred from capabilities. Not a real company, not a discovered lead.",
      prohibitions: ["real buyer discovery", "real contact identification", "market targeting", "sales advice"]
    },
    draftOutreachTemplates: {
      requiredLabel: "Draft outreach template. Not marketing advice. Human verification required.",
      prohibitions: ["campaigns", "targeting strategies", "compliance-sensitive content", "real contact outreach"]
    },
    legalHeuristicBoundaries: {
      requiredLabel: "Heuristic indicators only — not legal advice.",
      prohibitions: [
        "determine ownership",
        "verify provenance",
        "assess patentability",
        "confirm trade secret status",
        "confirm license compliance",
        "perform cleanroom verification"
      ]
    }
  },

  mandatoryDisclaimers: {
    globalDisclaimer:
      "All outputs are heuristic indicators based on evidence. They are not legal advice, not financial appraisal, not marketing guidance, and not provenance verification. Human review required before any transaction or outreach.",
    enforcementScope: [
      "valuation",
      "buyer_archetypes",
      "outreach_templates",
      "legal_risk_indicators",
      "refusal_messages",
      "api_payloads",
      "ui_surfaces"
    ]
  },

  governanceAndChangeControl: {
    requiresHumanLegalReview: [
      "legal grammar",
      "legal schema",
      "refusal rules",
      "disclaimers",
      "valuation semantics",
      "buyer semantics",
      "outreach semantics"
    ],
    technicalOnlyChanges: [
      "evidence extraction",
      "capability detection",
      "UI layout",
      "performance improvements"
    ]
  }
} as const;

export class CharterComplianceVerifier {
  /**
   * Asserts that a text payload does not violate the Charter's core prohibitions.
   */
  public static verifyText(text: string): { compliant: boolean; violations: string[] } {
    const lower = text.toLowerCase();
    const violations: string[] = [];

    const bannedKeywords = [
      "patentable",
      "guaranteed non-infringing",
      "fair market value appraisal",
      "cleanroom verified",
      "trade secret confirmed",
      "discovered lead",
      "ready-to-send marketing campaign",
      "ownership established"
    ];

    for (const kw of bannedKeywords) {
      if (lower.includes(kw.toLowerCase())) {
        violations.push(`Charter violation: contains prohibited phrase "${kw}"`);
      }
    }

    return {
      compliant: violations.length === 0,
      violations
    };
  }
}
