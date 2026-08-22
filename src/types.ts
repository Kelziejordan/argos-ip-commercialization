/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PrimaryKind = 
  | 'ossubstrate' 
  | 'aimodel' 
  | 'distributed_system' 
  | 'codelibrary' 
  | 'dataset';

export type AssetSourceType = 
  | 'file' 
  | 'repo' 
  | 'model' 
  | 'document' 
  | 'zip_archive' 
  | 'raw_code';

export type CertaintyLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';

export type EvidenceLevel = 'EVIDENCE_BASED' | 'HEURISTIC_ESTIMATE' | 'INSUFFICIENT';

export type RiskBand = 'LOW' | 'MEDIUM' | 'HIGH' | 'INSUFFICIENT_EVIDENCE';

export interface SizeMetrics {
  loc: number;
  file_count: number;
  classes_or_structs: number;
  functions_or_methods: number;
  cyclomatic_index: number;
}

export interface LicenseSignals {
  detectedLicenses: string[];
  riskBand: RiskBand;
  evidence: string[];
  disclaimer: string;
}

export interface ProvenanceSignals {
  indicators: string[];
  riskBand: RiskBand;
  evidence: string[];
  disclaimer: string;
}

export interface TradeSecretExposure {
  riskBand: RiskBand;
  evidence: string[];
  disclaimer: string;
}

export interface NoveltyIndicators {
  riskBand: RiskBand;
  evidence: string[];
  disclaimer: string;
}

export interface LegalHeuristics {
  licenseSignals: LicenseSignals;
  provenanceSignals: ProvenanceSignals;
  tradeSecretExposure: TradeSecretExposure;
  noveltyIndicators: NoveltyIndicators;
  overallDisclaimer: string;
}

// Backwards-compatible DefensibilityScore mapped to RiskBand
export interface DefensibilityScore {
  category: string;
  score: number; // 0 - 100
  verdict: 'HIGH' | 'MEDIUM' | 'EMERGING';
  riskBand?: RiskBand;
  description: string;
  evidence?: string[];
  disclaimer?: string;
}

export interface AnalyzedFile {
  path: string;
  loc: number;
  sizeBytes: number;
  kind: string;
  complexityScore: number;
  features: {
    invariants: string[];
    exportedSymbols: string[];
  };
  previewSnippet?: string;
}

export interface AssetObject {
  id: string;
  name: string;
  source_type: AssetSourceType;
  primarykind: PrimaryKind;
  languages: string[];
  files: AnalyzedFile[];
  claims: string[];
  size_metrics: SizeMetrics;
  confidence: number;
  certainty: CertaintyLevel;
  features: {
    capabilities: string[];
    claims: string[];
    architecturePatterns: string[];
    securityFeatures: string[];
  };
  legalHeuristics: LegalHeuristics;
  defensibility: DefensibilityScore[];
  created_at: string;
}

export interface ReplacementCost {
  estimatedReplacementCostUsd: number;
  inputs: {
    loc: number;
    complexityIndex: number;
    baseRatePerLoc: number;
    complexityMultiplier: number;
  };
  evidenceLevel: 'EVIDENCE_BASED' | 'INSUFFICIENT';
}

export interface ValuationBreakdown {
  mode: 'EVIDENCE_BASED' | 'INSUFFICIENT_EVIDENCE';
  statusMessage?: string;
  certainty: CertaintyLevel;
  rawConfidence: number;
  valueScore: number; // 0-10
  estimatedAnnualValueUsd: number;
  confidenceInterval: {
    minUsd: number;
    maxUsd: number;
  };
  estimatedTamUsd: number;
  replacementCost: ReplacementCost;
  keyDrivers: string[];
  evidenceAudit: {
    measuredLoc: number;
    measuredFileCount: number;
    measuredFunctions: number;
    measuredClassesOrStructs: number;
    cyclomaticIndex: number;
    primaryKind: PrimaryKind;
  };
  disclaimer: string;
}

export interface LicensingTier {
  id: string;
  name: string;
  tagline: string;
  royaltyModel: 'percentage_of_savings' | 'per_node_per_month' | 'per_device_oem' | 'dual_source_royalty';
  rateDescription: string;
  basePriceUsd?: number;
  targetCustomer: string;
  slaLevel: string;
  includedFeatures: string[];
  evidenceTierLabel?: string;
  evidenceTierReason?: string;
}

export interface ContractClause {
  id: string;
  title: string;
  category: 'Grant' | 'Royalty' | 'Audit' | 'IP Protection' | 'Indemnity' | 'Termination';
  summary: string;
  content: string;
  mandatory: boolean;
}

export interface ContractSpec {
  contractType: string;
  title: string;
  clauses: ContractClause[];
  fullDraftMarkdown: string;
}

export interface OutreachTemplate {
  archetypeId: string;
  contactPersona: string;
  subjectLine: string;
  emailBody: string;
  technicalBrief?: string;
  disclaimer: string;
}

export type BuyerSource = 
  | 'hubspot_crm' 
  | 'salesforce_crm' 
  | 'manual_entry' 
  | 'csv_import' 
  | 'consented_marketplace';

export interface BuyerContact {
  name: string;
  title: string;
  emailPlaceholder: string;
  department?: string;
  isPrimary?: boolean;
}

