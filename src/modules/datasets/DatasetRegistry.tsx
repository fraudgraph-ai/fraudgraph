import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Shield,
  Layers,
  ExternalLink,
  Download,
} from 'lucide-react';
import { datasetsList } from '../../data/mockData';
import { NavigationModule } from '../../types';

interface DatasetRegistryProps {
  onNavigate: (module: NavigationModule) => void;
}

export const DatasetRegistry: React.FC<DatasetRegistryProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Dataset Registry & Data Contracts
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Canonical event store manifests, synthetic vs real benchmarks, schema versions and quality gates.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg">
          <span>All 3 Data Contracts Validated · UTC Normalized</span>
        </div>
      </div>

      {/* Dataset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {datasetsList.map((ds) => (
          <div
            key={ds.id}
            className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">{ds.id}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    ds.isSynthetic
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {ds.isSynthetic ? 'Synthetic AML' : 'Real Blockchain'}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-1.5">{ds.name}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{ds.source}</p>
            </div>

            <div className="space-y-2 text-xs py-2 border-y border-white/[0.06]">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Events</span>
                <span className="font-mono font-bold text-slate-200">{ds.totalRecords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Entities / Accounts</span>
                <span className="font-mono text-slate-200">{ds.accountCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Coverage</span>
                <span className="text-slate-300">{ds.timeRange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Storage Size</span>
                <span className="font-mono text-slate-300">{ds.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quality Score</span>
                <span className="font-mono font-bold text-emerald-400">{ds.qualityScore}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500 font-mono">License: {ds.license}</span>
              <span className="text-[10px] text-cyan-400 font-medium">Schema {ds.version} ✓</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mandatory Data Quality Rules Notice */}
      <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-3">
        <h3 className="text-sm font-semibold text-white">Data Quality & Leakage Prevention Rules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-[#080d19] border border-white/[0.04]">
            <span className="font-semibold text-cyan-300 block mb-1">Temporal Event Split</span>
            <p className="text-slate-400 text-[11px]">
              Strict cutoff at event_time. Late-arriving events are isolated via ingested_at to eliminate future information leakage into historical graph states.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#080d19] border border-white/[0.04]">
            <span className="font-semibold text-cyan-300 block mb-1">Entity Resolution Checks</span>
            <p className="text-slate-400 text-[11px]">
              Orphan accounts with no valid KYC identity are routed to explicit synthetic isolation buckets, preventing fabricated benchmark inflation.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#080d19] border border-white/[0.04]">
            <span className="font-semibold text-cyan-300 block mb-1">Deterministic Manifests</span>
            <p className="text-slate-400 text-[11px]">
              Every training and test batch is signed with SHA-256 manifests, guaranteeing 100% experiment reproducibility across evaluation runs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
