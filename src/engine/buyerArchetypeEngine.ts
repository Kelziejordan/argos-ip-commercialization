/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// buyerArchetypeEngine.ts
// Buyer Archetype Engine
// Transforms technical evidence (AST invariants, size metrics, capability flags) into
// structured, policy-aware BuyerArchetype profiles.

import {
  AssetObject,
  BuyerArchetype,
  GovernancePolicy,
  LicensingTier,
  OutreachTemplate,
  ValuationBreakdown
} from '../types';

export const DEFAULT_GOVERNANCE_POLICY: GovernancePolicy = {
  id: "gov-policy-enterprise-v1",
  name: "Enterprise Compliance & Export Governance Policy",
  blockedIndustries: ["Autonomous Weapons", "Surveillance & Spyware", "Predatory Lending"],
  minimumDealSizeUsd: 25000,
  humanApprovalThresholdUsd: 150000,
  sensitiveSegmentsRequiringReview: [
    "Autonomous Mobile Robotics (AMR) & Edge OEM",
    "Military & Defense Systems",
    "High-Assurance Critical Infrastructure"
  ],
  enforceConsentVerification: true,
  prohibitedLicenseCombinations: ["GPLv3_Dual_Source_Without_Indemnity"]
};

export class BuyerArchetypeEngine {
  public static readonly ARCHETYPE_NOTE = 
    "Hypothetical buyer archetype inferred from detected capabilities, not a real company.";

  public static readonly OUTREACH_DISCLAIMER = 
    "Draft outreach template for hypothetical buyer archetype. Not marketing advice. Human verification and targeting required.";

