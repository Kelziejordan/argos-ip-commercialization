/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  DollarSign, 
  FileText, 
  Users, 
  Code2, 
  Sparkles, 
  Layers, 
  UploadCloud,
  Scale,
  ArrowRight
} from 'lucide-react';

export type TabType = 'bento' | 'intake' | 'valuation' | 'contracts' | 'buyers' | 'apispec';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAiAudit: () => void;
  onOpenLicense?: () => void;
  tcsTraceId?: string;
  hasAnalyzed: boolean;
  activeAssetName?: string;
  onLaunchOutreach?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiAudit,
  onOpenLicense,
  hasAnalyzed,
  activeAssetName,
  onLaunchOutreach
}) => {
  const tabs = [
    { id: 'bento' as TabType, label: 'Dashboard', icon: Layers },
    { id: 'intake' as TabType, label: 'Asset Code & AST', icon: UploadCloud },
    { id: 'valuation' as TabType, label: 'Valuation & Tiers', icon: DollarSign },
    { id: 'contracts' as TabType, label: 'Contracts (MLA)', icon: FileText },
    { id: 'buyers' as TabType, label: 'Real Buyer Console', icon: Users },
    { id: 'apispec' as TabType, label: 'API Console', icon: Code2 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur border-b border-[#1a1a1a] shadow-xl">
      {/* Clean Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] text-sm">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">
                ArgOS Commercialization Engine
              </h1>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Ready</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {hasAnalyzed ? (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-neutral-500 font-mono uppercase">Analyzed Asset</span>
                <span className="text-xs font-mono font-bold text-blue-400 truncate max-w-[160px]">
                  {activeAssetName}
                </span>
              </div>

              <button
                id="header-license-btn"
                onClick={onOpenLicense}
                title="View Apache 2.0 License"
                className="hidden md:flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-[#1a1a1a] hover:border-[#333] transition cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-neutral-400" />
                <span>Apache-2.0</span>
              </button>

              <button
                id="header-ai-audit-btn"
                onClick={onOpenAiAudit}
                className="flex items-center gap-1.5 bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 font-semibold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI IP Audit</span>
              </button>

              <button
                id="launch-outreach-header-btn"
                onClick={onLaunchOutreach}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] transition cursor-pointer flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Buyer Archetypes</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-license-btn-unauth"
                onClick={onOpenLicense}
                className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition px-2.5 py-1.5 rounded-lg border border-[#1a1a1a] hover:border-[#333] cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-neutral-400" />
                <span>Apache-2.0</span>
              </button>

              <button
                id="header-api-spec-btn"
                onClick={() => setActiveTab('apispec')}
                className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition px-3 py-1.5 rounded-lg border border-transparent hover:border-[#2a2a2a] cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span>API Reference</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation tabs - shown cleanly when analyzed */}
      {hasAnalyzed && (
        <div className="max-w-7xl mx-auto px-4 pb-2 border-t border-[#141414] pt-2">
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#181818] text-white border border-[#2a2a2a] shadow-sm font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-neutral-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
