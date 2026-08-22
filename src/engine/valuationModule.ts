/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// valuationModule.ts
// Evidence-driven, screening-only valuation engine.
// Designed for one-time legal + commercial sign-off.

export type CertaintyBand = "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT_EVIDENCE";

export interface SizeMetrics {
  loc: number;
  classesOrStructs: number;
  functionsOrMethods: number;
}

export interface ValuationInputs {
  sizeMetrics: SizeMetrics;
  complexityIndex: number; // e.g. 0.5–2.0
  baseRatePerLoc: number;  // USD per LOC
}

export interface ValuationResult {
  mode: "SCREENING_ESTIMATE" | "INSUFFICIENT_EVIDENCE";
  certainty: CertaintyBand;
  estimated_replacement_cost_usd: number;
  inputs: ValuationInputs;
  disclaimer: string;
}

export const VALUATION_DISCLAIMER =
  "Screening valuation estimate based on code metrics and detected capabilities. " +
  "Not a formal financial appraisal, not legal advice, and not accounting guidance. " +
  "Human review required before any transaction.";

export function buildValuation(
  metrics: SizeMetrics,
  complexityIndex: number,
  rawCertainty: number,
  baseRatePerLoc = 2.5
): ValuationResult {
  if (!metrics || metrics.loc <= 0) {
    return {
      mode: "INSUFFICIENT_EVIDENCE",
      certainty: "INSUFFICIENT_EVIDENCE",
      estimated_replacement_cost_usd: 0,
      inputs: { sizeMetrics: metrics || { loc: 0, classesOrStructs: 0, functionsOrMethods: 0 }, complexityIndex, baseRatePerLoc },
      disclaimer: VALUATION_DISCLAIMER
    };
  }

  let certainty: CertaintyBand;
  if (rawCertainty >= 0.85) certainty = "HIGH";
  else if (rawCertainty >= 0.65) certainty = "MEDIUM";
  else if (rawCertainty >= 0.4) certainty = "LOW";
  else certainty = "INSUFFICIENT_EVIDENCE";

  const rawCost = metrics.loc * baseRatePerLoc * complexityIndex;

  return {
    mode: "SCREENING_ESTIMATE",
    certainty,
    estimated_replacement_cost_usd: Math.round(rawCost),
    inputs: { sizeMetrics: metrics, complexityIndex, baseRatePerLoc },
    disclaimer: VALUATION_DISCLAIMER
  };
}
