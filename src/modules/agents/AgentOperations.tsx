import React, { useState } from 'react';
import {
  Bot,
  Cpu,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  Search,
  ArrowRight,
  Filter,
  Layers,
  Shield,
  FileCheck,
  Terminal,
  Zap,
} from 'lucide-react';
import {
  specialistAgentsCatalog,
  liveExecutions,
} from '../../data/mockData';
import { AgentDomain, SpecialistAgent, NavigationModule } from '../../types';
import { useToast } from '../../components/ui/Toast';

interface AgentOperationsProps {
  onNavigate: (module: NavigationModule) => void;
  onOpenCase: (caseId: string) => void;
}

export const AgentOperations: React.FC<AgentOperationsProps> = ({ onNavigate, onOpenCase }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'registry' | 'executions' | 'orchestration' | 'traces'>('overview');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<SpecialistAgent | null>(null);
  const [executionsList, setExecutionsList] = useState(liveExecutions);
  const [selectedExecution, setSelectedExecution] = useState(liveExecutions[0]);
  const [isDispatching, setIsDispatching] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number | null>(null);

  const handleTriggerLiveRun = () => {
    setIsDispatching(true);
    setActivePipelineStep(1);
    toast({
      type: 'info',
      title: 'Supervisor Agent Dispatched',
      description: 'Evaluating case FG-8421 typology and allocating specialist budget (RQ-05)...',
    });

    setTimeout(() => setActivePipelineStep(2), 600);
    setTimeout(() => setActivePipelineStep(3), 1200);
    setTimeout(() => setActivePipelineStep(4), 1800);
    setTimeout(() => setActivePipelineStep(5), 2400);

    setTimeout(() => {
      setIsDispatching(false);
      setActivePipelineStep(null);

      const newExec = {
        id: `EX-${Math.floor(10000 + Math.random() * 90000)}`,
        caseId: 'FG-8421',
        triggeredBy: 'Supervisor (Dynamic DAG)',
        status: 'completed' as const,
        agentsInvolved: 6,
        duration: '2.8s',
        startedAt: 'Just now',
        completedAt: 'Just now',
        tokenCount: 42100,
        cost: '$0.24',
        steps: [
          { stepNumber: 1, agentId: 'A-01', agentName: 'Supervisor', action: 'Decomposed alert into 4 investigative sub-tasks', durationMs: 280, toolUsed: 'task_planner', status: 'success' as const },
          { stepNumber: 2, agentId: 'B-08', agentName: 'Circular Routing', action: 'Identified ₺7.43M closed transfer loop across 3 accounts', durationMs: 440, toolUsed: 'johnson_cycle_detector', status: 'success' as const },
          { stepNumber: 3, agentId: 'C-14', agentName: 'Device Auditor', action: 'Flagged hardware collision on DEV-9921', durationMs: 310, toolUsed: 'device_fingerprint_lookup', status: 'success' as const },
          { stepNumber: 4, agentId: 'E-26', agentName: 'Risk Critic', action: 'Formulated counter-hypothesis for commercial invoice batching (Refuted: Sub-15m hops)', durationMs: 520, toolUsed: 'counter_evidence_evaluator', status: 'success' as const },
          { stepNumber: 5, agentId: 'E-25', agentName: 'Evidence Verifier', action: 'Audited all 4 claims against graph edges (0 hallucinations detected)', durationMs: 380, toolUsed: 'sha256_merkle_verifier', status: 'success' as const },
          { stepNumber: 6, agentId: 'F-31', agentName: 'Dossier Composer', action: 'Compiled forensic case file with SAR recommendations', durationMs: 410, toolUsed: 'dossier_generator', status: 'success' as const },
        ],
      };

      setExecutionsList((prev) => [newExec, ...prev]);
      setSelectedExecution(newExec);
      setActiveTab('traces');

      toast({
        type: 'success',
        title: 'Multi-Agent Investigation Completed',
        description: `Run ${newExec.id} finalized in 2.8s. 0 hallucinated citations (RQ-01, RQ-04 verified).`,
      });
    }, 2800);
  };

  const filteredAgents = specialistAgentsCatalog.filter((agent) => {
    if (domainFilter !== 'all' && agent.domain !== domainFilter) return false;
    if (
      searchQuery &&
      !agent.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !agent.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !agent.role.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Agent Operations
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-agent orchestration, execution monitoring and performance analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerLiveRun}
            disabled={isDispatching}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 fill-white text-white ${isDispatching ? 'animate-bounce' : ''}`} />
            <span>{isDispatching ? 'Orchestrating Agents...' : 'Trigger Live Agent Run'}</span>
          </button>
          <div className="flex items-center gap-2 bg-[#0c1220] px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Last 24 Hours</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.08] gap-6 text-xs">
        {(['overview', 'registry', 'executions', 'orchestration', 'traces'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 font-medium capitalize border-b-2 transition-all ${
              activeTab === tab
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'registry' ? 'Agent Registry (36 Roles)' : tab}
          </button>
        ))}
      </div>

      {/* 5 Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#0c1220] border border-white/[0.08]">
          <span className="text-[11px] font-medium text-slate-400">Total Agents</span>
          <p className="text-2xl font-bold font-mono text-white mt-1.5">36</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">6 Specialist Domains</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0c1220] border border-white/[0.08]">
          <span className="text-[11px] font-medium text-slate-400">Active Agents</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-2xl font-bold font-mono text-white">28</p>
          </div>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">77.8% Fleet Utilization</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0c1220] border border-white/[0.08]">
          <span className="text-[11px] font-medium text-slate-400">Running Executions</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <p className="text-2xl font-bold font-mono text-white">7</p>
          </div>
          <span className="text-[10px] text-blue-400 mt-0.5 block">Parallel async DAGs</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0c1220] border border-white/[0.08]">
          <span className="text-[11px] font-medium text-slate-400">Success Rate</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <p className="text-2xl font-bold font-mono text-white">97.6%</p>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +1.8%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Verified evidence proofs</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0c1220] border border-white/[0.08]">
          <span className="text-[11px] font-medium text-slate-400">Avg. Latency</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <p className="text-2xl font-bold font-mono text-white">3.4s</p>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              -12%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Per investigation step</span>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Live Orchestration Flow & Live Executions (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Orchestration Pipeline Card */}
            <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    Agent Orchestration (Live)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Stateful dynamic DAG execution flow with circuit breakers
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Running
                </span>
              </div>

              {/* Horizontal Pipeline Steps */}
              <div className="p-4 rounded-xl bg-[#080d19] border border-white/[0.06] flex flex-wrap md:flex-nowrap items-center justify-between gap-2 overflow-x-auto text-xs">
                {/* Step 1: Supervisor */}
                <div className={`flex-1 min-w-[120px] p-2.5 rounded-lg border text-center shadow-lg transition-all ${
                  activePipelineStep === 1
                    ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 animate-pulse'
                    : 'bg-blue-950/40 border-blue-500/40'
                }`}>
                  <span className="text-[10px] font-mono text-cyan-400 block font-semibold">
                    A01 Root
                  </span>
                  <span className="font-semibold text-slate-200 block text-xs mt-0.5">
                    Supervisor
                  </span>
                  <span className="text-[9px] text-slate-400">(Orchestrator)</span>
                </div>

                <span className="text-slate-600 font-mono">➔</span>

                {/* Step 2: Planning */}
                <div className={`flex-1 min-w-[120px] p-2.5 rounded-lg border text-center shadow-lg transition-all ${
                  activePipelineStep === 2
                    ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400 animate-pulse'
                    : 'bg-indigo-950/40 border-indigo-500/40'
                }`}>
                  <span className="text-[10px] font-mono text-indigo-300 block font-semibold">
                    A02-A03
                  </span>
                  <span className="font-semibold text-slate-200 block text-xs mt-0.5">
                    Planning
                  </span>
                  <span className="text-[9px] text-slate-400">(Task Decomp.)</span>
                </div>

                <span className="text-slate-600 font-mono">➔</span>

                {/* Step 3: Specialists */}
                <div className={`flex-1 min-w-[120px] p-2.5 rounded-lg border text-center shadow-lg ring-1 ring-cyan-400 transition-all ${
                  activePipelineStep === 3
                    ? 'bg-cyan-600/30 border-cyan-400 ring-2 ring-cyan-400 animate-pulse'
                    : 'bg-cyan-950/40 border-cyan-500/40'
                }`}>
                  <span className="text-[10px] font-mono text-cyan-300 block font-semibold">
                    Groups B & C
                  </span>
                  <span className="font-semibold text-slate-100 block text-xs mt-0.5">
                    Specialists
                  </span>
                  <span className="text-[9px] text-cyan-400 font-medium">(28 Agents)</span>
                </div>

                <span className="text-slate-600 font-mono">➔</span>

                {/* Step 4: Evidence Verifier */}
                <div className={`flex-1 min-w-[120px] p-2.5 rounded-lg border text-center shadow-lg transition-all ${
                  activePipelineStep === 4
                    ? 'bg-emerald-600/30 border-emerald-400 ring-2 ring-emerald-400 animate-pulse'
                    : 'bg-emerald-950/40 border-emerald-500/40'
                }`}>
                  <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
                    D22-D26
                  </span>
                  <span className="font-semibold text-slate-200 block text-xs mt-0.5">
                    Evidence
                  </span>
                  <span className="text-[9px] text-slate-400">(Verification)</span>
                </div>

                <span className="text-slate-600 font-mono">➔</span>

                {/* Step 5: Report Output */}
                <div className={`flex-1 min-w-[120px] p-2.5 rounded-lg border text-center shadow-lg transition-all ${
                  activePipelineStep === 5
                    ? 'bg-purple-600/30 border-purple-400 ring-2 ring-purple-400 animate-pulse'
                    : 'bg-purple-950/40 border-purple-500/40'
                }`}>
                  <span className="text-[10px] font-mono text-purple-300 block font-semibold">
                    F33 Dossier
                  </span>
                  <span className="font-semibold text-slate-200 block text-xs mt-0.5">
                    Report
                  </span>
                  <span className="text-[9px] text-slate-400">(Case Output)</span>
                </div>
              </div>
            </div>

            {/* Live Executions Table */}
            <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    Live Executions
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time concurrent agent investigation runs (click row to inspect traces)
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono font-medium">
                  {executionsList.length} Runs Logged
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400 text-[11px] font-medium">
                      <th className="pb-2.5 pl-1 font-mono">Execution ID</th>
                      <th className="pb-2.5">Case</th>
                      <th className="pb-2.5">Triggered By</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5 text-center">Agents</th>
                      <th className="pb-2.5 pr-1 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {executionsList.map((exec) => (
                      <tr
                        key={exec.id}
                        onClick={() => {
                          setSelectedExecution(exec);
                          setActiveTab('traces');
                        }}
                        className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                      >
                        <td className="py-3 pl-1 font-mono font-semibold text-cyan-300">
                          {exec.id}
                        </td>
                        <td className="py-3 font-mono font-medium text-slate-200">
                          {exec.caseId}
                        </td>
                        <td className="py-3 text-slate-300">{exec.triggeredBy}</td>
                        <td className="py-3">
                          {exec.status === 'running' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Running
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                              <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                              Completed
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-center font-mono text-slate-300">
                          {exec.agentsInvolved}
                        </td>
                        <td className="py-3 pr-1 text-right font-mono text-slate-400">
                          {exec.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Agent Domains Donut & Agent Health (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Agent Domains Distribution */}
            <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">Agent Domains</h3>
                  <p className="text-xs text-slate-400">36 registered specialist roles</p>
                </div>
              </div>

              {/* Donut representation */}
              <div className="flex items-center justify-center py-2">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="10" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="10" strokeDasharray="40 200" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" strokeWidth="10" strokeDasharray="52 200" strokeDashoffset="-40" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="10" strokeDasharray="40 200" strokeDashoffset="-92" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="10" strokeDasharray="46 200" strokeDashoffset="-132" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8b5cf6" strokeWidth="10" strokeDasharray="32 200" strokeDashoffset="-178" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-base font-bold text-white">36</span>
                    <span className="text-[10px] text-slate-400">Agents</span>
                  </div>
                </div>
              </div>

              {/* Domain Breakdown list */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Orchestration
                  </span>
                  <span className="font-mono font-bold text-slate-100">6</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    Transaction & Graph
                  </span>
                  <span className="font-mono font-bold text-slate-100">8</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    ML & Risk
                  </span>
                  <span className="font-mono font-bold text-slate-100">6</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Evidence & Investigation
                  </span>
                  <span className="font-mono font-bold text-slate-100">7</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    Compliance & Security
                  </span>
                  <span className="font-mono font-bold text-slate-100">5</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                    Reporting & Evaluation
                  </span>
                  <span className="font-mono font-bold text-slate-100">4</span>
                </div>
              </div>
            </div>

            {/* Agent Health Bars */}
            <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-3.5">
              <h3 className="text-sm font-semibold text-white tracking-tight">Agent Health</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Healthy</span>
                    <span className="font-mono font-bold text-emerald-400">28 (77.8%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '77.8%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Idle</span>
                    <span className="font-mono font-bold text-sky-400">5 (13.9%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: '13.9%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Disabled / Planned</span>
                    <span className="font-mono font-bold text-slate-400">3 (8.3%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 rounded-full" style={{ width: '8.3%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Full 36 Specialist Agent Registry Table */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agent ID, name, or capability..."
                className="w-full pl-8 pr-4 py-1.5 rounded-lg bg-[#0e1627] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="bg-[#0e1627] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All 6 Domains</option>
                <option value="orchestration">Orchestration</option>
                <option value="transaction_graph">Transaction & Graph</option>
                <option value="ml_risk">ML & Risk</option>
                <option value="evidence_investigation">Evidence & Investigation</option>
                <option value="compliance_security">Compliance & Security</option>
                <option value="reporting_evaluation">Reporting & Evaluation</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl bg-[#0c1220] border border-white/[0.08] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e1627] border-b border-white/[0.08] text-slate-400 text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-3 font-mono">ID</th>
                  <th className="py-3 px-3">Agent Name</th>
                  <th className="py-3 px-3">Domain</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Allowed Tools</th>
                  <th className="py-3 px-3 text-right">Execs</th>
                  <th className="py-3 px-3 text-right">Success</th>
                  <th className="py-3 px-3 text-right">Avg Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-cyan-300">
                      {agent.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-100">{agent.name}</div>
                      <div className="text-[10px] text-slate-400">{agent.role}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px]">
                        {agent.domainLabel}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          agent.status === 'running'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : agent.status === 'healthy'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : agent.status === 'idle'
                            ? 'bg-slate-700/40 text-slate-300'
                            : 'bg-red-950/40 text-red-400'
                        }`}
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {agent.allowedTools.slice(0, 2).join(', ')}
                      {agent.allowedTools.length > 2 && ` +${agent.allowedTools.length - 2}`}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-200">
                      {agent.executionCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">
                      {agent.successRate}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {agent.avgLatencyMs}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Traces */}
      {activeTab === 'traces' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Execution Trace: {selectedExecution.id}</h3>
                <p className="text-xs text-slate-400 font-mono">Case {selectedExecution.caseId} · Duration: {selectedExecution.duration} · Triggered By: {selectedExecution.triggeredBy}</p>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                selectedExecution.status === 'running'
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                  : 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
              }`}>
                {selectedExecution.status === 'running' ? 'Active Execution' : 'Completed Trace'}
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {selectedExecution.steps.map((st) => (
                <div key={st.stepNumber} className="p-2.5 rounded bg-[#080d19] border border-white/[0.04] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">#{st.stepNumber}</span>
                    <span className="text-cyan-400 font-bold">[{st.agentId} {st.agentName}]</span>
                    <span className="text-slate-200">{st.action}</span>
                    {st.toolUsed && (
                      <span className="text-amber-400 text-[10px] bg-amber-950/40 px-1.5 py-0.5 rounded">
                        tool: {st.toolUsed}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[11px]">{st.durationMs}ms</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
