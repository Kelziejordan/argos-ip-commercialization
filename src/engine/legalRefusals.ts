/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LegalRefusalResult {
  status: 'CANNOT_DETERMINE';
  query: string;
  reason: string;
  requiredAction: string;
  disclaimer: string;
}

export class LegalRefusalEngine {
  public static readonly REFUSAL_DISCLAIMER =
    "This automated system is structurally constrained from answering substantive legal, patent validity, cleanroom provenance, or license compliance questions. Formal engagement with qualified legal counsel is required.";

  public static readonly REFUSAL_TOPICS: Record<string, { queryName: string; reason: string; requiredAction: string }> = {
    cleanroom_verification: {
      queryName: "Cleanroom Verification & Lineage Certification",
      reason: "Cleanroom provenance requires human forensic audit, chain-of-custody documentation, and isolated environment verification.",
      requiredAction: "Engage forensic IP counsel to conduct cleanroom audit and maintain developer work logs."
    },
    patentability_determination: {
      queryName: "Patent Novelty & Non-Obviousness Determination",
      reason: "Patentability determinations require extensive USPTO/EPO prior art searching, claim drafting, and statutory examination under 35 U.S.C. §§ 101, 102, 103.",
      requiredAction: "Retain a registered patent attorney to conduct a formal patentability and prior art clearance search."
    },
    ownership_chain: {
      queryName: "IP Ownership & Chain of Title Verification",
      reason: "IP ownership depends on contractual assignment agreements, employment covenants, and jurisdictional work-for-hire statutes.",
      requiredAction: "Review all founder/contributor Proprietary Information and Inventions Agreements (PIIA) with corporate counsel."
    },
    license_compliance_guarantee: {
      queryName: "License Compliance & Non-Infringement Guarantee",
      reason: "Comprehensive license compliance requires deep transitive dependency resolution, dynamic linking analysis, and dual-licensing audit.",
      requiredAction: "Perform software composition analysis (SCA) accompanied by legal counsel review of open source obligations."
    },
    trade_secret_confirmation: {
      queryName: "Trade Secret Legal Status Confirmation",
      reason: "Trade secret protection under DTSA/UTSA requires demonstrating reasonable measures to maintain secrecy and independent economic value.",
      requiredAction: "Audit physical, cryptographic, and contractual access controls with intellectual property counsel."
    }
  };

  /**
   * Refuses a substantive legal question with a structured, legally safe refusal object.
   */
  public static refuse(topicKey: keyof typeof LegalRefusalEngine.REFUSAL_TOPICS | string): LegalRefusalResult {
    const topic = LegalRefusalEngine.REFUSAL_TOPICS[topicKey] || {
      queryName: String(topicKey),
      reason: "Substantive legal determinations require qualified attorney evaluation and cannot be performed by automated heuristics.",
      requiredAction: "Consult licensed legal counsel in the relevant jurisdiction."
    };

    return {
      status: 'CANNOT_DETERMINE',
      query: topic.queryName,
      reason: topic.reason,
      requiredAction: topic.requiredAction,
      disclaimer: LegalRefusalEngine.REFUSAL_DISCLAIMER
    };
  }

  /**
   * Checks if a user or system prompt is attempting to elicit a legal conclusion,
   * and returns a structured refusal if detected.
   */
  public static evaluateRefusalTrigger(promptText: string): LegalRefusalResult | null {
    const lower = promptText.toLowerCase();

    if (lower.includes('is this patentable') || lower.includes('can i patent this') || lower.includes('is it novel')) {
      return this.refuse('patentability_determination');
    }
    if (lower.includes('is it cleanroom') || lower.includes('verify cleanroom') || lower.includes('guarantee no gpl')) {
      return this.refuse('cleanroom_verification');
    }
    if (lower.includes('who owns this') || lower.includes('chain of title') || lower.includes('verify ownership')) {
      return this.refuse('ownership_chain');
    }
    if (lower.includes('is this compliant') || lower.includes('guarantee non-infringing')) {
      return this.refuse('license_compliance_guarantee');
    }

    return null;
  }
}
