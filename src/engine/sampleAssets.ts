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

export const SAMPLE_ASSETS: SampleAssetDefinition[] = [
  {
    id: "argos-supervisor-core",
    name: "ArgOS Autonomous Operating Substrate",
    badge: "Flagship / C + Assembly",
    description: "Production supervisor daemon featuring 16-way chunk sequence manifold, zero-copy lockless shared memory IPC, and verified 94% compute compression.",
    sourceType: "repo",
    files: [
      {
        path: "src/supervisor.c",
        language: "C",
        content: `/**
 * @file supervisor.c
 * @brief Autonomous Root Daemon for ArgOS 16-Way Manifold
 * * Proven 94% compute cost reduction via zero-copy lockless ring buffers
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/mman.h>
#include <sys/wait.h>
#include <pthread.h>
#include "argos_ipc.h"
#include "argos_defs.h"

#define NUM_WORKERS 16
#define SHM_NAME "/argos_core_manifold"
#define MANIFOLD_CAPACITY (64 * 1024 * 1024)

typedef struct {
    pid_t pids[NUM_WORKERS];
    volatile int active_workers;
    shm_manifold_t *shared_bus;
    pthread_mutex_t root_lock;
} supervisor_context_t;

static supervisor_context_t g_ctx;

int init_root_manifold(supervisor_context_t *ctx) {
    int shm_fd = shm_open(SHM_NAME, O_CREAT | O_RDWR, 0660);
    if (shm_fd < 0) {
        perror("shm_open failed");
        return -1;
    }
    ftruncate(shm_fd, MANIFOLD_CAPACITY);
    ctx->shared_bus = (shm_manifold_t*)mmap(NULL, MANIFOLD_CAPACITY, 
                                            PROT_READ | PROT_WRITE, 
                                            MAP_SHARED, shm_fd, 0);
    return 0;
}

void spawn_worker_pool(supervisor_context_t *ctx) {
    for (int i = 0; i < NUM_WORKERS; i++) {
        pid_t pid = fork();
        if (pid == 0) {
            // Worker child process executing lockless chunk queue
            worker_exec_loop(i, ctx->shared_bus);
            exit(0);
        } else {
            ctx->pids[i] = pid;
            ctx->active_workers++;
        }
    }
}
`
      },
      {
        path: "include/argos_ipc.h",
        language: "C",
        content: `/**
 * @file argos_ipc.h
 * @brief Zero-copy lockless atomic memory bus
 */

#ifndef ARGOS_IPC_H
#define ARGOS_IPC_H

#include <stdatomic.h>
#include <stdint.h>

#define CHUNK_SIZE_BYTES (4 * 1024 * 1024)
#define MAX_RING_ELEMENTS 1024

typedef struct {
    atomic_uint_fast64_t sequence_id;
    uint32_t payload_len;
    uint8_t raw_buffer[CHUNK_SIZE_BYTES];
} chunk_descriptor_t;

typedef struct {
    atomic_uint_fast64_t head_index;
    atomic_uint_fast64_t tail_index;
    chunk_descriptor_t ring_buffer[MAX_RING_ELEMENTS];
} shm_manifold_t;

int push_chunk_atomic(shm_manifold_t *bus, const uint8_t *data, uint32_t len);
int pop_chunk_atomic(shm_manifold_t *bus, uint8_t *dest, uint32_t *len);

#endif
`
      },
      {
        path: "arch/x86_64/spin_barrier.s",
        language: "Assembly",
        content: `/*
 * High-performance hardware spin barrier with PAUSE hint
 * Guarantees zero bus congestion under 16-way concurrent contention
 */
.global argos_atomic_barrier
.text

argos_atomic_barrier:
    movq $0, %rax
1:
    pause
    cmpq $0, (%rdi)
    jne 1b
    ret
`
      }
    ]
  },
  {
    id: "tensor-quant-kernel",
    name: "QuantCore 4-Bit Tensor Inference Engine",
    badge: "AI Kernel / CUDA + C++",
    description: "Hardware-accelerated INT4/FP8 fused GEMM matrix engine achieving 4.8x higher tokens/sec and 78% VRAM reduction on datacenter GPUs.",
    sourceType: "repo",
    files: [
      {
        path: "src/fused_gemm.cu",
        language: "CUDA",
        content: `/**
 * QuantCore INT4 Fused Tensor Core Kernel
 * 78% VRAM footprint compression with zero accuracy degradation
 */
#include <cuda_runtime.h>
#include <mma.h>

__global__ void wmma_int4_fused_kernel(const half* __restrict__ A, 
                                      const uint8_t* __restrict__ B_quant, 
                                      half* __restrict__ C, 
                                      int M, int N, int K) {
    nvcuda::wmma::fragment<nvcuda::wmma::matrix_a, 16, 16, 16, half, nvcuda::wmma::row_major> a_frag;
    nvcuda::wmma::fragment<nvcuda::wmma::matrix_b, 16, 16, 16, half, nvcuda::wmma::col_major> b_frag;
    nvcuda::wmma::fragment<nvcuda::wmma::accumulator, 16, 16, 16, float> c_frag;
    nvcuda::wmma::fill_fragment(c_frag, 0.0f);
}
`
      }
    ]
  },
  {
    id: "aegis-nav-slam",
    name: "Aegis-Nav Fault-Tolerant LiDAR SLAM",
    badge: "Robotics / Rust + C++",
    description: "Sub-centimeter autonomous mobile robot navigation stack with real-time obstacle avoidance and IMU/LiDAR sensor fusion.",
    sourceType: "repo",
    files: [
      {
        path: "src/fusion_ekf.rs",
        language: "Rust",
        content: `//! Aegis-Nav Extended Kalman Filter for 3D Pose Estimation & Fault Recovery
use std::sync::atomic::AtomicBool;

pub struct EKFTracker {
    pub state_x: f64,
    pub state_y: f64,
    pub velocity: f64,
    pub is_healthy: AtomicBool,
}
`
      }
    ]
  },
  {
    id: "synapse-db-stream",
    name: "SynapseDB Zero-Copy Streaming Ledger",
    badge: "Distributed DB / Go",
    description: "Append-only real-time telemetry ledger offering sub-millisecond p99 latency and 99.999% crash consistency.",
    sourceType: "repo",
    files: [
      {
        path: "engine/wal.go",
        language: "Go",
        content: `package engine

import (
	"os"
	"sync/atomic"
)

type WriteAheadLog struct {
	file   *os.File
	offset atomic.Uint64
}
`
      }
    ]
  }
];
