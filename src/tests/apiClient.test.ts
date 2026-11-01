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
});
