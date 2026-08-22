/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// buyerMatcher.ts
// Unified Buyer Archetype and Real Buyer Matching bridge.

import {
  AssetObject,
  BuyerArchetype,
  GovernancePolicy,
  LicensingTier,
  MatchedBuyerSet,
  ValuationBreakdown
} from '../types';
import { BuyerArchetypeEngine, DEFAULT_GOVERNANCE_POLICY } from './buyerArchetypeEngine';
import { ArchetypeBuyerMatcher } from './archetypeBuyerMatcher';
import { BuyerRegistryService } from './buyerRegistry';

export class BuyerMatcher {
  public static readonly OUTREACH_DISCLAIMER = BuyerArchetypeEngine.OUTREACH_DISCLAIMER;
  public static readonly ARCHETYPE_NOTE = BuyerArchetypeEngine.ARCHETYPE_NOTE;

  /**
   * Evidence-based builder for Buyer Archetypes.
   */
  public static discoverBuyers(
    asset: AssetObject,
    valuation: ValuationBreakdown,
    tiers: LicensingTier[] = [],
    policy: GovernancePolicy = DEFAULT_GOVERNANCE_POLICY
  ): BuyerArchetype[] {
    return BuyerArchetypeEngine.generateArchetypes(asset, valuation, tiers, policy);
  }

  /**
   * Complete matching pipeline: Archetypes + Real Registry Matching.
   */
  public static matchArchetypesToRealBuyers(
    archetypes: BuyerArchetype[],
    policy: GovernancePolicy = DEFAULT_GOVERNANCE_POLICY
  ): MatchedBuyerSet {
    const registry = BuyerRegistryService.getRegistry();
    return ArchetypeBuyerMatcher.matchRegisteredBuyers(archetypes, registry, policy);
  }
}
