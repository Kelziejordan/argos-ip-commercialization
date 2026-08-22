/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssetSourceType } from '../types';

export interface SampleAssetDefinition {
  id: string;
  name: string;
  badge: string;
  description: string;
  sourceType: AssetSourceType;
  files: {
    path: string;
    language: string;
    content: string;
  }[];
}

// Synthetic demonstration assets. These are intentionally unrelated to the product owner's projects.
export const SAMPLE_ASSETS: SampleAssetDefinition[] = [
  {
    id: 'demo-high-performance-cache',
    name: 'High-Performance Cache',
    badge: 'Systems / C++',
    description: 'Synthetic cache engine designed to demonstrate low-latency data access and memory-aware processing.',
    sourceType: 'repo',
    files: [
      {
        path: 'src/cache.cpp',
        language: 'C++',
        content: `#include <cstddef>
#include <cstdint>
#include <vector>

struct CacheEntry {
  uint64_t key;
  uint64_t timestamp;
};

class FastCache {
public:
  explicit FastCache(std::size_t capacity) : entries_(capacity) {}

  bool lookup(uint64_t key, CacheEntry& result) const {
    for (const auto& entry : entries_) {
      if (entry.key == key) {
        result = entry;
        return true;
      }
    }
    return false;
  }

private:
  std::vector<CacheEntry> entries_;
};
`,
      },
    ],
  },
  {
    id: 'demo-stream-processing-pipeline',
    name: 'Stream Processing Pipeline',
    badge: 'Data / Go',
    description: 'Synthetic event pipeline demonstrating batching, back-pressure, and structured stream processing.',
    sourceType: 'repo',
    files: [
      {
        path: 'pipeline.go',
        language: 'Go',
        content: `package pipeline

import "sync"

type Event struct {
  ID   uint64
  Data []byte
}

type Processor struct {
  mu sync.Mutex
  out chan Event
}

func (p *Processor) Submit(event Event) {
  p.mu.Lock()
  defer p.mu.Unlock()
  p.out <- event
}
`,
      },
    ],
  },
  {
    id: 'demo-image-processing-engine',
    name: 'Image Processing Engine',
    badge: 'Compute / Rust',
    description: 'Synthetic image pipeline demonstrating parallel transforms and bounded memory use.',
    sourceType: 'repo',
    files: [
      {
        path: 'src/transform.rs',
        language: 'Rust',
        content: `pub struct Pixel {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

pub fn brighten(pixels: &mut [Pixel], amount: u8) {
    for pixel in pixels.iter_mut() {
        pixel.r = pixel.r.saturating_add(amount);
        pixel.g = pixel.g.saturating_add(amount);
        pixel.b = pixel.b.saturating_add(amount);
    }
}
`,
      },
    ],
  },
  {
    id: 'demo-workload-scheduler',
    name: 'Workload Scheduler',
    badge: 'Concurrency / Python',
    description: 'Synthetic scheduler demonstrating priority queues, worker allocation, and concurrent task handling.',
    sourceType: 'repo',
    files: [
      {
        path: 'scheduler.py',
        language: 'Python',
        content: `from dataclasses import dataclass
from queue import PriorityQueue

@dataclass(order=True)
class Job:
    priority: int
    name: str

class Scheduler:
    def __init__(self):
        self.queue = PriorityQueue()

    def submit(self, priority: int, name: str):
        self.queue.put(Job(priority, name))
`,
      },
    ],
  },
];
