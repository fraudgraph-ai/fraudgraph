import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Filter,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { alertsList } from '../../data/mockData';
import { useToast } from '../../components/ui/Toast';
import { AlertItem, NavigationModule } from '../../types';

interface AlertIntelligenceProps {
  onNavigate: (module: NavigationModule) => void;
  onOpenCase: (caseId: string) => void;
}

export const AlertIntelligence: React.FC<AlertIntelligenceProps> = ({ onNavigate, onOpenCase }) => {
  const { toast } = useToast();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alertsList.filter((alt) => {
    if (filterSeverity !== 'all' && alt.riskLevel !== filterSeverity) return false;
    if (filterStatus !== 'all' && alt.status !== filterStatus) return false;
    if (
      searchQuery &&
      !alt.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !alt.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !alt.targetAccount.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleInvestigateAlert = (alert: AlertItem) => {
    toast({
      type: 'info',
      title: `Escalating ${alert.id} to Investigation`,
      description: `Target ${alert.targetAccount} (${alert.amount}) routed to Multi-Agent Supervisor.`,
    });
    // Open case
    onOpenCase('FG-8421');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Alert Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated anomaly detection queue, prioritization and triage pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-red-400 bg-red-950/40 border border-red-500/30 px-2.5 py-1 rounded-lg">
            27 High-Priority Pending
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alert ID, target account, or pattern..."
            className="w-full pl-8 pr-4 py-1.5 rounded-lg bg-[#0e1627] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-[#0e1627] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <span className="text-slate-500">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0e1627]">All Severities</option>
              <option value="high" className="bg-[#0e1627]">High Risk (&gt;0.80)</option>
              <option value="medium" className="bg-[#0e1627]">Medium Risk</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#0e1627] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <span className="text-slate-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0e1627]">All Statuses</option>
              <option value="investigating" className="bg-[#0e1627]">Under Investigation</option>
              <option value="new" className="bg-[#0e1627]">New / Untriaged</option>
              <option value="escalated" className="bg-[#0e1627]">Escalated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="rounded-xl bg-[#0c1220] border border-white/[0.08] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0e1627] border-b border-white/[0.08] text-slate-400 text-[11px] font-semibold">
            <tr>
              <th className="py-3 px-4 font-mono">Alert ID</th>
              <th className="py-3 px-3">Typology / Anomaly</th>
              <th className="py-3 px-3">Target Account</th>
              <th className="py-3 px-3">Exposure Amount</th>
              <th className="py-3 px-3">Detection Model</th>
              <th className="py-3 px-3">Score</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredAlerts.map((alt) => (
              <tr key={alt.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                  {alt.id}
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-100">{alt.title}</div>
                  <div className="flex gap-1 mt-0.5">
                    {alt.tags.map((t) => (
                      <span key={t} className="text-[9px] px-1 py-0.2 rounded bg-white/[0.04] text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-mono text-slate-200">{alt.targetAccount}</div>
                  <div className="text-[10px] text-slate-400">{alt.sourceEntity}</div>
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-slate-200">
                  {alt.amount}
                </td>
                <td className="py-3 px-3 text-slate-400 text-[11px]">
                  {alt.detectionModel}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                      alt.riskLevel === 'high'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {alt.riskScore}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`text-[10px] capitalize px-2 py-0.5 rounded font-medium ${
                      alt.status === 'investigating'
                        ? 'bg-blue-500/20 text-blue-300'
                        : alt.status === 'escalated'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-slate-700/40 text-slate-300'
                    }`}
                  >
                    {alt.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleInvestigateAlert(alt)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-cyan-300 border border-blue-500/30 text-xs font-medium transition-colors"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="w-3 h-3" />
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
