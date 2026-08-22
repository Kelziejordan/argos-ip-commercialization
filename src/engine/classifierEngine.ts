/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CertaintyLevel, PrimaryKind, SizeMetrics } from '../types';

export interface FileItem {
  path: string;
  content: string;
  sizeBytes?: number;
}

export class AssetClassifier {
  private static extensionMap: Record<string, string> = {
    'c': 'C',
    'h': 'C',
    'cpp': 'C++',
    'hpp': 'C++',
    'cc': 'C++',
    'rs': 'Rust',
    'go': 'Go',
    'py': 'Python',
    'cu': 'CUDA',
    'cuh': 'CUDA',
    's': 'Assembly',
    'asm': 'Assembly',
    'ts': 'TypeScript',
    'tsx': 'TypeScript',
    'js': 'JavaScript',
    'jsx': 'JavaScript',
    'java': 'Java',
    'json': 'JSON',
    'onnx': 'ONNX',
    'bin': 'Binary',
    'md': 'Markdown'
  };

  public static classify(files: FileItem[]): {
    primarykind: PrimaryKind;
    confidence: number;
    certainty: CertaintyLevel;
    languages: string[];
  } {
    if (files.length === 0) {
      return {
        primarykind: 'codelibrary',
        confidence: 0,
        certainty: 'INSUFFICIENT',
        languages: []
      };
    }

    const languageCounts: Record<string, number> = {};
    let osSubstrateWeight = 0;
    let aiModelWeight = 0;
    let distributedWeight = 0;
    let libraryWeight = 0;
    let datasetWeight = 0;

    for (const f of files) {
      const ext = f.path.split('.').pop()?.toLowerCase() || '';
      const lang = this.extensionMap[ext] || 'Unknown';
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;

      const lowerContent = f.content.toLowerCase();

      // OS / Kernel Substrate indicators
      if (
        lowerContent.includes('shm_open') ||
        lowerContent.includes('mmap') ||
        lowerContent.includes('supervisor') ||
        lowerContent.includes('ring_buffer') ||
        lowerContent.includes('daemon') ||
        lowerContent.includes('pthread') ||
        lowerContent.includes('barrier') ||
        ext === 'c' || ext === 's' || ext === 'asm'
      ) {
        osSubstrateWeight += 3.5;
      }

      // AI / Tensor indicators
      if (
        lowerContent.includes('cuda') ||
        lowerContent.includes('gemm') ||
        lowerContent.includes('tensor') ||
        lowerContent.includes('quant') ||
        lowerContent.includes('wmma') ||
        ext === 'cu' || ext === 'cuh' || ext === 'onnx'
      ) {
        aiModelWeight += 4.0;
      }

      // Distributed systems indicators
      if (
        lowerContent.includes('consensus') ||
        lowerContent.includes('wal') ||
        lowerContent.includes('raft') ||
        lowerContent.includes('grpc') ||
        lowerContent.includes('replication') ||
        ext === 'go' || ext === 'rs'
      ) {
        distributedWeight += 3.0;
      }

      // Dataset indicators
      if (ext === 'json' || ext === 'csv' || ext === 'parquet' || lowerContent.includes('dataset')) {
        datasetWeight += 2.0;
      }

      libraryWeight += 1.0;
    }

    const languages = Object.keys(languageCounts)
      .filter(l => l !== 'Unknown' && l !== 'Markdown' && l !== 'JSON')
      .sort((a, b) => (languageCounts[b] || 0) - (languageCounts[a] || 0));

    const weights: { kind: PrimaryKind; score: number }[] = [
      { kind: 'ossubstrate', score: osSubstrateWeight },
      { kind: 'aimodel', score: aiModelWeight },
      { kind: 'distributed_system', score: distributedWeight },
      { kind: 'dataset', score: datasetWeight },
      { kind: 'codelibrary', score: libraryWeight }
    ];

    weights.sort((a, b) => b.score - a.score);
    const top = weights[0];
    const totalScore = weights.reduce((acc, curr) => acc + curr.score, 0);

    // Raw confidence directly from evidence ratio (0 - 1) — NO artificial clamping!
    const rawConfidence = totalScore > 0 
      ? Math.round((top.score / totalScore) * 100) / 100 
      : 0;

    let certainty: CertaintyLevel;
    if (files.length === 0) {
      certainty = 'INSUFFICIENT';
    } else if (rawConfidence >= 0.70) {
      certainty = 'HIGH';
    } else if (rawConfidence >= 0.40) {
      certainty = 'MEDIUM';
    } else if (rawConfidence >= 0.15 || files.length > 0) {
      certainty = 'LOW';
    } else {
      certainty = 'INSUFFICIENT';
    }

    return {
      primarykind: top.kind,
      confidence: rawConfidence,
      certainty,
      languages: languages.length > 0 ? languages : ['Generic Source']
    };
  }

  /**
   * Evidence-based size metric calculation:
   * Strips out artificial minimums or presentation inflation (e.g. Math.max(loc, 1420)).
   * Accurately reflects raw measured lines, structures, and function definitions.
   */
  public static calculateSizeMetrics(files: FileItem[]): SizeMetrics {
    let loc = 0;
    let classesOrStructs = 0;
    let functionsOrMethods = 0;

    for (const f of files) {
      const lines = f.content.split('\n');
      loc += lines.length;

      for (const line of lines) {
        const trimmed = line.trim();
        if (
          trimmed.startsWith('struct ') ||
          trimmed.startsWith('typedef struct') ||
          trimmed.startsWith('class ') ||
          trimmed.startsWith('pub struct ') ||
          trimmed.startsWith('type ') ||
          trimmed.startsWith('interface ') ||
          trimmed.startsWith('enum ')
        ) {
          classesOrStructs++;
        }

        if (
          (trimmed.includes('(') && trimmed.endsWith('{') && !trimmed.startsWith('if') && !trimmed.startsWith('for') && !trimmed.startsWith('while')) ||
          trimmed.startsWith('void ') ||
          trimmed.startsWith('int ') ||
          trimmed.startsWith('pub fn ') ||
          trimmed.startsWith('def ') ||
          trimmed.startsWith('func ') ||
          (trimmed.startsWith('const ') && trimmed.includes('=>'))
        ) {
          functionsOrMethods++;
        }
      }
    }

    // Measure raw architectural density index from parsed structures per file
    const cyclomaticIndex = files.length > 0
      ? Math.round(((functionsOrMethods * 1.2 + classesOrStructs * 0.8) / Math.max(1, files.length)) * 10) / 10
      : 0;

    return {
      loc,
      file_count: files.length,
      classes_or_structs: classesOrStructs,
      functions_or_methods: functionsOrMethods,
      cyclomatic_index: cyclomaticIndex
    };
  }
}
