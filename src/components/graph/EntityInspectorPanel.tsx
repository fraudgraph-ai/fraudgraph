import React, { useState } from 'react';
import {
  Building2,
  User,
  CreditCard,
  Smartphone,
  Globe,
  Briefcase,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  ExternalLink,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { GraphNodeData } from '../../types';

interface EntityInspectorPanelProps {
  selectedNode: GraphNodeData | null;
  onOpenCase?: (caseId: string) => void;
  onViewEvidence?: (evidenceId: string) => void;
}

export const EntityInspectorPanel: React.FC<EntityInspectorPanelProps> = ({
  selectedNode,
  onOpenCase,
  onViewEvidence,
}) => {
  const [activeTab, setActiveTab] = useState<'entity' | 'relationships' | 'risk' | 'evidence'>('entity');

  if (!selectedNode) {
    return (
      <div className="w-80 bg-[#0d1322] border-l border-white/[0.08] flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <Building2 className="w-10 h-10 mb-2 opacity-30 text-slate-400" />
        <p className="text-xs font-medium text-slate-400">Select an entity in the graph</p>
        <p className="text-[11px] text-slate-600 mt-1">
          Click any node to inspect risk signals, connected accounts, and verified evidence.
        </p>
      </div>
    );
  }

  const { properties, riskScore, riskLevel } = selectedNode;

  return (
    <div className="w-80 md:w-88 bg-[#0a0f1b] border-l border-white/[0.08] flex flex-col h-full overflow-hidden select-none z-10 shrink-0">
      {/* Inspector Tabs */}
      <div className="flex border-b border-white/[0.08] bg-[#0c1222] px-2 pt-2">
        {(['entity', 'relationships', 'risk', 'evidence'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-medium capitalize transition-all border-b-2 ${
              activeTab === tab
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'entity' && (
          <>
            {/* Header Identity Card */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0f172a] border border-white/[0.08]">
              <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs font-bold text-slate-100 truncate">
                    {selectedNode.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono ${
                      riskLevel === 'high'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {riskLevel} Risk
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {properties.entityType || 'Financial Entity'}
                </p>
              </div>
            </div>

            {/* Risk Score Progress Bar Meter */}
            <div className="p-3 rounded-xl bg-[#0e1627] border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Risk Score</span>
                <span className="font-mono font-bold text-red-400 text-sm">{riskScore}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full shadow-glow-red"
                  style={{ width: `${Math.min(riskScore * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.00 Low</span>
                <span>0.50 Threshold</span>
                <span>1.00 Critical</span>
              </div>
            </div>

            {/* Entity Details Table */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 mb-2">Entity Details</h4>
              <div className="rounded-xl bg-[#0e1627] border border-white/[0.06] divide-y divide-white/[0.04] text-xs">
                {properties.accountNo && (
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-400">Account No.</span>
                    <span className="font-mono font-medium text-slate-200">
                      {properties.accountNo}
                    </span>
                  </div>
                )}
                {properties.owner && (
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-400">Owner</span>
                    <span className="font-medium text-slate-200">{properties.owner}</span>
                  </div>
                )}
                <div className="flex justify-between p-2.5">
                  <span className="text-slate-400">Entity Type</span>
                  <span className="text-slate-200">{properties.entityType || 'Bank Account'}</span>
                </div>
                {properties.created && (
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-400">Created</span>
                    <span className="font-mono text-slate-300">{properties.created}</span>
                  </div>
                )}
                {properties.lastActivity && (
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-400">Last Activity</span>
                    <span className="font-mono text-slate-300">{properties.lastActivity}</span>
                  </div>
                )}
                {properties.balance && (
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-400">Current Balance</span>
                    <span className="font-mono text-cyan-300 font-semibold">
                      {properties.balance}
                    </span>
                  </div>
                )}
                {properties.region && (
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-400">Jurisdiction</span>
                    <span className="text-slate-300">{properties.region}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Signals (4) */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Risk Signals ({properties.riskSignals?.length || 4})</span>
                <span className="text-[10px] text-red-400">Active Alert</span>
              </h4>
              <div className="space-y-1.5">
                {(
                  properties.riskSignals || [
                    { title: 'Unusual transfer pattern', score: 0.91, severity: 'high' },
                    { title: 'Linked to flagged accounts', score: 0.87, severity: 'high' },
                    { title: 'High velocity transactions', score: 0.81, severity: 'high' },
                    { title: 'Structuring / layering typology', score: 0.76, severity: 'medium' },
                  ]
                ).map((signal, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#0e1627] border border-white/[0.05] text-xs hover:border-red-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-glow-red" />
                      <span className="text-slate-200 text-[11px] font-medium">{signal.title}</span>
                    </div>
                    <span className="font-mono font-bold text-red-400 text-[11px] bg-red-500/10 px-1.5 py-0.5 rounded">
                      {signal.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2">
              <button
                onClick={() => onOpenCase && onOpenCase('FG-8421')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md transition-all active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Case FG-8421</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'relationships' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#0e1627] border border-white/[0.06] space-y-2">
              <span className="text-xs font-semibold text-slate-300">Degree & Centrality</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-white/[0.02]">
                  <span className="text-slate-400 text-[10px]">In-Degree (Transfers In)</span>
                  <p className="font-mono font-bold text-slate-200 text-sm mt-0.5">2</p>
                </div>
                <div className="p-2 rounded bg-white/[0.02]">
                  <span className="text-slate-400 text-[10px]">Out-Degree (Transfers Out)</span>
                  <p className="font-mono font-bold text-slate-200 text-sm mt-0.5">3</p>
                </div>
                <div className="p-2 rounded bg-white/[0.02]">
                  <span className="text-slate-400 text-[10px]">PageRank</span>
                  <p className="font-mono font-bold text-cyan-300 text-sm mt-0.5">0.0842</p>
                </div>
                <div className="p-2 rounded bg-white/[0.02]">
                  <span className="text-slate-400 text-[10px]">Betweenness</span>
                  <p className="font-mono font-bold text-red-400 text-sm mt-0.5">0.719</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300">Connected Counterparties</span>
              <div className="p-2.5 rounded-lg bg-[#0e1627] border border-white/[0.05] text-xs flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-mono text-slate-300">TR-38192044 (M. Demir)</span>
                </div>
                <span className="font-mono text-red-400">₺3.85M</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0e1627] border border-white/[0.05] text-xs flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-mono text-slate-300">TR-49210082 (S. Çelik)</span>
                </div>
                <span className="font-mono text-red-400">₺2.45M</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0e1627] border border-white/[0.05] text-xs flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-slate-300">TR-77291048 (E. Şahin)</span>
                </div>
                <span className="font-mono text-emerald-400">₺5.20M</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#0e1627] border border-white/[0.06] space-y-2.5">
              <span className="text-xs font-semibold text-slate-300">Model Fusion Weights</span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>GraphSAGE GNN (Relational)</span>
                    <span className="font-mono text-red-400 font-bold">0.94</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>LightGBM Tabular (Behavior)</span>
                    <span className="font-mono text-red-400 font-bold">0.88</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>Rule Evaluation R-04</span>
                    <span className="font-mono text-red-400 font-bold">1.00</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Isotonic Calibration Confirmed (Brier score 0.042)</span>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">Linked Verified Proofs</span>
            {['EV-100', 'EV-101', 'EV-104', 'EV-108'].map((evId) => (
              <div
                key={evId}
                onClick={() => onViewEvidence && onViewEvidence(evId)}
                className="p-2.5 rounded-lg bg-[#0e1627] hover:bg-[#121c32] border border-white/[0.06] hover:border-cyan-500/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-cyan-300">{evId}</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Verified SHA-256</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  Snapshot artifact supporting multi-hop flow dispersion.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
