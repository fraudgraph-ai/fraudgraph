# FraudGraph AI — 36 Specialist Agents Catalog

This document defines the formal contracts, tool execution permissions, input/output specifications, activation conditions, and failure behaviors for all **36 specialist agent roles** in FraudGraph AI.

---

## Domain Overview

| Domain | Identifier | Role Count | Focus Area |
| :--- | :---: | :---: | :--- |
| **Group A: Orchestration & Case Management** | A01 – A06 | 6 | Workflow routing, task decomposition, budget enforcement, case lifecycle |
| **Group B: Transaction & Graph Intelligence** | B07 – B14 | 8 | Flow topology, cycle detection, multi-hop layering, entity resolution |
| **Group C: Machine Learning & Risk Intelligence**| C15 – C21 | 7 | Tabular LightGBM, GraphSAGE/GAT embeddings, calibration, drift detection |
| **Group D: Evidence & Critical Investigation** | D22 – D28 | 7 | Forensic artifact collection, claim verification, counter-hypotheses, contradiction detection |
| **Group E: Compliance & Security** | E29 – E32 | 4 | Regulatory checklist alignment (MASAK/FinCEN), PII redaction, immutable audit hash chain |
| **Group F: Reporting & Continuous Learning** | F33 – F36 | 4 | Forensic case dossier synthesis, analyst co-pilot, feedback categorization, benchmark eval |

---

## Group A — Orchestration and Case Management

### A01: Global Supervisor
- **Role:** Root Investigation Coordinator
- **Status:** Implemented (v1.2.0)
- **Allowed Tools:** `plan_evaluator`, `agent_dispatcher`, `budget_guard`, `state_snapshot`
- **Input Contract:** `CaseContext & AlertPayload`
- **Output Contract:** `InvestigationRoadmap & AgentAssignments`
- **Failure Behavior:** If routing is ambiguous, falls back to deterministic MVP 12-agent pipeline. Never generates unconstrained freeform steps.

### A02: Task Decomposer
- **Role:** Hierarchical Task Partitioning
- **Status:** Implemented (v1.1.0)
- **Allowed Tools:** `dag_builder`, `dependency_analyzer`
- **Input Contract:** `InvestigationGoal`
- **Output Contract:** `AtomicTaskList[]`
- **Failure Behavior:** If graph complexity exceeds max depth (3 hops), truncates leaf tasks and logs warning.

### A03: Investigation Planner
- **Role:** Strategic Evidence Planning
- **Status:** Implemented (v1.0.4)
- **Allowed Tools:** `typology_matcher`, `evidence_graph_matrix`
- **Input Contract:** `CaseSummary & RiskSignals`
- **Output Contract:** `PrioritizedPlan & RequiredProofs`
- **Failure Behavior:** Emits minimum required evidence threshold. Halts if critical data sources are unreachable.

### A04: Routing Optimizer
- **Role:** Dynamic Agent Dispatcher
- **Status:** Implemented (v1.0.2)
- **Allowed Tools:** `cost_model_evaluator`, `latency_budget_checker`
- **Input Contract:** `ActiveTaskList`
- **Output Contract:** `AgentRoutingTable`
- **Failure Behavior:** Selects cheapest agent variant (e.g., deterministic Cypher query instead of GNN inference when topological signals suffice).

### A05: Budget Controller
- **Role:** Execution Cost & Token Enforcer
- **Status:** Implemented (v1.0.0)
- **Allowed Tools:** `token_tracker`, `circuit_breaker`
- **Input Contract:** `StepExecutionEstimate`
- **Output Contract:** `BudgetAuthorizationStatus (APPROVED | DENIED)`
- **Failure Behavior:** Hard stop if case execution exceeds $1.50 or 150,000 tokens. Flags case for human review with `INSUFFICIENT_BUDGET`.

### A06: Case Lifecycle Agent
- **Role:** State Transition Manager
- **Status:** Registered (v0.9.0)
- **Allowed Tools:** `postgres_case_repo`, `audit_sign`
- **Input Contract:** `AnalystAction | AutoApprovalRule`
- **Output Contract:** `NewCaseState`
- **Failure Behavior:** Rejects non-DAG state transitions (e.g., cannot close without verified evidence or human signoff).

---

## Group B — Transaction and Graph Intelligence

### B07: Transaction Analyst
- **Role:** Transaction Flow Inspector
- **Status:** Implemented (v1.3.0)
- **Allowed Tools:** `read_tx_ledger`, `velocity_calculator`, `amount_distribution_test`
- **Input Contract:** `AccountId & TimeWindow`
- **Output Contract:** `TransactionAnomalySummary`
- **Failure Behavior:** Emits `EMPTY_LEDGER` warning if no transactions in window.

### B08: Account Behavior Analyst
- **Role:** Baseline Deviation Profiler
- **Status:** Implemented (v1.1.2)
- **Allowed Tools:** `profile_feature_store`, `historical_quantile_calc`
- **Input Contract:** `AccountEntity & RecentPeriod`
- **Output Contract:** `BehaviorDeviationVector (z-score, quantile)`

