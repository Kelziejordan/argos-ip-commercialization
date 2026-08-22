/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// outreachModule.ts
// Draft outreach templates for hypothetical buyer archetypes.
// Not campaigns, not advice, not real targeting.

import type { BuyerArchetype } from "./buyerArchetypeModule";
import type { ValuationResult } from "./valuationModule";

export interface OutreachTemplate {
  archetypeId: string;
  contactPersona: string;
  subjectLine: string;
  emailBody: string;
  disclaimer: string;
}

export const OUTREACH_DISCLAIMER =
  "AI-generated outreach template for hypothetical buyer archetypes. " +
  "Not real leads, not marketing advice, and not legal guidance. " +
  "You must supply real company and contact information, verify fit, " +
  "and comply with all applicable laws before use.";

export function buildOutreachTemplates(
  archetypes: BuyerArchetype[],
  valuation: ValuationResult
): OutreachTemplate[] {
  return archetypes.map(a => {
    const subjectLine = `Exploring potential fit: ${a.label} & your engineering asset`;

    const valuationLine =
      valuation.mode === "SCREENING_ESTIMATE"
        ? `Our screening valuation estimate suggests a replacement cost on the order of $${valuation.estimated_replacement_cost_usd.toLocaleString()}.`
        : `We were unable to form a screening valuation estimate due to insufficient evidence.`;

    const body =
      `This is a draft outreach template for a hypothetical buyer archetype: ${a.label} (${a.sector}), ` +
      `targeting the persona: ${a.contactPersona}.\n\n` +
      `${valuationLine}\n\n` +
      `The asset shows capabilities that may be relevant to your domain:\n` +
      `- ${a.evidence.join("\n- ")}\n\n` +
      `This message is a template only. You must replace archetype details with real company and contact information, ` +
      `verify technical and commercial fit, and obtain appropriate legal and compliance review before any actual outreach.\n`;

    return {
      archetypeId: a.id,
      contactPersona: a.contactPersona,
      subjectLine,
      emailBody: body,
      disclaimer: OUTREACH_DISCLAIMER
    };
  });
}
