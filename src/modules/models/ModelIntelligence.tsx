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
  Zap,
  CheckCircle2,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { modelBenchmarks } from '../../data/mockData';
import { NavigationModule } from '../../types';
import { useToast } from '../../components/ui/Toast';

interface ModelIntelligenceProps {
  onNavigate: (module: NavigationModule) => void;
}

export const ModelIntelligence: React.FC<ModelIntelligenceProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'specs' | 'leaderboard'>('specs');
  const [selectedModel, setSelectedModel] = useState(modelBenchmarks[4]); // Ensemble Fusion
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const leaderboardData = [
    {
      id: 'MOD-RULES',
      name: 'Static Rule Heuristics',
      family: 'Rule Engine',
      amlsim: 0.542,
      elliptic: 0.489,
      transxion: 0.412,
      driftDrop: '-24.0%',
      brier: 0.185,
      recall100: '38.0%',
      latency: '12ms',
      status: 'baseline',
    },
    {
      id: 'MOD-TAB-XGB',
      name: 'Tabular XGBoost Baseline',
      family: 'Gradient Boosting',
      amlsim: 0.728,
      elliptic: 0.694,
      transxion: 0.598,
      driftDrop: '-17.8%',
      brier: 0.089,
      recall100: '61.0%',
      latency: '45ms',
      status: 'baseline',
    },
    {
      id: 'MOD-GRAPH-LGBM',
      name: 'IBM Graph Feature Preprocessor + LightGBM',
      family: 'Hybrid Structural',
      amlsim: 0.842,
      elliptic: 0.815,
      transxion: 0.748,
      driftDrop: '-11.1%',
      brier: 0.058,
      recall100: '79.5%',
      latency: '95ms',
      status: 'challenger',
    },
    {
      id: 'MOD-GATV2',
      name: 'GATv2 Inductive Graph Neural Network',
      family: 'Deep Graph Attention',
      amlsim: 0.876,
      elliptic: 0.852,
      transxion: 0.781,
      driftDrop: '-10.8%',
      brier: 0.051,
      recall100: '83.0%',
      latency: '280ms',
      status: 'challenger',
    },
    {
      id: 'MOD-FUSION-AGENTS',
      name: 'FraudGraph AI Full Multi-Agent Fusion',
      family: 'Hybrid GNN + 36-Agent Critic',
      amlsim: 0.912,
      elliptic: 0.887,
      transxion: 0.845,
      driftDrop: '-7.3%',
      brier: 0.042,
      recall100: '88.5%',
      latency: '1,420ms',
      status: 'champion',
    },
  ];

  const handleRunBenchmarks = () => {
    setIsBenchmarking(true);
    toast({
      type: 'info',
      title: 'Benchmark Suite Triggered',
      description: 'Evaluating 5 model architectures across IBM AMLSim, Elliptic++, and TransXion datasets (RQ-07)...',
    });

    setTimeout(() => {
      setIsBenchmarking(false);
      setActiveView('leaderboard');
      toast({
        type: 'success',
        title: 'Empirical Benchmark Run Complete',
        description: 'FraudGraph AI confirmed +25.3% PR-AUC lift over tabular baseline and lowest cross-domain drop (7.3%).',
      });
    }, 1400);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Model Intelligence & Benchmarks
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Model registry, cross-dataset empirical benchmarks (RQ-07), and drift monitoring.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunBenchmarks}
            disabled={isBenchmarking}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 fill-white ${isBenchmarking ? 'animate-bounce' : ''}`} />
            <span>{isBenchmarking ? 'Evaluating Benchmarks...' : 'Run Benchmark Suite (RQ-07)'}</span>
          </button>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg">
            Active Registry: 5 Versioned Checkpoints
          </span>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-white/[0.08] gap-6 text-xs">
        <button
          onClick={() => setActiveView('specs')}
          className={`pb-2.5 font-medium border-b-2 transition-all ${
            activeView === 'specs'
              ? 'border-cyan-400 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Model Cards & Architecture Specs
        </button>
        <button
          onClick={() => setActiveView('leaderboard')}
          className={`pb-2.5 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
            activeView === 'leaderboard'
              ? 'border-cyan-400 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Cross-Dataset Empirical Leaderboard (RQ-07)</span>
        </button>
      </div>

      {/* TAB 1: EMPIRICAL LEADERBOARD (RQ-07) */}
      {activeView === 'leaderboard' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-300">Empirical Generalization Finding (RQ-07):</span>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                When transferring from synthetic simulator (IBM AMLSim) to real multi-bank drift (TransXion),
                conventional XGBoost experiences an <b>17.8% PR-AUC drop</b>. FraudGraph AI's hybrid multi-agent fusion
                reduces domain generalization drop to just <b>7.3%</b> through adversary critic verification and graph topological priors.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#0c1220] border border-white/[0.08] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e1627] border-b border-white/[0.08] text-slate-400 text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-3">Architecture</th>
                  <th className="py-3 px-3">Paradigm</th>
                  <th className="py-3 px-3 text-right">AMLSim PR-AUC</th>
                  <th className="py-3 px-3 text-right">Elliptic++ BTC</th>
                  <th className="py-3 px-3 text-right">TransXion AML</th>
                  <th className="py-3 px-3 text-center">Domain Drop (RQ-07)</th>
                  <th className="py-3 px-3 text-right">Brier Score</th>
                  <th className="py-3 px-3 text-right">Recall@100</th>
                  <th className="py-3 px-3 text-right">Latency</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {leaderboardData.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      row.status === 'champion'
                        ? 'bg-blue-950/30 hover:bg-blue-900/40 font-medium'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {row.status === 'champion' && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                        <span>{row.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{row.id}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                      {row.family}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                      {row.amlsim}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {row.elliptic}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {row.transxion}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        row.status === 'champion'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-950/40 text-red-400'
                      }`}>
                        {row.driftDrop}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-cyan-300 font-bold">
                      {row.brier}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {row.recall100}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {row.latency}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        row.status === 'champion'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : row.status === 'challenger'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-white/[0.04] text-slate-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MODEL SPECS & CARDS */}
      {activeView === 'specs' && (
        <>
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
        </>
      )}
    </div>
  );
};
