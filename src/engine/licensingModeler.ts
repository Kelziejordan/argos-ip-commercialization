/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LicensingTier, ValuationBreakdown } from '../types';

export class LicensingModeler {
  public static buildTiers(valuation: ValuationBreakdown, useCases: string[]): LicensingTier[] {
    if (valuation.mode === 'INSUFFICIENT_EVIDENCE' || valuation.estimatedAnnualValueUsd === 0) {
      return [
        {
          id: "tier-screening-only",
          name: "Screening Evaluation Only",
          tagline: "Insufficient measurable code evidence to model commercial licensing terms.",
          royaltyModel: "percentage_of_savings",
          rateDescription: "N/A — Evidence Required",
          basePriceUsd: 0,
          targetCustomer: "Pending Code Ingestion",
          slaLevel: "Evaluation Only",
          includedFeatures: [
            "Upload valid source code to model enterprise licensing tiers",
            "Requires verified AST lines and structure definitions"
          ],
          evidenceTierLabel: "INSUFFICIENT_EVIDENCE",
          evidenceTierReason: "No code evidence supplied or zero lines measured."
        }
      ];
    }

    const annualEst = valuation.estimatedAnnualValueUsd;
    const baseEntryPrice = Math.max(1000, Math.round(annualEst * 0.04 / 500) * 500);

    return [
      {
        id: "tier-percentage-savings",
        name: "Enterprise Compute & Value-Share (Recommended)",
        tagline: "Pay directly from proven infrastructure efficiency with low upfront capital risk.",
        royaltyModel: "percentage_of_savings",
        rateDescription: "4.5% of verified monthly compute bill reduction",
        basePriceUsd: baseEntryPrice,
        targetCustomer: "Datacenter Hyper-Scalers, AI Inference Fleets & SaaS Platforms",
        slaLevel: "99.99% Guaranteed Substrate Uptime & Dedicated Solutions Architect",
        includedFeatures: [
          "Compiled binary ABI distribution with cleanroom warranty",
          "Automated cryptographic telemetry verification",
          "Cleanroom source code escrow deposit access",
          "Direct engineering escalation within 2 hours",
          "Unlimited worker core deployments within enterprise cluster"
        ],
        evidenceTierLabel: "VALUE_SHARE",
        evidenceTierReason: "Tied to measured operational efficiency and replacement cost."
      },
      {
        id: "tier-per-node",
        name: "Dedicated Node Infrastructure License",
        tagline: "Predictable, flat monthly pricing for high-density server clusters.",
        royaltyModel: "per_node_per_month",
        rateDescription: `$${Math.max(75, Math.round(annualEst / 3500))} / node / month (billed quarterly)`,
        basePriceUsd: Math.max(2000, Math.round(annualEst * 0.03 / 500) * 500),
        targetCustomer: "Distributed Systems Operators, Cloud Platforms & Financial Desks",
        slaLevel: "99.95% Infrastructure SLA with 4-hour response time",
        includedFeatures: [
          "Modular execution binaries and client SDK integration",
          "Multi-region deployment authorization",
          "Standard quarterly compliance & security patching",
          "Annual license volume discounts (>50 nodes: 20% off)"
        ],
        evidenceTierLabel: "CAPACITY_BASED",
        evidenceTierReason: "Scales with customer deployment footprint."
      },
      {
        id: "tier-oem-embedded",
        name: "OEM Embedded Hardware & Firmware Royalty",
        tagline: "Per-unit licensing model optimized for device integration and robotics.",
        royaltyModel: "per_device_oem",
        rateDescription: "$18.50 / activated physical device (volume tiering available)",
        basePriceUsd: Math.max(5000, Math.round(annualEst * 0.05 / 1000) * 1000),
        targetCustomer: "Autonomous Robotics, Mobile AMRs, Edge Sensors & Hardware OEMs",
        slaLevel: "Hardware Board Support Package (BSP) Maintenance",
        includedFeatures: [
          "Cross-compilation toolchain bindings",
          "Deterministic low-latency execution runtime",
          "Right to embed compiled binaries into proprietary firmware",
          "Dedicated board bring-up technical support"
        ],
        evidenceTierLabel: "UNIT_ROYALTY",
        evidenceTierReason: "Derived from hardware integration & embedded applicability."
      },
      {
        id: "tier-dual-source",
        name: "Full Source Code Commercial Buyout",
        tagline: "Complete perpetual source code ownership with private branch forks.",
        royaltyModel: "dual_source_royalty",
        rateDescription: `$${Math.round(annualEst * 2.2).toLocaleString()} One-time Perpetual Buyout + 12% Annual Support`,
        basePriceUsd: Math.round(annualEst * 2.2),
        targetCustomer: "Strategic Acquirers, Sovereign Clouds & Enterprise System Integrators",
        slaLevel: "White-Glove Architecture Transition & 12 Months Core Team Advisory",
        includedFeatures: [
          "Full unredacted source repository git history and build scripts",
          "Complete patent assignment and perpetual non-exclusive grant",
          "Right to modify, re-brand, and sub-license without royalty obligation",
          "Hands-on architectural handover workshops and architectural review"
        ],
        evidenceTierLabel: "PERPETUAL_TRANSFER",
        evidenceTierReason: "Priced against full engineering replication replacement cost."
      }
    ];
  }
}
