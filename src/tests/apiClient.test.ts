import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../services/apiClient';

describe('FraudGraphApiClient Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('handles healthcheck successfully when backend is online', async () => {
    const mockHealth = {
      status: 'HEALTHY',
      service: 'fraudgraph-intelligence-api',
      version: '1.0.0',
      subsystems: {
        graph_engine: 'ONLINE',
        detection_ml: 'ONLINE',
        multi_agent_supervisor: 'ONLINE',
        cryptographic_vault: 'ONLINE',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockHealth,
    } as Response);

    const res = await apiClient.checkHealth();
    expect(res).not.toBeNull();
    expect(res?.status).toBe('HEALTHY');
    expect(res?.subsystems.graph_engine).toBe('ONLINE');
  });

  it('gracefully handles backend unavailability without throwing', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    const res = await apiClient.checkHealth();
    expect(res).toBeNull();
  });

  it('correctly requests subgraphs with entityId and dataset', async () => {
    const mockSubgraph = {
      center_entity_id: 'TR-90421073',
      nodes: [],
      edges: [],
      total_volume: 7430000,
      node_count: 8,
      edge_count: 9,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockSubgraph,
    } as Response);

    const res = await apiClient.getSubgraph('TR-90421073', 'ibm_amlsim_500k', 2, 100000);
    expect(res).not.toBeNull();
    expect(res?.center_entity_id).toBe('TR-90421073');
    expect(res?.total_volume).toBe(7430000);
  });

  it('deposits cryptographic evidence and returns SHA-256 fingerprint', async () => {
    const mockDeposit = {
      evidence_id: 'EV-903',
      case_id: 'FG-8421',
      title: 'MT103 Wire Confirmation',
      evidence_type: 'bank_statement',
      sha256_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      timestamp: '2026-03-29 14:30:00',
      status: 'Verified & Merkle-Anchored',
      deposited_by: 'Analyst E. Kaya',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockDeposit,
    } as Response);

    const res = await apiClient.depositEvidence(
      'FG-8421',
      'MT103 Wire Confirmation',
      'bank_statement',
      'raw content proof'
    );
    expect(res).not.toBeNull();
    expect(res?.sha256_hash.length).toBe(64);
    expect(res?.status).toBe('Verified & Merkle-Anchored');
  });

  it('generates valid Server-Sent Events (SSE) streaming URL', () => {
    const url = apiClient.getInvestigationStreamUrl('FG-8421', 'TR-90421073', 'ibm_amlsim_500k');
    expect(url).toBe('/api/v1/investigations/stream/FG-8421?entity_id=TR-90421073&dataset=ibm_amlsim_500k');
  });

  it('fetches alerts list and handles filtering', async () => {
    const mockAlerts = [
      {
        id: 'ALT-1094',
        title: 'Rapid Outbound Fund Dispersion',
        risk_level: 'Critical',
        risk_score: 0.94,
        target_account: 'TR-90421073',
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockAlerts,
    } as Response);

    const alerts = await apiClient.getAlerts('Critical', 'Open');
    expect(alerts.length).toBe(1);
    expect(alerts[0].id).toBe('ALT-1094');
  });

  it('escalates alert and receives cryptographic proof anchor', async () => {
    const mockEscalate = {
      alert_id: 'ALT-1094',
      case_id: 'FG-1094',
      status: 'Escalated to Multi-Agent Supervisor',
      lead_analyst: 'Emre Kaya',
      sha256_audit_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      message: 'Escalated successfully',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockEscalate,
    } as Response);

    const res = await apiClient.escalateAlert('ALT-1094', 'TR-90421073');
    expect(res).not.toBeNull();
    expect(res?.case_id).toBe('FG-1094');
    expect(res?.sha256_audit_hash.length).toBe(64);
  });

  it('fetches streaming transactions list with amount filter', async () => {
    const mockTxs = [
      {
        id: 'TX-901842',
        source_account: 'TR-90421073',
        target_account: 'TR-38192044',
        amount: 3850000,
        currency: 'TRY',
        pattern_type: 'layering',
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTxs,
    } as Response);

    const txs = await apiClient.getTransactions('layering', 1000000);
    expect(txs.length).toBe(1);
    expect(txs[0].id).toBe('TX-901842');
  });

  it('fetches AML detection rules and executes backtest simulation', async () => {
    const mockRules = [
      {
        id: 'RUL-CIRC-01',
        name: 'Closed Multi-Hop Circular Flow Detector',
        typology: 'circular_layering',
        is_active: true,
      },
    ];

    const mockSim = {
      rule_id: 'RUL-CIRC-01',
      rule_name: 'Closed Multi-Hop Circular Flow Detector',
      dataset: 'ibm_amlsim_500k',
      simulated_entities_count: 100,
      rule_hits_count: 3,
      hit_rate_percentage: 3.0,
      total_exposure_volume_try: 22290000.0,
      estimated_false_positive_rate: 0.038,
      execution_time_ms: 18.4,
      sample_flagged_entities: ['TR-90421073'],
    };

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRules,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSim,
      } as Response);

    const rules = await apiClient.getRules('circular_layering');
    expect(rules.length).toBe(1);
    expect(rules[0].id).toBe('RUL-CIRC-01');

    const sim = await apiClient.simulateRule('RUL-CIRC-01');
    expect(sim).not.toBeNull();
    expect(sim?.rule_hits_count).toBe(3);
    expect(sim?.total_exposure_volume_try).toBeGreaterThan(0);
  });

  it('handles Four-Eye review submission, dual authorization, and audit logs', async () => {
    const mockSubmit = {
      case_id: 'FG-8421',
      status: 'PENDING_COMPLIANCE_SIGNOFF',
      disposition: 'Escalate for SAR/STR Regulatory Filing',
      lead_analyst: 'Analyst E. Kaya',
      primary_signature_sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      sar_filing_unlocked: false,
      message: 'Case FG-8421 submitted for Four-Eye review.',
    };

    const mockApprove = {
      case_id: 'FG-8421',
      status: 'DUAL_AUTHORIZED_FOR_REGULATORY_SUBMISSION',
      disposition: 'Escalate for SAR/STR Regulatory Filing',
      lead_analyst: 'Analyst E. Kaya',
      compliance_officer: 'MLRO S. Demir',
      primary_signature_sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      secondary_signature_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      sar_filing_unlocked: true,
      message: 'Four-Eye Dual Authorization completed.',
    };

    const mockLogs = [
      {
        id: 'AUD-901',
        timestamp: '2026-03-29 14:22:15',
        actor: 'MLRO S. Demir',
        action: 'FOUR_EYE_DUAL_AUTHORIZED',
        target_id: 'FG-8421',
        details: 'Signed secondary authorization',
        sha256_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      },
    ];

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmit,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApprove,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockLogs,
      } as Response);

    const sub = await apiClient.submitCaseReview('FG-8421', 'Escalate for SAR/STR Regulatory Filing', 'Proof of funds layering');
    expect(sub?.status).toBe('PENDING_COMPLIANCE_SIGNOFF');
    expect(sub?.sar_filing_unlocked).toBe(false);

    const app = await apiClient.approveCaseReview('FG-8421', 'MLRO S. Demir');
    expect(app?.status).toBe('DUAL_AUTHORIZED_FOR_REGULATORY_SUBMISSION');
    expect(app?.sar_filing_unlocked).toBe(true);

    const logs = await apiClient.getAuditLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].id).toBe('AUD-901');
  });

  it('interacts with real-time streaming ingestion and burst simulation endpoints', async () => {
    const mockMetrics = {
      status: 'HEALTHY_STREAMING',
      total_events_processed: 184500,
      current_throughput_tx_sec: 28500.0,
      buffer_depth: 340,
      max_buffer_capacity: 50000,
      average_ingest_latency_ms: 0.85,
      alerts_emitted_total: 28,
      memory_footprint_mb: 48.6,
      connected_consumers_count: 4,
    };

    const mockIngest = {
      batch_id: 'BATCH-882193',
      events_ingested: 1,
      nodes_added_or_updated: 2,
      edges_added: 1,
      alerts_generated_count: 1,
      latency_ms: 0.94,
      throughput_tx_sec: 1063.8,
      status: 'INGESTED_AND_GRAPH_SYNCHRONIZED',
    };

    const mockBurst = {
      simulation_id: 'SIM-BURST-100',
      burst_size: 500,
      ingest_duration_seconds: 0.045,
      throughput_tx_sec: 11111.1,
      alerts_triggered: 3,
      critical_cycles_detected: 1,
      status: 'COMPLETED_STRESS_BENCHMARK',
    };

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockIngest,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBurst,
      } as Response);

    const metrics = await apiClient.getStreamMetrics();
    expect(metrics).not.toBeNull();
    expect(metrics?.status).toBe('HEALTHY_STREAMING');
    expect(metrics?.total_events_processed).toBe(184500);

    const ingestRes = await apiClient.ingestTransactionStream([
      {
        event_id: 'EVT-TEST',
        source_account: 'TR-ACC-1',
        target_account: 'TR-ACC-2',
        amount: 5500000,
      },
    ]);
    expect(ingestRes?.batch_id).toBe('BATCH-882193');
    expect(ingestRes?.edges_added).toBe(1);

    const burstRes = await apiClient.simulateStreamBurst(500, true);
    expect(burstRes?.critical_cycles_detected).toBe(1);
    expect(burstRes?.status).toBe('COMPLETED_STRESS_BENCHMARK');
  });
});
