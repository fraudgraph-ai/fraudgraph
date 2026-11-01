export type NavigationModule =
  | 'command-center'
  | 'alerts'
  | 'investigation'
  | 'graph-explorer'
  | 'transactions'
  | 'agents'
  | 'evidence'
  | 'risk-analytics'
  | 'models'
  | 'datasets'
  | 'compliance'
  | 'system-admin';

export type RiskLevel = 'high' | 'medium' | 'low' | 'safe';

export type CaseStatus = 'in_progress' | 'review' | 'escalated' | 'closed' | 'archived';

export interface InvestigationStage {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending' | 'skipped';
  timestamp?: string;
  completedBy?: string;
}

export interface CaseFinding {
  id: string;
  claim: string;
  evidenceIds: string[];
  confidence: number;
  riskSignal: string;
  isContradicted?: boolean;
}

export interface CaseHypothesis {
  id: string;
  title: string;
  description: string;
  type: 'suspicious' | 'legitimate_alternative';
  likelihood: number;
  supportingEvidenceCount: number;
  refutingEvidenceCount: number;
  status: 'supported' | 'refuted' | 'under_review';
}

export interface Case {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  riskScore: number;
  status: CaseStatus;
  priority: 'High' | 'Medium' | 'Low';
  leadAnalyst: string;
  createdAt: string;
  updatedAt: string;
  summary: string;
  stages: InvestigationStage[];
  findings: CaseFinding[];
  hypotheses: CaseHypothesis[];
  targetAccount: string;
  totalVolume: string;
  involvedAccountsCount: number;
  suspiciousTransfersCount: number;
  evidenceIds: string[];
}

export type EntityType = 'account' | 'person' | 'organization' | 'device' | 'ip' | 'card' | 'alert';

export interface GraphNodeData {
  id: string;
  label: string;
  type: EntityType;
  riskLevel: RiskLevel;
  riskScore: number;
  isCenter?: boolean;
  isFlagged?: boolean;
  properties: {
    accountNo?: string;
    owner?: string;
    entityType?: string;
    created?: string;
    lastActivity?: string;
    balance?: string;
    currency?: string;
    region?: string;
    ipHash?: string;
    deviceFingerprint?: string;
    riskSignals?: Array<{
      title: string;
      score: number;
      severity: RiskLevel;
    }>;
  };
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
  amount: number;
  currency: string;
  timestamp: string;
  isSuspicious?: boolean;
  flowDirection?: 'in' | 'out' | 'bidirectional';
  channel?: string;
}

export type AgentDomain =
  | 'orchestration'
  | 'transaction_graph'
  | 'ml_risk'
  | 'evidence_investigation'
  | 'compliance_security'
  | 'reporting_evaluation';

export interface SpecialistAgent {
  id: string; // e.g. A01, B07, C16
  name: string;
  domain: AgentDomain;
  domainLabel: string;
  role: string;
  status: 'healthy' | 'idle' | 'running' | 'disabled';
  implementationStatus: 'implemented' | 'registered' | 'planned';
  version: string;
  allowedTools: string[];
  inputContract: string;
  outputContract: string;
  executionCount: number;
  successRate: number;
  avgLatencyMs: number;
  costPerExecution: string;
  lastExecution: string;
  description: string;
}

export interface AgentExecutionTrace {
  id: string;
  caseId: string;
  triggeredBy: string;
  status: 'running' | 'completed' | 'failed';
  agentsInvolved: number;
  duration: string;
  startedAt: string;
  completedAt?: string;
  tokenCount: number;
  cost: string;
  steps: Array<{
    stepNumber: number;
    agentId: string;
    agentName: string;
    action: string;
    toolUsed?: string;
    evidenceProduced?: string[];
    status: 'success' | 'running' | 'warning' | 'error';
    durationMs: number;
  }>;
}

export interface AlertItem {
  id: string;
  title: string;
  type: 'structuring' | 'circular_flow' | 'rapid_movement' | 'dormant_reactivation' | 'device_anomaly';
  riskScore: number;
  riskLevel: RiskLevel;
  targetAccount: string;
  sourceEntity: string;
  amount: string;
  currency: string;
  triggeredAt: string;
  detectionModel: string;
  status: 'new' | 'investigating' | 'escalated' | 'dismissed' | 'resolved';
  tags: string[];
}

export interface EvidenceItem {
  id: string; // EV-101
  caseId: string;
  title: string;
  category: 'transaction_chain' | 'subgraph_snapshot' | 'model_inference' | 'device_telemetry' | 'kyc_registry';
  source: string;
  collectedAt: string;
  hash: string;
  status: 'verified' | 'unverified' | 'contradicted';
  claimsSupported: string[];
  confidence: number;
  details: Record<string, any>;
}

export interface TransactionRecord {
  id: string;
  txHash: string;
  sourceAccount: string;
  sourceOwner: string;
  targetAccount: string;
  targetOwner: string;
  amount: number;
  currency: string;
  timestamp: string;
  channel: string;
  riskScore: number;
  riskLevel: RiskLevel;
  patternType: 'standard' | 'layering' | 'smurfing' | 'circular' | 'rapid_drain';
  isFlagged: boolean;
}

export interface ModelBenchmarkData {
  id: string;
  name: string;
  version: string;
  type: 'Rule-Based' | 'Tabular ML (LightGBM)' | 'Graph ML (GraphSAGE)' | 'Graph ML (GAT)' | 'Ensemble Fusion';
  prAuc: number;
  recallAt100: number;
  precisionAt100: number;
  brierScore: number;
  latencyMs: number;
  status: 'production' | 'candidate' | 'baseline' | 'archived';
  dataset: string;
  featureCount: number;
  lastTrained: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  version: string;
  type: 'Synthetic AML' | 'Real Blockchain' | 'Multi-Agent Simulation';
  source: string;
  license: string;
  totalRecords: string;
  accountCount: string;
  timeRange: string;
  schemaStatus: 'Valid' | 'Warning' | 'Error';
  qualityScore: number;
  isSynthetic: boolean;
  fileSize: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorType: 'analyst' | 'supervisor_agent' | 'system';
  action: string;
  targetId: string;
  targetType: 'case' | 'model' | 'evidence' | 'agent' | 'export';
  details: string;
  integrityHash: string;
  status: 'verified' | 'flagged';
}
