import React, { useState } from 'react';
import {
  BrainCircuit,
  Database,
  Layers,
  Sparkles,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { modelBenchmarks } from '../../data/mockData';
import { NavigationModule } from '../../types';

interface ModelIntelligenceProps {
  onNavigate: (module: NavigationModule) => void;
}

export const ModelIntelligence: React.FC<ModelIntelligenceProps> = ({ onNavigate }) => {
  const [selectedModel, setSelectedModel] = useState(modelBenchmarks[4]); // Ensemble Fusion

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Model Intelligence & Model Cards
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Model registry, feature governance, artifact reproducibility, and drift monitoring.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg">
            Active Registry: 5 Versioned Checkpoints
          </span>
        </div>
      </div>

      {/* Model Cards Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {modelBenchmarks.map((mod) => {
          const isSelected = selectedModel.id === mod.id;
          return (
            <div
              key={mod.id}
              onClick={() => setSelectedModel(mod)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-950/40 border-cyan-400 shadow-lg'
                  : 'bg-[#0c1220] border-white/[0.06] hover:border-white/20'
              }`}
            >
              <span className="font-mono text-[10px] text-cyan-400 font-bold block">{mod.id}</span>
              <h4 className="text-xs font-semibold text-slate-200 mt-1 truncate">{mod.name}</h4>
              <div className="flex items-center justify-between text-[11px] mt-2">
                <span className="text-slate-400 font-mono">PR-AUC {mod.prAuc}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                    mod.status === 'production'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/[0.06] text-slate-400'
                  }`}
                >
                  {mod.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Model Card Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Model Architecture Specs & Parameters (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold">MODEL SPECIFICATION</span>
              <h2 className="text-base font-bold text-white mt-0.5">{selectedModel.name}</h2>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
              Version {selectedModel.version}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#080d19] border border-white/[0.04]">
              <span className="text-slate-500 text-[10px] block">Primary Dataset Split</span>
              <span className="text-slate-200 font-medium mt-0.5 block">{selectedModel.dataset}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#080d19] border border-white/[0.04]">
              <span className="text-slate-500 text-[10px] block">Feature Dimension</span>
              <span className="font-mono text-cyan-300 font-bold mt-0.5 block">{selectedModel.featureCount} Features</span>
            </div>
            <div className="p-3 rounded-xl bg-[#080d19] border border-white/[0.04]">
              <span className="text-slate-500 text-[10px] block">Last Trained Checkpoint</span>
              <span className="font-mono text-slate-300 mt-0.5 block">{selectedModel.lastTrained}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#080d19] border border-white/[0.04]">
              <span className="text-slate-500 text-[10px] block">Artifact SHA-256</span>
              <span className="font-mono text-slate-400 text-[10px] truncate block">sha256:8f192b0c48201...</span>
            </div>
          </div>

          {/* Top SHAP Feature Importances */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2">
              Top SHAP Feature Importance Drivers
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { feature: 'subgraph_out_degree_velocity', importance: 0.38 },
                { feature: 'layering_decay_ratio_3hop', importance: 0.27 },
                { feature: 'temporal_burst_concentration', importance: 0.19 },
                { feature: 'shared_hardware_fingerprint_flag', importance: 0.16 },
              ].map((feat) => (
                <div key={feat.feature} className="p-2.5 rounded-lg bg-[#0e1627] border border-white/[0.04]">
                  <div className="flex justify-between text-slate-300 font-mono text-[11px] mb-1">
                    <span>{feat.feature}</span>
                    <span className="text-cyan-400 font-bold">{feat.importance}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${feat.importance * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Drift & Calibration Guard (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-semibold text-white">Continuous Drift Health</h3>
          <p className="text-xs text-slate-400">
            Automated Population Stability Index (PSI) and Kolmogorov-Smirnov statistical tests.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#080d19] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">PSI Drift Indicator</span>
                <span className="font-mono font-bold text-emerald-400 text-sm mt-0.5 block">0.038 (Stable)</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                Threshold: &lt; 0.10
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#080d19] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Kolmogorov-Smirnov p-value</span>
                <span className="font-mono font-bold text-slate-200 text-sm mt-0.5 block">0.84 (No Drift)</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded font-mono">
                Alpha: 0.05
              </span>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-slate-300 text-xs space-y-1">
              <span className="font-semibold text-cyan-300 block">Epistemic Uncertainty Gate</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                When uncertainty variance exceeds 0.15 on unobserved transaction networks, C20 Uncertainty Analyst automatically issues an abstain verdict and routes to human analyst.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