  /**
   * Generates policy-aware Buyer Archetypes from technical asset evidence.
   */
  public static generateArchetypes(
    asset: AssetObject,
    valuation: ValuationBreakdown,
    tiers: LicensingTier[] = [],
    policy: GovernancePolicy = DEFAULT_GOVERNANCE_POLICY
  ): BuyerArchetype[] {
    const annualEst = valuation.estimatedAnnualValueUsd || 0;
    const kind = asset.primarykind;
    const langList = asset.languages.join(', ');
    const caps = asset.features?.capabilities || [];
    const invariants = asset.files.flatMap(f => f.features.invariants || []);
    const topCap = caps[0] || "High-Throughput Modular Architecture";
    const secondCap = caps[1] || "Deterministic State Execution";
    const loc = asset.size_metrics.loc;
    const complexity = asset.size_metrics.cyclomatic_index;

    const rawArchetypes: BuyerArchetype[] = [];

    const createTemplate = (
      archetypeId: string,
      label: string,
      persona: string,
      subject: string,
      techBrief: string
    ): OutreachTemplate => {
      const emailBody = 
`[DRAFT OUTREACH TEMPLATE FOR ARCHETYPE: ${label.toUpperCase()} // ${persona.toUpperCase()}]
NOTICE: This is a draft template. You must supply verified company and contact information, verify technical fit, and obtain legal/compliance review before use.

Dear ${persona},

We have developed a technical asset (${asset.name}) in ${langList}, engineered with ${topCap}.

Observable Technical Evidence (Static AST Analysis):
• ${caps.slice(0, 3).map(c => `Detected capability: ${c}`).join('\n• ')}
• Codebase scale: ${loc.toLocaleString()} source lines across ${asset.size_metrics.file_count} files
• Cyclomatic complexity index: ${complexity.toFixed(2)}
• Cleanroom non-forensic scan: zero copyleft markers detected

Would your engineering leadership be open to a 20-minute architecture review and receiving our technical evaluation sandbox?

Sincerely,
[Your Name / Commercialization Lead]

---
DISCLAIMER: ${this.OUTREACH_DISCLAIMER}`;

      return {
        archetypeId,
        contactPersona: persona,
        subjectLine: subject,
        emailBody,
        technicalBrief: techBrief,
        disclaimer: this.OUTREACH_DISCLAIMER
      };
    };

    // 1. Cost-Compression Cloud Buyer (Hyperscale Cloud & Infrastructure)
    const tCost = createTemplate(
      "archetype-cost-cloud",
      "Cost-Compression Cloud Buyer",
      "VP of Cloud Infrastructure & Efficiency",
      `[Draft Template] Compute Cluster Cost-Compression via ${asset.name}`,
      `Lockless memory-mapped IPC and zero-copy synchronization primitives engineered in ${langList}.`
    );
    rawArchetypes.push({
      id: "archetype-cost-cloud",
      label: "Cost-Compression Cloud Buyer",
      archetypeName: "Cost-Compression Cloud Buyer",
      companyName: "Cost-Compression Cloud Buyer",
      sector: "Cloud Infrastructure & Hyper-Scale Interconnect",
      fitScore: 96.5,
      technicalFitProfile: {
        requiredCapabilities: ["Distributed Concurrency", "High Throughput", "Memory Isolation"],
        stackCompatibility: ["C", "C++", "Rust", "Linux Kernel", "DPDK", "Kubernetes", "eBPF"],
        minimumLocComplexity: 1.5
      },
      economicProfile: {
        dealSizeBandUsd: {
          min: Math.round(annualEst * 0.08),
          max: Math.round(annualEst * 0.25)
        },
        preferredRoyaltyModels: ["percentage_of_savings", "per_node_per_month"],
        typicalAnnualSavingsUsd: Math.round(annualEst * 1.6)
      },
      complianceConstraints: {
        allowedIndustries: ["Cloud Computing", "Data Centers", "Telecommunications", "Enterprise SaaS"],
        blockedIndustries: policy.blockedIndustries,
        minimumGovernanceTier: "STANDARD",
        requiresHumanApprovalThresholdUsd: policy.humanApprovalThresholdUsd
      },
      annualSavingsEstimateUsd: Math.round(annualEst * 1.6),
      recommendedTier: "Enterprise Compute & Value-Share (4.5% of savings)",
      contactPersona: "VP of Global Cloud Infrastructure & Efficiency",
      isHypothetical: true,
      notes: this.ARCHETYPE_NOTE,
      primaryPainPoint: "Soaring CPU core allocation overhead, socket context switching, and multi-tenant memory thrashing.",
      matchedCapabilities: caps.slice(0, 3),
      evidenceTriggers: [
        "Lockless shared memory & async primitives detected in AST",
        `${loc.toLocaleString()} lines of performance-critical code in ${langList}`,
        invariants[0] || "Deterministic memory buffer management"
      ],
      suggestedDealSizeUsd: Math.max(policy.minimumDealSizeUsd, Math.round(annualEst * 0.12)),
      pitchAngle: `Deploy ${asset.name} to eliminate process contention and compress compute infrastructure overhead by up to 28%.`,
      outreachTemplate: tCost,
      outreachSequence: {
        emailSubject: tCost.subjectLine,
        emailBody: tCost.emailBody,
        technicalBrief: tCost.technicalBrief || ''
      }
    });

    // 2. Edge Resilience OEM (Robotics, Automotive, Embedded Systems)
    const tEdge = createTemplate(
      "archetype-edge-resilience",
      "Edge Resilience OEM",
      "Head of Embedded Systems Architecture",
      `[Draft Template] Deterministic Low-Power Runtime (${asset.name}) for Edge Hardware`,
      `Compact binary execution with deterministic memory boundaries and zero-allocation critical path.`
    );
    rawArchetypes.push({
      id: "archetype-edge-resilience",
      label: "Edge Resilience OEM",
      archetypeName: "Edge Resilience OEM",
      companyName: "Edge Resilience OEM",
      sector: "Autonomous Mobile Robotics (AMR) & Edge OEM",
      fitScore: 92.4,
      technicalFitProfile: {
        requiredCapabilities: ["Deterministic State", "Low Footprint", "Hardware Acceleration"],
        stackCompatibility: ["C++", "C", "Rust", "RTOS", "Linux", "ROS2", "CUDA"],
        minimumLocComplexity: 1.2
      },
      economicProfile: {
        dealSizeBandUsd: {
          min: Math.round(annualEst * 0.05),
          max: Math.round(annualEst * 0.18)
        },
        preferredRoyaltyModels: ["per_device_oem", "dual_source_royalty"],
        typicalAnnualSavingsUsd: Math.round(annualEst * 1.1)
      },
      complianceConstraints: {
        allowedIndustries: ["Commercial Robotics", "Industrial IoT", "Medical Devices", "Automotive"],
        blockedIndustries: [...policy.blockedIndustries, "Offensive Weapons"],
        minimumGovernanceTier: "HIGH_ASSURANCE",
        requiresHumanApprovalThresholdUsd: 100000 // stricter threshold for edge/OEM
      },
      annualSavingsEstimateUsd: Math.round(annualEst * 1.1),
      recommendedTier: "OEM Embedded Hardware & Firmware Royalty ($18.50 / activated unit)",
      contactPersona: "Head of Embedded Systems Architecture & Flight Control",
      isHypothetical: true,
      notes: this.ARCHETYPE_NOTE,
      primaryPainPoint: "Edge compute thermal throttling, battery drain, and non-deterministic sensor fusion scheduling jitter.",
      matchedCapabilities: caps.slice(0, 2),
      evidenceTriggers: [
        "Bounded execution timing loops verified in AST",
        "Deterministic memory alignment (zero heap churn in hot path)"
      ],
      suggestedDealSizeUsd: Math.max(policy.minimumDealSizeUsd, Math.round(annualEst * 0.08)),
      pitchAngle: `Guarantee microsecond deterministic scheduling and extend device battery life with drop-in embedded runtime modules.`,
      outreachTemplate: tEdge,
      outreachSequence: {
        emailSubject: tEdge.subjectLine,
        emailBody: tEdge.emailBody,
        technicalBrief: tEdge.technicalBrief || ''
      }
    });

    // 3. Agentic Platform Integrator (Telemetry, Observability, Stream Analytics)
    const tAgentic = createTemplate(
      "archetype-agentic-integrator",
      "Agentic Platform Integrator",
      "VP of Ingestion Pipeline & Kernel Telemetry",
      `[Draft Template] Stream Analytics Ingestion Acceleration via ${asset.name}`,
      `High-throughput event serialization engine with zero kernel context switches.`
    );
    rawArchetypes.push({
      id: "archetype-agentic-integrator",
      label: "Agentic Platform Integrator",
      archetypeName: "Agentic Platform Integrator",
      companyName: "Agentic Platform Integrator",
      sector: "Agentic Platform Integrator & Stream Analytics",
      fitScore: 94.8,
      technicalFitProfile: {
        requiredCapabilities: ["Stream Ingestion", "Async Processing", "Telemetry Aggregation"],
        stackCompatibility: ["Go", "Rust", "C++", "Python", "Kafka", "ClickHouse", "eBPF"],
        minimumLocComplexity: 1.4
      },
      economicProfile: {
        dealSizeBandUsd: {
          min: Math.round(annualEst * 0.07),
          max: Math.round(annualEst * 0.20)
        },
        preferredRoyaltyModels: ["percentage_of_savings", "per_node_per_month"],
        typicalAnnualSavingsUsd: Math.round(annualEst * 1.35)
      },
      complianceConstraints: {
        allowedIndustries: ["Observability", "Enterprise SaaS", "Cloud Security", "Developer Tools"],
        blockedIndustries: policy.blockedIndustries,
        minimumGovernanceTier: "STANDARD",
        requiresHumanApprovalThresholdUsd: policy.humanApprovalThresholdUsd
      },
      annualSavingsEstimateUsd: Math.round(annualEst * 1.35),
      recommendedTier: "Dedicated Node Infrastructure License ($1,250 / host / month)",
      contactPersona: "VP of Ingestion Pipeline & Core Telemetry Platform",
      isHypothetical: true,
      notes: this.ARCHETYPE_NOTE,
      primaryPainPoint: "Ingestion pipeline backpressure, serialization bottlenecks, and soaring cloud ingestion cluster bills.",
      matchedCapabilities: [topCap, secondCap],
      evidenceTriggers: [
        "Asynchronous stream processing constructs detected",
        `${asset.size_metrics.functions_or_methods} verified functions across ${asset.size_metrics.file_count} files`
      ],
      suggestedDealSizeUsd: Math.max(policy.minimumDealSizeUsd, Math.round(annualEst * 0.1)),
      pitchAngle: `Scale log and metric ingestion throughput 3x without increasing node fleet count.`,
      outreachTemplate: tAgentic,
      outreachSequence: {
        emailSubject: tAgentic.subjectLine,
        emailBody: tAgentic.emailBody,
        technicalBrief: tAgentic.technicalBrief || ''
      }
    });

    // 4. Low-Latency FinTech Operator (HFT & Electronic Trading)
    const tFintech = createTemplate(
      "archetype-fintech-hft",
      "Low-Latency FinTech Operator",
      "Head of Low-Latency Market Access Architecture",
      `[Draft Template] Sub-Microsecond State & Message Routing (${asset.name})`,
      `Cache-line aligned data structures eliminating bus contention under high concurrent loads.`
    );
    rawArchetypes.push({
      id: "archetype-fintech-hft",
      label: "Low-Latency FinTech Operator",
      archetypeName: "Low-Latency FinTech Operator",
      companyName: "Low-Latency FinTech Operator",
      sector: "Electronic Trading & Low-Latency FinTech",
      fitScore: 91.2,
      technicalFitProfile: {
        requiredCapabilities: ["Low Latency", "Zero Copy", "Memory Alignment"],
        stackCompatibility: ["C++", "C", "Rust", "Assembly", "Linux Kernel", "DPDK", "Solarflare"],
        minimumLocComplexity: 1.6
      },
      economicProfile: {
        dealSizeBandUsd: {
          min: Math.round(annualEst * 0.1),
          max: Math.round(annualEst * 0.3)
        },
        preferredRoyaltyModels: ["dual_source_royalty", "percentage_of_savings"],
        typicalAnnualSavingsUsd: Math.round(annualEst * 1.5)
      },
      complianceConstraints: {
        allowedIndustries: ["Financial Markets", "Algorithmic Trading", "Exchange Tech"],
        blockedIndustries: policy.blockedIndustries,
        minimumGovernanceTier: "HIGH_ASSURANCE",
        requiresHumanApprovalThresholdUsd: policy.humanApprovalThresholdUsd
      },
      annualSavingsEstimateUsd: Math.round(annualEst * 1.5),
      recommendedTier: "Source-Available Custom Dual-Licensing",
      contactPersona: "Head of Core Execution Platforms & Infrastructure",
      isHypothetical: true,
      notes: this.ARCHETYPE_NOTE,
      primaryPainPoint: "Tail latency spikes in order dispatch and packet serialization contention.",
      matchedCapabilities: [topCap, secondCap],
      evidenceTriggers: [
        "Cache-line padding (64-byte alignment) detected in data structures",
        "Zero dynamic allocation in inner critical loop"
      ],
      suggestedDealSizeUsd: Math.max(policy.minimumDealSizeUsd, Math.round(annualEst * 0.15)),
      pitchAngle: `Bypass kernel socket delays with high-speed memory-mapped routing pipelines.`,
      outreachTemplate: tFintech,
      outreachSequence: {
        emailSubject: tFintech.subjectLine,
        emailBody: tFintech.emailBody,
        technicalBrief: tFintech.technicalBrief || ''
      }
    });

    // 5. High-Assurance SecOps Core (Cybersecurity & Endpoint Protection)
    const tSecops = createTemplate(
      "archetype-secops-core",
      "High-Assurance SecOps Core",
      "VP of Threat Sensor Architecture",
      `[Draft Template] Kernel-Safe Threat Telemetry Module (${asset.name})`,
      `Memory-safe kernel isolation hooks with provable bounds checking.`
    );
    rawArchetypes.push({
      id: "archetype-secops-core",
      label: "High-Assurance SecOps Core",
      archetypeName: "High-Assurance SecOps Core",
      companyName: "High-Assurance SecOps Core",
      sector: "Enterprise Cybersecurity & Kernel SecOps",
      fitScore: 89.6,
      technicalFitProfile: {
        requiredCapabilities: ["Memory Isolation", "Security Hardening", "Kernel Safety"],
        stackCompatibility: ["C++", "C", "Rust", "Linux Kernel", "Windows Internals", "eBPF"],
        minimumLocComplexity: 1.3
      },
      economicProfile: {
        dealSizeBandUsd: {
          min: Math.round(annualEst * 0.08),
          max: Math.round(annualEst * 0.22)
        },
        preferredRoyaltyModels: ["per_node_per_month", "percentage_of_savings"],
        typicalAnnualSavingsUsd: Math.round(annualEst * 1.2)
      },
      complianceConstraints: {
        allowedIndustries: ["Cybersecurity", "Endpoint Detection", "Cloud Defense"],
        blockedIndustries: policy.blockedIndustries,
        minimumGovernanceTier: "HIGH_ASSURANCE",
        requiresHumanApprovalThresholdUsd: policy.humanApprovalThresholdUsd
      },
      annualSavingsEstimateUsd: Math.round(annualEst * 1.2),
      recommendedTier: "Dedicated Node Infrastructure License",
      contactPersona: "VP of Sensor Engineering & Kernel Security",
      isHypothetical: true,
      notes: this.ARCHETYPE_NOTE,
      primaryPainPoint: "Risk of blue-screen crashes / kernel panics when sensor modules inspect memory in production.",
      matchedCapabilities: caps.slice(0, 2),
      evidenceTriggers: [
        "Memory boundary safety invariant checks in AST",
        "Cleanroom non-forensic scan (zero copyleft contamination)"
      ],
      suggestedDealSizeUsd: Math.max(policy.minimumDealSizeUsd, Math.round(annualEst * 0.09)),
      pitchAngle: `Deploy verified memory-safe telemetry hooks without kernel panics.`,
      outreachTemplate: tSecops,
      outreachSequence: {
        emailSubject: tSecops.subjectLine,
        emailBody: tSecops.emailBody,
        technicalBrief: tSecops.technicalBrief || ''
      }
    });

    // Filter against governance policy: remove archetypes whose allowed industries conflict with blocked policies
    return rawArchetypes.filter(arch => {
      const isBlocked = arch.complianceConstraints.allowedIndustries.some(ind =>
        policy.blockedIndustries.map(b => b.toLowerCase()).includes(ind.toLowerCase())
      );
      return !isBlocked;
    });
  }
}
