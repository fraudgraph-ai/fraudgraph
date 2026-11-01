import { describe, it, expect } from 'vitest';
import { datasetsCatalog, getDatasetPayload } from '../data/datasets';

describe('Dataset Registry & Topology Tests', () => {
  it('contains all 3 benchmark datasets: AMLSim, Elliptic++, TransXion', () => {
    const keys = Object.keys(datasetsCatalog);
    expect(keys).toContain('IBM AMLSim 500K');
    expect(keys).toContain('Elliptic++ Bitcoin');
    expect(keys).toContain('TransXion Ecosystem');
  });

  it('maps correct currencies per dataset', () => {
    const aml = datasetsCatalog['IBM AMLSim 500K'];
    const btc = datasetsCatalog['Elliptic++ Bitcoin'];
    const trans = datasetsCatalog['TransXion Ecosystem'];

    expect(aml.currency).toBe('TRY');
    expect(btc.currency).toBe('BTC');
    expect(trans.currency).toBe('USD');
  });

  it('retrieves distinct graph topologies for Elliptic++ Bitcoin vs AMLSim', () => {
    const btcPayload = getDatasetPayload('Elliptic++ Bitcoin');
    const amlPayload = getDatasetPayload('IBM AMLSim 500K');

    expect(btcPayload.nodes.length).toBeGreaterThan(0);
    expect(amlPayload.nodes.length).toBeGreaterThan(0);

    // Bitcoin topology addresses should start with 3J or btc id
    const hasBtcAddress = btcPayload.nodes.some(
      (n) => n.id.startsWith('btc') || n.label.startsWith('3J') || n.properties?.accountNo?.includes('3J')
    );
    expect(hasBtcAddress).toBe(true);

    // AMLSim topology addresses should start with node id and TR- account
    const hasTrAccount = amlPayload.nodes.some(
      (n) => n.id.startsWith('node') || n.properties?.accountNo?.startsWith('TR-')
    );
    expect(hasTrAccount).toBe(true);
  });
});
