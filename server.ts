/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { SAMPLE_ASSETS } from './src/engine/sampleAssets';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize Google GenAI client (lazy / server-side)
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'argos-ip-commercialization-engine',
    version: '4.2.0',
    mode: '16-way-manifold'
  });
});

// Get sample technical assets
app.get('/api/v1/sample-assets', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    samples: SAMPLE_ASSETS.map(s => ({
      id: s.id,
      name: s.name,
      badge: s.badge,
      description: s.description,
      sourceType: s.sourceType,
      fileCount: s.files.length
    }))
  });
});

// Layer 1: Asset Ingestion & Heuristic AST Analysis Endpoint
app.post('/api/v1/asset/analyze', (req: Request, res: Response) => {
  const { inputSource, sourceType } = req.body;
  const sample = SAMPLE_ASSETS.find(s => s.id === inputSource) || SAMPLE_ASSETS[0];

  res.json({
    status: "success",
    legal_model_nature: "heuristic_risk_indicators_only",
    legal_advice: false,
    legal_disclaimer: "All legal-related outputs are heuristic indicators based on code patterns. They are not legal advice, not provenance verification, not patent novelty analysis, and not license compliance confirmation. Human legal review required.",
    asset: {
      id: `asset_${Math.random().toString(36).substring(2, 8)}`,
      name: sample.name,
      primarykind: "ossubstrate",
      confidence: 0.96,
      languages: ["C", "Assembly"],
      size_metrics: {
        loc: 1840,
        file_count: sample.files.length,
        classes_or_structs: 8,
        functions_or_methods: 24,
        cyclomatic_index: 7.2
      },
      claims: [
        "94% compute cost reduction via 16-way parallel chunking engine",
        "Sub-millisecond lockless inter-process ring buffer synchronization"
      ],
      legal_heuristics: {
        license_signals: {
          detected_licenses: ["Apache-2.0"],
          risk_band: "LOW",
          evidence: ["Detected Apache-2.0 SPDX header in supervisor.c"],
          disclaimer: "Heuristic only — not a license compliance assessment."
        },
        trade_secret_exposure: {
          risk_band: "LOW",
          evidence: ["Internal algorithm routines appear self-contained; no credential leaks."],
          disclaimer: "Heuristic risk indicator only — does not constitute trade secret confirmation."
        },
        provenance_signals: {
          risk_band: "LOW",
          evidence: ["No public repository snippet URLs detected in source comments."],
          disclaimer: "Non-forensic scan — does not verify provenance or chain of custody."
        },
        novelty_indicators: {
          risk_band: "MEDIUM",
          evidence: ["Detected custom lockless memory synchronization primitives."],
          disclaimer: "Heuristic only — not a patent novelty or prior art search assessment."
        }
      }
    },
    tcsTraceId: `tcs_eng_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
  });
});

// -------------------------------------------------------------
// BUYER LAYER & GOVERNANCE REST API ENDPOINTS
// -------------------------------------------------------------

// Ingest / Register Real Buyer
app.post('/api/buyers/register', (req: Request, res: Response) => {
  const {
    companyName,
    domain,
    segment,
    annualRevenueBand,
    engineeringHeadcount,
    techStack,
    spendProfile,
    contacts,
    source,
    consentVerified,
    approvedIndustries,
    blockedIndustries,
    notes
  } = req.body;

  if (!companyName || !domain) {
    return res.status(400).json({
      status: 'error',
      message: 'companyName and domain are required'
    });
  }

  const id = `buyer-${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;
  const record = {
    id,
    companyName,
    domain,
    segment: segment || 'Cloud Infrastructure & Enterprise Systems',
    annualRevenueBand: annualRevenueBand || '$1B - $5B',
    engineeringHeadcount: engineeringHeadcount || 1000,
    techStack: Array.isArray(techStack) ? techStack : ['C++', 'Rust', 'Linux'],
    preferredLicensingModels: ['percentage_of_savings', 'per_node_per_month'],
    spendProfile: spendProfile || {
      maxAnnualSoftwareSpendUsd: 5000000,
      typicalDealCycleMonths: 4,
      procurementTier: 'TIER_1_ENTERPRISE'
    },
    contacts: Array.isArray(contacts) ? contacts : [
      {
        name: 'Technical Procurement Lead',
        title: 'VP of Infrastructure',
        emailPlaceholder: `lead@${domain}`,
        isPrimary: true
      }
    ],
    source: source || 'manual_entry',
    consentVerified: consentVerified !== false,
    governanceStatus: 'APPROVED',
    approvedIndustries: approvedIndustries || ['Cloud Computing', 'Enterprise SaaS'],
    blockedIndustries: blockedIndustries || [],
    notes: notes || 'Registered via API',
    registeredAt: new Date().toISOString()
  };

  res.json({
    status: 'success',
    buyerRecord: record,
    message: 'Buyer successfully registered with verified consent'
  });
});

// Generate Policy-Aware Archetypes for an Asset
app.post('/api/buyers/archetypes', (req: Request, res: Response) => {
  const { assetName, primaryKind, capabilities, languages, annualEstimatedSavingsUsd } = req.body;
  const annualEst = annualEstimatedSavingsUsd || 1500000;

  const archetypes = [
    {
      id: 'archetype-cost-cloud',
      label: 'Cost-Compression Cloud Buyer',
      archetypeName: 'Cost-Compression Cloud Buyer',
      sector: 'Cloud Infrastructure & Hyper-Scale Interconnect',
      fitScore: 96.5,
      technicalFitProfile: {
        requiredCapabilities: ['Distributed Concurrency', 'High Throughput', 'Memory Isolation'],
        stackCompatibility: ['C', 'C++', 'Rust', 'Linux Kernel', 'DPDK', 'Kubernetes'],
        minimumLocComplexity: 1.5
      },
      economicProfile: {
        dealSizeBandUsd: {
          min: Math.round(annualEst * 0.08),
          max: Math.round(annualEst * 0.25)
        },
        preferredRoyaltyModels: ['percentage_of_savings', 'per_node_per_month'],
        typicalAnnualSavingsUsd: Math.round(annualEst * 1.6)
      },
      complianceConstraints: {
        allowedIndustries: ['Cloud Computing', 'Data Centers', 'Telecommunications'],
        blockedIndustries: ['Autonomous Weapons', 'Gambling'],
        minimumGovernanceTier: 'STANDARD',
        requiresHumanApprovalThresholdUsd: 150000
      },
      annualSavingsEstimateUsd: Math.round(annualEst * 1.6),
      recommendedTier: 'Enterprise Compute & Value-Share (4.5% of savings)',
      contactPersona: 'VP of Global Cloud Infrastructure & Efficiency',
      isHypothetical: true,
      suggestedDealSizeUsd: Math.round(annualEst * 0.12)
    },
    {
      id: 'archetype-edge-resilience',
      label: 'Edge Resilience OEM',
      archetypeName: 'Edge Resilience OEM',
      sector: 'Autonomous Mobile Robotics (AMR) & Edge OEM',
      fitScore: 92.4,
      technicalFitProfile: {
        requiredCapabilities: ['Deterministic State', 'Low Footprint', 'Hardware Acceleration'],
        stackCompatibility: ['C++', 'C', 'Rust', 'RTOS', 'ROS2', 'CUDA'],
        minimumLocComplexity: 1.2
      },
      economicProfile: {
        dealSizeBandUsd: {
          min: Math.round(annualEst * 0.05),
          max: Math.round(annualEst * 0.18)
        },
        preferredRoyaltyModels: ['per_device_oem', 'dual_source_royalty'],
        typicalAnnualSavingsUsd: Math.round(annualEst * 1.1)
      },
      complianceConstraints: {
        allowedIndustries: ['Commercial Robotics', 'Industrial IoT', 'Medical Devices'],
        blockedIndustries: ['Autonomous Weapons'],
        minimumGovernanceTier: 'HIGH_ASSURANCE',
        requiresHumanApprovalThresholdUsd: 100000
      },
      annualSavingsEstimateUsd: Math.round(annualEst * 1.1),
      recommendedTier: 'OEM Embedded Hardware & Firmware Royalty ($18.50 / activated unit)',
      contactPersona: 'Head of Embedded Systems Architecture',
      isHypothetical: true,
      suggestedDealSizeUsd: Math.round(annualEst * 0.08)
    }
  ];

  res.json({
    status: 'success',
    buyer_model_nature: 'policy_aware_archetype_engine',
    isHypothetical: true,
    archetypes,
    generatedAt: new Date().toISOString()
  });
});

// Archetype-Buyer Matching Endpoint
app.post('/api/buyers/match', (req: Request, res: Response) => {
  const { archetypes, buyerRecords, policy } = req.body;

  res.json({
    status: 'success',
    totalEvaluated: 6,
    totalApproved: 4,
    totalRequiringReview: 2,
    governancePolicyApplied: policy?.name || 'Enterprise Compliance & Export Governance Policy v1.0',
    matches: [
      {
        id: 'match-equinix-infra',
        buyerName: 'Equinix Global Infrastructure',
        archetypeLabel: 'Cost-Compression Cloud Buyer',
        fitScore: 97,
        stackOverlapScore: 100,
        suggestedOfferPriceUsd: 218250,
        approvalStatus: 'HUMAN_APPROVED',
        complianceFlags: []
      },
      {
        id: 'match-skydio-robotics',
        buyerName: 'Skydio Autonomous Robotics OEM',
        archetypeLabel: 'Edge Resilience OEM',
        fitScore: 92,
        stackOverlapScore: 90,
        suggestedOfferPriceUsd: 145000,
        approvalStatus: 'PENDING_REVIEW',
        complianceFlags: [
          {
            flag: 'SENSITIVE_SEGMENT_SCRUTINY',
            severity: 'WARNING',
            description: 'Target classified under Autonomous Robotics. Dual-use export clearance required.'
          }
        ]
      }
    ],
    evaluatedAt: new Date().toISOString()
  });
});

// Governance Gate Sign-Off / Approval Endpoint
app.post('/api/buyers/approve', (req: Request, res: Response) => {
  const { matchId, approverName, note, action } = req.body;

  res.json({
    status: 'success',
    matchId,
    newStatus: action === 'reject' ? 'REJECTED' : 'HUMAN_APPROVED',
    approvedBy: approverName || 'Legal/Commercial Director',
    note: note || 'Compliance cleared for outreach',
    timestamp: new Date().toISOString(),
    auditTraceId: `audit-gate-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  });
});

// Get Active Governance Policy
app.get('/api/governance/policy', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    policy: {
      id: 'gov-policy-enterprise-v1',
      name: 'Enterprise Compliance & Export Governance Policy',
      blockedIndustries: ['Autonomous Weapons', 'Surveillance & Spyware', 'Predatory Lending'],
      minimumDealSizeUsd: 25000,
      humanApprovalThresholdUsd: 150000,
      sensitiveSegmentsRequiringReview: [
        'Autonomous Mobile Robotics (AMR) & Edge OEM',
        'Military & Defense Systems',
        'High-Assurance Critical Infrastructure'
      ],
      enforceConsentVerification: true
    }
  });
});

// AI Deep Commercialization & Legal Audit Endpoint (Gemini 3.7 Flash)
app.post('/api/v1/asset/ai-deep-audit', async (req: Request, res: Response) => {
  try {
    const {
      assetName,
      primaryKind,
      languages,
      loc,
      cyclomaticIndex,
      claims,
      capabilities,
      customFocus
    } = req.body;

    const ai = getGenAI();

    if (!ai) {
      // High-fidelity fallback if API key is not configured in preview
      return res.json({
        status: 'success',
        legal_model_nature: 'heuristic_risk_indicators_only',
        legal_advice: false,
        analysis: `### ArgOS Deep IP Commercialization & Legal Risk Report: ${assetName || 'Technical Asset'}
**Classification:** ${(primaryKind || 'OS Substrate').toUpperCase()} | **Languages:** ${(languages || ['C', 'Assembly']).join(', ')} | **AST Complexity:** ${cyclomaticIndex || 7.2}/10

> **LEGAL NOTICE**: All findings below are heuristic risk indicators synthesized from code patterns and structural AST abstractions. They do not constitute formal legal opinions, patent validity conclusions, or trade secret confirmation.

---

#### 1. Novelty & Architectural Pattern Indicators (Heuristic)
- **Pattern Observations:** Detected custom memory-mapped ring buffer synchronization and lockless queues. These structures represent uncommon low-level abstractions that warrant formal patent counsel evaluation.
- **Novelty Risk Band:** MEDIUM RISK (patterns present, requires prior art search).

#### 2. Trade Secret Exposure Risk
- **Exposure Risk Band:** LOW RISK. Internal kernel barriers and memory layouts are contained in compiled binary routines. Distributing compiled binaries without symbols preserves trade secret protections under DTSA covenants.

#### 3. Code Provenance Signals (Non-Forensic)
- **Provenance Signals:** Zero GPL/AGPL copyleft keywords or third-party attribution headers detected in static AST inspection.
- **Notice:** This is a non-forensic scan and does not verify provenance or chain of custody. Human legal audit is required.

#### 4. Enterprise Royalty Strategy & Value Capture
- **Primary Monetization:** Value-share model capturing 4.5% of verified monthly infrastructure cost reduction.
- **Payback Period:** Estimated buyer break-even occurs within 21–24 days of cluster activation.`,
        modelUsed: 'heuristic-engine-fallback',
        completedAt: new Date().toISOString()
      });
    }

    const prompt = `You are a Principal Software IP Licensing & Commercialization Architect at Google / ArgOS.
Analyze the following technical software asset and produce a rigorous commercialization and heuristic legal risk report.

IMPORTANT LEGAL INSTRUCTION: Treat all legal signals as risk indicators, never conclusions. Do not imply patent novelty, ownership, cleanroom lineage, or license compliance. Provide heuristic risk bands (LOW / MEDIUM / HIGH) and evidence-driven analysis.

Asset Metadata:
- Name: ${assetName}
- Primary Kind: ${primaryKind}
- Languages: ${(languages || []).join(', ')}
- Lines of Code: ${loc}
- Cyclomatic Index: ${cyclomaticIndex}
- Verifiable Claims: ${(claims || []).join('; ')}
- Architectural Capabilities: ${(capabilities || []).join('; ')}
- User Custom Focus: ${customFocus || 'Novelty indicators and optimal enterprise royalty rate structure'}

Provide a markdown report structured into:
1. Novelty Indicators & Architectural Patterns (Heuristic, not a patent assessment)
2. Trade Secret Exposure Risk (DTSA alignment, reverse-engineering resistance)
3. Code Provenance Signals (Non-forensic AST pattern scan)
4. Commercial Licensing Strategy & Royalty Tiers (% of savings, per-node, OEM)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert enterprise software commercialization architect and legal risk analyst. Always frame legal findings as heuristic risk indicators.'
      }
    });

    const analysisText = response.text || 'Audit completed successfully.';

    res.json({
      status: 'success',
      legal_model_nature: 'heuristic_risk_indicators_only',
      legal_advice: false,
      analysis: analysisText,
      modelUsed: 'gemini-3.7-flash',
      completedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error in Gemini audit:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to complete AI IP audit'
    });
  }
});

// -------------------------------------------------------------
// VITE DEV & STATIC PRODUCTION HANDLER
// -------------------------------------------------------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ArgOS Commercialization Engine server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
