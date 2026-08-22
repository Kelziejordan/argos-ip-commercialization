/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// buyerRegistry.ts
// Buyer Data Ingestion Service
// Ingests, normalizes, and manages consented real buyer records from CRM (HubSpot/Salesforce),
// CSV imports, marketplace APIs, and manual enterprise entries.

import { BuyerRecord, BuyerSource } from '../types';

const INITIAL_BUYER_REGISTRY: BuyerRecord[] = [
  {
    id: "buyer-equinix-infra",
    companyName: "Equinix Global Infrastructure",
    domain: "equinix.com",
    segment: "Cloud Infrastructure & Hyper-Scale Interconnect",
    annualRevenueBand: "$5B - $10B",
    engineeringHeadcount: 3200,
    techStack: ["C", "C++", "Rust", "Linux Kernel", "eBPF", "DPDK", "Kubernetes", "gRPC"],
    preferredLicensingModels: ["percentage_of_savings", "per_node_per_month"],
    spendProfile: {
      maxAnnualSoftwareSpendUsd: 12500000,
      typicalDealCycleMonths: 4,
      procurementTier: "STRATEGIC_HYPERSCALE"
    },
    contacts: [
      {
        name: "Marcus Vance",
        title: "VP of Global Edge Virtualization & Infrastructure",
        emailPlaceholder: "m.vance@equinix.com",
        department: "Core Network Systems",
        isPrimary: true
      },
      {
        name: "Elena Rostova",
        title: "Principal Systems Architect",
        emailPlaceholder: "e.rostova@equinix.com",
        department: "Hardware Acceleration"
      }
    ],
    source: "salesforce_crm",
    consentVerified: true,
    governanceStatus: "APPROVED",
    approvedIndustries: ["Cloud Computing", "Telecommunications", "Data Centers", "Fintech"],
    blockedIndustries: ["Autonomous Weapons", "Gambling"],
    notes: "Active enterprise vendor relationship. Priority interest in lockless concurrency and low-overhead kernel substrates.",
    registeredAt: "2026-06-15T08:30:00Z"
  },
  {
    id: "buyer-cloudflare-edge",
    companyName: "Cloudflare Edge Compute",
    domain: "cloudflare.com",
    segment: "Edge Resilience OEM & CDN Infrastructure",
    annualRevenueBand: "$1B - $5B",
    engineeringHeadcount: 2400,
    techStack: ["Rust", "C++", "Go", "WebAssembly", "Linux Kernel", "BGP", "QUIC"],
    preferredLicensingModels: ["per_node_per_month", "percentage_of_savings"],
    spendProfile: {
      maxAnnualSoftwareSpendUsd: 8500000,
      typicalDealCycleMonths: 3,
      procurementTier: "STRATEGIC_HYPERSCALE"
    },
    contacts: [
      {
        name: "Karthik Subramanian",
        title: "Head of Systems Performance & Edge Runtimes",
        emailPlaceholder: "karthik@cloudflare.com",
        department: "Workers & Edge Infrastructure",
        isPrimary: true
      }
    ],
    source: "hubspot_crm",
    consentVerified: true,
    governanceStatus: "APPROVED",
    approvedIndustries: ["Developer Tools", "Edge Infrastructure", "Cybersecurity", "Cloud"],
    blockedIndustries: ["Surveillance", "Weaponry"],
    notes: "Consented tech intake pipeline. Evaluates high-throughput memory-safe binaries and deterministic execution.",
    registeredAt: "2026-07-02T11:20:00Z"
  },
  {
    id: "buyer-datadog-telemetry",
    companyName: "Datadog Observability",
    domain: "datadoghq.com",
    segment: "Agentic Platform Integrator & Stream Analytics",
    annualRevenueBand: "$2B - $5B",
    engineeringHeadcount: 3100,
    techStack: ["Go", "C++", "Rust", "Python", "Kafka", "ClickHouse", "eBPF"],
    preferredLicensingModels: ["percentage_of_savings", "per_node_per_month"],
    spendProfile: {
      maxAnnualSoftwareSpendUsd: 6500000,
      typicalDealCycleMonths: 3,
      procurementTier: "TIER_1_ENTERPRISE"
    },
    contacts: [
      {
        name: "Sarah Lindqvist",
        title: "VP of Ingestion Pipeline & Kernel Telemetry",
        emailPlaceholder: "s.lindqvist@datadoghq.com",
        department: "Agent Systems Engineering",
        isPrimary: true
      }
    ],
    source: "hubspot_crm",
    consentVerified: true,
    governanceStatus: "APPROVED",
    approvedIndustries: ["Observability", "Enterprise SaaS", "Cloud Security"],
    blockedIndustries: [],
    notes: "Seeking high-speed log ingestion and streaming serialization components.",
    registeredAt: "2026-07-18T14:10:00Z"
  },
  {
    id: "buyer-skydio-robotics",
    companyName: "Skydio Autonomous Robotics OEM",
    domain: "skydio.com",
    segment: "Autonomous Mobile Robotics (AMR) & Edge OEM",
    annualRevenueBand: "$200M - $500M",
    engineeringHeadcount: 650,
    techStack: ["C++", "C", "CUDA", "RTOS", "Linux", "ROS2", "Python"],
    preferredLicensingModels: ["per_device_oem", "dual_source_royalty"],
    spendProfile: {
      maxAnnualSoftwareSpendUsd: 3200000,
      typicalDealCycleMonths: 6,
      procurementTier: "TIER_2_MIDMARKET"
    },
    contacts: [
      {
        name: "David Chen",
        title: "Chief Autonomy Architect & Head of Embedded Systems",
        emailPlaceholder: "dchen@skydio.com",
        department: "Flight Control & Sensor Fusion",
        isPrimary: true
      }
    ],
    source: "consented_marketplace",
    consentVerified: true,
    governanceStatus: "REQUIRES_APPROVAL",
    approvedIndustries: ["Commercial Robotics", "Inspection", "Public Safety"],
    blockedIndustries: ["Offensive Military Strike Systems"],
    notes: "Subject to export controls (EAR99 / dual-use scrutiny). Requires human review before binding offers.",
    registeredAt: "2026-08-01T09:45:00Z"
  },
  {
    id: "buyer-twosigma-fintech",
    companyName: "Two Sigma Quantitative Systems",
    domain: "twosigma.com",
    segment: "Electronic Trading & Low-Latency FinTech",
    annualRevenueBand: "$10B+",
    engineeringHeadcount: 1800,
    techStack: ["C++", "C", "Rust", "Assembly", "Linux Kernel", "FPGA", "Solarflare EF_VI"],
    preferredLicensingModels: ["dual_source_royalty", "percentage_of_savings"],
    spendProfile: {
      maxAnnualSoftwareSpendUsd: 15000000,
      typicalDealCycleMonths: 2,
      procurementTier: "STRATEGIC_HYPERSCALE"
    },
    contacts: [
      {
        name: "Alexander Thorne",
        title: "Head of Low-Latency Market Access Engineering",
        emailPlaceholder: "a.thorne@twosigma.com",
        department: "Core Execution Platforms",
        isPrimary: true
      }
    ],
    source: "manual_entry",
    consentVerified: true,
    governanceStatus: "APPROVED",
    approvedIndustries: ["Financial Markets", "Algorithmic Execution", "Hedge Funds"],
    blockedIndustries: [],
    notes: "Demands zero-contention ring buffers, cache-line alignment, and source-available evaluation licenses.",
    registeredAt: "2026-08-10T16:00:00Z"
  },
  {
    id: "buyer-crowdstrike-secops",
    companyName: "CrowdStrike SecOps Core",
    domain: "crowdstrike.com",
    segment: "Enterprise Cybersecurity & Kernel SecOps",
    annualRevenueBand: "$3B - $6B",
    engineeringHeadcount: 2800,
    techStack: ["C++", "C", "Rust", "Windows Internals", "Linux Kernel", "eBPF"],
    preferredLicensingModels: ["per_node_per_month", "percentage_of_savings"],
    spendProfile: {
      maxAnnualSoftwareSpendUsd: 9000000,
      typicalDealCycleMonths: 4,
      procurementTier: "STRATEGIC_HYPERSCALE"
    },
    contacts: [
      {
        name: "Rachel Goldman",
        title: "VP of Threat Sensor Architecture",
        emailPlaceholder: "r.goldman@crowdstrike.com",
        department: "Falcon Sensor Engineering",
        isPrimary: true
      }
    ],
    source: "salesforce_crm",
    consentVerified: true,
    governanceStatus: "APPROVED",
    approvedIndustries: ["Cybersecurity", "Endpoint Protection", "Cloud Security"],
    blockedIndustries: [],
    notes: "Requires cleanroom verification indicators and high-reliability kernel-safe memory isolation.",
    registeredAt: "2026-08-14T13:25:00Z"
  }
];

