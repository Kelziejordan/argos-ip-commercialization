/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, X, Copy, Check, ExternalLink, FileText, Scale } from 'lucide-react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const licenseText = `                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.
      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

   2. Grant of Copyright License.
      Subject to the terms and conditions of this License, each Contributor
      hereby grants to You a perpetual, worldwide, non-exclusive, no-charge,
      royalty-free, irrevocable copyright license to reproduce, prepare
      Derivative Works of, publicly display, publicly perform, sublicense,
      and distribute the Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License.
      Subject to the terms and conditions of this License, each Contributor
      hereby grants to You a perpetual, worldwide, non-exclusive, no-charge,
      royalty-free, irrevocable (except as stated in this section) patent
      license to make, have made, use, offer to sell, sell, import, and
      otherwise transfer the Work.

   4. Redistribution.
      You may reproduce and distribute copies of the Work or Derivative Works
      thereof in any medium, with or without modifications, and in Source or
      Object form, provided that You meet the conditions of this License.

   7. Disclaimer of Warranty.
      Unless required by applicable law or agreed to in writing, Licensor
      provides the Work on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
      OF ANY KIND, either express or implied.

   8. Limitation of Liability.
      In no event and under no legal theory shall any Contributor be liable
      to You for damages arising as a result of this License.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(licenseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1a1a1a] flex items-center justify-between bg-[#0e0e0e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-tight">
                  Open Source License
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Apache-2.0
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                ArgOS IP Commercialization Engine Software License
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-4 text-neutral-300 leading-relaxed whitespace-pre-wrap font-mono text-[11px] max-h-72 overflow-y-auto scrollbar-thin">
            {licenseText}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#080808] border border-[#1a1a1a]">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                Permissions Granted
              </span>
              <ul className="text-[11px] text-neutral-300 space-y-1">
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Commercial & private use
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Modification & distribution
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Patent grant protection
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-[#080808] border border-[#1a1a1a]">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                Requirements & Limits
              </span>
              <ul className="text-[11px] text-neutral-300 space-y-1">
                <li className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Include copyright & license notice
                </li>
                <li className="flex items-center gap-1.5 text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                  State significant changes made
                </li>
                <li className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  No warranty or liability
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#0e0e0e] flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#222] bg-[#050505] hover:bg-[#111] text-neutral-300 text-xs font-mono transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy License Text'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
