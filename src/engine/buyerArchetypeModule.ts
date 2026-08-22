/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// buyerArchetypeModule.ts
// Hypothetical buyer archetypes inferred from evidence.
// Not real leads, not buyer discovery.

import type { SizeMetrics } from "./valuationModule";

export interface DetectedCapabilities {
  distributedSystems?: boolean;
  highThroughput?: boolean;
  resilience?: boolean;
  securityFeatures?: boolean;
  analytics?: boolean;
  machineLearning?: boolean;
  embeddedOrLowLevel?: boolean;
  cryptography?: boolean;
}

export interface BuyerArchetype {
  id: string;
  label: string;              // e.g. "Cloud Infrastructure Provider"
  sector: string;
  fitScore: number;           // 0–1 heuristic
  annualSavingsEstimateUsd?: number;
  recommendedTier?: string;   // link to licensing tier id
  contactPersona: string;     // e.g. "VP Platform Engineering"
  isHypothetical: true;
  evidence: string[];         // why this archetype exists
  disclaimer: string;
}

export const BUYER_DISCLAIMER =
  "Hypothetical buyer archetype inferred from asset capabilities and metrics. " +
  "Not a real company, not a discovered lead, and not marketing advice. " +
  "Human verification and targeting required.";

function scoreFromCapabilities(
  caps: DetectedCapabilities,
  keys: (keyof DetectedCapabilities)[]
): number {
  const present = keys.filter(k => caps[k]).length;
  const total = keys.length || 1;
  return Number((present / total).toFixed(2));
}

function estimateSavings(
  metrics: SizeMetrics,
  caps: DetectedCapabilities
): number {
  const base = metrics.loc * 0.5;
  const multiplier = caps.highThroughput ? 2 : 1;
  return Math.round(base * multiplier);
}

export function buildBuyerArchetypes(
  metrics: SizeMetrics,
  caps: DetectedCapabilities
): BuyerArchetype[] {
  const archetypes: BuyerArchetype[] = [];

  if (caps.distributedSystems || caps.highThroughput) {
    archetypes.push({
      id: "cloud-infra",
      label: "Cloud Infrastructure Provider",
      sector: "Cloud / Distributed Systems",
      fitScore: scoreFromCapabilities(caps, ["distributedSystems", "highThroughput", "resilience"]),
      annualSavingsEstimateUsd: estimateSavings(metrics, caps),
      recommendedTier: "PLATFORM_PREMIUM",
      contactPersona: "VP Platform Engineering",
      isHypothetical: true,
      evidence: [
        "Detected distributed systems or high-throughput capabilities.",
        "Size metrics indicate non-trivial implementation effort."
      ],
      disclaimer: BUYER_DISCLAIMER
    });
  }

  if (caps.analytics || caps.machineLearning) {
    archetypes.push({
      id: "analytics-firm",
      label: "Data Analytics Provider",
      sector: "Analytics / SaaS",
      fitScore: scoreFromCapabilities(caps, ["analytics", "machineLearning", "highThroughput"]),
      annualSavingsEstimateUsd: estimateSavings(metrics, caps),
      recommendedTier: "STANDARD_SAAS",
      contactPersona: "Head of Data Engineering",
      isHypothetical: true,
      evidence: [
        "Detected analytics or machine learning capabilities.",
        "Workload scaling patterns indicate value for data-intensive processing."
      ],
      disclaimer: BUYER_DISCLAIMER
    });
  }

  if (caps.securityFeatures || caps.cryptography) {
    archetypes.push({
      id: "cybersecurity-platform",
      label: "Enterprise Security Vendor",
      sector: "Cybersecurity & Compliance",
      fitScore: scoreFromCapabilities(caps, ["securityFeatures", "cryptography", "resilience"]),
      annualSavingsEstimateUsd: estimateSavings(metrics, caps),
      recommendedTier: "ENTERPRISE_CUSTOM",
      contactPersona: "Chief Information Security Officer (CISO)",
      isHypothetical: true,
      evidence: [
        "Detected cryptographic or enterprise security logic patterns.",
        "High-assurance requirements align with compliance licensing."
      ],
      disclaimer: BUYER_DISCLAIMER
    });
  }

  // Fallback archetype if no specific deep capability flags triggered
  if (archetypes.length === 0 && metrics.loc > 0) {
    archetypes.push({
      id: "tech-integrator",
      label: "Systems Integrator & OEM Partner",
      sector: "Enterprise Software Integration",
      fitScore: 0.5,
      annualSavingsEstimateUsd: estimateSavings(metrics, caps),
      recommendedTier: "STANDARD_OEM",
      contactPersona: "Director of Technology Partnerships",
      isHypothetical: true,
      evidence: [
        "General modular asset suitable for technical integration.",
        "Codebase provides self-contained functionality."
      ],
      disclaimer: BUYER_DISCLAIMER
    });
  }

  return archetypes;
}
