/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Layers, 
  Sliders, 
  Check, 
  ArrowRight, 
  Zap,
  Building,
  Cpu,
  Lock,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Scale
} from 'lucide-react';
import { LicensingTier, ValuationBreakdown } from '../types';

interface ValuationAndLicensingViewProps {
  valuation: ValuationBreakdown;
  useCases: string[];
  licensingTiers: LicensingTier[];
  assetName: string;
  onProceedToContracts: () => void;
  onProceedToBuyers: () => void;
}

export const ValuationAndLicensingView: React.FC<ValuationAndLicensingViewProps> = ({
  valuation,
  useCases,
  licensingTiers,
  assetName,
  onProceedToContracts,
  onProceedToBuyers
}) => {
  const [monthlySpend, setMonthlySpend] = useState<number>(350000);
  const [savingsPercent, setSavingsPercent] = useState<number>(94);
  const [royaltyPercent, setRoyaltyPercent] = useState<number>(4.5);

  const isInsufficient = valuation.mode === 'INSUFFICIENT_EVIDENCE' || valuation.estimatedAnnualValueUsd === 0;

  const annualClientPreSpend = monthlySpend * 12;
  const annualGrossSavings = annualClientPreSpend * (savingsPercent / 100);
  const annualRoyaltyFromSavings = annualGrossSavings * (royaltyPercent / 100);
  const netClientSavings = annualGrossSavings - annualRoyaltyFromSavings;

  const getTierIcon = (model: string) => {
    switch (model) {
      case 'percentage_of_savings': return Zap;
      case 'per_node_per_month': return Building;
      case 'per_device_oem': return Cpu;
      case 'dual_source_royalty': return Lock;
      default: return Zap;
    }
  };

  const getCertaintyColor = (certainty: string) => {
    switch (certainty) {
      case 'HIGH': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MEDIUM': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'LOW': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header with Official Evidence-Based Status */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 md:p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1a1a1a]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Layer 2 // Valuation Engine
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${getCertaintyColor(valuation.certainty)}`}>
                Certainty band: {valuation.certainty} (heuristic only)
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Asset: <strong className="text-neutral-200">{assetName}</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
              Screening Valuation Assessment (Evidence‑Based)
            </h2>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Derived from code metrics and detected capabilities. Not a formal appraisal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="goto-contracts-nav-btn"
              onClick={onProceedToContracts}
              className="flex items-center gap-1.5 bg-[#111111] hover:bg-[#1a1a1a] text-neutral-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#1a1a1a] transition cursor-pointer"
            >
              <span>Draft Contracts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="goto-buyers-nav-btn"
              onClick={onProceedToBuyers}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(37,99,235,0.3)] cursor-pointer"
            >
              <span>Explore Buyer Archetypes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* INSUFFICIENT EVIDENCE STATE */}
        {isInsufficient ? (
          <div className="py-8 text-center space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase">
                Unable to form a screening valuation estimate due to insufficient evidence.
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Cannot estimate commercial value without measurable source code artifacts or AST metrics. 
                Please upload a source code archive (.zip) or paste raw code in the Asset Intake view.
              </p>
            </div>
            <div className="p-3 bg-[#050505] rounded-xl border border-[#1a1a1a] text-left text-xs font-mono text-neutral-400 space-y-1">
              <div className="flex justify-between">
                <span>Measured LOC:</span>
                <span className="text-white font-bold">{valuation.evidenceAudit.measuredLoc}</span>
              </div>
              <div className="flex justify-between">
                <span>Verified Files:</span>
                <span className="text-white font-bold">{valuation.evidenceAudit.measuredFileCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Certainty Band:</span>
                <span className="text-amber-400 font-bold">INSUFFICIENT_EVIDENCE (heuristic only)</span>
              </div>
            </div>
          </div>
        ) : (
          /* EVIDENCE-BASED VALUATION NUMBERS */
          <>
            <div className="p-4 bg-[#050505] rounded-xl border border-blue-500/20 text-xs font-mono mb-2">
              <span className="text-neutral-400 block mb-1">Value Benchmark:</span>
              <span className="text-base font-bold text-white">
                Estimated replacement cost (screening only): ${valuation.replacementCost.estimatedReplacementCostUsd.toLocaleString()}.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              <div className="bg-[#050505] p-4 rounded-xl border border-[#1a1a1a]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-neutral-500 uppercase font-mono">Heuristic Value Score</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${getCertaintyColor(valuation.certainty)}`}>
                    {valuation.certainty}
                  </span>
                </div>
                <div className="text-2xl font-black text-white font-mono tracking-tight">
                  {valuation.valueScore} <span className="text-xs text-neutral-500 font-normal">/ 10.0</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Based on measured AST cyclomatic index & verified lines.
                </p>
              </div>

              <div className="bg-[#050505] p-4 rounded-xl border border-[#1a1a1a]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-neutral-500 uppercase font-mono">Est. Annual Value (USD)</span>
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-blue-400 font-mono tracking-tight">
                  ${valuation.estimatedAnnualValueUsd.toLocaleString()}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                  Band: ${valuation.confidenceInterval.minUsd.toLocaleString()} – ${valuation.confidenceInterval.maxUsd.toLocaleString()}
                </p>
              </div>

              <div className="bg-[#050505] p-4 rounded-xl border border-[#1a1a1a]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-neutral-500 uppercase font-mono">Replacement Cost Benchmark</span>
                  <Scale className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-cyan-400 font-mono tracking-tight">
                  ${valuation.replacementCost.estimatedReplacementCostUsd.toLocaleString()}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                  {valuation.replacementCost.inputs.loc.toLocaleString()} LOC @ ${valuation.replacementCost.inputs.baseRatePerLoc}/line
                </p>
              </div>

              <div className="bg-[#050505] p-4 rounded-xl border border-[#1a1a1a]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-neutral-500 uppercase font-mono">Addressable Market (TAM)</span>
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-purple-400 font-mono tracking-tight">
                  ${(valuation.estimatedTamUsd / 1000000).toFixed(1)}M
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Estimated total market footprint across target sectors.
                </p>
              </div>
            </div>

            {/* Replacement Cost Mathematical Audit Trail */}
            <div className="mt-4 p-4 bg-[#050505] rounded-xl border border-[#1a1a1a] text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold tracking-wider">
                  Audit Trail: Replacement Cost Mathematical Model
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {valuation.replacementCost.evidenceLevel}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px] text-neutral-300">
                <div className="p-2 bg-[#111111] rounded-lg border border-[#1e1e1e]">
                  <span className="text-[9px] text-neutral-500 block uppercase">Raw LOC</span>
                  <span className="font-bold text-white">{valuation.replacementCost.inputs.loc.toLocaleString()} lines</span>
                </div>
                <div className="p-2 bg-[#111111] rounded-lg border border-[#1e1e1e]">
                  <span className="text-[9px] text-neutral-500 block uppercase">Base Rate</span>
                  <span className="font-bold text-blue-400">${valuation.replacementCost.inputs.baseRatePerLoc} / line</span>
                </div>
                <div className="p-2 bg-[#111111] rounded-lg border border-[#1e1e1e]">
                  <span className="text-[9px] text-neutral-500 block uppercase">Complexity Multiplier</span>
                  <span className="font-bold text-cyan-400">{valuation.replacementCost.inputs.complexityMultiplier}x</span>
                </div>
                <div className="p-2 bg-[#111111] rounded-lg border border-[#1e1e1e]">
                  <span className="text-[9px] text-neutral-500 block uppercase">Total Replacement Est.</span>
                  <span className="font-bold text-purple-400">${valuation.replacementCost.estimatedReplacementCostUsd.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Key Drivers */}
            <div className="mt-4 p-3.5 bg-[#050505] rounded-xl border border-[#1a1a1a] text-xs">
              <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-2 font-bold tracking-wider">
                Observable Code Evidence Drivers
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {valuation.keyDrivers.map((driver, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="font-mono text-[11px]">{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Mandatory Statutory Disclaimer Banner */}
        <div className="mt-4 p-3.5 bg-[#050505] rounded-xl border border-[#2a2a2a] text-[11px] text-neutral-300 leading-relaxed flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <span>
            All valuation outputs are screening estimates based on code metrics and detected capabilities. They are not formal financial appraisals, not legal advice, and not accounting guidance. Human review required before any transaction.
          </span>
        </div>
      </div>

      {/* 2. Interactive Economic Impact Model (Shown when evidence exists) */}
      {!isInsufficient && (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 md:p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase">
                  Royalty Yield & Buyer ROI Sensitivity Modeler
                </h3>
                <p className="text-xs text-neutral-400">
                  Model counterparty economics and annual cash flow based on customer infrastructure spend.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
              Sensitivity Tool
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls column */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-neutral-400">Buyer Monthly Cloud / Compute Spend:</span>
                  <span className="text-blue-400 font-bold">${monthlySpend.toLocaleString()} / mo</span>
                </div>
                <input
                  id="slider-monthly-spend"
                  type="range"
                  min={50000}
                  max={2000000}
                  step={25000}
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#111111] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-0.5">
                  <span>$50k (Mid-market)</span>
                  <span>$2.0M (Hyper-scaler)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-neutral-400">Verified Compute Cost Reduction:</span>
                  <span className="text-blue-400 font-bold">{savingsPercent}% compression</span>
                </div>
                <input
                  id="slider-savings-percent"
                  type="range"
                  min={15}
                  max={94}
                  step={1}
                  value={savingsPercent}
                  onChange={(e) => setSavingsPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#111111] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-0.5">
                  <span>15% Conservative</span>
                  <span>94% ArgOS Benchmark</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-neutral-400">Royalty Rate (% of Savings):</span>
                  <span className="text-cyan-400 font-bold">{royaltyPercent.toFixed(1)}%</span>
                </div>
                <input
                  id="slider-royalty-percent"
                  type="range"
                  min={1.0}
                  max={10.0}
                  step={0.5}
                  value={royaltyPercent}
                  onChange={(e) => setRoyaltyPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#111111] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-0.5">
                  <span>1.0% Low Friction</span>
                  <span>10.0% Premium Value</span>
                </div>
              </div>
            </div>

            {/* Results Projection column */}
            <div className="lg:col-span-6 bg-[#050505] p-4 rounded-xl border border-[#1a1a1a] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1a1a1a] text-xs font-mono">
                  <span className="text-neutral-400">Gross Annual Buyer Cost Savings:</span>
                  <span className="text-white font-bold text-sm">
                    ${Math.round(annualGrossSavings).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#1a1a1a] text-xs font-mono">
                  <span className="text-neutral-400">Net Buyer Annual Savings (After Royalty):</span>
                  <span className="text-blue-400 font-bold text-sm">
                    ${Math.round(netClientSavings).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#111111] border border-blue-500/30">
                  <span className="text-[10px] uppercase font-mono text-blue-400 block font-bold">
                    Projected Annual Royalty Yield (Single Enterprise Buyer)
                  </span>
                  <div className="text-2xl font-black text-white font-mono mt-1">
                    ${Math.round(annualRoyaltyFromSavings).toLocaleString()} <span className="text-xs text-neutral-400 font-normal">/ year</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1 font-mono">
                    Structured as a percentage of verified infrastructure cost reduction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Generated Commercial Licensing Tiers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-neutral-500 font-mono uppercase tracking-widest">
              Standardized Commercial Licensing Tiers ({licensingTiers.length})
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Ready for Master Agreement Insertion</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licensingTiers.map((tier) => {
            const Icon = getTierIcon(tier.royaltyModel);
            return (
              <div
                key={tier.id}
                id={`tier-card-${tier.id}`}
                className="bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#2a2a2a] rounded-2xl p-5 shadow-2xl flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono">{tier.name}</h4>
                        <span className="text-[10px] font-mono text-blue-400 font-semibold">
                          SLA: {tier.slaLevel}
                        </span>
                      </div>
                    </div>
                    {tier.evidenceTierLabel && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#111111] text-neutral-400 border border-[#1e1e1e]">
                        {tier.evidenceTierLabel}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-300 mb-3 leading-relaxed">{tier.tagline}</p>

                  <div className="p-3 bg-[#050505] rounded-xl border border-[#1a1a1a] mb-3">
                    <span className="text-[10px] uppercase font-mono text-neutral-500 block">Monetization Formula</span>
                    <span className="text-sm font-bold text-blue-400 font-mono block mt-0.5">
                      {tier.rateDescription}
                    </span>
                    {tier.basePriceUsd && tier.basePriceUsd > 0 ? (
                      <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                        Base / Setup Fee: ${tier.basePriceUsd.toLocaleString()} USD
                      </span>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1.5">Target Counterparty</span>
                    <span className="text-xs text-neutral-300 font-medium block">{tier.targetCustomer}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1.5">Included Terms & Rights</span>
                    <ul className="space-y-1">
                      {tier.includedFeatures.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-neutral-400">
                          <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 font-mono">Master Contract Compatible</span>
                  <button
                    onClick={onProceedToContracts}
                    className="text-xs text-blue-400 hover:text-blue-300 font-mono font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Legal Clauses</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Target Industrial Use-Cases */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-neutral-500 font-mono uppercase tracking-widest">
            Mapped High-Value Enterprise Use Cases ({useCases.length})
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {useCases.map((uc, idx) => (
            <div key={idx} className="bg-[#050505] p-3 rounded-xl border border-[#1a1a1a] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></span>
              <span className="text-xs text-neutral-200 font-mono">{uc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
