# ADR-001: Hybrid NetworkX In-Memory & Neo4j Dual Engine Architecture

## Status
Accepted

## Context
Financial crime investigations require both long-term storage of multi-million entity transaction graphs and low-latency (< 50ms) ad-hoc topological operations (such as k-hop ego subgraph extraction, circular cycle detection with Tarjan/Johnson algorithms, and personalized PageRank centrality calculations).

Deploying only an external distributed graph database (e.g., Neo4j cluster) introduces network round-trip overhead and Docker/JVM dependency overhead during local analyst workbench sessions, rapid unit testing, and ephemeral CI/CD test runners. Conversely, relying strictly on in-memory structures lacks persistence and horizontal scaling across historical transaction archives.

## Decision
We adopted a dual-layer hybrid architecture:
1. **Production Cluster Persistence:** Neo4j (5.26.0) serves as the persistent distributed system of record with Cypher query support, multi-label indexing, and APOC / Graph Data Science plugins.
2. **Low-Latency Analytical Execution Engine:** In-memory temporal `FinancialGraphEngine` implemented with NetworkX and pure-Python power iteration algorithms. This handles ego-subgraph extraction, rapid cycle discovery, and real-time pruning without external C-compilation dependencies (e.g. NumPy/SciPy bindings), ensuring instantaneous startup in containerized and serverless environments.

## Consequences
- **Positive:**
  - Zero-latency test execution: 22 Pytest backend tests execute in under 0.3 seconds.
  - Portability: Developers can run the full suite and workbench without a running Neo4j instance.
  - Deterministic replay: Historical temporal slices can be loaded into memory without mutating the persistent graph.
- **Negative:**
  - In-memory working sets must be bounded (e.g., k-hop ego subgraphs capped at ≤ 500 nodes per extraction) to maintain low memory footprints.
