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

export interface ApiAlertItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  risk_level: string;
  risk_score: number;
  status: string;
  target_account: string;
  amount: string;
  typology: string;
  rule_or_model: string;
}

export interface EscalateAlertResponse {
  alert_id: string;
  case_id: string;
  status: string;
  lead_analyst: string;
  sha256_audit_hash: string;
  message: string;
}

export interface ApiTransactionItem {
  id: string;
  source_account: string;
  target_account: string;
  amount: number;
  currency: string;
  timestamp: string;
  channel: string;
  is_flagged: boolean;
  pattern_type: string;
  risk_score: number;
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

  async getAlerts(severity?: string, status?: string, search?: string): Promise<ApiAlertItem[]> {
    try {
      const params = new URLSearchParams();
      if (severity && severity !== 'all') params.append('severity', severity);
      if (status && status !== 'all') params.append('status', status);
      if (search) params.append('search', search);

      const res = await fetch(`${this.baseUrl}/alerts/?${params.toString()}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async escalateAlert(alertId: string, targetAccount: string, analystNotes?: string): Promise<EscalateAlertResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/alerts/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert_id: alertId,
          target_account: targetAccount,
          analyst_notes: analystNotes || 'Escalated for immediate multi-agent critical review',
        }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getTransactions(patternType?: string, minAmount?: number, search?: string): Promise<ApiTransactionItem[]> {
    try {
      const params = new URLSearchParams();
      if (patternType && patternType !== 'all') params.append('pattern_type', patternType);
      if (minAmount !== undefined && minAmount > 0) params.append('min_amount', minAmount.toString());
      if (search) params.append('search', search);

      const res = await fetch(`${this.baseUrl}/transactions/?${params.toString()}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }
}

export const apiClient = new FraudGraphApiClient();
