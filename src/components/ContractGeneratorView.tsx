/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock
} from 'lucide-react';
import { ContractClause, ContractSpec } from '../types';

interface ContractGeneratorViewProps {
  contracts: Record<string, ContractSpec>;
  assetName: string;
  onProceedToBuyers: () => void;
}

export const ContractGeneratorView: React.FC<ContractGeneratorViewProps> = ({
  contracts,
  assetName,
  onProceedToBuyers
}) => {
  const contractKeys = Object.keys(contracts);
  const [selectedContractKey, setSelectedContractKey] = useState<string>(contractKeys[0] || '');
  const [activeTab, setActiveTab] = useState<'clauses' | 'fullMarkdown'>('clauses');
  const [selectedClause, setSelectedClause] = useState<ContractClause | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const currentContract = contracts[selectedContractKey] || Object.values(contracts)[0];

  const handleCopyMarkdown = () => {
    if (currentContract) {
      navigator.clipboard.writeText(currentContract.fullDraftMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!currentContract) return;
    const blob = new Blob([currentContract.fullDraftMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assetName.toLowerCase().replace(/\s+/g, '_')}_master_license.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Grant': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Royalty': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Audit': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'IP Protection': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Indemnity': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Statutory Contract Disclaimer Banner */}
      <div className="bg-[#0a0a0a] border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
        <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs font-mono">
          <span className="text-amber-300 font-bold block mb-0.5">LEGAL CONTRACT TEMPLATE NOTICE</span>
          <p className="text-neutral-400 leading-relaxed">
            All clauses and generated agreements are standardized drafting templates only. They do not constitute formal legal advice or guarantees of enforceability. Legal counsel review is strictly required before executing any licensing transaction.
          </p>
        </div>
      </div>

      {/* Top Header & Contract Selector */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 md:p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a1a1a]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Layer 5 // Automated Contract Synthesis
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Asset: <strong className="text-neutral-200">{assetName}</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
              Master Licensing & IP Defense Agreements
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-contract-btn"
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 bg-[#111111] hover:bg-[#1a1a1a] text-neutral-200 px-3 py-2 rounded-xl text-xs font-mono font-semibold border border-[#1a1a1a] transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Full Draft'}</span>
            </button>
            <button
              id="download-contract-btn"
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 bg-[#111111] hover:bg-[#1a1a1a] text-neutral-200 px-3 py-2 rounded-xl text-xs font-mono font-semibold border border-[#1a1a1a] transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>
            <button
              id="goto-buyers-btn-from-contracts"
              onClick={onProceedToBuyers}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold font-mono transition shadow-[0_0_15px_rgba(37,99,235,0.3)] cursor-pointer"
            >
              <span>Match Enterprise Buyers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Contract Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2">
            {contractKeys.map((key) => {
              const spec = contracts[key];
              const isSelected = selectedContractKey === key;
              return (
                <button
                  key={key}
                  id={`contract-tab-${key}`}
                  onClick={() => setSelectedContractKey(key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#1a1a1a] text-blue-400 border border-blue-500/40 font-bold shadow-sm'
                      : 'bg-[#050505] text-neutral-400 border border-[#1a1a1a] hover:text-white'
                  }`}
                >
                  {spec.contractType}
                </button>
              );
            })}
          </div>

          <div className="flex items-center bg-[#050505] p-1 rounded-xl border border-[#1a1a1a]">
            <button
              id="view-mode-clauses"
              onClick={() => setActiveTab('clauses')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                activeTab === 'clauses' ? 'bg-[#1a1a1a] text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Clause Matrix ({currentContract?.clauses.length})
            </button>
            <button
              id="view-mode-markdown"
              onClick={() => setActiveTab('fullMarkdown')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                activeTab === 'fullMarkdown' ? 'bg-[#1a1a1a] text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Full Legal Draft (.MD)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'clauses' && currentContract && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Clause List (Left 5 cols) */}
          <div className="lg:col-span-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1a1a1a]">
              <span className="text-xs font-bold text-neutral-500 uppercase font-mono tracking-wider">
                Synthesized Clauses
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">Template Drafts</span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
              {currentContract.clauses.map((clause, idx) => {
                const isSelected = (selectedClause?.id === clause.id) || (!selectedClause && idx === 0);
                return (
                  <div
                    key={clause.id}
                    id={`clause-card-${clause.id}`}
                    onClick={() => setSelectedClause(clause)}
                    className={`p-3 rounded-xl border cursor-pointer transition text-left ${
                      isSelected
                        ? 'bg-[#111111] border-blue-500/60 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                        : 'bg-[#050505] border-[#1a1a1a] hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getCategoryBadge(clause.category)}`}>
                        {clause.category}
                      </span>
                      {clause.mandatory && (
                        <span className="text-[9px] font-mono text-neutral-500 uppercase">Non-Negotiable</span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white font-mono mb-1">{clause.title}</h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{clause.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clause Detail & Legal Inspector (Right 7 cols) */}
          <div className="lg:col-span-7 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
            {(() => {
              const active = selectedClause || currentContract.clauses[0];
              if (!active) return null;
              return (
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1a1a1a]">
                    <div>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getCategoryBadge(active.category)} inline-block mb-1`}>
                        {active.category} Clause
                      </span>
                      <h3 className="text-sm font-bold text-white font-mono">{active.title}</h3>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">
                      {active.mandatory ? 'Mandatory IP Safeguard' : 'Standard Commercial Term'}
                    </span>
                  </div>

                  <div className="bg-[#050505] p-3.5 rounded-xl border border-[#1a1a1a] mb-4">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">Executive Summary</span>
                    <p className="text-xs text-neutral-300 leading-relaxed">{active.summary}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1.5 font-bold">
                      Binding Contractual Language
                    </span>
                    <div className="bg-[#050505] p-4 rounded-xl border border-[#1a1a1a] text-xs font-mono text-neutral-200 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto scrollbar-thin">
                      {active.content}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Template Drafts • Legal Counsel Review Required</span>
              </span>
              <button
                onClick={handleCopyMarkdown}
                className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Copy Agreement Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Markdown Tab */}
      {activeTab === 'fullMarkdown' && currentContract && (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1a1a1a]">
            <span className="text-xs font-bold text-neutral-400 font-mono">
              PREVIEW: {currentContract.title}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="text-xs font-mono bg-[#111111] hover:bg-neutral-800 text-neutral-200 px-3 py-1.5 rounded-lg border border-[#1a1a1a] cursor-pointer"
              >
                Copy Markdown
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="text-xs font-mono bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer"
              >
                Download (.MD)
              </button>
            </div>
          </div>
          <pre className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-4 text-xs font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto scrollbar-thin">
            {currentContract.fullDraftMarkdown}
          </pre>
        </div>
      )}
    </div>
  );
};
