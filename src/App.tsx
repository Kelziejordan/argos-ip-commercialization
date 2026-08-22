/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, TabType } from './components/Header';
import { BentoGridDashboard } from './components/BentoGridDashboard';
import { AssetIntakeSection } from './components/AssetIntakeSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ValuationAndLicensingView } from './components/ValuationAndLicensingView';
import { ContractGeneratorView } from './components/ContractGeneratorView';
import { BuyerDiscoveryAndOutreachView } from './components/BuyerDiscoveryAndOutreachView';
import { ApiSpecExplorer } from './components/ApiSpecExplorer';
import { AiDeepAuditModal } from './components/AiDeepAuditModal';
import { LicenseModal } from './components/LicenseModal';
import { AssetIntakeService } from './engine/intakeService';
import { LicensingProfile, AssetSourceType } from './types';
import { UploadCloud, Cpu, Layers, ArrowRight, ShieldCheck, Scale } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('intake');
  const [profile, setProfile] = useState<LicensingProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeStatus, setActiveStatus] = useState<string>('idle');
  const [isAiAuditOpen, setIsAiAuditOpen] = useState<boolean>(false);
  const [isLicenseOpen, setIsLicenseOpen] = useState<boolean>(false);

  const handleRunAnalysis = async (params: {
    inputSource?: string;
    sourceType?: AssetSourceType;
    zipFile?: File;
    customCode?: string;
    assetName?: string;
  }) => {
    setIsAnalyzing(true);
    setActiveStatus('unpacking & reading files');
    try {
      let zipBlob: Blob | undefined = undefined;
      if (params.zipFile) {
        zipBlob = params.zipFile;
      }

      setActiveStatus('extracting ast & complexity metrics');
      const updatedProfile = await AssetIntakeService.processIntake({
        inputSource: params.inputSource || params.customCode,
        sourceType: params.sourceType,
        zipBlob,
        assetName: params.assetName
      });

      setActiveStatus('computing valuation & buyer matching');
      setProfile(updatedProfile);
      setActiveTab('bento');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      throw err;
    } finally {
      setIsAnalyzing(false);
      setActiveStatus('idle');
    }
  };

  const handleResetAsset = () => {
    setProfile(null);
    setActiveTab('intake');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-neutral-300 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bento Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAudit={() => setIsAiAuditOpen(true)}
        onOpenLicense={() => setIsLicenseOpen(true)}
        tcsTraceId={profile?.tcsTraceId}
        hasAnalyzed={!!profile}
        activeAssetName={profile?.asset.name}
        onLaunchOutreach={() => setActiveTab('buyers')}
      />

      {/* Main Content View */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-5">
        {/* INTAKE TAB */}
        {activeTab === 'intake' && (
          <div>
            <AssetIntakeSection
              onRunAnalysis={handleRunAnalysis}
              isAnalyzing={isAnalyzing}
              activeStatus={activeStatus}
            />
            {profile && (
              <AnalysisDashboard
                asset={profile.asset}
                onProceedToValuation={() => setActiveTab('valuation')}
              />
            )}
          </div>
        )}

        {/* BENTO DASHBOARD TAB */}
        {activeTab === 'bento' && (
          <div>
            {profile ? (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={handleResetAsset}
                    className="text-xs font-mono text-neutral-500 hover:text-blue-400 flex items-center gap-1 cursor-pointer transition"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload a different codebase / asset</span>
                  </button>
                </div>
                <BentoGridDashboard
                  profile={profile}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenAiAudit={() => setIsAiAuditOpen(true)}
                />
              </div>
            ) : (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 md:p-12 text-center shadow-2xl space-y-4 max-w-2xl mx-auto my-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase tracking-tight">
                    No Technical Asset Ingested Yet
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 max-w-md mx-auto leading-relaxed">
                    Upload your codebase archive (.zip) or paste source code. The ArgOS Manifold will unpack your files, calculate AST cyclomatic complexity, and derive valuation metrics and buyer matches directly from your code.
                  </p>
                </div>
                <button
                  id="go-to-intake-btn"
                  onClick={() => setActiveTab('intake')}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase font-mono tracking-wide shadow-[0_0_20px_rgba(37,99,235,0.4)] transition cursor-pointer"
                >
                  <span>Go to Asset Intake & Upload</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* VALUATION TAB */}
        {activeTab === 'valuation' && (
          <div>
            {profile ? (
              <ValuationAndLicensingView
                valuation={profile.valuation}
                useCases={profile.useCases}
                licensingTiers={profile.licensingTiers}
                assetName={profile.asset.name}
                onProceedToContracts={() => setActiveTab('contracts')}
                onProceedToBuyers={() => setActiveTab('buyers')}
              />
            ) : (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 text-center shadow-2xl space-y-3 max-w-lg mx-auto my-8">
                <h3 className="text-sm font-bold text-white font-mono uppercase">Awaiting Asset Upload</h3>
                <p className="text-xs text-neutral-400">Please upload your codebase in the Asset Intake tab to compute valuation scores and licensing tiers.</p>
                <button
                  onClick={() => setActiveTab('intake')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl font-mono cursor-pointer transition"
                >
                  Upload Technical Asset
                </button>
              </div>
            )}
          </div>
        )}

        {/* CONTRACTS TAB */}
        {activeTab === 'contracts' && (
          <div>
            {profile ? (
              <ContractGeneratorView
                contracts={profile.contracts}
                assetName={profile.asset.name}
                onProceedToBuyers={() => setActiveTab('buyers')}
              />
            ) : (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 text-center shadow-2xl space-y-3 max-w-lg mx-auto my-8">
                <h3 className="text-sm font-bold text-white font-mono uppercase">Awaiting Asset Upload</h3>
                <p className="text-xs text-neutral-400">Upload your source files to synthesize legal MLA contracts customized for your asset.</p>
                <button
                  onClick={() => setActiveTab('intake')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl font-mono cursor-pointer transition"
                >
                  Upload Technical Asset
                </button>
              </div>
            )}
          </div>
        )}

        {/* BUYERS TAB */}
        {activeTab === 'buyers' && (
          <div>
            {profile ? (
              <BuyerDiscoveryAndOutreachView
                buyerMatches={profile.buyerMatches}
                assetName={profile.asset.name}
                onOpenAiAudit={() => setIsAiAuditOpen(true)}
              />
            ) : (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 text-center shadow-2xl space-y-3 max-w-lg mx-auto my-8">
                <h3 className="text-sm font-bold text-white font-mono uppercase">Awaiting Asset Upload</h3>
                <p className="text-xs text-neutral-400">Upload your asset in Asset Intake to discover enterprise buyer matches and generate outreach sequences.</p>
                <button
                  onClick={() => setActiveTab('intake')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl font-mono cursor-pointer transition"
                >
                  Upload Technical Asset
                </button>
              </div>
            )}
          </div>
        )}

        {/* API SPEC TAB */}
        {activeTab === 'apispec' && (
          <ApiSpecExplorer />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#141414] bg-[#0a0a0a] py-4 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="text-neutral-400 font-semibold">ArgOS Commercialization Engine</span>
            </div>
            <span className="text-neutral-600">|</span>
            <button
              onClick={() => setIsLicenseOpen(true)}
              className="text-neutral-400 hover:text-blue-400 flex items-center gap-1 font-mono transition cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Apache 2.0 License</span>
            </button>
          </div>
          <div className="text-[11px] text-neutral-600 font-mono">
            Cleanroom AST Analysis & Enterprise Licensing
          </div>
        </div>
      </footer>

      {/* License Modal */}
      <LicenseModal
        isOpen={isLicenseOpen}
        onClose={() => setIsLicenseOpen(false)}
      />

      {/* AI Deep IP Audit Modal */}
      {profile && (
        <AiDeepAuditModal
          isOpen={isAiAuditOpen}
          onClose={() => setIsAiAuditOpen(false)}
          asset={profile.asset}
        />
      )}
    </div>
  );
}