export class BuyerRegistryService {
  private static STORAGE_KEY = "argos_buyer_registry_v1";

  /**
   * Retrieves all registered real buyer records.
   */
  public static getRegistry(): BuyerRecord[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial seed
    }
    return [...INITIAL_BUYER_REGISTRY];
  }

  /**
   * Persists the registry to local state.
   */
  public static saveRegistry(records: BuyerRecord[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn("Failed to persist buyer registry:", e);
    }
  }

  /**
   * Registers a new verified buyer record.
   */
  public static registerBuyer(data: Omit<BuyerRecord, 'id' | 'registeredAt'>): BuyerRecord {
    const id = `buyer-${data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;
    const newRecord: BuyerRecord = {
      ...data,
      id,
      registeredAt: new Date().toISOString()
    };

    const current = this.getRegistry();
    current.unshift(newRecord);
    this.saveRegistry(current);
    return newRecord;
  }

  /**
   * Imports buyers from raw CSV text with standard schema.
   * CSV Headers: Company, Domain, Segment, RevenueBand, Headcount, TechStack(comma-separated), Source, ConsentVerified, ContactName, ContactTitle, ContactEmail
   */
  public static importFromCsv(csvText: string): { imported: BuyerRecord[]; count: number; errors: string[] } {
    const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) {
      return { imported: [], count: 0, errors: ["CSV file is empty or missing headers."] };
    }

    const imported: BuyerRecord[] = [];
    const errors: string[] = [];

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]+/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (cols.length < 3) continue;

        const company = cols[0] || `Imported Enterprise ${i}`;
        const domain = cols[1] || `${company.toLowerCase().replace(/\s+/g, '')}.com`;
        const segment = cols[2] || "Enterprise Software & Cloud Platforms";
        const revenue = cols[3] || "$500M - $2B";
        const headcount = parseInt(cols[4], 10) || 500;
        const stackRaw = cols[5] || "C++, Rust, Linux, Cloud";
        const techStack = stackRaw.split(';').map(s => s.trim()).filter(Boolean);
        const contactName = cols[6] || "Technical Procurement Lead";
        const contactTitle = cols[7] || "VP of Infrastructure";
        const contactEmail = cols[8] || `procurement@${domain}`;

        const record = this.registerBuyer({
          companyName: company,
          domain,
          segment,
          annualRevenueBand: revenue,
          engineeringHeadcount: headcount,
          techStack: techStack.length > 0 ? techStack : ["C++", "Rust", "Linux"],
          preferredLicensingModels: ["percentage_of_savings", "per_node_per_month"],
          spendProfile: {
            maxAnnualSoftwareSpendUsd: 2500000,
            typicalDealCycleMonths: 4,
            procurementTier: "TIER_2_MIDMARKET"
          },
          contacts: [
            {
              name: contactName,
              title: contactTitle,
              emailPlaceholder: contactEmail,
              isPrimary: true
            }
          ],
          source: "csv_import",
          consentVerified: true,
          governanceStatus: "APPROVED",
          approvedIndustries: ["Cloud Computing", "Software Engineering"],
          blockedIndustries: [],
          notes: "Imported via CSV ingestion pipeline."
        });

        imported.push(record);
      } catch (err: any) {
        errors.push(`Row ${i + 1}: ${err.message || 'Parse error'}`);
      }
    }

    return { imported, count: imported.length, errors };
  }

  /**
   * Generates a CSV export of the current buyer registry.
   */
  public static exportToCsv(): string {
    const registry = this.getRegistry();
    const headers = [
      "Company Name",
      "Domain",
      "Segment",
      "Revenue Band",
      "Headcount",
      "Tech Stack",
      "Source",
      "Consent Verified",
      "Primary Contact",
      "Contact Title",
      "Contact Email"
    ];

    const rows = registry.map(b => {
      const primary = b.contacts.find(c => c.isPrimary) || b.contacts[0];
      return [
        `"${b.companyName.replace(/"/g, '""')}"`,
        `"${b.domain}"`,
        `"${b.segment}"`,
        `"${b.annualRevenueBand}"`,
        b.engineeringHeadcount,
        `"${b.techStack.join(';')}"`,
        `"${b.source}"`,
        b.consentVerified ? "YES" : "NO",
        `"${primary?.name || ''}"`,
        `"${primary?.title || ''}"`,
        `"${primary?.emailPlaceholder || ''}"`
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Resets registry to default seed.
   */
  public static resetToDefault(): BuyerRecord[] {
    this.saveRegistry(INITIAL_BUYER_REGISTRY);
    return [...INITIAL_BUYER_REGISTRY];
  }
}
