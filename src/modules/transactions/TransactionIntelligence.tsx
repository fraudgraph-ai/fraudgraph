import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Filter,
  Search,
  ExternalLink,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
} from 'lucide-react';
import { recentTransactionsList } from '../../data/mockData';
import { NavigationModule } from '../../types';

interface TransactionIntelligenceProps {
  onNavigate: (module: NavigationModule) => void;
  onOpenCase: (caseId: string) => void;
}

export const TransactionIntelligence: React.FC<TransactionIntelligenceProps> = ({
  onNavigate,
  onOpenCase,
}) => {
  const [filterPattern, setFilterPattern] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTxs = recentTransactionsList.filter((tx) => {
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
            Transaction Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Streaming transaction audit, velocity profiling and cross-border fund flows.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg">
          <span>Event Store: 184,200 Ingested (UTC Normalized)</span>
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
            className="w-full pl-8 pr-4 py-1.5 rounded-lg bg-[#0e1627] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-400 focus:outline-none"
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
              <th className="py-3 px-3">Timestamp (UTC)</th>
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
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
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
