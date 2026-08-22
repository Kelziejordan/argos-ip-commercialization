/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  ChevronRight, 
  Activity,
  AlertTriangle,
  Scale,
  ShieldAlert,
  Info
} from 'lucide-react';
import { AnalyzedFile, AssetObject, RiskBand } from '../types';

interface AnalysisDashboardProps {
  asset: AssetObject;
  onProceedToValuation: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  asset,
  onProceedToValuation
}) => {
  const [selectedFile, setSelectedFile] = useState<AnalyzedFile>(asset.files[0] || null);

  const getPrimaryKindBadgeColor = (kind: string) => {
    switch (kind) {
      case 'ossubstrate': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'aimodel': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'distributed_system': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'codelibrary': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'dataset': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  const getRiskBandBadge = (riskBand: RiskBand) => {
    switch (riskBand) {
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'HIGH':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  const legalHeuristics = asset.legalHeuristics;

  return (
    <div className="space-y-4">
      {/* Statutory Global Legal Disclaimer Banner */}
      <div className="bg-[#0a0a0a] border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
        <Scale className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs font-mono">
          <span className="text-white font-bold block mb-0.5">LEGAL HEURISTICS FRAMEWORK</span>
          <p className="text-neutral-300 leading-relaxed">
            This module provides heuristic legal risk indicators based on code patterns. It does not determine ownership, provenance, patentability, trade secret status, or license compliance. Human legal review is required before relying on any legal‑related output.
          </p>
        </div>
      </div>

      {/* Top Intelligence Summary Card */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 md:p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1a1a1a]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${getPrimaryKindBadgeColor(asset.primarykind)}`}>
                {asset.primarykind.toUpperCase()}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Asset ID: <strong className="text-neutral-200">{asset.id}</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span>{asset.name}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#050505] px-3 py-1.5 rounded-xl border border-[#1a1a1a] text-right">
              <span className="text-[10px] text-neutral-500 uppercase block font-mono">Classification Confidence</span>
              <span className="text-sm font-bold text-blue-400 font-mono">
                {(asset.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <button
              id="goto-valuation-btn"
              onClick={onProceedToValuation}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              <span>View Valuation & Tiers</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Core Quantitative Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="bg-[#050505] p-3.5 rounded-xl border border-[#1a1a1a]">
            <span className="text-[10px] text-neutral-500 uppercase font-mono block">Lines of Code (LOC)</span>
            <span className="text-lg font-bold text-white font-mono">{asset.size_metrics.loc.toLocaleString()}</span>
            <span className="text-[11px] text-neutral-400 block mt-0.5">{asset.size_metrics.file_count} scanned files</span>
          </div>

          <div className="bg-[#050505] p-3.5 rounded-xl border border-[#1a1a1a]">
            <span className="text-[10px] text-neutral-500 uppercase font-mono block">Classes & Structs</span>
            <span className="text-lg font-bold text-blue-400 font-mono">{asset.size_metrics.classes_or_structs}</span>
            <span className="text-[11px] text-neutral-400 block mt-0.5">{asset.size_metrics.functions_or_methods} exported methods</span>
          </div>

          <div className="bg-[#050505] p-3.5 rounded-xl border border-[#1a1a1a]">
            <span className="text-[10px] text-neutral-500 uppercase font-mono block">Cyclomatic Index</span>
            <span className="text-lg font-bold text-cyan-400 font-mono">{asset.size_metrics.cyclomatic_index}</span>
            <span className="text-[11px] text-neutral-400 block mt-0.5 font-mono">AST structure ratio</span>
          </div>

          <div className="bg-[#050505] p-3.5 rounded-xl border border-[#1a1a1a]">
            <span className="text-[10px] text-neutral-500 uppercase font-mono block">Detected Languages</span>
            <span className="text-sm font-bold text-neutral-200 font-mono truncate block mt-1">
              {asset.languages.join(', ')}
            </span>
            <span className="text-[11px] text-emerald-400 block mt-0.5 font-mono">GPL keyword check clean</span>
          </div>
        </div>
      </div>

      {/* Extracted Capabilities & Claims Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-neutral-500 font-mono uppercase tracking-widest">
              Extracted Architectural Capabilities ({asset.features.capabilities.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {asset.features.capabilities.map((cap, idx) => (
              <span
                key={idx}
                className="bg-[#050505] text-neutral-200 text-xs px-2.5 py-1 rounded-lg border border-[#1a1a1a] font-mono flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-blue-400 flex-shrink-0" />
                <span>{cap}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-neutral-500 font-mono uppercase tracking-widest">
              Verifiable Performance Claims & Invariants
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {asset.claims.map((claim, idx) => (
              <span
                key={idx}
                className="bg-[#111111] text-blue-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-500/30 font-mono flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>{claim}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Structural Inspection View: File Tree + File Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Canonical Normalized File Tree */}
        <div className="lg:col-span-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-neutral-500 font-mono uppercase tracking-widest">
                Normalized File Tree ({asset.files.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">{asset.size_metrics.loc} Total LOC</span>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[380px] pr-1 scrollbar-thin">
            {asset.files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                  selectedFile?.path === file.path
                    ? 'bg-blue-600/15 border border-blue-500/40 text-white'
                    : 'bg-[#050505] border border-transparent text-neutral-400 hover:bg-[#111111] hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${selectedFile?.path === file.path ? 'text-blue-400' : 'text-neutral-500'}`} />
                  <span className="truncate">{file.path}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-[10px]">
                  <span className="text-neutral-500">{file.loc} LOC</span>
                  <span className="bg-[#111111] px-1.5 py-0.5 rounded text-blue-400 border border-[#1a1a1a]">
                    {file.kind}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: File Detail AST Inspector */}
        <div className="lg:col-span-7 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 shadow-2xl flex flex-col justify-between">
          {selectedFile ? (
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1a1a1a]">
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block">File Inspector</span>
                  <h4 className="text-sm font-bold text-white font-mono">{selectedFile.path}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="bg-[#050505] px-2.5 py-1 rounded-lg border border-[#1a1a1a] text-neutral-400">
                    Complexity: <strong className="text-blue-400">{selectedFile.complexityScore}/10</strong>
                  </span>
                  <span className="bg-[#050505] px-2.5 py-1 rounded-lg border border-[#1a1a1a] text-neutral-400">
                    Size: <strong className="text-neutral-200">{(selectedFile.sizeBytes / 1024).toFixed(1)} KB</strong>
                  </span>
                </div>
              </div>

              {/* Invariants & Extracted Symbols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-xs">
                <div className="bg-[#050505] p-3 rounded-xl border border-[#1a1a1a]">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">Architectural Invariants</span>
                  {selectedFile.features.invariants.length > 0 ? (
                    <ul className="space-y-1 text-neutral-300">
                      {selectedFile.features.invariants.map((inv, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] font-mono text-blue-400">
                          <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                          <span>{inv}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-[11px] text-neutral-500 font-mono">Standard deterministic execution</span>
                  )}
                </div>

                <div className="bg-[#050505] p-3 rounded-xl border border-[#1a1a1a]">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">Exported ABI Symbols</span>
                  {selectedFile.features.exportedSymbols.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {selectedFile.features.exportedSymbols.map((sym, i) => (
                        <span key={i} className="text-[10px] font-mono bg-[#111111] text-blue-300 px-1.5 py-0.5 rounded border border-[#1a1a1a]">
                          {sym}()
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-neutral-500 font-mono">Internal subsystem module</span>
                  )}
                </div>
              </div>

              {/* Code Snippet Box */}
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">Source Preview</span>
                <pre className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-3 text-[11px] font-mono text-blue-300 overflow-x-auto max-h-48 scrollbar-thin">
                  {selectedFile.previewSnippet || '// No preview available'}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-500 text-xs font-mono">
              Select a file from the tree to view extracted AST features and invariants.
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex justify-end">
            <button
              id="inspect-valuation-link-btn"
              onClick={onProceedToValuation}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>Calculate Monetization Model & Royalties</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Legal Risk Heuristics Layer (Defensible Non-Forensic Indicators) */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Legal Risk Indicators (Heuristic, Non‑Forensic)
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                Pattern-based risk categorization — not formal legal conclusions
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#050505] border border-[#1a1a1a] text-neutral-400">
            Model: <strong className="text-blue-400">Heuristic Risk Scanner</strong>
          </span>
        </div>

        {/* 4 Standardized Legal Heuristic Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. License Signals (Heuristic Only) */}
          <div className="bg-[#050505] p-4 rounded-xl border border-[#1a1a1a] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white font-mono">License Signals (Heuristic Only)</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskBandBadge(legalHeuristics?.licenseSignals.riskBand || 'LOW')}`}>
                  {legalHeuristics?.licenseSignals.riskBand || 'LOW'} RISK
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-2">
                Scanned for copyleft (GPL/AGPL) text and explicit license declarations across files.
              </p>
              <div className="space-y-1 mb-3">
                {(legalHeuristics?.licenseSignals.evidence || ['No restrictive copyleft headers detected across parsed files.']).map((ev, i) => (
                  <div key={i} className="text-[10px] font-mono text-neutral-300 flex items-start gap-1.5">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-[#1a1a1a] text-[9px] font-mono text-neutral-500">
              {legalHeuristics?.licenseSignals.disclaimer || 'Heuristic indicator only — not a legal conclusion. Non-forensic pattern detection — cannot determine legal status. This output is not legal advice.'}
            </div>
          </div>

          {/* 2. Provenance Signals (Non-Forensic) */}
          <div className="bg-[#050505] p-4 rounded-xl border border-[#1a1a1a] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white font-mono">Provenance Signals (Non‑Forensic)</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskBandBadge(legalHeuristics?.provenanceSignals.riskBand || 'LOW')}`}>
                  {legalHeuristics?.provenanceSignals.riskBand || 'LOW'} RISK
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-2">
                No external provenance signals were detected, but this is not a cleanroom verification.
              </p>
              <div className="space-y-1 mb-3">
                {(legalHeuristics?.provenanceSignals.evidence || ['No public repository snippet URLs detected in source comments.']).map((ev, i) => (
                  <div key={i} className="text-[10px] font-mono text-neutral-300 flex items-start gap-1.5">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-[#1a1a1a] text-[9px] font-mono text-neutral-500">
              {legalHeuristics?.provenanceSignals.disclaimer || 'Heuristic indicator only — not a legal conclusion. Non-forensic pattern detection — cannot determine legal status. This output is not legal advice.'}
            </div>
          </div>

          {/* 3. Trade Secret Exposure Risk (Heuristic) */}
          <div className="bg-[#050505] p-4 rounded-xl border border-[#1a1a1a] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white font-mono">Trade Secret Exposure Risk (Heuristic)</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskBandBadge(legalHeuristics?.tradeSecretExposure.riskBand || 'LOW')}`}>
                  {legalHeuristics?.tradeSecretExposure.riskBand || 'LOW'} RISK
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-2">
                Evaluates risk of proprietary algorithm and internal state representation exposure.
              </p>
              <div className="space-y-1 mb-3">
                {(legalHeuristics?.tradeSecretExposure.evidence || ['Internal structural abstractions appear self-contained.']).map((ev, i) => (
                  <div key={i} className="text-[10px] font-mono text-neutral-300 flex items-start gap-1.5">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-[#1a1a1a] text-[9px] font-mono text-neutral-500">
              {legalHeuristics?.tradeSecretExposure.disclaimer || 'Heuristic indicator only — not a legal conclusion. Non-forensic pattern detection — cannot determine legal status. This output is not legal advice.'}
            </div>
          </div>

          {/* 4. Novelty Indicators (Heuristic) */}
          <div className="bg-[#050505] p-4 rounded-xl border border-[#1a1a1a] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white font-mono">Novelty Indicators (Heuristic)</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskBandBadge(legalHeuristics?.noveltyIndicators.riskBand || 'LOW')}`}>
                  {legalHeuristics?.noveltyIndicators.riskBand || 'LOW'} RISK
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-2">
                Surfaced architectural structures that may warrant evaluation for potential novelty.
              </p>
              <div className="space-y-1 mb-3">
                {(legalHeuristics?.noveltyIndicators.evidence || ['Standard structured programming abstractions identified.']).map((ev, i) => (
                  <div key={i} className="text-[10px] font-mono text-neutral-300 flex items-start gap-1.5">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-[#1a1a1a] text-[9px] font-mono text-neutral-500">
              {legalHeuristics?.noveltyIndicators.disclaimer || 'Heuristic indicator only — not a legal conclusion. Non-forensic pattern detection — cannot determine legal status. This output is not legal advice.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
