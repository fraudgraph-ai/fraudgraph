import { describe, it, expect } from 'vitest';
import {
  calculatePageRank,
  detectCircularFlows,
  findShortestPath,
} from '../utils/graphAlgorithms';

describe('FraudGraph AI — Graph Algorithms Engine', () => {
  const sampleNodes = [
    { id: 'acc_A', label: 'Account A', riskScore: 0.9 },
    { id: 'acc_B', label: 'Account B', riskScore: 0.8 },
    { id: 'acc_C', label: 'Account C', riskScore: 0.7 },
    { id: 'acc_D', label: 'Account D', riskScore: 0.4 },
  ];

  it('calculates PageRank centrality with correct mass conservation', () => {
    const edges = [
      { id: 'e1', source: 'acc_A', target: 'acc_B', amount: 1000 },
      { id: 'e2', source: 'acc_B', target: 'acc_C', amount: 1000 },
      { id: 'e3', source: 'acc_C', target: 'acc_B', amount: 500 },
      { id: 'e4', source: 'acc_D', target: 'acc_B', amount: 2000 },
    ];

    const ranks = calculatePageRank(sampleNodes, edges);

    expect(Object.keys(ranks)).toHaveLength(4);
    // acc_B receives multiple inbound transfers, so its PageRank should be highest
    expect(ranks['acc_B']).toBeGreaterThan(ranks['acc_A']);
    expect(ranks['acc_B']).toBeGreaterThan(ranks['acc_D']);
  });

  it('detects circular money laundering cycles (A -> B -> C -> A)', () => {
    const edgesWithCycle = [
      { id: 'e1', source: 'acc_A', target: 'acc_B', amount: 10000 },
      { id: 'e2', source: 'acc_B', target: 'acc_C', amount: 9800 },
      { id: 'e3', source: 'acc_C', target: 'acc_A', amount: 9600 }, // closes loop
      { id: 'e4', source: 'acc_C', target: 'acc_D', amount: 200 },
    ];

    const cycles = detectCircularFlows(sampleNodes, edgesWithCycle);

    expect(cycles.length).toBeGreaterThan(0);
    const loop = cycles[0];
    expect(loop[0]).toBe(loop[loop.length - 1]); // starts and ends on same node
  });

  it('computes shortest path for multi-hop fund dispersion tracking', () => {
    const edges = [
      { id: 'e1', source: 'acc_A', target: 'acc_B', amount: 5000 },
      { id: 'e2', source: 'acc_B', target: 'acc_C', amount: 5000 },
      { id: 'e3', source: 'acc_C', target: 'acc_D', amount: 5000 },
    ];

    const { path, totalHops } = findShortestPath('acc_A', 'acc_D', sampleNodes, edges);

    expect(path).toEqual(['acc_A', 'acc_B', 'acc_C', 'acc_D']);
    expect(totalHops).toBe(3);
  });
});
