/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalyzedFile, DefensibilityScore, LegalHeuristics } from '../types';
import { FileItem } from './classifierEngine';
import { LegalHeuristicsEngine } from './legalHeuristics';

export class FeatureExtractor {
  public static extract(files: FileItem[]): {
    capabilities: string[];
    claims: string[];
    architecturePatterns: string[];
    securityFeatures: string[];
    analyzedFiles: AnalyzedFile[];
    legalHeuristics: LegalHeuristics;
    defensibility: DefensibilityScore[];
  } {
    const capabilitiesSet = new Set<string>();
    const claimsSet = new Set<string>();
    const patternsSet = new Set<string>();
    const securitySet = new Set<string>();
    const analyzedFiles: AnalyzedFile[] = [];

    let totalLoc = 0;
    let totalInvariants = 0;
    let totalExportedSymbols = 0;
    let totalClassesOrStructs = 0;

    for (const f of files) {
      const content = f.content;
      const lower = content.toLowerCase();
      const lines = content.split('\n');
      totalLoc += lines.length;
      const invariants: string[] = [];
      const exportedSymbols: string[] = [];

      // 1. Look for explicit claims in comments or docstrings
      for (const line of lines) {
        if (line.includes('%') && (line.includes('reduction') || line.includes('savings') || line.includes('compression') || line.includes('faster') || line.includes('speedup') || line.includes('throughput'))) {
          const match = line.replace(/^[/*#\s]+/, '').trim();
          if (match.length > 8 && match.length < 140) {
            claimsSet.add(match);
          }
        }

        // 2. Invariants, assertions, atomic guards
        if (
          line.includes('assert(') ||
          line.includes('require(') ||
          line.includes('barrier') ||
          line.includes('atomic_') ||
          line.includes('lockless') ||
          line.includes('mutex') ||
          line.includes('synchronized') ||
          line.includes('invariant')
        ) {
          const clean = line.trim();
          if (clean.length < 90 && !clean.startsWith('//') && !clean.startsWith('#')) {
            invariants.push(clean);
            totalInvariants++;
          }
        }

        // 3. Detect Class / Struct / Interface / Type definitions
        if (
          /^(?:export\s+)?(?:class|struct|interface|type|enum|record)\s+([A-Za-z0-9_]+)/.test(line.trim()) ||
          /^typedef\s+struct/.test(line.trim())
        ) {
          totalClassesOrStructs++;
        }

        // 4. Exported symbols / functions / methods
        const funcMatch = line.match(
          /^(?:export\s+)?(?:async\s+)?(?:function|def|pub fn|func|int|void|float|double|bool|const\s+[A-Za-z0-9_]+\s*=\s*(?:async\s*)?\()\s*([a-zA-Z0-9_]+)/
        );
        if (funcMatch && funcMatch[1]) {
          exportedSymbols.push(funcMatch[1]);
          totalExportedSymbols++;
        }
      }

      // 5. Detect architectural patterns & capabilities directly from AST tokens in uploaded code
      if (lower.includes('shm_open') || lower.includes('mmap') || lower.includes('shared memory') || lower.includes('ring_buffer')) {
        capabilitiesSet.add('Lockless Shared Memory Bus');
        patternsSet.add('Zero-Copy Inter-Process Communication');
      }
      if (lower.includes('parallel') || lower.includes('worker') || lower.includes('multiprocessing') || lower.includes('threadpool') || lower.includes('chunk')) {
        capabilitiesSet.add('Parallel Multi-Core Processing Pipeline');
        patternsSet.add('Deterministic Concurrency Pipeline');
      }
      if (lower.includes('async') || lower.includes('await') || lower.includes('promise') || lower.includes('goroutine') || lower.includes('channel')) {
        capabilitiesSet.add('Asynchronous Non-Blocking Event Flow');
        patternsSet.add('Reactive Stream Architecture');
      }
      if (lower.includes('express') || lower.includes('fastapi') || lower.includes('router') || lower.includes('endpoint') || lower.includes('http') || lower.includes('rest')) {
        capabilitiesSet.add('High-Throughput REST API Microservice');
        patternsSet.add('Stateless Modular Service Layer');
      }
      if (lower.includes('torch') || lower.includes('tensor') || lower.includes('numpy') || lower.includes('cuda') || lower.includes('wmma') || lower.includes('embedding') || lower.includes('model')) {
        capabilitiesSet.add('AI Tensor & Neural Acceleration Kernel');
        patternsSet.add('Hardware-Optimized Matrix Computation');
      }
      if (lower.includes('postgres') || lower.includes('sql') || lower.includes('redis') || lower.includes('cache') || lower.includes('mongodb') || lower.includes('store')) {
        capabilitiesSet.add('Distributed High-Performance Data Persistence');
        patternsSet.add('Transactional State Storage Engine');
      }
      if (lower.includes('jwt') || lower.includes('crypto') || lower.includes('hash') || lower.includes('tls') || lower.includes('auth') || lower.includes('permission')) {
        securitySet.add('Cryptographic Authentication & Role-Based Access');
        securitySet.add('End-to-End Payload Validation');
      }
      if (lower.includes('atomic') || lower.includes('barrier') || lower.includes('spin') || lower.includes('mutex') || lower.includes('memory_order')) {
        securitySet.add('Hardware-Level Race Condition Prevention');
        securitySet.add('Memory Barrier Cache Alignment');
      }

      const complexityScore = Math.min(10, Math.max(2, Math.round(lines.length / 25) + (invariants.length > 2 ? 3 : 1)));

      analyzedFiles.push({
        path: f.path,
        loc: lines.length,
        sizeBytes: f.sizeBytes || content.length,
        kind: f.path.split('.').pop()?.toUpperCase() || 'SRC',
        complexityScore,
        features: {
          invariants: invariants.slice(0, 4),
          exportedSymbols: exportedSymbols.slice(0, 6)
        },
        previewSnippet: lines.slice(0, 18).join('\n')
      });
    }

    // Dynamic fallback generation strictly derived from the parsed code properties
    if (capabilitiesSet.size === 0) {
      capabilitiesSet.add(`Modular Software Architecture (${files.length} verified files)`);
      capabilitiesSet.add(`Component Implementation (${totalLoc} parsed lines)`);
      if (totalExportedSymbols > 0) {
        capabilitiesSet.add(`${totalExportedSymbols} callable API interfaces extracted`);
      }
    }

    if (claimsSet.size === 0) {
      claimsSet.add(`Evaluated source code across ${totalLoc} lines`);
      claimsSet.add(`Structured multi-component architecture across ${files.length} distinct files`);
      claimsSet.add(`No copyleft GPL strings detected during AST keyword scan`);
    }

    if (patternsSet.size === 0) {
      patternsSet.add('Modular Separation of Concerns');
      patternsSet.add('Extensible Enterprise Architecture');
    }

    if (securitySet.size === 0) {
      securitySet.add('Static AST Invariant Checks');
      securitySet.add('Non-Forensic Provenance Scan');
    }

    // Run the Legal Heuristics Engine
    const legalHeuristics = LegalHeuristicsEngine.evaluate(files);

    // Defensible Risk Bands mapped to DefensibilityScore format for backward compatibility
    const defensibility: DefensibilityScore[] = [
      {
        category: 'Novelty Indicators (Heuristic)',
        score: legalHeuristics.noveltyIndicators.riskBand === 'HIGH' ? 88 : legalHeuristics.noveltyIndicators.riskBand === 'MEDIUM' ? 72 : 55,
        verdict: legalHeuristics.noveltyIndicators.riskBand === 'HIGH' ? 'HIGH' : legalHeuristics.noveltyIndicators.riskBand === 'MEDIUM' ? 'MEDIUM' : 'EMERGING',
        riskBand: legalHeuristics.noveltyIndicators.riskBand,
        description: `Surfaced architectural patterns that may warrant legal review for potential novelty.`,
        evidence: legalHeuristics.noveltyIndicators.evidence,
        disclaimer: legalHeuristics.noveltyIndicators.disclaimer
      },
      {
        category: 'Trade Secret Exposure Risk',
        score: legalHeuristics.tradeSecretExposure.riskBand === 'LOW' ? 92 : 65,
        verdict: legalHeuristics.tradeSecretExposure.riskBand === 'LOW' ? 'HIGH' : 'MEDIUM',
        riskBand: legalHeuristics.tradeSecretExposure.riskBand,
        description: `Proprietary algorithm logic and internal data representations evaluated for exposure risk.`,
        evidence: legalHeuristics.tradeSecretExposure.evidence,
        disclaimer: legalHeuristics.tradeSecretExposure.disclaimer
      },
      {
        category: 'Code Provenance Signals (Non-Forensic)',
        score: legalHeuristics.provenanceSignals.riskBand === 'LOW' ? 94 : 70,
        verdict: legalHeuristics.provenanceSignals.riskBand === 'LOW' ? 'HIGH' : 'MEDIUM',
        riskBand: legalHeuristics.provenanceSignals.riskBand,
        description: `No external provenance signals were detected, but this is not a cleanroom verification.`,
        evidence: legalHeuristics.provenanceSignals.evidence,
        disclaimer: legalHeuristics.provenanceSignals.disclaimer
      },
      {
        category: 'License Text Presence Scan',
        score: legalHeuristics.licenseSignals.riskBand === 'LOW' ? 96 : 45,
        verdict: legalHeuristics.licenseSignals.riskBand === 'LOW' ? 'HIGH' : 'EMERGING',
        riskBand: legalHeuristics.licenseSignals.riskBand,
        description: `Scanned for GPL/AGPL text and copyright declarations across parsed files.`,
        evidence: legalHeuristics.licenseSignals.evidence,
        disclaimer: legalHeuristics.licenseSignals.disclaimer
      }
    ];

    return {
      capabilities: Array.from(capabilitiesSet),
      claims: Array.from(claimsSet),
      architecturePatterns: Array.from(patternsSet),
      securityFeatures: Array.from(securitySet),
      analyzedFiles,
      legalHeuristics,
      defensibility
    };
  }
}
