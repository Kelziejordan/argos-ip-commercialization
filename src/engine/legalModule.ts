/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// legalModule.ts
// Integrated legal subsystem: grammar + schema + refusal + safe output builder.

import { LEGAL_PHRASES, composeLegalText, LegalPhraseId, LegalGrammarValidator } from "./legalGrammar";
import { LegalJSONSchema, CanonicalLegalSchemaValidator } from "./legalSchema";
import { refuseLegal, LegalRefusal, LegalRefusalReasonId, LegalRefusalClassifier } from "./legalRefusalRules";

export type RiskBand = "LOW" | "MEDIUM" | "HIGH" | "INSUFFICIENT_EVIDENCE";

export interface LegalSignalsSection {
  risk_band: RiskBand;
  evidence: string[];
  disclaimer: string;
}

export interface LegalRiskIndicators {
  license_signals: LegalSignalsSection;
  provenance_signals: LegalSignalsSection;
  trade_secret_exposure: LegalSignalsSection;
  novelty_indicators: LegalSignalsSection;
  global_disclaimer: string;
}

export interface LegalOutput {
  legal_risk_indicators: LegalRiskIndicators;
  legal_review_required: true;
}

// Global disclaimer (same as in refusal rules).
const GLOBAL_DISCLAIMER =
  "All legal-related outputs are heuristic indicators based on code patterns. " +
  "They are not legal advice, not provenance verification, not patent novelty analysis, " +
  "and not license compliance confirmation. Human legal review required.";

// Helper to build a single signals section from evidence + risk band.
function buildSignalsSection(
  risk_band: RiskBand,
  evidence: string[],
  phraseIds: LegalPhraseId[]
): LegalSignalsSection {
  const sanitizedEvidence = (evidence && evidence.length > 0)
    ? evidence.map(e => LegalGrammarValidator.sanitize(e))
    : [LEGAL_PHRASES.INSUFFICIENT_EVIDENCE];

  return {
    risk_band,
    evidence: sanitizedEvidence,
    disclaimer: composeLegalText(phraseIds)
  };
}

// Main builder: constructs a full, schema-compliant legal output.
export function buildLegalHeuristicsOutput(params: {
  licenseRiskBand: RiskBand;
  licenseEvidence: string[];
  provenanceRiskBand: RiskBand;
  provenanceEvidence: string[];
  tradeSecretRiskBand: RiskBand;
  tradeSecretEvidence: string[];
  noveltyRiskBand: RiskBand;
  noveltyEvidence: string[];
}): LegalOutput {
  const license_signals = buildSignalsSection(
    params.licenseRiskBand,
    params.licenseEvidence,
    ["HEURISTIC_INDICATOR", "NON_FORENSIC", "NOT_LEGAL_ADVICE"]
  );

  const provenance_signals = buildSignalsSection(
    params.provenanceRiskBand,
    params.provenanceEvidence,
    ["HEURISTIC_INDICATOR", "NON_FORENSIC", "NOT_LEGAL_ADVICE"]
  );

  const trade_secret_exposure = buildSignalsSection(
    params.tradeSecretRiskBand,
    params.tradeSecretEvidence,
    ["HEURISTIC_INDICATOR", "NON_FORENSIC", "NOT_LEGAL_ADVICE"]
  );

  const novelty_indicators = buildSignalsSection(
    params.noveltyRiskBand,
    params.noveltyEvidence,
    ["HEURISTIC_INDICATOR", "NON_FORENSIC", "NOT_LEGAL_ADVICE"]
  );

  const output: LegalOutput = {
    legal_risk_indicators: {
      license_signals,
      provenance_signals,
      trade_secret_exposure,
      novelty_indicators,
      global_disclaimer: GLOBAL_DISCLAIMER
    },
    legal_review_required: true
  };

  // Enforce schema compliance validation at output boundary
  CanonicalLegalSchemaValidator.validate(output);

  return output;
}

// Export refusal and helper tooling for any truly legal question or evaluation.
export {
  refuseLegal,
  LegalRefusalClassifier,
  LegalJSONSchema,
  LEGAL_PHRASES,
  GLOBAL_DISCLAIMER
};
export type { LegalRefusal, LegalRefusalReasonId };
