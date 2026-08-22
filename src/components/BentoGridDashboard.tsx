/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Cpu, 
  DollarSign, 
  Users, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Layers,
  TrendingUp,
  Activity,
  Scale,
  ShieldAlert
} from 'lucide-react';
import { LicensingProfile } from '../types';
import { TabType } from './Header';

interface BentoGridDashboardProps {
  profile: LicensingProfile;
  onNavigateTab: (tab: TabType) => void;
  onOpenAiAudit: () => void;
}

export const BentoGridDashboard: React.FC<BentoGridDashboardProps> = ({
  profile,
  onNavigateTab,
  onOpenAiAudit
}) => {
  const { asset, valuation, licensingTiers, buyerMatches } = profile;
  const isInsufficient = valuation.mode === 'INSUFFICIENT_EVIDENCE';

  // Real pipeline calculations derived from the analyzed asset
  const pipelineValueUsd = buyerMatches.reduce((sum, b) => sum + (b.suggestedDealSizeUsd || 0), 0);
  const avgFitScore = buyerMatches.length > 0
    ? (buyerMatches.reduce((sum, b) => sum + b.fitScore, 0) / buyerMatches.length).toFixed(1)
    : '90.0';

  const getCertaintyBadge = (certainty: string) => {
    switch (certainty) {
      case 'HIGH': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MEDIUM': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'LOW': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Real Analyzed Asset Status */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Assessed Technical Asset
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getCertaintyBadge(asset.certainty)}`}>
                Certainty: {asset.certainty}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {asset.size_metrics.loc.toLocaleString()} LOC • {asset.size_metrics.file_count} Files • {asset.languages.join(', ')}
              </span>
            </div>
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-tight mt-0.5">
              {asset.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            id="bento-run-audit-btn"
            onClick={onOpenAiAudit}
            className="flex items-center gap-1.5 bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Commercial Audit</span>
          </button>
          <button
            id="bento-view-contracts-btn"
            onClick={() => onNavigateTab('contracts')}
            className="flex items-center gap-1.5 bg-[#111111] hover:bg-[#161616] text-neutral-200 border border-[#1a1a1a] px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>View MLA Drafts</span>
          </button>
        </div>
      </div>

      {/* Main 12-Column High-Density Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* ------------------------------------------------------------- */}
        {/* TILE 1: ASSET INTELLIGENCE & INVARIANTS (Span 8 cols)         */}
        {/* ------------------------------------------------------------- */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl flex flex-col justify-between hover:border-[#2a2a2a] transition">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase font-mono">
                  Layer 1 // AST Extraction
                </span>
                <h3 className="text-sm font-bold text-white font-mono uppercase mt-0.5">
                  Extracted Architectural Profile
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-neutral-400 bg-[#050505] px-2.5 py-1 rounded-lg border border-[#1a1a1a]">
                  Complexity Index: <strong className="text-white">{asset.size_metrics.cyclomatic_index.toFixed(1)}/10</strong>
                </span>
              </div>
            </div>

            {/* Dynamic Claims derived from code */}
            <div className="space-y-2 mb-4">
              {asset.claims.map((claim, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300 font-mono bg-[#050505] p-2.5 rounded-xl border border-[#1a1a1a]">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{claim}</span>
                </div>
              ))}
            </div>

            {/* Capabilities Pill Matrix */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {asset.features.capabilities.map((cap, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 bg-[#111111] text-neutral-300 text-[11px] font-mono rounded-lg border border-[#1a1a1a]"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
              <span>{asset.size_metrics.file_count} Files Parsed</span>
              <span>•</span>
              <span>{asset.size_metrics.loc.toLocaleString()} Verified Lines</span>
              <span>•</span>
              <span className="text-green-400">Source Lineage</span>
            </div>
            <button
              id="bento-inspect-ast-btn"
              onClick={() => onNavigateTab('intake')}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect Raw AST</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TILE 2: BUYER ARCHETYPE FIT (Span 4 cols)                     */}
        {/* ------------------------------------------------------------- */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl flex flex-col justify-between hover:border-[#2a2a2a] transition">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase font-mono">
                  Layer 4 // Counterparty Fit
                </span>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono mt-0.5">
                  Inferred Buyer Archetypes
                </h3>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {buyerMatches.length} Inferred
              </span>
            </div>

            <div className="space-y-2.5">
              {buyerMatches.slice(0, 3).map((match) => (
                <div 
                  key={match.id}
                  onClick={() => onNavigateTab('buyers')}
                  className="p-3 bg-[#050505] hover:bg-[#111111] rounded-xl border border-[#1a1a1a] flex justify-between items-center transition cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-white truncate font-mono">{match.label || match.companyName}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{match.sector}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-blue-400 font-mono">{match.fitScore.toFixed(1)}%</p>
                    <p className="text-[9px] text-purple-400 font-mono">Archetype</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a1a1a]">
            <div className="flex justify-between text-[10px] text-neutral-400 mb-2 font-mono">
              <span>Avg. Heuristic Fit</span>
              <span className="text-blue-400 font-bold">{avgFitScore}%</span>
            </div>
            <button
              id="bento-open-campaigns-btn"
              onClick={() => onNavigateTab('buyers')}
              className="w-full py-2 bg-[#111111] hover:bg-neutral-800 text-neutral-200 text-xs font-bold font-mono rounded-xl border border-[#1a1a1a] transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Review Buyer Archetypes ({buyerMatches.length})</span>
              <ArrowRight className="w-3 h-3 text-blue-400" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TILE 3: EVIDENCE-BASED VALUATION & TIERS (Span 5 cols)        */}
        {/* ------------------------------------------------------------- */}
        <div className="col-span-1 md:col-span-6 lg:col-span-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between shadow-2xl hover:border-[#2a2a2a] transition">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                Screening Valuation Assessment
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getCertaintyBadge(valuation.certainty)}`}>
                {valuation.certainty}
              </span>
            </div>

            {isInsufficient ? (
              <div className="p-4 bg-[#050505] rounded-xl border border-[#1a1a1a] my-2 text-center">
                <p className="text-xs font-mono text-amber-400 font-bold">Screening Valuation Unavailable</p>
                <p className="text-[11px] text-neutral-400 mt-1">Insufficient measurable code evidence</p>
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-light text-white font-mono tracking-tight">
                    ${(valuation.estimatedAnnualValueUsd / 1000).toFixed(0)}K
                  </span>
                  <span className="text-xs text-neutral-500 uppercase font-mono tracking-tighter">
                    Est. Annual Yield (Band: ${(valuation.confidenceInterval.minUsd / 1000).toFixed(0)}K – ${(valuation.confidenceInterval.maxUsd / 1000).toFixed(0)}K)
                  </span>
                </div>

                <div className="p-2.5 bg-[#050505] rounded-xl border border-[#1a1a1a] mb-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">Replacement Cost:</span>
                  <span className="text-cyan-400 font-bold">
                    ${valuation.replacementCost.estimatedReplacementCostUsd.toLocaleString()} USD
                  </span>
                </div>

                <div className="space-y-2">
                  {licensingTiers.slice(0, 2).map((tier, idx) => (
                    <div 
                      key={tier.id}
                      className={`flex justify-between items-center p-2.5 bg-[#050505] rounded-xl border-l-2 ${
                        idx === 0 ? 'border-blue-500' : 'border-neutral-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-[11px] font-bold text-white uppercase font-mono truncate">{tier.name}</p>
                        <p className="text-[10px] text-neutral-400 truncate">{tier.rateDescription}</p>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-400 font-mono flex-shrink-0">
                        {idx === 0 ? 'DEFAULT' : 'OEM'}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
            <span className="text-[10px] text-neutral-500 font-mono">Screening Assessment</span>
            <button
              id="bento-explore-valuation-btn"
              onClick={() => onNavigateTab('valuation')}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Economic Model</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TILE 4: COMMERCIAL OPPORTUNITY (Span 3 cols)                  */}
        {/* ------------------------------------------------------------- */}
        <div className="col-span-1 md:col-span-6 lg:col-span-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between shadow-2xl hover:border-[#2a2a2a] transition">
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 font-mono">
              Commercial Opportunity
            </h3>

            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">ARCHETYPES</span>
                <span className="text-lg font-bold text-white">{buyerMatches.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">SCREENING YIELD</span>
                <span className="text-lg font-bold text-blue-400">
                  ${Math.round(pipelineValueUsd / 1000)}K
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">LEGAL MODEL</span>
                <span className="text-xs font-bold text-blue-400 uppercase font-mono">
                  Heuristic Only
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a1a1a]">
            <div className="bg-[#050505] p-2 rounded-lg border border-[#1a1a1a] text-[10px] font-mono text-neutral-400 text-center">
              Evidence-qualified screening estimates
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TILE 5: LEGAL RISK INDICATORS (HEURISTIC) (Span 4 cols)       */}
        {/* ------------------------------------------------------------- */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 flex flex-col justify-between shadow-2xl hover:border-[#2a2a2a] transition">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
                Legal Risk Indicators (Heuristic)
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  NON-FORENSIC
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-neutral-300">
              <div className="bg-[#050505] p-2.5 rounded-xl border border-[#1a1a1a] flex items-center justify-between">
                <span className="text-neutral-400">License Signals</span>
                <span className="text-emerald-400 font-bold">
                  {profile.asset.legalHeuristics?.licenseSignals.riskBand || 'LOW'} RISK
                </span>
              </div>
              <div className="bg-[#050505] p-2.5 rounded-xl border border-[#1a1a1a] flex items-center justify-between">
                <span className="text-neutral-400">Trade Secret Exposure</span>
                <span className="text-emerald-400 font-bold">
                  {profile.asset.legalHeuristics?.tradeSecretExposure.riskBand || 'LOW'} RISK
                </span>
              </div>
              <div className="bg-[#050505] p-2.5 rounded-xl border border-[#1a1a1a] flex items-center justify-between">
                <span className="text-neutral-400">Provenance Signals</span>
                <span className="text-blue-400 font-bold">
                  {profile.asset.legalHeuristics?.provenanceSignals.riskBand || 'LOW'} RISK
                </span>
              </div>
              <div className="bg-[#050505] p-2.5 rounded-xl border border-[#1a1a1a] flex items-center justify-between">
                <span className="text-neutral-400">Novelty Patterns</span>
                <span className="text-purple-400 font-bold">
                  {profile.asset.legalHeuristics?.noveltyIndicators.riskBand || 'MEDIUM'} RISK
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
            <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[170px]" title="Heuristic risk signals — not legal advice">
              Heuristic patterns only
            </span>
            <button
              id="bento-inspect-governance-btn"
              onClick={() => onNavigateTab('intake')}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono font-bold flex items-center gap-1 cursor-pointer flex-shrink-0"
            >
              <span>View Indicators</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
