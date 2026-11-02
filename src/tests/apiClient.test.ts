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
});
