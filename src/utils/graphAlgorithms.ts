/**
 * FraudGraph AI — Graph Algorithms & Mathematical Network Analytics Engine
 * Implements PageRank, Cycle Detection, Dijkstra Shortest Path, and Centrality
 */

export interface AlgorithmNode {
  id: string;
  label: string;
  riskScore: number;
}

export interface AlgorithmEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
}

/**
 * PageRank Algorithm for Directed Transaction Networks
 * Computes node influence / centrality based on inbound financial transfer links.
 */
export function calculatePageRank(
  nodes: AlgorithmNode[],
  edges: AlgorithmEdge[],
  dampingFactor: number = 0.85,
  iterations: number = 20
): Record<string, number> {
  const n = nodes.length;
  if (n === 0) return {};

  const ranks: Record<string, number> = {};
  const outDegree: Record<string, number> = {};
  const inEdges: Record<string, string[]> = {};

  nodes.forEach((node) => {
    ranks[node.id] = 1.0 / n;
    outDegree[node.id] = 0;
    inEdges[node.id] = [];
  });

  edges.forEach((edge) => {
    if (outDegree[edge.source] !== undefined) {
      outDegree[edge.source] += 1;
    }
    if (inEdges[edge.target]) {
      inEdges[edge.target].push(edge.source);
    }
  });

  for (let it = 0; it < iterations; it++) {
    const nextRanks: Record<string, number> = {};
    const baseRank = (1.0 - dampingFactor) / n;

    nodes.forEach((node) => {
      let incomingShare = 0;
      const sources = inEdges[node.id] || [];

      sources.forEach((srcId) => {
        const out = outDegree[srcId] || 1;
        incomingShare += ranks[srcId] / out;
      });

      nextRanks[node.id] = baseRank + dampingFactor * incomingShare;
    });

    Object.assign(ranks, nextRanks);
  }

  // Normalize to 4 decimals
  const result: Record<string, number> = {};
  Object.keys(ranks).forEach((k) => {
    result[k] = Math.round(ranks[k] * 10000) / 10000;
  });

  return result;
}

/**
 * Cycle Detection (Circular Transfer Chains)
 * Identifies money round-trip loops e.g. A -> B -> C -> A
 */
export function detectCircularFlows(
  nodes: AlgorithmNode[],
  edges: AlgorithmEdge[]
): string[][] {
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => {
    adj[n.id] = [];
  });

  edges.forEach((e) => {
    if (adj[e.source]) {
      adj[e.source].push(e.target);
    }
  });

  const visited: Record<string, boolean> = {};
  const recStack: Record<string, boolean> = {};
  const currentPath: string[] = [];
  const cycles: string[][] = [];

  function dfs(u: string) {
    visited[u] = true;
    recStack[u] = true;
    currentPath.push(u);

    const neighbors = adj[u] || [];
    for (const v of neighbors) {
      if (!visited[v]) {
        dfs(v);
      } else if (recStack[v]) {
        const cycleStartIndex = currentPath.indexOf(v);
        if (cycleStartIndex !== -1) {
          cycles.push(currentPath.slice(cycleStartIndex).concat(v));
        }
      }
    }

    currentPath.pop();
    recStack[u] = false;
  }

  nodes.forEach((n) => {
    if (!visited[n.id]) {
      dfs(n.id);
    }
  });

  return cycles;
}

/**
 * Shortest Path using Dijkstra for Multi-Hop Money Trail Exploration
 */
export function findShortestPath(
  sourceId: string,
  targetId: string,
  nodes: AlgorithmNode[],
  edges: AlgorithmEdge[]
): { path: string[]; totalHops: number } {
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  nodes.forEach((n) => {
    dist[n.id] = Infinity;
    prev[n.id] = null;
    unvisited.add(n.id);
  });

  dist[sourceId] = 0;

  const adj: Record<string, Array<{ target: string; weight: number }>> = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    if (adj[e.source]) {
      adj[e.source].push({ target: e.target, weight: 1 });
    }
  });

  while (unvisited.size > 0) {
    let curr: string | null = null;
    let minD = Infinity;

    unvisited.forEach((id) => {
      if (dist[id] < minD) {
        minD = dist[id];
        curr = id;
      }
    });

    if (!curr || curr === targetId || minD === Infinity) break;

    unvisited.delete(curr);

    const neighbors = adj[curr] || [];
    neighbors.forEach(({ target, weight }) => {
      if (unvisited.has(target)) {
        const alt = dist[curr!] + weight;
        if (alt < dist[target]) {
          dist[target] = alt;
          prev[target] = curr;
        }
      }
    });
  }

  const path: string[] = [];
  let u: string | null = targetId;
  while (u) {
    path.unshift(u);
    u = prev[u];
  }

  if (path.length > 0 && path[0] === sourceId) {
    return { path, totalHops: path.length - 1 };
  }

  return { path: [], totalHops: 0 };
}
