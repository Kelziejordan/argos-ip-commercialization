/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Cpu,
  FileCode,
  FolderArchive,
  Play,
  UploadCloud,
  Zap,
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

const CODE_EXAMPLE = `function processBatch(items) {
  return items
    .filter(item => item.ready)
    .map(item => transform(item));
}`;

export const AssetIntakeSection: React.FC<AssetIntakeSectionProps> = ({
  onRunAnalysis,
  isAnalyzing,
  activeStatus,
}) => {
  const [selectedMode, setSelectedMode] = useState<'upload' | 'code' | 'sample'>('upload');
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_ASSETS[0]?.id ?? '');
  const [customCode, setCustomCode] = useState('');
  const [uploadedZip, setUploadedZip] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSample = SAMPLE_ASSETS.find((sample) => sample.id === selectedSampleId) ?? SAMPLE_ASSETS[0];

  const selectMode = (mode: 'upload' | 'code' | 'sample') => {
    setSelectedMode(mode);
    setErrorMessage(null);
    if (mode === 'code') setCustomCode('');
  };

  const handleSampleSelect = (sample: SampleAssetDefinition) => {
    setSelectedSampleId(sample.id);
    setSelectedMode('sample');
    setErrorMessage(null);
  };

  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    setErrorMessage(null);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setUploadedZip(file);
      setSelectedMode('upload');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = event.target.files?.[0];
    if (file) setUploadedZip(file);
  };

  const handleStartAnalysis = async () => {
    setErrorMessage(null);
    try {
      if (selectedMode === 'upload') {
        if (!uploadedZip) {
          setErrorMessage('Choose a .zip archive or source file first.');
          return;
        }
        await onRunAnalysis({
          zipFile: uploadedZip,
          sourceType: 'zip_archive',
          assetName: uploadedZip.name.replace(/\.[^/.]+$/, ''),
        });
        return;
      }

      if (selectedMode === 'code') {
        if (!customCode.trim()) {
          setErrorMessage('Paste some source code before analyzing.');
          return;
        }
        await onRunAnalysis({
          customCode,
          sourceType: 'raw_code',
          assetName: 'Custom Source Code Asset',
        });
        return;
      }

      if (!selectedSample) {
        setErrorMessage('Choose a sample first.');
        return;
      }

      await onRunAnalysis({
        inputSource: selectedSample.id,
        sourceType: selectedSample.sourceType,
        assetName: selectedSample.name,
      });
    } catch (error: any) {
      console.error('Intake analysis trigger failed:', error);
      setErrorMessage(error?.message || 'Analysis encountered an error. Please try again.');
    }
  };

  const actionLabel =
    selectedMode === 'sample'
      ? 'Analyze Sample'
      : selectedMode === 'code'
        ? 'Analyze My Code'
        : 'Analyze My Asset';

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 md:py-14">
      <section className="text-center max-w-3xl mx-auto">
        <div className="text-[10px] md:text-xs font-mono tracking-[0.28em] uppercase text-blue-400 mb-5">
          ArgOS // IP Commercialization
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          You built something.<br />
          <span className="text-neutral-300">Let&apos;s find out what it&apos;s worth.</span>
        </h1>
        <p className="mt-5 text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Turn your code, software, or technical asset into a clear commercial opportunity.
        </p>
      </section>

      <section className="max-w-2xl mx-auto mt-8 md:mt-10">
        <div className="rounded-2xl border border-[#1d1d1d] bg-[#090909] p-4 md:p-5 shadow-2xl">
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#050505] border border-[#171717]">
            <button id="intake-tab-upload" type="button" onClick={() => selectMode('upload')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${selectedMode === 'upload' ? 'bg-[#181818] text-white' : 'text-neutral-500 hover:text-white'}`}>
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Asset</span>
            </button>
            <button id="intake-tab-sample" type="button" onClick={() => selectMode('sample')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${selectedMode === 'sample' ? 'bg-[#181818] text-white' : 'text-neutral-500 hover:text-white'}`}>
              <Zap className="w-3.5 h-3.5" />
              <span>Try a Sample</span>
            </button>
            <button id="intake-tab-code" type="button" onClick={() => selectMode('code')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${selectedMode === 'code' ? 'bg-[#181818] text-white' : 'text-neutral-500 hover:text-white'}`}>
              <FileCode className="w-3.5 h-3.5" />
              <span>Paste Code</span>
            </button>
          </div>

          {selectedMode === 'upload' && (
            <div className="mt-4">
              <input ref={fileInputRef} type="file" accept=".zip,.tar,.gz,.tgz,.c,.cpp,.h,.py,.rs,.go,.ts,.js,.java" className="hidden" onChange={handleFileChange} />
              <button id="drag-drop-zone" type="button" onDragOver={(event) => { event.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleFileDrop} onClick={() => fileInputRef.current?.click()} className={`w-full min-h-44 rounded-xl border border-dashed px-6 py-8 flex flex-col items-center justify-center gap-3 text-center transition ${dragOver ? 'border-blue-400 bg-blue-950/20' : uploadedZip ? 'border-blue-500/50 bg-blue-950/10' : 'border-[#242424] hover:border-[#3b3b3b] bg-[#050505]'}`}>
                <FolderArchive className="w-7 h-7 text-blue-400" />
                {uploadedZip ? (
                  <>
                    <span className="text-sm font-semibold text-white break-all">{uploadedZip.name}</span>
                    <span className="text-xs text-blue-400">Ready to analyze</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium text-white">Drop your .zip or source files here</span>
                    <span className="text-xs text-neutral-500">or click to browse from your computer</span>
                  </>
                )}
              </button>
            </div>
          )}

          {selectedMode === 'sample' && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-neutral-500 px-1">Choose a demonstration asset to see how ArgOS works.</p>
              <div className="grid gap-2">
                {SAMPLE_ASSETS.map((sample) => {
                  const isSelected = selectedSampleId === sample.id;
                  return (
                    <button key={sample.id} id={`sample-card-${sample.id}`} type="button" onClick={() => handleSampleSelect(sample)} className={`w-full text-left rounded-xl border px-4 py-3 transition ${isSelected ? 'border-blue-500/60 bg-blue-950/10' : 'border-[#1b1b1b] bg-[#050505] hover:border-[#333333]'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-blue-400 mb-1">{sample.badge}</div>
                          <div className="text-sm font-semibold text-white">{sample.name}</div>
                          <div className="text-xs text-neutral-500 mt-1">{sample.description}</div>
                        </div>
                        {isSelected && <span className="text-[10px] text-blue-400">SELECTED</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedMode === 'code' && (
            <div className="mt-4">
              <textarea id="code-editor-textarea" value={customCode} onChange={(event) => setCustomCode(event.target.value)} onFocus={() => setCustomCode('')} rows={9} spellCheck={false} aria-label="Paste source code" placeholder={CODE_EXAMPLE} className="w-full resize-y rounded-xl border border-[#1d1d1d] bg-[#050505] p-4 text-xs leading-relaxed font-mono text-blue-200 placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/60" />
              <p className="mt-2 px-1 text-[11px] text-neutral-600">Paste your code. The example disappears when you start.</p>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 rounded-xl border border-red-500/40 bg-red-950/30 px-3 py-2.5 flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button id="run-analysis-btn" type="button" onClick={handleStartAnalysis} disabled={isAnalyzing || (selectedMode === 'upload' && !uploadedZip) || (selectedMode === 'code' && !customCode.trim())} className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 disabled:text-neutral-500 text-white font-bold py-3.5 px-6 text-sm transition disabled:cursor-not-allowed">
            {isAnalyzing ? (
              <><Cpu className="w-4 h-4 animate-spin" /><span>{activeStatus || 'Analyzing'}...</span></>
            ) : (
              <><Play className="w-4 h-4 fill-current" /><span>{actionLabel}</span><ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          <p className="mt-3 text-center text-[10px] text-neutral-600">No technical expertise required. Your analysis stays focused on your asset.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto mt-14 md:mt-20">
        <div className="text-center mb-5">
          <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-600">The commercialization process</div>
          <h2 className="mt-2 text-lg md:text-xl font-semibold text-white">What you&apos;ll discover</h2>
        </div>
        <div className="grid gap-2.5">
          {[
            ['What you built', 'A plain-English explanation of your technology and its capabilities.'],
            ['What it could be worth', 'A screening estimate based on the evidence in your submission.'],
            ['Who might want it', 'Potential industries and buyers that may have a use for it.'],
            ['How you could monetize it', 'Licensing, acquisition, OEM, or other commercial paths.'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-xl border border-[#171717] bg-[#070707] px-5 py-4">
              <div className="text-xs font-semibold text-white">{title}</div>
              <div className="mt-1 text-xs text-neutral-500 leading-relaxed">{description}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
