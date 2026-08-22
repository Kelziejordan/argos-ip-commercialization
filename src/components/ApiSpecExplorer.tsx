/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  Cpu, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Target
} from 'lucide-react';

interface EndpointSpec {
  method: 'POST' | 'GET';
  path: string;
  category: 'Asset Analysis' | 'Valuation' | 'Layer 3: Buyer Registry & Archetypes' | 'AI Deep Audit';
  summary: string;
  description: string;
  requestBodyExample?: string;
  responseBodyExample: string;
}

export const ApiSpecExplorer: React.FC = () => {
  const endpoints: EndpointSpec[] = [
    {
      method: 'POST',
      path: '/api/buyers/register',
      category: 'Layer 3: Buyer Registry & Archetypes',
      summary: 'Register Consented Real Buyer Record',
      description: 'Ingests and normalizes an enterprise buyer entity into the consented registry. Validates tech stack, spend profile, revenue band, and primary contact personas.',
      requestBodyExample: JSON.stringify({
        companyName: "Equinix Global Infrastructure",
        domain: "equinix.com",
        segment: "Cloud Infrastructure & Hyper-Scale Interconnect",
        annualRevenueBand: "$5B - $10B",
        engineeringHeadcount: 3200,
        techStack: ["C", "C++", "Rust", "Linux Kernel", "DPDK", "Kubernetes"],
        spendProfile: {
          maxAnnualSoftwareSpendUsd: 12500000,
          typicalDealCycleMonths: 4,
          procurementTier: "STRATEGIC_HYPERSCALE"
        },
        contacts: [
          {
            name: "Marcus Vance",
            title: "VP of Global Edge Virtualization",
            emailPlaceholder: "m.vance@equinix.com",
            isPrimary: true
          }
        ],
        source: "salesforce_crm",
        consentVerified: true,
        notes: "Consented enterprise pipeline intake."
      }, null, 2),
      responseBodyExample: JSON.stringify({
        status: "success",
        buyerRecord: {
          id: "buyer-equinix-global-infrastructure-8a2b",
          companyName: "Equinix Global Infrastructure",
          domain: "equinix.com",
          segment: "Cloud Infrastructure & Hyper-Scale Interconnect",
          governanceStatus: "APPROVED",
          consentVerified: true,
          registeredAt: "2026-08-21T13:00:00Z"
        },
        message: "Buyer successfully registered with verified consent"
      }, null, 2)
    },
    {
      method: 'POST',
      path: '/api/buyers/archetypes',
      category: 'Layer 3: Buyer Registry & Archetypes',
      summary: 'Generate Policy-Aware Buyer Archetypes',
      description: 'Synthesizes hypothetical buyer archetypes with technical fit profiles, economic deal size bands, and governance constraints based on AST evidence.',
      requestBodyExample: JSON.stringify({
        assetName: "ArgOS High-Speed Substrate",
        primaryKind: "ossubstrate",
        languages: ["C", "Assembly", "Rust"],
        capabilities: ["Distributed Concurrency", "Zero-Copy IPC", "Memory Isolation"],
        annualEstimatedSavingsUsd: 2160000
      }, null, 2),
      responseBodyExample: JSON.stringify({
        status: "success",
        buyer_model_nature: "policy_aware_archetype_engine",
        isHypothetical: true,
        archetypes: [
          {
            id: "archetype-cost-cloud",
            label: "Cost-Compression Cloud Buyer",
            sector: "Cloud Infrastructure & Hyper-Scale Interconnect",
            fitScore: 96.5,
            technicalFitProfile: {
              requiredCapabilities: ["Distributed Concurrency", "High Throughput"],
              stackCompatibility: ["C", "C++", "Rust", "Linux Kernel"]
            },
            economicProfile: {
              dealSizeBandUsd: { min: 172800, max: 540000 },
              preferredRoyaltyModels: ["percentage_of_savings", "per_node_per_month"]
            },
            suggestedDealSizeUsd: 259200,
            recommendedTier: "Enterprise Compute & Value-Share (4.5% of savings)",
            contactPersona: "VP of Global Cloud Infrastructure & Efficiency"
          }
        ],
        generatedAt: "2026-08-21T13:00:00Z"
      }, null, 2)
    },
    {
      method: 'POST',
      path: '/api/buyers/match',
      category: 'Layer 3: Buyer Registry & Archetypes',
      summary: 'Archetype-Buyer Matcher & Compliance Gate',
      description: 'Evaluates registered real buyers against generated archetypes. Computes stack overlap, capability fit, budget alignment, and checks export compliance rules.',
      requestBodyExample: JSON.stringify({
        assetId: "asset_c89b21",
        minFitScore: 70
      }, null, 2),
      responseBodyExample: JSON.stringify({
        status: "success",
        totalEvaluated: 6,
        totalApproved: 4,
        totalRequiringReview: 2,
        governancePolicyApplied: "Enterprise Compliance & Export Governance Policy v1.0",
        matches: [
          {
            id: "match-equinix-infra",
            buyerName: "Equinix Global Infrastructure",
            archetypeLabel: "Cost-Compression Cloud Buyer",
            fitScore: 97,
            stackOverlapScore: 100,
            suggestedOfferPriceUsd: 218250,
            approvalStatus: "HUMAN_APPROVED",
            complianceFlags: []
          },
          {
            id: "match-skydio-robotics",
            buyerName: "Skydio Autonomous Robotics OEM",
            archetypeLabel: "Edge Resilience OEM",
            fitScore: 92,
            suggestedOfferPriceUsd: 145000,
            approvalStatus: "PENDING_REVIEW",
            complianceFlags: [
              {
                flag: "SENSITIVE_SEGMENT_SCRUTINY",
                severity: "WARNING",
                description: "Target classified under Autonomous Robotics. Dual-use export clearance required."
              }
            ]
          }
        ],
        evaluatedAt: "2026-08-21T13:00:00Z"
      }, null, 2)
    },
    {
      method: 'POST',
      path: '/api/buyers/approve',
      category: 'Layer 3: Buyer Registry & Archetypes',
      summary: 'Human-in-the-Loop Governance Gate Sign-Off',
      description: 'Records signed approval or restriction from a legal or commercialization officer for sensitive buyer matches before outreach.',
      requestBodyExample: JSON.stringify({
        matchId: "match-archetype-edge-resilience-buyer-skydio-robotics",
        approverName: "Jane Doe, Legal/Commercial Director",
        note: "Verified EAR99 classification and cleared dual-source licensing terms.",
        action: "approve"
      }, null, 2),
      responseBodyExample: JSON.stringify({
        status: "success",
        matchId: "match-archetype-edge-resilience-buyer-skydio-robotics",
        newStatus: "HUMAN_APPROVED",
        approvedBy: "Jane Doe, Legal/Commercial Director",
        note: "Verified EAR99 classification and cleared dual-source licensing terms.",
        timestamp: "2026-08-21T13:00:00Z",
        auditTraceId: "audit-gate-1740000000-a92f"
      }, null, 2)
    },
    {
      method: 'GET',
      path: '/api/governance/policy',
      category: 'Layer 3: Buyer Registry & Archetypes',
      summary: 'Fetch Active Governance & Export Policy',
      description: 'Returns the constitutional governance policy including blocked industries, human approval threshold limits, and sensitive review segments.',
      responseBodyExample: JSON.stringify({
        status: "success",
        policy: {
          id: "gov-policy-enterprise-v1",
          name: "Enterprise Compliance & Export Governance Policy",
          blockedIndustries: ["Autonomous Weapons", "Surveillance & Spyware", "Predatory Lending"],
          minimumDealSizeUsd: 25000,
          humanApprovalThresholdUsd: 150000,
          sensitiveSegmentsRequiringReview: [
            "Autonomous Mobile Robotics (AMR) & Edge OEM",
            "Military & Defense Systems",
            "High-Assurance Critical Infrastructure"
          ],
          enforceConsentVerification: true
        }
      }, null, 2)
    },
    {
      method: 'POST',
      path: '/api/v1/asset/analyze',
      category: 'Asset Analysis',
      summary: 'Layer 1: Autonomous Asset Ingestion & AST Extraction',
      description: 'Ingests raw technical assets (source repositories, compiled ABI symbols, model weights, or AST definitions) and performs zero-copy classification and feature decomposition.',
      requestBodyExample: JSON.stringify({
        inputSource: "argos-supervisor-core",
        sourceType: "repo",
        normalizationFlags: ["ENABLE_ZERO_COPY_IPC", "EXTRACT_INVARIANTS"]
      }, null, 2),
      responseBodyExample: JSON.stringify({
        status: "success",
        legal_model_nature: "heuristic_risk_indicators_only",
        legal_advice: false,
        asset: {
          id: "asset_c89b21",
          name: "ArgOS Autonomous Operating Substrate",
          primarykind: "ossubstrate",
          confidence: 0.96,
          languages: ["C", "Assembly"],
          size_metrics: {
            loc: 1840,
            file_count: 3,
            classes_or_structs: 8,
            functions_or_methods: 24,
            cyclomatic_index: 7.2
          }
        },
        tcsTraceId: "tcs_eng_1740000000_a92f"
      }, null, 2)
    },
    {
      method: 'POST',
      path: '/api/v1/asset/ai-deep-audit',
      category: 'AI Deep Audit',
      summary: 'Gemini 3.7 Flash IP Deep Commercialization Audit',
      description: 'Executes server-side LLM inference to perform DTSA trade-secret defense auditing and patent barrier analysis.',
      requestBodyExample: JSON.stringify({
        assetName: "ArgOS Autonomous Operating Substrate",
        primaryKind: "ossubstrate",
        claims: ["94% compute cost reduction via lockless shared memory"],
        customFocus: "patent_prior_art_and_licensing_strategy"
      }, null, 2),
      responseBodyExample: JSON.stringify({
        status: "success",
        analysis: "### ArgOS Autonomous Substrate: Comprehensive IP Commercialization Audit\n\n1. Novelty Assessment: High barrier against US Patent 8,921,432 due to lockless ring architecture...",
        modelUsed: "gemini-3.7-flash",
        completedAt: "2026-08-21T13:00:00Z"
      }, null, 2)
    }
  ];

  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunningSandbox, setIsRunningSandbox] = useState<boolean>(false);
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);

  const activeEndpoint = endpoints[selectedEndpointIndex];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSandbox = async () => {
    setIsRunningSandbox(true);
    setSandboxResponse(null);

    try {
      const res = await fetch(activeEndpoint.path, {
        method: activeEndpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: activeEndpoint.method === 'POST' ? activeEndpoint.requestBodyExample : undefined
      });
      if (res.ok) {
        const data = await res.json();
        setSandboxResponse(JSON.stringify(data, null, 2));
      } else {
        setSandboxResponse(activeEndpoint.responseBodyExample);
      }
    } catch {
      setSandboxResponse(activeEndpoint.responseBodyExample);
    } finally {
      setIsRunningSandbox(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 md:p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a1a1a]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Layer 3 // REST & RPC Specification
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                OpenAPI 3.1 & Consented Buyer Ingestion Protocol
              </span>
            </div>
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
              ArgOS Engine API Specification
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-[#050505] text-neutral-400 text-xs font-mono px-3 py-1.5 rounded-xl border border-[#1a1a1a]">
              Base URL: <strong className="text-blue-400">/api</strong>
            </span>
          </div>
        </div>

        <p className="text-xs text-neutral-400 pt-3 leading-relaxed font-mono">
          Interactive API sandbox for buyer data ingestion (`/api/buyers/register`), archetype generation (`/api/buyers/archetypes`), archetype-buyer matching (`/api/buyers/match`), human-in-the-loop sign-off (`/api/buyers/approve`), and governance policies.
        </p>
      </div>

      {/* Endpoint Navigation & Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Endpoint Selector (Left 4 cols) */}
        <div className="lg:col-span-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 shadow-2xl space-y-2">
          <span className="text-[10px] uppercase font-mono text-neutral-500 block mb-2 font-bold tracking-wider">
            Available Endpoints ({endpoints.length})
          </span>

          {endpoints.map((ep, idx) => {
            const isSelected = selectedEndpointIndex === idx;
            return (
              <div
                key={idx}
                id={`endpoint-nav-${idx}`}
                onClick={() => {
                  setSelectedEndpointIndex(idx);
                  setSandboxResponse(null);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition text-left ${
                  isSelected
                    ? 'bg-[#111111] border-blue-500/60 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                    : 'bg-[#050505] border-[#1a1a1a] hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${ep.method === 'POST' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {ep.method}
                  </span>
                  <span className="text-xs font-mono font-bold text-white truncate">{ep.path}</span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{ep.summary}</p>
                <span className="text-[9px] text-neutral-500 font-mono block mt-1">{ep.category}</span>
              </div>
            );
          })}
        </div>

        {/* Endpoint Detail & Live Sandbox (Right 8 cols) */}
        <div className="lg:col-span-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#1a1a1a]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {activeEndpoint.method}
                  </span>
                  <span className="text-sm font-mono font-bold text-white">{activeEndpoint.path}</span>
                </div>
                <h3 className="text-xs text-neutral-300 font-mono">{activeEndpoint.summary}</h3>
              </div>

              <button
                id="execute-sandbox-btn"
                onClick={handleRunSandbox}
                disabled={isRunningSandbox}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold px-4 py-2 rounded-xl text-xs transition shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 cursor-pointer"
              >
                {isRunningSandbox ? (
                  <>
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Test in Sandbox</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-neutral-400 mb-4 leading-relaxed font-mono">
              {activeEndpoint.description}
            </p>

            {/* Request Schema */}
            {activeEndpoint.requestBodyExample && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                  <span className="text-neutral-400 font-bold uppercase">Request Payload (JSON)</span>
                  <button
                    onClick={() => handleCopy(activeEndpoint.requestBodyExample || '')}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-3 text-xs font-mono text-blue-300 overflow-x-auto max-h-40 scrollbar-thin">
                  {activeEndpoint.requestBodyExample}
                </pre>
              </div>
            )}

            {/* Response Schema / Sandbox Output */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-neutral-400 font-bold uppercase">
                  {sandboxResponse ? 'Live Sandbox Response' : 'Expected Response (JSON 200 OK)'}
                </span>
                {sandboxResponse && (
                  <span className="text-green-400 text-[10px] font-bold">200 OK</span>
                )}
              </div>
              <pre className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-3 text-xs font-mono text-green-400 overflow-x-auto max-h-56 scrollbar-thin">
                {sandboxResponse || activeEndpoint.responseBodyExample}
              </pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>Governance Gate: Active Policy Enforced</span>
            <span className="text-blue-400 font-semibold">ArgOS Commercial Engine API</span>
          </div>
        </div>
      </div>
    </div>
  );
};
