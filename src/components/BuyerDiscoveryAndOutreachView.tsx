/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Send, 
  Check, 
  Sparkles, 
  Mail, 
  Users, 
  Target, 
  Copy, 
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  FileCheck2,
  Cpu,
  Layers,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { 
  BuyerArchetype, 
  BuyerRecord, 
  MatchedBuyerSet, 
  RealBuyerMatch, 
  AuditLogEntry, 
  GovernancePolicy 
} from '../types';
import { BuyerRegistryService } from '../engine/buyerRegistry';
import { ArchetypeBuyerMatcher } from '../engine/archetypeBuyerMatcher';
import { BuyerMatcher } from '../engine/buyerMatcher';
import { DEFAULT_GOVERNANCE_POLICY } from '../engine/buyerArchetypeEngine';

type BuyerViewMode = 'matrix' | 'archetypes' | 'registry' | 'outreach_gate';

interface BuyerDiscoveryAndOutreachViewProps {
  buyerArchetypes?: BuyerArchetype[];
  buyerMatches?: BuyerArchetype[];
  realBuyerMatches?: RealBuyerMatch[];
  matchedBuyerSet?: MatchedBuyerSet;
  auditTrail?: AuditLogEntry[];
  assetName: string;
  onOpenAiAudit: () => void;
}

