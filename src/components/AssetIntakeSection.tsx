/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileCode, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  FolderArchive, 
  Play, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react';
import { SAMPLE_ASSETS, SampleAssetDefinition } from '../engine/sampleAssets';
import { AssetSourceType } from '../types';

interface AssetIntakeSectionProps {
  onRunAnalysis: (params: {
    inputSource?: string;
    sourceType?: AssetSourceType;
    zipFile?: File;
    customCode?: string;
    assetName?: string;
  }) => Promise<void>;
  isAnalyzing: boolean;
  activeStatus: string;
}

export const AssetIntakeSection: React.FC<AssetIntakeSectionProps> = ({
  onRunAnalysis,
  isAnalyzing,
  activeStatus
}) => {
  const [selectedMode, setSelectedMode] = useState<'upload' | 'code' | 'sample'>('upload');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('argos-supervisor-core');
  const [customCode, setCustomCode] = useState<string>(
`// Paste your C, C++, Python, Rust, Go, TypeScript, or CUDA codebase here...
#include <stdio.h>
#include <stdint.h>

// Enterprise High-Throughput Stream Processing Routine
typedef struct {
    uint64_t sequence_id;
    uint32_t payload_bytes;
    uint32_t status_flags;
} transaction_event_t;

int process_event_stream(transaction_event_t* events, size_t count) {
    if (!events || count == 0) return -1;
    for (size_t i = 0; i < count; i++) {
        events[i].status_flags |= 0x01;
    }
    return 0;
}
`
  );
  const [uploadedZip, setUploadedZip] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSample = SAMPLE_ASSETS.find(s => s.id === selectedSampleId) || SAMPLE_ASSETS[0];

  const handleSampleSelect = (sample: SampleAssetDefinition) => {
    setSelectedSampleId(sample.id);
    setCustomCode(sample.files[0].content);
    setErrorMessage(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setErrorMessage(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedZip(file);
      setSelectedMode('upload');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      setUploadedZip(e.target.files[0]);
    }
  };

  const handleStartAnalysis = async () => {
    setErrorMessage(null);
    try {
      if (selectedMode === 'upload') {
        if (!uploadedZip) {
          setErrorMessage('Please select or drop a .zip archive or code file first.');
          return;
        }
        await onRunAnalysis({
          zipFile: uploadedZip,
          sourceType: 'zip_archive',
          assetName: uploadedZip.name.replace(/\.[^/.]+$/, '')
        });
      } else if (selectedMode === 'code') {
        if (!customCode || customCode.trim().length === 0) {
          setErrorMessage('Please enter or paste some source code before analyzing.');
          return;
        }
        await onRunAnalysis({
          customCode,
          sourceType: 'raw_code',
          assetName: 'Custom Source Code Asset'
        });
      } else if (selectedMode === 'sample') {
        await onRunAnalysis({
          inputSource: selectedSampleId,
          sourceType: selectedSample.sourceType,
          assetName: selectedSample.name
        });
      }
    } catch (err: any) {
      console.error('Intake analysis trigger failed:', err);
      setErrorMessage(err?.message || 'Analysis encountered an error. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8 space-y-8">
      {/* Clean Minimalist Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous IP Commercialization Engine</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          Value & License Your Technical Assets
        </h1>
        <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Upload your codebase or software archive. The engine analyzes code complexity, computes enterprise licensing tiers, and matches qualified buyers.
        </p>
      </div>

      {/* Main Intake Box */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Simple Mode Toggle */}
        <div className="flex items-center justify-center">
          <div className="flex items-center bg-[#050505] p-1 rounded-xl border border-[#1a1a1a] gap-1">
            <button
              id="intake-tab-upload"
              onClick={() => setSelectedMode('upload')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedMode === 'upload'
                  ? 'bg-[#1a1a1a] text-white border border-[#2a2a2a] shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
              <span>Upload Archive (.zip)</span>
            </button>
            <button
              id="intake-tab-code"
              onClick={() => setSelectedMode('code')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedMode === 'code'
                  ? 'bg-[#1a1a1a] text-white border border-[#2a2a2a] shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>Paste Source Code</span>
            </button>
            <button
              id="intake-tab-sample"
              onClick={() => setSelectedMode('sample')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedMode === 'sample'
                  ? 'bg-[#1a1a1a] text-white border border-[#2a2a2a] shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Try a Sample</span>
            </button>
          </div>
        </div>

        {/* Upload Mode */}
        {selectedMode === 'upload' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.tar,.gz,.tgz,.c,.cpp,.h,.py,.rs,.go,.ts,.js,.java"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              id="drag-drop-zone"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 md:p-10 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                dragOver
                  ? 'border-blue-400 bg-blue-950/20'
                  : uploadedZip
                  ? 'border-blue-500/50 bg-[#050505]'
                  : 'border-[#1e1e1e] hover:border-blue-500/40 bg-[#050505]'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FolderArchive className="w-6 h-6" />
              </div>
              {uploadedZip ? (
                <div>
                  <p className="text-sm font-semibold text-white font-mono">
                    {uploadedZip.name}
                  </p>
                  <p className="text-xs text-blue-400 mt-1 font-mono">
                    {(uploadedZip.size / 1024).toFixed(1)} KB — Ready to analyze
                  </p>
                  <span className="text-[11px] text-neutral-500 mt-2 block underline">Click to choose a different file</span>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-white">
                    Drop your <strong className="text-blue-400">.zip</strong> archive or source files here
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    or click to browse from your computer
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Paste Code Mode */}
        {selectedMode === 'code' && (
          <div>
            <textarea
              id="code-editor-textarea"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              rows={8}
              className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl p-3.5 text-xs font-mono text-blue-300 focus:outline-none focus:border-blue-500 scrollbar-thin"
              placeholder="Paste C, C++, Python, Rust, Go, or TypeScript source code here..."
            />
          </div>
        )}

        {/* Try Sample Mode */}
        {selectedMode === 'sample' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_ASSETS.map((sample) => {
              const isSelected = selectedSampleId === sample.id;
              return (
                <div
                  key={sample.id}
                  id={`sample-card-${sample.id}`}
                  onClick={() => handleSampleSelect(sample)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#111111] border-blue-500/60 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                      : 'bg-[#050505] border-[#1a1a1a] hover:border-[#2a2a2a]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#111111] text-blue-400 border border-[#1a1a1a]">
                        {sample.badge}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1 font-mono">{sample.name}</h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{sample.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            id="run-analysis-btn"
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || (selectedMode === 'upload' && !uploadedZip)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(37,99,235,0.4)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-mono"
          >
            {isAnalyzing ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                <span>{activeStatus.toUpperCase()}...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Analyze & Value Technical Asset</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Clean 3-Step Preview (Zero Edge Noise) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">1. AST & Complexity Scan</h3>
            <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
              Extracts verified lines, cyclomatic complexity, invariants, and cleanroom IP defensibility.
            </p>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">2. Valuation & Tiers</h3>
            <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
              Calculates engineering replacement cost, TAM yield, and enterprise licensing contracts.
            </p>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">3. Buyer Matching</h3>
            <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
              Matches qualified corporate buyers and generates targeted executive outreach sequences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
