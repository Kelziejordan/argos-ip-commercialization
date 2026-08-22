/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// legalSchema.ts
// Canonical JSON schema for all legal-related outputs.
// This schema is immutable once approved by human legal review.

export const LegalJSONSchema = {
  type: "object",
  required: ["legal_risk_indicators", "legal_review_required"],
  properties: {
    legal_risk_indicators: {
      type: "object",
      required: [
        "license_signals",
        "provenance_signals",
        "trade_secret_exposure",
        "novelty_indicators",
        "global_disclaimer"
      ],
      properties: {
        license_signals: {
          type: "object",
          required: ["risk_band", "evidence", "disclaimer"],
          properties: {
            risk_band: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH", "INSUFFICIENT_EVIDENCE"]
            },
            evidence: {
              type: "array",
              items: { type: "string" }
            },
            disclaimer: { type: "string" }
          }
        },

        provenance_signals: {
          type: "object",
          required: ["risk_band", "evidence", "disclaimer"],
          properties: {
            risk_band: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH", "INSUFFICIENT_EVIDENCE"]
            },
            evidence: {
              type: "array",
              items: { type: "string" }
            },
            disclaimer: { type: "string" }
          }
        },

        trade_secret_exposure: {
          type: "object",
          required: ["risk_band", "evidence", "disclaimer"],
          properties: {
            risk_band: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH", "INSUFFICIENT_EVIDENCE"]
            },
            evidence: {
              type: "array",
              items: { type: "string" }
            },
            disclaimer: { type: "string" }
          }
        },

        novelty_indicators: {
          type: "object",
          required: ["risk_band", "evidence", "disclaimer"],
          properties: {
            risk_band: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH", "INSUFFICIENT_EVIDENCE"]
            },
            evidence: {
              type: "array",
              items: { type: "string" }
            },
            disclaimer: { type: "string" }
          }
        },

        global_disclaimer: {
          type: "string",
          description:
            "Mandatory system-wide legal disclaimer. Must always be present."
        }
      }
    },

    legal_review_required: {
      type: "boolean",
      const: true
    }
  }
} as const;

export type LegalRiskBand = 'LOW' | 'MEDIUM' | 'HIGH' | 'INSUFFICIENT_EVIDENCE';

export interface CanonicalLegalSignalBlock {
  risk_band: LegalRiskBand;
  evidence: string[];
  disclaimer: string;
}

export interface CanonicalLegalRiskIndicators {
  license_signals: CanonicalLegalSignalBlock;
  provenance_signals: CanonicalLegalSignalBlock;
  trade_secret_exposure: CanonicalLegalSignalBlock;
  novelty_indicators: CanonicalLegalSignalBlock;
  global_disclaimer: string;
}

export interface CanonicalLegalOutputPayload {
  legal_risk_indicators: CanonicalLegalRiskIndicators;
  legal_review_required: true;
}

export class CanonicalLegalSchemaValidator {
  private static readonly VALID_BANDS = new Set<LegalRiskBand>([
    'LOW',
    'MEDIUM',
    'HIGH',
    'INSUFFICIENT_EVIDENCE'
  ]);

  /**
   * Validates runtime payloads against the canonical legal JSON schema.
   */
  public static validate(payload: CanonicalLegalOutputPayload): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload) {
      return { valid: false, errors: ['Payload is null or undefined'] };
    }

    if (payload.legal_review_required !== true) {
      errors.push('legal_review_required must be strictly boolean true.');
    }

    const indicators = payload.legal_risk_indicators;
    if (!indicators) {
      return { valid: false, errors: ['Missing legal_risk_indicators object.'] };
    }

    const sections: (keyof Omit<CanonicalLegalRiskIndicators, 'global_disclaimer'>)[] = [
      'license_signals',
      'provenance_signals',
      'trade_secret_exposure',
      'novelty_indicators'
    ];

    for (const sec of sections) {
      const block = indicators[sec];
      if (!block) {
        errors.push(`Missing section: ${sec}`);
        continue;
      }
      if (!this.VALID_BANDS.has(block.risk_band)) {
        errors.push(`Invalid risk_band in ${sec}: ${block.risk_band}`);
      }
      if (!Array.isArray(block.evidence)) {
        errors.push(`Missing or invalid evidence array in ${sec}`);
      }
      if (!block.disclaimer || typeof block.disclaimer !== 'string' || block.disclaimer.trim().length === 0) {
        errors.push(`Missing mandatory disclaimer in ${sec}`);
      }
    }

    if (!indicators.global_disclaimer || indicators.global_disclaimer.length < 25) {
      errors.push('Missing or incomplete mandatory global_disclaimer.');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
