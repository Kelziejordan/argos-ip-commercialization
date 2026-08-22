/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// archetypeBuyerMatcher.ts
// Archetype–Buyer Matcher & Compliance Gate
// Maps real ingested buyers from the Buyer Registry to generated Buyer Archetypes.
// Evaluates tech stack overlap, budget fit, and enforces Governance Policy rules & Human-in-the-Loop gates.

import {
  AuditLogEntry,
  BuyerArchetype,
  BuyerRecord,
  ComplianceFlag,
  GovernancePolicy,
  MatchedBuyerSet,
  RealBuyerMatch
} from '../types';
import { DEFAULT_GOVERNANCE_POLICY } from './buyerArchetypeEngine';
import { BuyerRegistryService } from './buyerRegistry';

export class ArchetypeBuyerMatcher {
  private static APPROVALS_STORAGE_KEY = "argos_match_approvals_v1";

  /**
   * Retrieves saved approval overrides from localStorage.
   */
  private static getApprovalOverrides(): Record<string, { status: 'HUMAN_APPROVED' | 'REJECTED'; approver: string; date: string; note?: string }> {
    try {
      const stored = localStorage.getItem(this.APPROVALS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return {};
  }

  /**
   * Matches all registered buyers against a set of archetypes with governance enforcement.
   */
  public static matchRegisteredBuyers(
    archetypes: BuyerArchetype[],
    customRegistry?: BuyerRecord[],
    policy: GovernancePolicy = DEFAULT_GOVERNANCE_POLICY
  ): MatchedBuyerSet {
    const buyers = customRegistry || BuyerRegistryService.getRegistry();
    const approvals = this.getApprovalOverrides();
    const evaluatedAt = new Date().toISOString();

    let totalApproved = 0;
    let totalPending = 0;

    const archetypeMatches = archetypes.map(archetype => {
      const matchedRealBuyers: RealBuyerMatch[] = [];

      for (const buyer of buyers) {
        // 1. Tech Stack Overlap calculation
        const targetStack = archetype.technicalFitProfile.stackCompatibility.map(s => s.toLowerCase());
        const buyerStack = buyer.techStack.map(s => s.toLowerCase());
        const overlappingStack = buyer.techStack.filter(s => targetStack.includes(s.toLowerCase()));
        const stackOverlapScore = targetStack.length > 0
          ? Math.min(100, Math.round((overlappingStack.length / Math.min(targetStack.length, 4)) * 100))
          : 75;

        // 2. Capability overlap (approximated based on segment relevance)
        const segmentMatches = buyer.segment.toLowerCase().includes(archetype.sector.toLowerCase()) ||
          archetype.complianceConstraints.allowedIndustries.some(ind => buyer.segment.toLowerCase().includes(ind.toLowerCase()));
        const capabilityFitScore = segmentMatches ? 95 : Math.max(40, stackOverlapScore - 15);

        // 3. Budget / Spend fit calculation
        const maxSpend = buyer.spendProfile.maxAnnualSoftwareSpendUsd;
        const dealTarget = archetype.suggestedDealSizeUsd;
        let budgetFitScore = 80;
        if (maxSpend >= dealTarget * 1.5) {
          budgetFitScore = 98;
        } else if (maxSpend >= dealTarget) {
          budgetFitScore = 85;
        } else {
          budgetFitScore = Math.max(20, Math.round((maxSpend / dealTarget) * 80));
        }

        // Composite Fit Score
        const fitScore = Math.round(
          stackOverlapScore * 0.4 +
          capabilityFitScore * 0.35 +
          budgetFitScore * 0.25
        );

        // Filter out poor matches (below 55% fit unless segment explicitly matches)
        if (fitScore < 55 && !segmentMatches) {
          continue;
        }

        // 4. Governance & Compliance Checks
        const complianceFlags: ComplianceFlag[] = [];
        let requiresHumanApproval = false;

        // Check A: Consent Verification
        if (policy.enforceConsentVerification && !buyer.consentVerified) {
          complianceFlags.push({
            flag: "UNVERIFIED_INTAKE_CONSENT",
            severity: "BLOCKER",
            description: "Buyer record does not have verified consent for software license intake."
          });
          requiresHumanApproval = true;
        }

        // Check B: Sensitive Segments
        const isSensitive = policy.sensitiveSegmentsRequiringReview.some(s =>
          buyer.segment.toLowerCase().includes(s.toLowerCase()) ||
          archetype.sector.toLowerCase().includes(s.toLowerCase())
        );
        if (isSensitive) {
          complianceFlags.push({
            flag: "SENSITIVE_SEGMENT_SCRUTINY",
            severity: "WARNING",
            description: `Target is classified under sensitive segment (${buyer.segment}). Human legal/governance sign-off required.`
          });
          requiresHumanApproval = true;
        }

        // Check C: High-Value Threshold
        if (dealTarget >= policy.humanApprovalThresholdUsd) {
          complianceFlags.push({
            flag: "HIGH_VALUE_THRESHOLD_EXCEEDED",
            severity: "INFO",
            description: `Suggested deal size ($${dealTarget.toLocaleString()}) exceeds the automated outreach threshold ($${policy.humanApprovalThresholdUsd.toLocaleString()}).`
          });
          requiresHumanApproval = true;
        }

        // Check D: Blocked Industries conflict
        const isBlocked = buyer.blockedIndustries.some(ind =>
          archetype.complianceConstraints.allowedIndustries.map(a => a.toLowerCase()).includes(ind.toLowerCase())
        );
        if (isBlocked) {
          complianceFlags.push({
            flag: "INDUSTRY_POLICY_CONFLICT",
            severity: "BLOCKER",
            description: "Asset distribution may violate buyer's published blocked industry policy."
          });
          requiresHumanApproval = true;
        }

        // Status resolution (check saved overrides)
        const matchId = `match-${archetype.id}-${buyer.id}`;
        const override = approvals[matchId];
        let approvalStatus: 'PENDING_REVIEW' | 'HUMAN_APPROVED' | 'REJECTED' = 'PENDING_REVIEW';
        let approvedBy: string | undefined = undefined;
        let approvedAt: string | undefined = undefined;

        if (override) {
          approvalStatus = override.status;
          approvedBy = override.approver;
          approvedAt = override.date;
        } else if (!requiresHumanApproval) {
          approvalStatus = 'HUMAN_APPROVED'; // Auto-approved if beneath all risk thresholds
        }

        if (approvalStatus === 'HUMAN_APPROVED') {
          totalApproved++;
        } else if (approvalStatus === 'PENDING_REVIEW') {
          totalPending++;
        }

        matchedRealBuyers.push({
          id: matchId,
          buyerRecord: buyer,
          archetypeId: archetype.id,
          archetypeLabel: archetype.label,
          fitScore,
          stackOverlapScore,
          capabilityFitScore,
          budgetFitScore,
          recommendedTier: archetype.recommendedTier,
          suggestedOfferPriceUsd: archetype.suggestedDealSizeUsd,
          matchedCapabilities: archetype.matchedCapabilities,
          matchedTechStack: overlappingStack,
          complianceFlags,
          requiresHumanApproval,
          approvalStatus,
          approvedBy,
          approvedAt,
          auditTraceId: `trace-match-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          notes: buyer.notes
        });
      }

      // Sort matched buyers by fit score descending
      matchedRealBuyers.sort((a, b) => b.fitScore - a.fitScore);

      return {
        archetype,
        matchedRealBuyers,
        totalMatchedCount: matchedRealBuyers.length
      };
    });

    return {
      archetypeMatches,
      totalRealBuyersEvaluated: buyers.length,
      totalApprovedMatches: totalApproved,
      totalPendingApprovalMatches: totalPending,
      governancePolicyApplied: policy,
      evaluatedAt
    };
  }

  /**
   * Approves a buyer match in the human-in-the-loop governance gate.
   */
  public static approveMatch(matchId: string, approverName: string, note?: string): void {
    const overrides = this.getApprovalOverrides();
    overrides[matchId] = {
      status: 'HUMAN_APPROVED',
      approver: approverName || 'Legal/Commercialization Director',
      date: new Date().toISOString(),
      note
    };
    try {
      localStorage.setItem(this.APPROVALS_STORAGE_KEY, JSON.stringify(overrides));
    } catch (e) {
      console.warn("Failed to persist match approval:", e);
    }
  }

  /**
   * Rejects or restricts a buyer match.
   */
  public static rejectMatch(matchId: string, approverName: string, reason?: string): void {
    const overrides = this.getApprovalOverrides();
    overrides[matchId] = {
      status: 'REJECTED',
      approver: approverName || 'Compliance Officer',
      date: new Date().toISOString(),
      note: reason
    };
    try {
      localStorage.setItem(this.APPROVALS_STORAGE_KEY, JSON.stringify(overrides));
    } catch (e) {
      console.warn("Failed to persist match rejection:", e);
    }
  }

  /**
   * Generates a formal Chronicle Audit Log for the buyer matching operation.
   */
  public static generateAuditTrail(matchedSet: MatchedBuyerSet, assetName: string): AuditLogEntry[] {
    const entries: AuditLogEntry[] = [];
    const timestamp = matchedSet.evaluatedAt;

    entries.push({
      id: `audit-gen-${Date.now()}-1`,
      timestamp,
      action: "ARCHETYPE_GENERATED",
      actor: "ArgOS Buyer Archetype Engine v2.0",
      details: `Synthesized ${matchedSet.archetypeMatches.length} policy-bounded buyer archetypes for asset "${assetName}".`,
      traceId: `trace-arch-${Math.random().toString(36).substring(2, 8)}`
    });

    entries.push({
      id: `audit-match-${Date.now()}-2`,
      timestamp,
      action: "REAL_BUYER_MATCHED",
      actor: "ArgOS Archetype–Buyer Matcher",
      details: `Evaluated ${matchedSet.totalRealBuyersEvaluated} registered CRM/consented buyer records. Generated matches with ${matchedSet.totalApprovedMatches} approved and ${matchedSet.totalPendingApprovalMatches} requiring human review under policy "${matchedSet.governancePolicyApplied.name}".`,
      traceId: `trace-match-${Math.random().toString(36).substring(2, 8)}`
    });

    return entries;
  }
}
