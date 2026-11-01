import React from 'react';
import {
  FolderSearch,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { commandCenterMetrics, casesList } from '../../data/mockData';
import { RiskDistributionDonut } from '../../components/charts/RiskDistributionDonut';
import { AlertTrendChart } from '../../components/charts/AlertTrendChart';
import { AgentHealthGauge } from '../../components/charts/AgentHealthGauge';
import { Case, NavigationModule } from '../../types';

interface CommandCenterProps {
  onNavigate: (module: NavigationModule) => void;
  onOpenCase: (caseId: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigate, onOpenCase }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time fraud intelligence, investigations and system health.
          </p>
        </div>
      </div>

      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Investigations */}
        <div
          onClick={() => onNavigate('investigation')}
          className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] hover:border-blue-500/40 cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Active Investigations</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <FolderSearch className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {commandCenterMetrics.activeInvestigations.value}
            </span>
            <span className="flex items-center text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              {commandCenterMetrics.activeInvestigations.change}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">12 currently assigned to AI Agents</p>
        </div>

        {/* High-Priority Alerts */}
        <div
          onClick={() => onNavigate('alerts')}
          className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] hover:border-red-500/40 cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">High-Priority Alerts</span>
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {commandCenterMetrics.highPriorityAlerts.value}
            </span>
            <span className="flex items-center text-xs font-mono font-semibold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-0.5" />+
              {commandCenterMetrics.highPriorityAlerts.change}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires immediate analyst triage</p>
        </div>

        {/* Flagged Transactions */}
        <div
          onClick={() => onNavigate('transactions')}
          className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] hover:border-amber-500/40 cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Flagged Transactions</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {commandCenterMetrics.flaggedTransactions.value}
            </span>
            <span className="flex items-center text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              {commandCenterMetrics.flaggedTransactions.change}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 180 simulated stream windows</p>
        </div>

        {/* Estimated Risk Exposure */}
        <div
          onClick={() => onNavigate('risk-analytics')}
          className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] hover:border-red-500/40 cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Estimated Risk Exposure</span>
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {commandCenterMetrics.estimatedRiskExposure.value}
            </span>
            <span className="flex items-center text-xs font-mono font-semibold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-0.5" />+
              {commandCenterMetrics.estimatedRiskExposure.change}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Active fund preservation scope</p>
        </div>
      </div>

      {/* Row 2: Charts (Risk Distribution & Alert Trend) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Card */}
        <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Risk Distribution</h3>
              <p className="text-xs text-slate-400">Segmented transaction volume classification</p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded">
              184.2K Evaluated
            </span>
          </div>
          <div className="py-2">
            <RiskDistributionDonut />
          </div>
        </div>

        {/* Alert Trend Card */}
        <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Alert Trend</h3>
              <p className="text-xs text-slate-400">Time-series alert volume by severity</p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
              March 2025
            </span>
          </div>
          <AlertTrendChart />
        </div>
      </div>

      {/* Row 3: Agent Health & Recent Investigations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Execution Health Card */}
        <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Agent Execution Health
              </h3>
              <p className="text-xs text-slate-400">Fleet telemetry across 36 specialist roles</p>
            </div>
            <button
              onClick={() => onNavigate('agents')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
            >
              View Fleet →
            </button>
          </div>
          <div className="py-1">
            <AgentHealthGauge />
          </div>
        </div>

        {/* Recent Investigations Table */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Recent Investigations
              </h3>
              <p className="text-xs text-slate-400">Active cases under multi-agent review</p>
            </div>
            <button
              onClick={() => onNavigate('investigation')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>All Cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 text-[11px] font-medium">
                  <th className="pb-2.5 pl-1 font-mono">Case ID</th>
                  <th className="pb-2.5">Title</th>
                  <th className="pb-2.5">Risk</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 pr-1 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {casesList.slice(0, 3).map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onOpenCase(item.id)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 pl-1 font-mono font-semibold text-cyan-300 group-hover:text-cyan-200">
                      {item.id}
                    </td>
                    <td className="py-3 font-medium text-slate-200">{item.title}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          item.riskLevel === 'high'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.riskLevel === 'high' ? 'High' : 'Medium'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          item.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {item.status === 'in_progress' ? 'In Progress' : 'Review'}
                      </span>
                    </td>
                    <td className="py-3 pr-1 text-right text-slate-400 font-mono text-[11px]">
                      {item.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
