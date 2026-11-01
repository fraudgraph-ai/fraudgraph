/**
 * FraudGraph AI — Enterprise API Client
 * Seamlessly interfaces with the FastAPI intelligence service (/api/v1)
 * with graceful fallback to local analytics when running in decoupled mode.
 */

export interface BackendHealth {
  status: string;
  service: string;
  version: string;
  subsystems: {
    graph_engine: string;
    detection_ml: string;
    multi_agent_supervisor: string;
    cryptographic_vault: string;
  };
}

export interface SubgraphResponse {
  center_entity_id: string;
  nodes: Array<{
    id: string;
    label: string;
    entity_type: string;
    risk_score: number;
    risk_level: string;
    properties: Record<string, any>;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    amount: number;
    currency: string;
    timestamp: string;
    channel: string;
    is_flagged: boolean;
  }>;
  total_volume: number;
  node_count: number;
  edge_count: number;
}

export interface CycleResponse {
  detected_cycles: string[][];
  cycle_count: number;
  execution_time_ms: number;
  typology: string;
}

export interface RiskScoreResponse {
  entity_id: string;
  raw_model_score: number;
  calibrated_risk_score: number;
  uncertainty_brier: number;
  risk_level: string;
  primary_typology: string;
  feature_drivers: Array<{
    feature_name: string;
    impact_score: number;
    direction: string;
  }>;
  risk_signals: Array<{
    id: string;
    description: string;
    severity: string;
    weight: number;
    evidence_ref: string;
  }>;
}

class FraudGraphApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  async checkHealth(): Promise<BackendHealth | null> {
    try {
      const res = await fetch('/health');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getSubgraph(entityId: string, dataset: string = 'ibm_amlsim_500k', maxHops: number = 2, minAmount: number = 0): Promise<SubgraphResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/graphs/subgraph`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: entityId, dataset, max_hops: maxHops, min_amount: minAmount }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async detectCycles(dataset: string = 'ibm_amlsim_500k', minAmount: number = 0, maxCycleLength: number = 6): Promise<CycleResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/graphs/algorithms/cycles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset, min_amount: minAmount, max_cycle_length: maxCycleLength }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getRiskScore(entityId: string, dataset: string = 'ibm_amlsim_500k', lookbackDays: number = 30): Promise<RiskScoreResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/risk/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: entityId, dataset, lookback_days: lookbackDays }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async depositEvidence(caseId: string, title: string, evidenceType: string, rawContent: string): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/evidence/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId, title, evidence_type: evidenceType, raw_content: rawContent }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async explainSubgraph(entityId: string = 'TR-90421073', dataset: string = 'ibm_amlsim_500k'): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/graphs/explain?entity_id=${encodeURIComponent(entityId)}&dataset=${encodeURIComponent(dataset)}`, {
        method: 'POST',
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async fetchSarXml(caseId: string): Promise<string | null> {
    try {
      const res = await fetch(`${this.baseUrl}/evidence/${caseId}/sar-xml`);
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  }

  getInvestigationStreamUrl(caseId: string, entityId: string = 'ACC-849201', dataset: string = 'ibm_amlsim_500k'): string {
    return `${this.baseUrl}/investigations/stream/${encodeURIComponent(caseId)}?entity_id=${encodeURIComponent(entityId)}&dataset=${encodeURIComponent(dataset)}`;
  }

  async verifyHash(sha256Hash: string): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/evidence/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sha256_hash: sha256Hash }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}

export const apiClient = new FraudGraphApiClient();
