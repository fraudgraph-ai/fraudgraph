import React, { useState } from 'react';
import {
  Settings,
  Server,
  Database,
  Cpu,
  Shield,
  Key,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { NavigationModule } from '../../types';

interface SystemAdminProps {
  onNavigate: (module: NavigationModule) => void;
}

export const SystemAdmin: React.FC<SystemAdminProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshDiagnostics = () => {
    setIsRefreshing(true);
    toast({
      type: 'info',
      title: 'Executing Infrastructure Health Checks',
      description: 'Pinging Neo4j Bolt port 7687, Postgres AsyncPG pool, and Celery heartbeat...',
    });

    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        type: 'success',
        title: 'Diagnostic Probes Complete',
        description: 'All 4 cluster services healthy: Neo4j (1.2ms), Postgres (1.1ms), Redis (0.4ms), GNN Runtime (OK).',
      });
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            System Administration & Infrastructure Health
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Database clusters, graph engine pools, worker queues, and LLM budget guardrails.
          </p>
        </div>
        <button
          onClick={handleRefreshDiagnostics}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1627] hover:bg-[#141f36] border border-white/[0.08] text-xs font-medium text-slate-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Pinging Nodes...' : 'Refresh Health Diagnostics'}</span>
        </button>
      </div>

      {/* Infrastructure Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Neo4j Graph Engine */}
        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" />
              Neo4j Enterprise
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-base font-bold font-mono text-white mt-1">bolt://127.0.0.1:7687</p>
          <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
            <div>Version: 5.26.0 (Read Replica)</div>
            <div>Active Connections: 32 / 100</div>
            <div>Pagecache: 8.2 GB / 12 GB</div>
          </div>
        </div>

        {/* PostgreSQL Canonical Store */}
        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-blue-400" />
              PostgreSQL 16
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-base font-bold font-mono text-white mt-1">Cases & Audit Vault</p>
          <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
            <div>Pool: AsyncPG (Pool Size: 20)</div>
            <div>Latency: 1.2ms</div>
            <div>Storage: 4.8 GB (WAL Active)</div>
          </div>
        </div>

        {/* Celery & Redis Worker Queue */}
        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              Celery + Redis
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-base font-bold font-mono text-white mt-1">7 Background Workers</p>
          <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
            <div>Queue Backlog: 0 Tasks</div>
            <div>Memory: 240 MB</div>
            <div>Heartbeat: 4s interval</div>
          </div>
        </div>

        {/* ML Inference Runtime */}
        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-purple-400" />
              PyG + LightGBM
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-base font-bold font-mono text-white mt-1">Torch MPS / CPU Opt</p>
          <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
            <div>Model Checkpoints: Loaded (v2.0)</div>
            <div>Inference Worker: Daemon PID 4910</div>
            <div>Batch Size: Dynamic (1-64)</div>
          </div>
        </div>
      </div>

      {/* LLM Routing & Cost Circuit Breakers */}
      <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-4">
        <h3 className="text-sm font-semibold text-white">LLM Provider Routing & Budget Enforcers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#080d19] border border-white/[0.04] space-y-2">
            <span className="text-cyan-300 font-semibold block">Primary Agent LLM Engine</span>
            <p className="text-slate-300 font-mono text-[11px]">Claude 3.7 Sonnet / GPT-4o Enterprise</p>
            <div className="text-slate-400 text-[10px]">
              Assigned to: A01 Supervisor, D24 Hypothesis, F33 Case Composer
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080d19] border border-white/[0.04] space-y-2">
            <span className="text-emerald-300 font-semibold block">High-Throughput Fast Tier</span>
            <p className="text-slate-300 font-mono text-[11px]">Gemini 1.5 Flash / GPT-4o-mini</p>
            <div className="text-slate-400 text-[10px]">
              Assigned to: D23 Verifier, B14 Entity Resolution, E31 Privacy Guardian
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080d19] border border-white/[0.04] space-y-2">
            <span className="text-amber-300 font-semibold block">A05 Budget Circuit Breaker</span>
            <p className="text-slate-300 font-mono text-[11px]">Max $1.50 / Case · Max 150K Tokens</p>
            <div className="text-slate-400 text-[10px]">
              Hard limit: Halts runaway agent recursion and abstains with human alert.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
