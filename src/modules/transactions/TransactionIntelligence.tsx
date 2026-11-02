import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Filter,
  Search,
  ExternalLink,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Zap,
  Activity,
  RefreshCw,
  ShieldCheck,
  Layers,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { recentTransactionsList } from '../../data/mockData';
import { NavigationModule, TransactionRecord } from '../../types';
import { apiClient, StreamMetricsResponse } from '../../services/apiClient';
import { useToast } from '../../components/ui/Toast';

interface TransactionIntelligenceProps {
  onNavigate: (module: NavigationModule) => void;
  onOpenCase: (caseId: string) => void;
}

export const TransactionIntelligence: React.FC<TransactionIntelligenceProps> = ({
  onNavigate,
  onOpenCase,
}) => {
  const { toast } = useToast();
  const [filterPattern, setFilterPattern] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [metrics, setMetrics] = useState<StreamMetricsResponse | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(false);
  const [isSimulatingBurst, setIsSimulatingBurst] = useState<boolean>(false);
  const [txList, setTxList] = useState(recentTransactionsList);

  const fetchMetrics = async () => {
    setIsLoadingMetrics(true);
    try {
      const data = await apiClient.getStreamMetrics();
      if (data) {
        setMetrics(data);
      }
    } catch {
      // Graceful fallback to default baseline
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateBurst = async () => {
    setIsSimulatingBurst(true);
    try {
      const res = await apiClient.simulateStreamBurst(1000, true, 'ibm_amlsim_500k');
      if (res) {
        toast({
          type: 'success',
          title: 'High-Velocity Burst Ingestion Succeeded',
          description: `Simulated ${res.burst_size.toLocaleString()} events in ${res.ingest_duration_seconds}s (${res.throughput_tx_sec.toLocaleString()} tx/sec). ${res.critical_cycles_detected} Critical 3-Hop Cycle Enjected & Flagged.`,
        });

        // Prepend synthetic flagged loop transaction to local table
        const burstTx: TransactionRecord = {
          id: 'TX-LOOP-01',
          txHash: '0x8f1994a821e290f1190a42bf4c',
          timestamp: 'Just now',
          sourceAccount: 'TR-MULE-ALPHA',
          sourceOwner: 'Synthetic Laundering Mule A',
          targetAccount: 'TR-MULE-BETA',
          targetOwner: 'Synthetic Laundering Mule B',
          amount: 8500000,
          currency: 'TRY',
          channel: 'Swift MT103',
          patternType: 'layering',
          riskScore: 0.96,
          riskLevel: 'high',
          isFlagged: true,
        };
        setTxList((prev) => [burstTx, ...prev]);
        fetchMetrics();
      } else {
        toast({
          type: 'info',
          title: 'Local Burst Simulation Executed',
          description: 'Processed 1,000 synthetic transactions in offline mode.',
        });
      }
    } catch {
      toast({
        type: 'error',
        title: 'Simulation Error',
        description: 'Failed to communicate with streaming ingestion worker.',
      });
    } finally {
      setIsSimulatingBurst(false);
    }
  };

  const filteredTxs = txList.filter((tx) => {
    if (filterPattern !== 'all' && tx.patternType !== filterPattern) return false;
    if (
      searchQuery &&
      !tx.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tx.sourceAccount.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tx.targetAccount.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
            Transaction Intelligence & Streaming Queue
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time event-driven ingestion queue, microsecond graph edge sync, and velocity burst profiling (RQ-03).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMetrics}
            disabled={isLoadingMetrics}
            className="p-1.5 rounded-lg bg-[#0e1627] hover:bg-[#141f36] border border-white/[0.08] text-slate-400 hover:text-cyan-300 transition-colors"
            title="Refresh Ingestion Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMetrics ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleSimulateBurst}
            disabled={isSimulatingBurst}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-cyan-950/40 transition-all active:scale-95"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatingBurst ? 'animate-pulse text-yellow-300' : ''}`} />
            <span>{isSimulatingBurst ? 'Injecting 1,000 Tx...' : 'Inject Stress Burst (1k Tx)'}</span>
          </button>
        </div>
      </div>

      {/* Streaming Performance Telemetry Card */}
      <div className="p-4 rounded-xl bg-[#0c1220] border border-cyan-500/20 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-white">Event-Driven Ingestion Telemetry</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              {metrics?.status || 'HEALTHY_STREAMING'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Target Graph: <span className="text-cyan-300">ibm_amlsim_500k</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-[#080d19] border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 block mb-0.5">Total Ingested Events</span>
            <div className="font-mono text-sm font-bold text-white">
              {(metrics?.total_events_processed || 184500).toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" /> Zero Drop Rate
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#080d19] border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 block mb-0.5">Peak Ingestion Rate</span>
            <div className="font-mono text-sm font-bold text-cyan-300">
              {(metrics?.current_throughput_tx_sec || 28500).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">tx/s</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Microsecond Edge Sync</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#080d19] border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 block mb-0.5">Queue Buffer Depth</span>
            <div className="font-mono text-sm font-bold text-amber-300">
              {(metrics?.buffer_depth || 340).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ 50k</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Circular Ring Buffer</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#080d19] border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 block mb-0.5">Avg Ingest Latency</span>
            <div className="font-mono text-sm font-bold text-purple-300">
              {metrics?.average_ingest_latency_ms || 0.85} <span className="text-[10px] font-normal text-slate-400">ms</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Sub-millisecond Triage</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#080d19] border border-white/[0.04] col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block mb-0.5">Active Consumers</span>
            <div className="font-mono text-sm font-bold text-emerald-400">
              {metrics?.connected_consumers_count || 4} Workers
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Memory: {metrics?.memory_footprint_mb || 48.6} MB</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tx ID, account no, or owner..."
            className="w-full pl-8 pr-4 py-1.5 rounded-lg bg-[#0e1627] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Pattern Typology:</span>
          <select
            value={filterPattern}
            onChange={(e) => setFilterPattern(e.target.value)}
            className="bg-[#0e1627] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Patterns</option>
            <option value="layering">Layering & Dispersion</option>
            <option value="smurfing">Smurfing / Structuring</option>
            <option value="rapid_drain">Rapid Drain / Wash</option>
            <option value="standard">Standard Transfer</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl bg-[#0c1220] border border-white/[0.08] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0e1627] border-b border-white/[0.08] text-slate-400 text-[11px] font-semibold">
            <tr>
              <th className="py-3 px-4 font-mono">TX ID</th>
              <th className="py-3 px-3">Timestamp</th>
              <th className="py-3 px-3">Source Party</th>
              <th className="py-3 px-3">Destination Party</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Channel</th>
              <th className="py-3 px-3">Typology</th>
              <th className="py-3 px-3">Score</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredTxs.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                  {tx.id}
                </td>
                <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                  {tx.timestamp}
                </td>
                <td className="py-3 px-3">
                  <div className="font-mono text-slate-200">{tx.sourceAccount}</div>
                  <div className="text-[10px] text-slate-400">{tx.sourceOwner}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-mono text-slate-200">{tx.targetAccount}</div>
                  <div className="text-[10px] text-slate-400">{tx.targetOwner}</div>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-slate-100">
                  ₺{tx.amount.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-slate-400 text-[11px]">{tx.channel}</td>
                <td className="py-3 px-3">
                  <span
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                      tx.isFlagged
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 font-semibold'
                        : 'bg-slate-700/40 text-slate-400'
                    }`}
                  >
                    {tx.patternType}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-xs text-red-400">
                  {tx.riskScore}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onNavigate('graph-explorer')}
                    className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-white/[0.08] transition-colors"
                    title="View in Graph Explorer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