### B09: Temporal Pattern Analyst
- **Role:** Time-Series Pattern Miner
- **Status:** Implemented (v1.2.0)
- **Allowed Tools:** `fourier_periodicity`, `burst_detector`, `event_timeline_query`
- **Input Contract:** `TransactionTimeline[]`
- **Output Contract:** `TemporalClusteringReport`

### B10: Graph Structure Analyst
- **Role:** Topology & Centrality Miner
- **Status:** Implemented (v1.4.1)
- **Allowed Tools:** `neo4j_readonly_cypher`, `pagerank_calc`, `betweenness_calc`
- **Input Contract:** `SeedNodeId & MaxHops(3)`
- **Output Contract:** `SubgraphTopologyMetrics`
- **Failure Behavior:** Strict read-only query permissions. Max execution timeout: 3,000ms.

### B11: Community Detection Agent
- **Role:** Louvain & Infomap Clusterer
- **Status:** Implemented (v1.0.5)
- **Allowed Tools:** `louvain_clustering`, `weakly_connected_components`
- **Input Contract:** `EdgeListGraph`
- **Output Contract:** `ClusterPartitionMap`

### B12: Circular Flow Analyst
- **Role:** Loop & Round-Trip Detector
- **Status:** Implemented (v1.2.3)
- **Allowed Tools:** `johnson_cycles_finder`, `fund_conservation_check`
- **Input Contract:** `DirectFlowGraph & TimeDelta`
- **Output Contract:** `DetectedCyclesList`

### B13: Multi-Hop Flow Analyst
- **Role:** Dispersion & Layering Tracer
- **Status:** Implemented (v1.3.0)
- **Allowed Tools:** `shortest_path_dijkstra`, `all_simple_paths`, `flow_conservation_tracer`
- **Input Contract:** `SourceId & SinkIds & Depth`
- **Output Contract:** `MultiHopChains & LayeringIndex`

### B14: Entity Resolution Agent
- **Role:** Identity & Alias Deduplication
- **Status:** Registered (v0.9.5)
- **Allowed Tools:** `fuzzy_string_matcher`, `graph_link_prediction`, `ip_device_matcher`
- **Input Contract:** `CandidateEntities[]`
- **Output Contract:** `MergedEntityClusters & MatchConfidence`

---

## Group C — Machine Learning and Risk

### C15: Rule Evaluation Agent
- **Role:** Deterministic Rule Engine
- **Status:** Implemented (v1.0.0)
- **Allowed Tools:** `aml_ruleset_runner`
- **Input Contract:** `TransactionEvent`
- **Output Contract:** `TriggeredRules[]`

### C16: Tabular ML Analyst
- **Role:** LightGBM Risk Inference
- **Status:** Implemented (v2.1.0)
- **Allowed Tools:** `lightgbm_infer`, `shap_values_calc`
- **Input Contract:** `FeatureVector`
- **Output Contract:** `RiskProbability & FeatureContributions`

### C17: GNN Analyst
- **Role:** Graph Neural Network Scorer
- **Status:** Implemented (v1.4.0)
- **Allowed Tools:** `graphsage_torch_infer`, `gat_attention_weights`
- **Input Contract:** `PyG_HeteroData_Subgraph`
- **Output Contract:** `NodeEmbedding & GraphRiskScore & AttentionEdges`

### C18: Anomaly Analyst
- **Role:** Unsupervised Outlier Scorer
- **Status:** Implemented (v1.1.0)
- **Allowed Tools:** `isolation_forest`, `autoencoder_reconstruction`
- **Input Contract:** `NormalizedFeatureArray`
- **Output Contract:** `AnomalyScore & ReconstructionError`

### C19: Risk Fusion Agent
- **Role:** Multi-Modal Signal Calibrator
- **Status:** Implemented (v1.3.2)
- **Allowed Tools:** `isotonic_calibrator`, `platt_scaler`, `bayesian_fusion`
- **Input Contract:** `{RuleScore, TabularScore, GNNScore, AnomalyScore}`
- **Output Contract:** `CalibratedRiskScore & ConfidenceInterval`

### C20: Uncertainty Analyst
- **Role:** Epistemic Uncertainty Estimator
- **Status:** Implemented (v1.0.1)
- **Allowed Tools:** `monte_carlo_dropout`, `conformal_prediction_set`
- **Input Contract:** `ModelPrediction & Variance`
- **Output Contract:** `PredictionInterval & AbstainRecommendation`

### C21: Drift Detection Agent
- **Role:** Data & Concept Drift Monitor
- **Status:** Registered (v0.9.2)
- **Allowed Tools:** `ks_test`, `population_stability_index`, `wasserstein_distance`
- **Input Contract:** `BatchFeatures & ReferenceBaseline`
- **Output Contract:** `DriftMetrics & RetrainAlert`

---

## Group D — Evidence and Critical Investigation

### D22: Evidence Collector
- **Role:** Forensic Artifact Harvester
- **Status:** Implemented (v1.2.0)
- **Allowed Tools:** `hash_sha256`, `subgraph_snapshot_serializer`, `evidence_vault_write`
- **Input Contract:** `RawQueryOutput & QueryMetadata`
- **Output Contract:** `EvidenceRecord (EV-*)`

