/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// developerComplianceGuide.ts
// Developer Compliance Guide (v1.0)
// Canonical contributor guidelines for the Commercialization Engine.

export const DEVELOPER_COMPLIANCE_GUIDE_VERSION = "1.0";

export const DEVELOPER_COMPLIANCE_GUIDE = {
  version: DEVELOPER_COMPLIANCE_GUIDE_VERSION,
  title: "Developer Compliance Guide (v1.0)",
  targetAudience: "Contributors to the Commercialization Engine",
  governingDocuments: [
    "Legal Grammar File (legalGrammar.ts)",
    "Legal JSON Schema (legalSchema.ts)",
    "Legal Refusal Rules (legalRefusalRules.ts)",
    "Valuation Module (valuationModule.ts)",
    "Buyer Archetype Module (buyerArchetypeModule.ts)",
    "Outreach Module (outreachModule.ts)",
    "Commercialization Engine Charter (charter.ts)"
  ],

  corePrinciples: {
    evidenceDrivenOnly: {
      rule: "Developers may only use observable, measurable evidence (LOC, complexity, AST invariants, detected capabilities, license text presence, provenance signals).",
      forbidden: ["Speculation", "Inference of ownership", "Unsubstantiated marketing or legal claims"]
    },
    boundedLanguage: {
      rule: "All legal-sensitive or commercial-sensitive text must be composed strictly from the Legal Grammar File.",
      forbidden: ["Freeform legal language in UI, API responses, logs, templates, or documentation"]
    },
    immutableSchemas: {
      rule: "Schemas are locked once signed off.",
      lockedSchemas: [
        "Legal JSON Schema",
        "Valuation JSON Schema",
        "Buyer Archetype JSON Schema",
        "Outreach JSON Schema"
      ]
    },
    mandatoryDisclaimers: {
      rule: "Every subsystem must include its required disclaimers without shortening, paraphrasing, or removing.",
      requiredDisclaimers: ["Subsystem-specific disclaimer", "Universal global disclaimer"]
    },
    mandatoryRefusalRules: {
      rule: "If a user query requires legal, financial, or marketing judgment, developers must route through Legal Refusal Rules."
    }
  },

  permittedExpansions: [
    "New static evidence extractors",
    "New capability detectors",
    "New AST pattern heuristics",
    "New UI dashboard components and charts",
    "New asset intake formats (e.g. zip, git, tar)",
    "New visualization tools",
    "New valuation calculation models (strictly evidence-based)",
    "New hypothetical buyer archetypes (strictly evidence-linked)",
    "New draft outreach templates (strictly persona-level and neutral)"
  ],

  strictProhibitions: [
    "Real buyer discovery or scraping",
    "Real contact identification",
    "Legal conclusions or advice",
    "Provenance certification or cleanroom verification",
    "Patent novelty assessments",
    "Trade secret determinations",
    "License compliance certifications",
    "Formal financial appraisal or accounting valuations",
    "Marketing campaign or automated targeting logic",
    "Binding contract execution without attorney review"
  ],

  prReviewChecklist: {
    legal: [
      "No forbidden legal phrases or freeform claims",
      "All legal text uses canonical grammar IDs",
      "Legal JSON schema strictly unmodified",
      "Refusal rules invoked for any legal inquiries",
      "Mandatory disclaimers intact and unmodified"
    ],
    valuation: [
      "Evidence-driven calculation only",
      "No formal appraisal language or fair-value claims",
      "No investment advice or financial conclusions",
      "Screening-only semantics preserved"
    ],
    buyerArchetypes: [
      "Hypothetical-only classification preserved",
      "Mathematically linked to detected capability evidence",
      "No real companies or proprietary lead lists used"
    ],
    outreach: [
      "Persona-level templates only",
      "Neutral, non-promotional tone",
      "No marketing strategy or targeting automation",
      "Mandatory draft notices and legal disclaimers present"
    ],
    charter: [
      "Zero violations of the Commercialization Engine Charter"
    ]
  }
} as const;

export class PullRequestComplianceChecker {
  /**
   * Evaluates proposed code strings for compliance with the Developer Guide.
   */
  public static checkSource(sourceCode: string): { passes: boolean; findings: string[] } {
    const findings: string[] = [];

    // Prohibited phrase inspections
    const riskyPatterns = [
      { pattern: /patentable/i, message: "Use of prohibited term 'patentable'. Must use novelty heuristic grammar." },
      { pattern: /cleanroom\s+verified/i, message: "Prohibited claim of cleanroom verification." },
      { pattern: /certified\s+compliant/i, message: "Prohibited claim of license compliance certification." },
      { pattern: /fair\s+market\s+value\s+appraisal/i, message: "Valuation must remain screening replacement cost only." },
      { pattern: /discovered\s+lead/i, message: "Buyer archetypes must remain strictly hypothetical." }
    ];

    for (const { pattern, message } of riskyPatterns) {
      if (pattern.test(sourceCode)) {
        findings.push(message);
      }
    }

    return {
      passes: findings.length === 0,
      findings
    };
  }
}