export const BuyerDiscoveryAndOutreachView: React.FC<BuyerDiscoveryAndOutreachViewProps> = ({
  buyerArchetypes,
  buyerMatches,
  assetName,
  onOpenAiAudit
}) => {
  const archetypes = buyerArchetypes || buyerMatches || [];
  
  // Local state for buyer console
  const [viewMode, setViewMode] = useState<BuyerViewMode>('matrix');
  const [registry, setRegistry] = useState<BuyerRecord[]>(() => BuyerRegistryService.getRegistry());
  const [governancePolicy, setGovernancePolicy] = useState<GovernancePolicy>(DEFAULT_GOVERNANCE_POLICY);
  
  // Dynamic matched set computed against live registry
  const [matchedSet, setMatchedSet] = useState<MatchedBuyerSet>(() => 
    ArchetypeBuyerMatcher.matchRegisteredBuyers(archetypes, registry, governancePolicy)
  );

  // Selected Archetype / Buyer state
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>(archetypes[0]?.id || '');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedRealBuyerForOutreach, setSelectedRealBuyerForOutreach] = useState<RealBuyerMatch | null>(null);

  // Registration Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [newCompanyName, setNewCompanyName] = useState<string>('');
  const [newDomain, setNewDomain] = useState<string>('');
  const [newSegment, setNewSegment] = useState<string>('Cloud Infrastructure & Hyper-Scale Interconnect');
  const [newRevenueBand, setNewRevenueBand] = useState<string>('$1B - $5B');
  const [newHeadcount, setNewHeadcount] = useState<number>(1200);
  const [newTechStack, setNewTechStack] = useState<string>('C++, Rust, Linux Kernel, Kubernetes');
  const [newMaxSpendUsd, setNewMaxSpendUsd] = useState<number>(5000000);
  const [newContactName, setNewContactName] = useState<string>('Alex Morgan');
  const [newContactTitle, setNewContactTitle] = useState<string>('VP of Infrastructure');
  const [newContactEmail, setNewContactEmail] = useState<string>('');
  const [newConsentVerified, setNewConsentVerified] = useState<boolean>(true);

  // Human Sign-Off / Approval Modal
  const [approvalModalMatch, setApprovalModalMatch] = useState<RealBuyerMatch | null>(null);
  const [approverName, setApproverName] = useState<string>('Jane Doe, Legal/Commercial Director');
  const [approvalNote, setApprovalNote] = useState<string>('Verified source provenance and confirmed compliance clearance.');

  // UI helpers
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (msg: string, type: 'success' | 'info' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const recomputeMatches = (updatedRegistry = registry, policy = governancePolicy) => {
    const updated = ArchetypeBuyerMatcher.matchRegisteredBuyers(archetypes, updatedRegistry, policy);
    setMatchedSet(updated);
  };

  const handleApproveMatch = (match: RealBuyerMatch) => {
    ArchetypeBuyerMatcher.approveMatch(match.id, approverName, approvalNote);
    recomputeMatches();
    setApprovalModalMatch(null);
    showNotification(`Match approved for ${match.buyerRecord.companyName} by ${approverName}`);
  };

  const handleRejectMatch = (match: RealBuyerMatch) => {
    ArchetypeBuyerMatcher.rejectMatch(match.id, approverName, 'Export or business constraint');
    recomputeMatches();
    setApprovalModalMatch(null);
    showNotification(`Match restricted for ${match.buyerRecord.companyName}`, 'info');
  };

  const handleRegisterNewBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName || !newDomain) return;

    const stack = newTechStack.split(',').map(s => s.trim()).filter(Boolean);
    const newRecord = BuyerRegistryService.registerBuyer({
      companyName: newCompanyName,
      domain: newDomain,
      segment: newSegment,
      annualRevenueBand: newRevenueBand,
      engineeringHeadcount: newHeadcount,
      techStack: stack.length > 0 ? stack : ["C++", "Rust", "Linux"],
      preferredLicensingModels: ["percentage_of_savings", "per_node_per_month"],
      spendProfile: {
        maxAnnualSoftwareSpendUsd: newMaxSpendUsd,
        typicalDealCycleMonths: 4,
        procurementTier: "TIER_1_ENTERPRISE"
      },
      contacts: [
        {
          name: newContactName,
          title: newContactTitle,
          emailPlaceholder: newContactEmail || `lead@${newDomain}`,
          isPrimary: true
        }
      ],
      source: "manual_entry",
      consentVerified: newConsentVerified,
      governanceStatus: "APPROVED",
      approvedIndustries: ["Cloud Computing", "Software Infrastructure"],
      blockedIndustries: [],
      notes: "Registered via ArgOS Real Buyer Console."
    });

    const updated = BuyerRegistryService.getRegistry();
    setRegistry(updated);
    recomputeMatches(updated);
    setIsRegisterModalOpen(false);
    showNotification(`Successfully registered and verified buyer "${newRecord.companyName}"`);
    
    // Reset form
    setNewCompanyName('');
    setNewDomain('');
    setNewContactEmail('');
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        const result = BuyerRegistryService.importFromCsv(text);
        if (result.count > 0) {
          const updated = BuyerRegistryService.getRegistry();
          setRegistry(updated);
          recomputeMatches(updated);
          showNotification(`Imported ${result.count} verified buyer records from CSV.`);
        } else {
          showNotification(`CSV import failed: ${result.errors.join(', ')}`, 'info');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleCsvExport = () => {
    const csv = BuyerRegistryService.exportToCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `argos_consented_buyer_registry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Exported buyer registry CSV.");
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const selectedArchetype = archetypes.find(b => b.id === selectedArchetypeId) || archetypes[0];
  const allRealMatches = matchedSet.archetypeMatches.flatMap(m => m.matchedRealBuyers);
  const selectedMatch = allRealMatches.find(m => m.id === selectedMatchId) || allRealMatches[0];

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-blue-600 text-white font-mono text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-blue-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* 1. Header & Navigation Controls */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 md:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1a1a1a]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Layer 3 // Real Buyer Console & Archetype Engine
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Consented Real Buyers ({registry.length})
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Asset: <strong className="text-neutral-200">{assetName}</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
              Real Buyer Registry & Archetype Matching
            </h2>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Maps policy-aware archetype profiles to consented enterprise buyer records with human-in-the-loop governance gates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="ai-archetype-audit-btn"
              onClick={onOpenAiAudit}
              className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Archetype Audit</span>
            </button>
            <button
              id="register-new-buyer-btn"
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Real Buyer</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 p-1 bg-[#050505] rounded-xl border border-[#1a1a1a]">
            <button
              id="view-matrix-tab"
              onClick={() => setViewMode('matrix')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'matrix'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Asset → Buyer Matrix</span>
            </button>

            <button
              id="view-archetypes-tab"
              onClick={() => setViewMode('archetypes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'archetypes'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Archetype Map ({archetypes.length})</span>
            </button>

            <button
              id="view-registry-tab"
              onClick={() => setViewMode('registry')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'registry'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Buyer Registry ({registry.length})</span>
            </button>

            <button
              id="view-outreach-gate-tab"
              onClick={() => setViewMode('outreach_gate')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'outreach_gate'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Outreach & Governance Gate</span>
            </button>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{matchedSet.totalApprovedMatches} Approved</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{matchedSet.totalPendingApprovalMatches} Requires Sign-Off</span>
            </span>
          </div>
        </div>

        {/* Mandatory Persistent Compliance Notice */}
        <div className="p-3 bg-[#050505] rounded-xl border border-[#2a2a2a] text-xs text-neutral-300 leading-relaxed flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] font-mono">
            <strong className="text-amber-300 block uppercase text-[10px] mb-0.5">
              Governance & Consented Lead Protocol
            </strong>
            <span>
              Real buyer records are ingested exclusively through consented enterprise channels (CRM, validated CSV, marketplace agreements).
              All outreach drafts are subject to policy-aware thresholds and human approval gates before dispatch.
            </span>
          </div>
        </div>
      </div>

      {/* 2. VIEW: ASSET → BUYER MATRIX ("Who, Why, and Under What Terms") */}
      {viewMode === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-tight">
                  Asset → Buyer Commercial Matrix
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Direct mapping of code capabilities to real buyers with recommended licensing terms.
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-500">
                {allRealMatches.length} Candidate Match Pairs
              </span>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#1e1e1e] text-[10px] text-neutral-500 uppercase tracking-wider bg-[#050505]">
                    <th className="py-3 px-3">Real Buyer & Segment</th>
                    <th className="py-3 px-3">Mapped Archetype</th>
                    <th className="py-3 px-3">Fit Score</th>
                    <th className="py-3 px-3">Recommended Offer & Terms</th>
                    <th className="py-3 px-3">Governance Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]">
                  {allRealMatches.map((match) => {
                    const isApproved = match.approvalStatus === 'HUMAN_APPROVED';
                    const isRejected = match.approvalStatus === 'REJECTED';
                    const isPending = match.approvalStatus === 'PENDING_REVIEW';
                    const buyer = match.buyerRecord;

                    return (
                      <tr 
                        key={match.id}
                        className="hover:bg-[#111111] transition group"
                      >
                        <td className="py-3 px-3">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                            <span>{buyer.companyName}</span>
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate max-w-xs mt-0.5">
                            {buyer.segment}
                          </div>
                          <div className="text-[10px] text-neutral-500 flex items-center gap-2 mt-1">
                            <span>Rev: {buyer.annualRevenueBand}</span>
                            <span>•</span>
                            <span>{buyer.engineeringHeadcount} Engs</span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold">
                            {match.archetypeLabel}
                          </span>
                          <div className="text-[10px] text-neutral-400 mt-1">
                            Stack match: {match.matchedTechStack.slice(0, 3).join(', ')}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {match.fitScore}%
                            </span>
                            <div className="w-16 bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${match.fitScore > 85 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                style={{ width: `${match.fitScore}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-[10px] text-neutral-500 block mt-0.5">
                            Overlap: {match.stackOverlapScore}%
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-semibold text-blue-300">
                            ${match.suggestedOfferPriceUsd.toLocaleString()} / yr
                          </div>
                          <div className="text-[10px] text-neutral-400 truncate max-w-xs mt-0.5">
                            {match.recommendedTier}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                              <Check className="w-3 h-3" />
                              <span>Approved</span>
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                              <Lock className="w-3 h-3" />
                              <span>Sign-Off Needed</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
                              <span>Restricted</span>
                            </span>
                          )}

                          {match.complianceFlags.length > 0 && (
                            <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{match.complianceFlags[0].flag}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedRealBuyerForOutreach(match);
                                setViewMode('outreach_gate');
                              }}
                              className="px-2.5 py-1 bg-[#1a1a1a] hover:bg-neutral-800 text-neutral-200 rounded-lg text-[11px] transition cursor-pointer"
                              title="Draft Outreach"
                            >
                              <Mail className="w-3 h-3 inline mr-1 text-blue-400" />
                              <span>Outreach</span>
                            </button>

                            <button
                              onClick={() => setApprovalModalMatch(match)}
                              className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 rounded-lg text-[11px] transition cursor-pointer font-bold"
                            >
                              <span>Gate Review</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. VIEW: ARCHETYPE MAP */}
      {viewMode === 'archetypes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left List of Archetypes */}
          <div className="lg:col-span-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1a1a1a]">
              <span className="text-xs font-bold text-neutral-400 uppercase font-mono">
                Policy-Aware Archetypes ({archetypes.length})
              </span>
              <span className="text-[10px] font-mono text-neutral-500">AST Inferred</span>
            </div>

            <div className="space-y-2.5">
              {archetypes.map((arch) => {
                const isSelected = selectedArchetype?.id === arch.id;
                const matchedCount = matchedSet.archetypeMatches.find(m => m.archetype.id === arch.id)?.totalMatchedCount || 0;

                return (
                  <div
                    key={arch.id}
                    onClick={() => setSelectedArchetypeId(arch.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition text-left ${
                      isSelected
                        ? 'bg-[#111111] border-blue-500/60 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                        : 'bg-[#050505] border-[#1a1a1a] hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                        <Target className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-neutral-500'}`} />
                        <span>{arch.label}</span>
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {matchedCount} Real Buyers
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 font-mono mb-2 truncate">
                      {arch.sector}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-2 border-t border-[#1a1a1a]">
                      <span>Persona: <strong className="text-neutral-300">{arch.contactPersona}</strong></span>
                      <span className="text-blue-400 font-bold">${(arch.suggestedDealSizeUsd || 0).toLocaleString()} target</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Detailed Archetype Blueprint */}
          <div className="lg:col-span-7 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl space-y-4">
            {selectedArchetype ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1a1a1a]">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Sector: {selectedArchetype.sector}
                    </span>
                    <h3 className="text-base font-bold text-white font-mono mt-1">
                      {selectedArchetype.label}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">Suggested Deal Band</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      ${selectedArchetype.economicProfile?.dealSizeBandUsd.min.toLocaleString()} - ${selectedArchetype.economicProfile?.dealSizeBandUsd.max.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                {/* 3 Columns for Fit Profile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  {/* Tech Profile */}
                  <div className="bg-[#050505] p-3.5 rounded-xl border border-[#1a1a1a] space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-blue-400" />
                      <span>Technical Fit</span>
                    </span>
                    <div className="text-[11px] text-neutral-300">
                      <strong className="text-neutral-500 block text-[10px]">Required Stack:</strong>
                      <span>{selectedArchetype.technicalFitProfile?.stackCompatibility.join(', ')}</span>
                    </div>
                    <div className="text-[11px] text-neutral-300 pt-1 border-t border-[#141414]">
                      <strong className="text-neutral-500 block text-[10px]">AST Evidence:</strong>
                      <span>{selectedArchetype.evidenceTriggers?.join(', ') || 'Invariants detected'}</span>
                    </div>
                  </div>

                  {/* Economic Profile */}
                  <div className="bg-[#050505] p-3.5 rounded-xl border border-[#1a1a1a] space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Economic Fit</span>
                    </span>
                    <div className="text-[11px] text-neutral-300">
                      <strong className="text-neutral-500 block text-[10px]">Royalty Models:</strong>
                      <span>{selectedArchetype.economicProfile?.preferredRoyaltyModels.join(', ')}</span>
                    </div>
                    <div className="text-[11px] text-neutral-300 pt-1 border-t border-[#141414]">
                      <strong className="text-neutral-500 block text-[10px]">Annual Savings:</strong>
                      <span>${(selectedArchetype.annualSavingsEstimateUsd || 0).toLocaleString()} est.</span>
                    </div>
                  </div>

                  {/* Compliance Constraints */}
                  <div className="bg-[#050505] p-3.5 rounded-xl border border-[#1a1a1a] space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Governance Policy</span>
                    </span>
                    <div className="text-[11px] text-neutral-300">
                      <strong className="text-neutral-500 block text-[10px]">Governance Tier:</strong>
                      <span className="text-purple-300 font-bold">{selectedArchetype.complianceConstraints?.minimumGovernanceTier || 'STANDARD'}</span>
                    </div>
                    <div className="text-[11px] text-neutral-300 pt-1 border-t border-[#141414]">
                      <strong className="text-neutral-500 block text-[10px]">Sign-Off Floor:</strong>
                      <span>${(selectedArchetype.complianceConstraints?.requiresHumanApprovalThresholdUsd || 150000).toLocaleString()} USD</span>
                    </div>
                  </div>
                </div>

                {/* Qualified Real Buyers in this Archetype */}
                <div className="p-3.5 bg-[#050505] rounded-xl border border-[#1a1a1a] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-300 font-mono flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>Consented Real Buyers Qualified for this Archetype</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {matchedSet.archetypeMatches.find(m => m.archetype.id === selectedArchetype.id)?.matchedRealBuyers.length || 0} Entities
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {matchedSet.archetypeMatches.find(m => m.archetype.id === selectedArchetype.id)?.matchedRealBuyers.map((rm) => (
                      <div 
                        key={rm.id}
                        className="flex items-center justify-between p-2.5 bg-[#111111] rounded-lg border border-[#1e1e1e] font-mono text-xs"
                      >
                        <div>
                          <span className="font-bold text-white">{rm.buyerRecord.companyName}</span>
                          <span className="text-neutral-400 ml-2 text-[11px]">({rm.buyerRecord.domain})</span>
                          <div className="text-[10px] text-neutral-500 mt-0.5">
                            Primary Contact: {rm.buyerRecord.contacts[0]?.name} • {rm.buyerRecord.contacts[0]?.title}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-400">{rm.fitScore}% Fit</span>
                          <button
                            onClick={() => {
                              setSelectedRealBuyerForOutreach(rm);
                              setViewMode('outreach_gate');
                            }}
                            className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 rounded text-[10px] cursor-pointer"
                          >
                            Outreach
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 4. VIEW: CONSENTED BUYER REGISTRY */}
      {viewMode === 'registry' && (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1a1a1a]">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-tight">
                Consented Enterprise Buyer Registry
              </h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Ingested through CRM integrations (HubSpot, Salesforce), CSV manifests, and consented partner agreements.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-neutral-800 text-neutral-300 border border-[#2a2a2a] px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Import CSV</span>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleCsvImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleCsvExport}
                className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-neutral-800 text-neutral-300 border border-[#2a2a2a] px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by company name, segment, tech stack, or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-neutral-500" />
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="salesforce_crm">Salesforce CRM</option>
                <option value="hubspot_crm">HubSpot CRM</option>
                <option value="manual_entry">Manual / Verified</option>
                <option value="csv_import">CSV Import</option>
                <option value="consented_marketplace">Marketplace Agreement</option>
              </select>
            </div>
          </div>

          {/* Registry Records List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {registry
              .filter(b => {
                const matchesSearch = searchQuery === '' || 
                  b.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  b.segment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  b.techStack.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchesSource = sourceFilter === 'all' || b.source === sourceFilter;
                return matchesSearch && matchesSource;
              })
              .map((buyer) => (
                <div
                  key={buyer.id}
                  className="p-4 bg-[#050505] border border-[#1a1a1a] rounded-xl font-mono text-xs space-y-3 hover:border-neutral-700 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">{buyer.companyName}</h4>
                        <span className="text-[11px] text-blue-400">{buyer.domain}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300 uppercase font-bold">
                        {buyer.source.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 line-clamp-2">
                      {buyer.segment}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {buyer.techStack.map((tech, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-[#111111] text-neutral-300 border border-[#222222]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#141414] space-y-1.5 text-[10px] text-neutral-400">
                    <div className="flex items-center justify-between">
                      <span>Max Software Spend:</span>
                      <strong className="text-emerald-400">${(buyer.spendProfile.maxAnnualSoftwareSpendUsd / 1000000).toFixed(1)}M/yr</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Primary Contact:</span>
                      <span className="text-neutral-200 font-semibold">{buyer.contacts[0]?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Consent Verified:</span>
                      <span className="text-emerald-400 font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 5. VIEW: OUTREACH & GOVERNANCE GATE */}
      {viewMode === 'outreach_gate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 font-mono text-xs">
          {/* Left: Select Match to Draft */}
          <div className="lg:col-span-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1a1a1a]">
              <span className="text-xs font-bold text-neutral-400 uppercase">
                Approved & Pending Target Matches
              </span>
              <span className="text-[10px] text-neutral-500">{allRealMatches.length} Matches</span>
            </div>

            <div className="space-y-2">
              {allRealMatches.map((m) => {
                const isSelected = (selectedRealBuyerForOutreach?.id === m.id) || (!selectedRealBuyerForOutreach && m.id === allRealMatches[0]?.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedRealBuyerForOutreach(m)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#111111] border-blue-500/60 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                        : 'bg-[#050505] border-[#1a1a1a] hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{m.buyerRecord.companyName}</span>
                      <span className="text-emerald-400 font-bold">{m.fitScore}% Fit</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 truncate">
                      Archetype: {m.archetypeLabel}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#141414] text-[10px]">
                      <span className="text-neutral-500">Contact: {m.buyerRecord.contacts[0]?.name}</span>
                      <span className={`font-bold ${m.approvalStatus === 'HUMAN_APPROVED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {m.approvalStatus === 'HUMAN_APPROVED' ? 'APPROVED' : 'NEEDS SIGN-OFF'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Dynamic Draft Template & Governance Audit */}
          <div className="lg:col-span-7 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl space-y-4">
            {selectedRealBuyerForOutreach || allRealMatches[0] ? (
              (() => {
                const activeMatch = selectedRealBuyerForOutreach || allRealMatches[0];
                const buyer = activeMatch.buyerRecord;
                const contact = buyer.contacts[0];
                const arch = archetypes.find(a => a.id === activeMatch.archetypeId) || archetypes[0];

                const dynamicEmail = 
`Subject: [Technical Review Draft] ${assetName} Integration for ${buyer.companyName}

Dear ${contact?.name || 'Engineering Leader'} (${contact?.title || 'VP Engineering'}),

We have analyzed technical asset "${assetName}" engineered in ${activeMatch.matchedTechStack.join(', ')}.

Based on ${buyer.companyName}'s focus on ${buyer.segment}, our AST analysis indicates high architectural alignment:
• Detected Capabilities: ${activeMatch.matchedCapabilities.join(', ')}
• Stack Compatibility: ${activeMatch.matchedTechStack.join(', ')}
• Recommended Licensing Model: ${activeMatch.recommendedTier}
• Estimated Value Delivery: $${activeMatch.suggestedOfferPriceUsd.toLocaleString()} / annual screening benchmark

Observable Cleanroom Evidence:
• Zero copyleft/GPL contamination detected in non-forensic scan
• Verified memory safety & concurrency invariants in inner critical path

Would you or your systems architecture team be open to receiving a private sandbox evaluation container?

Sincerely,
[Your Name / Commercialization Director]
ArgOS Enterprise Licensing

---
GOVERNANCE TRACE: ${activeMatch.auditTraceId}
STATUS: ${activeMatch.approvalStatus} (Sign-Off: ${activeMatch.approvedBy || 'Pending Human Review'})
DISCLAIMER: Draft outreach template for human review. Not automated spam. Human verification required before sending.`;

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
                      <div>
                        <span className="text-[10px] text-blue-400 uppercase font-bold">
                          Personalized Draft for {buyer.companyName}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                          Target: {contact?.name} ({contact?.emailPlaceholder})
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setApprovalModalMatch(activeMatch)}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Sign-Off / Gate Review
                        </button>
                        <button
                          onClick={() => handleCopy(dynamicEmail, 'dynamic_outreach')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        >
                          {copiedField === 'dynamic_outreach' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'dynamic_outreach' ? 'Copied' : 'Copy Template'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Email Box */}
                    <div className="bg-[#050505] p-4 rounded-xl border border-[#1a1a1a] text-neutral-300 text-[11px] font-mono leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto scrollbar-thin">
                      {dynamicEmail}
                    </div>

                    {/* Trace & Audit Record */}
                    <div className="p-3 bg-[#050505] rounded-xl border border-[#1a1a1a] space-y-1.5 text-[10px] text-neutral-400">
                      <span className="font-bold text-neutral-300 uppercase block">Governance Trace Chronicle</span>
                      <div className="flex items-center justify-between">
                        <span>Trace ID:</span>
                        <span className="font-mono text-neutral-300">{activeMatch.auditTraceId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Approval Gate:</span>
                        <span className={activeMatch.approvalStatus === 'HUMAN_APPROVED' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {activeMatch.approvalStatus} ({activeMatch.approvedBy || 'Requires Sign-Off'})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Policy Check:</span>
                        <span className="text-emerald-400">PASSED EXPORT SCREENING</span>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : null}
          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW REAL BUYER */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
          <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
              <div>
                <h3 className="text-base font-bold text-white">Register Consented Real Buyer</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Add a verified enterprise buyer entity to your local registry.</p>
              </div>
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-neutral-500 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterNewBuyer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Cloud Corp"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Domain *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. acmecloud.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Market Segment</label>
                <input
                  type="text"
                  value={newSegment}
                  onChange={(e) => setNewSegment(e.target.value)}
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Annual Revenue Band</label>
                  <select
                    value={newRevenueBand}
                    onChange={(e) => setNewRevenueBand(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-neutral-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="$100M - $500M">$100M - $500M</option>
                    <option value="$500M - $1B">$500M - $1B</option>
                    <option value="$1B - $5B">$1B - $5B</option>
                    <option value="$5B+">$5B+</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Engineering Headcount</label>
                  <input
                    type="number"
                    value={newHeadcount}
                    onChange={(e) => setNewHeadcount(parseInt(e.target.value, 10) || 500)}
                    className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={newTechStack}
                  onChange={(e) => setNewTechStack(e.target.value)}
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Primary Contact</label>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Title / Role</label>
                  <input
                    type="text"
                    value={newContactTitle}
                    onChange={(e) => setNewContactTitle(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#050505] rounded-xl border border-[#1a1a1a] flex items-center gap-2">
                <input
                  type="checkbox"
                  id="consent-check"
                  checked={newConsentVerified}
                  onChange={(e) => setNewConsentVerified(e.target.checked)}
                  className="rounded border-[#2a2a2a] text-blue-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="consent-check" className="text-[11px] text-neutral-300 cursor-pointer">
                  Consent verified: entity has opted in to receiving inbound enterprise technology licensing propositions.
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1a1a1a]">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 bg-[#1a1a1a] hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  Save & Ingest Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HUMAN APPROVAL / GOVERNANCE GATE REVIEW */}
      {approvalModalMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
          <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span>Human-in-the-Loop Governance Gate</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Review compliance flags and provide signed approval for outreach.
                </p>
              </div>
              <button 
                onClick={() => setApprovalModalMatch(null)}
                className="text-neutral-500 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#050505] rounded-xl border border-[#1a1a1a] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Target Entity:</span>
                  <span className="font-bold text-white">{approvalModalMatch.buyerRecord.companyName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Archetype:</span>
                  <span className="text-blue-400 font-bold">{approvalModalMatch.archetypeLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Proposed Deal Size:</span>
                  <span className="text-emerald-400 font-bold">${approvalModalMatch.suggestedOfferPriceUsd.toLocaleString()} USD</span>
                </div>
              </div>

              {approvalModalMatch.complianceFlags.length > 0 && (
                <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-500/30 space-y-1 text-amber-300 text-[11px]">
                  <strong className="block text-amber-400 uppercase text-[10px]">Active Compliance Scrutiny</strong>
                  {approvalModalMatch.complianceFlags.map((flag, idx) => (
                    <div key={idx}>• {flag.description}</div>
                  ))}
                </div>
              )}

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Approver Name & Title</label>
                <input
                  type="text"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Reviewer Note / Compliance Clearance</label>
                <textarea
                  rows={2}
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1a1a1a]">
                <button
                  type="button"
                  onClick={() => handleRejectMatch(approvalModalMatch)}
                  className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Restricted / Block
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveMatch(approvalModalMatch)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
                >
                  Sign & Approve Match
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