### D23: Evidence Verifier
- **Role:** Claim-to-Proof Grounding Validator
- **Status:** Implemented (v1.4.0)
- **Allowed Tools:** `evidence_claim_crossref`, `source_hash_auditor`
- **Input Contract:** `AgentClaim & ReferencedEvidenceIds[]`
- **Output Contract:** `VerificationStatus (VERIFIED | REFUTED | UNGROUNDED)`

### D24: Hypothesis Generator
- **Role:** Scenario Theory Formulation
- **Status:** Implemented (v1.2.1)
- **Allowed Tools:** `typology_kb_retriever`, `scenario_generator`
- **Input Contract:** `VerifiedFindingsList`
- **Output Contract:** `CandidateHypotheses[]`

### D25: Counter-Hypothesis Agent
- **Role:** Adversarial Devil's Advocate
- **Status:** Implemented (v1.3.0)
- **Allowed Tools:** `business_explanations_kb`, `counter_evidence_finder`
- **Input Contract:** `PrimarySuspicionClaim & AccountContext`
- **Output Contract:** `AlternativeExplanations & RefutingQueries`

### D26: Contradiction Detector
- **Role:** Logical Inconsistency Finder
- **Status:** Implemented (v1.1.0)
- **Allowed Tools:** `nli_entailment_checker`, `temporal_overlap_validator`
- **Input Contract:** `AllGeneratedClaims[] & TimeBounds`
- **Output Contract:** `ContradictionPairs[]`

### D27: Graph Explanation Agent
- **Role:** Subgraph Narrative Synthesizer
- **Status:** Implemented (v1.2.0)
- **Allowed Tools:** `gnn_explainer_subgraph`, `cytoscape_json_exporter`
- **Input Contract:** `TargetNode & InfluentialEdges[]`
- **Output Contract:** `AuditableExplanationSubgraph & VisualNarrative`

### D28: Confidence Reviewer
- **Role:** Final Investigation Arbiter
- **Status:** Registered (v0.9.1)
- **Allowed Tools:** `calibrated_threshold_gate`
- **Input Contract:** `VerifiedFindings & HypothesesWeights`
- **Output Contract:** `InvestigationVerdictRecommendation & HumanReviewFlag`

---

## Group E — Compliance and Security

### E29: Policy Interpreter
- **Role:** Institutional Policy Alignor
- **Status:** Implemented (v1.0.2)
- **Allowed Tools:** `policy_handbook_rag`
- **Input Contract:** `CaseSummary & OrganizationJurisdiction`
- **Output Contract:** `ApplicableSOPRules[]`

### E30: Compliance Review Agent
- **Role:** Regulatory Checklist Validator
- **Status:** Registered (v0.9.0)
- **Allowed Tools:** `fincen_masak_checklist_runner`
- **Input Contract:** `CaseDossier`
- **Output Contract:** `ComplianceChecklistStatus`

### E31: Privacy Guardian
- **Role:** PII Redactor & Tokenizer
- **Status:** Implemented (v1.1.0)
- **Allowed Tools:** `presidio_pii_anonymizer`, `token_hasher`
- **Input Contract:** `RawTextWithPII`
- **Output Contract:** `AnonymizedDossier & SaltMap`

### E32: Audit Integrity Agent
- **Role:** Immutable Trace Verifier
- **Status:** Implemented (v1.0.4)
- **Allowed Tools:** `merkle_hash_chain`, `trace_signature_validator`
- **Input Contract:** `CaseExecutionTrace`
- **Output Contract:** `IntegrityVerificationProof`

---

## Group F — Reporting and Continuous Learning

### F33: Case Report Composer
- **Role:** Forensic Dossier Author
- **Status:** Implemented (v1.3.1)
- **Allowed Tools:** `pdf_markdown_generator`, `evidence_citation_linker`
- **Input Contract:** `VerifiedCaseState`
- **Output Contract:** `ExportableCaseDossier`

### F34: Analyst Assistant
- **Role:** Interactive Q&A Co-Pilot
- **Status:** Implemented (v1.2.0)
- **Allowed Tools:** `case_vector_search`, `cypher_generator_sandboxed`
- **Input Contract:** `AnalystQuestion & CaseContext`
- **Output Contract:** `GroundingAnswer & FollowUpSuggestions`

### F35: Feedback Learning Agent
- **Role:** Analyst Disposition Classifier
- **Status:** Registered (v0.9.0)
- **Allowed Tools:** `disposition_categorizer`, `preference_dataset_writer`
- **Input Contract:** `AnalystClosureNote & FinalDisposition`
- **Output Contract:** `TrainingPair & FeedbackTelemetry`

### F36: Evaluation Agent
- **Role:** Automated Benchmark Evaluator
- **Status:** Planned (v0.2.0)
- **Allowed Tools:** `ground_truth_comparator`, `precision_recall_scorer`
- **Input Contract:** `EvaluationRunConfig`
- **Output Contract:** `BenchmarkReportMatrix`
