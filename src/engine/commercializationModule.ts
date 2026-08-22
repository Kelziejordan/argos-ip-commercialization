/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// commercializationModule.ts
// Sign-off-ready integration: valuation + buyer archetypes + outreach.

import {
  buildValuation,
  VALUATION_DISCLAIMER,
  type SizeMetrics,
  type ValuationResult,
  type CertaintyBand,
  type ValuationInputs
} from "./valuationModule";
import {
  buildBuyerArchetypes,
  BUYER_DISCLAIMER,
  type DetectedCapabilities,
  type BuyerArchetype
} from "./buyerArchetypeModule";
import {
  buildOutreachTemplates,
  OUTREACH_DISCLAIMER,
  type OutreachTemplate
} from "./outreachModule";

export interface CommercializationBundle {
  valuation: ValuationResult;
  buyer_archetypes: BuyerArchetype[];
  outreach_templates: OutreachTemplate[];
  global_disclaimer: string;
}

export const COMMERCIALIZATION_GLOBAL_DISCLAIMER =
  "All commercialization outputs (screening valuation, hypothetical buyer archetypes, and outreach templates) " +
  "are heuristic estimates derived from static code metrics. They do not constitute formal financial appraisals, " +
  "marketing advice, discovered leads, or legal counsel. Human verification and compliance review are required.";

export function buildCommercializationBundle(params: {
  metrics: SizeMetrics;
  complexityIndex: number;
  rawCertainty: number;
  capabilities: DetectedCapabilities;
  baseRatePerLoc?: number;
}): CommercializationBundle {
  const valuation = buildValuation(
    params.metrics,
    params.complexityIndex,
    params.rawCertainty,
    params.baseRatePerLoc ?? 2.5
  );

  const buyer_archetypes = buildBuyerArchetypes(
    params.metrics,
    params.capabilities
  );

  const outreach_templates = buildOutreachTemplates(
    buyer_archetypes,
    valuation
  );

  return {
    valuation,
    buyer_archetypes,
    outreach_templates,
    global_disclaimer: COMMERCIALIZATION_GLOBAL_DISCLAIMER
  };
}

export {
  buildValuation,
  buildBuyerArchetypes,
  buildOutreachTemplates,
  VALUATION_DISCLAIMER,
  BUYER_DISCLAIMER,
  OUTREACH_DISCLAIMER
};
export type {
  SizeMetrics,
  ValuationResult,
  CertaintyBand,
  ValuationInputs,
  DetectedCapabilities,
  BuyerArchetype,
  OutreachTemplate
};