export interface BuyerSpendProfile {
  maxAnnualSoftwareSpendUsd: number;
  typicalDealCycleMonths: number;
  procurementTier: 'TIER_1_ENTERPRISE' | 'TIER_2_MIDMARKET' | 'STRATEGIC_HYPERSCALE';
}

export interface BuyerRecord {
  id: string;
  companyName: string;
  domain: string;
  segment: string;
  annualRevenueBand: string;
  engineeringHeadcount: number;
  techStack: string[];
  preferredLicensingModels: ('percentage_of_savings' | 'per_node_per_month' | 'per_device_oem' | 'dual_source_royalty')[];
  spendProfile: BuyerSpendProfile;
  contacts: BuyerContact[];
  source: BuyerSource;
  consentVerified: boolean;
  governanceStatus: 'APPROVED' | 'REQUIRES_APPROVAL' | 'RESTRICTED';
  approvedIndustries: string[];
  blockedIndustries: string[];
  notes?: string;
  registeredAt: string;
}

export interface ArchetypeTechnicalProfile {
  requiredCapabilities: string[];
  stackCompatibility: string[];
  minimumLocComplexity: number;
}

export interface ArchetypeEconomicProfile {
  dealSizeBandUsd: {
    min: number;
    max: number;
  };
  preferredRoyaltyModels: string[];
  typicalAnnualSavingsUsd: number;
}

export interface ArchetypeComplianceConstraints {
  allowedIndustries: string[];
  blockedIndustries: string[];
  minimumGovernanceTier: 'STANDARD' | 'RESTRICTED_EXPORT' | 'HIGH_ASSURANCE';
  requiresHumanApprovalThresholdUsd: number;
}

export interface BuyerArchetype {
  id: string;
  label: string; // e.g. "Cost‑Compression Cloud Buyer"
  archetypeName: string; // Descriptive archetype profile
  companyName: string; // Kept for backwards compatibility, equal to label
  sector: string;
  fitScore: number; // 0-100 heuristic
  technicalFitProfile: ArchetypeTechnicalProfile;
  economicProfile: ArchetypeEconomicProfile;
  complianceConstraints: ArchetypeComplianceConstraints;
  annualSavingsEstimateUsd: number;
  recommendedTier: string;
  contactPersona: string; // e.g. "VP Platform Engineering"
  isHypothetical: true; // strictly hardcoded
  notes: string; // "Hypothetical archetype, not a real company."
  primaryPainPoint: string;
  matchedCapabilities: string[];
  evidenceTriggers: string[]; // specific AST/capability evidence items that generated this archetype
  suggestedDealSizeUsd: number;
  pitchAngle: string;
  outreachTemplate: OutreachTemplate;
  outreachSequence: {
    emailSubject: string;
    emailBody: string;
    technicalBrief: string;
  };
}

export interface ComplianceFlag {
  flag: string;
  severity: 'INFO' | 'WARNING' | 'BLOCKER';
  description: string;
  remediationNote?: string;
}

export interface RealBuyerMatch {
  id: string;
  buyerRecord: BuyerRecord;
  archetypeId: string;
  archetypeLabel: string;
  fitScore: number; // 0 - 100
  stackOverlapScore: number; // 0 - 100
  capabilityFitScore: number; // 0 - 100
  budgetFitScore: number; // 0 - 100
  recommendedTier: string;
  suggestedOfferPriceUsd: number;
  matchedCapabilities: string[];
  matchedTechStack: string[];
  complianceFlags: ComplianceFlag[];
  requiresHumanApproval: boolean;
  approvalStatus: 'PENDING_REVIEW' | 'HUMAN_APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  auditTraceId: string;
  notes?: string;
}

// Backwards-compatible alias
export type BuyerMatch = BuyerArchetype;

export interface MatchedBuyerSet {
  archetypeMatches: {
    archetype: BuyerArchetype;
    matchedRealBuyers: RealBuyerMatch[];
    totalMatchedCount: number;
  }[];
  totalRealBuyersEvaluated: number;
  totalApprovedMatches: number;
  totalPendingApprovalMatches: number;
  governancePolicyApplied: GovernancePolicy;
  evaluatedAt: string;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  blockedIndustries: string[];
  minimumDealSizeUsd: number;
  humanApprovalThresholdUsd: number;
  sensitiveSegmentsRequiringReview: string[];
  enforceConsentVerification: boolean;
  prohibitedLicenseCombinations: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'ARCHETYPE_GENERATED' | 'REAL_BUYER_MATCHED' | 'MATCH_APPROVED' | 'MATCH_REJECTED' | 'BUYER_REGISTERED' | 'CSV_IMPORTED';
  actor: string;
  details: string;
  traceId: string;
  metadata?: Record<string, any>;
}

export interface LicensingProfile {
  asset: AssetObject;
  valuation: ValuationBreakdown;
  useCases: string[];
  licensingTiers: LicensingTier[];
  contracts: Record<string, ContractSpec>;
  buyerArchetypes: BuyerArchetype[];
  buyerMatches: BuyerArchetype[]; // Alias for backwards compatibility
  realBuyerMatches?: RealBuyerMatch[];
  matchedBuyerSet?: MatchedBuyerSet;
  auditTrail?: AuditLogEntry[];
  buyerModelNature: 'hypothetical_archetype_generator';
  realLeadDiscovery: false;
  legalModelNature: 'heuristic_risk_indicators_only';
  legalAdvice: false;
  legalDisclaimer: string;
  tcsTraceId: string;
}
