import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowUpRight,
  Sliders,
} from 'lucide-react';
import { modelBenchmarks } from '../../data/mockData';
import { calculateConfusionMatrixAtThreshold } from '../../utils/riskMath';
import { NavigationModule } from '../../types';

interface RiskAnalyticsProps {
  onNavigate: (module: NavigationModule) => void;
}

export const RiskAnalytics: React.FC<RiskAnalyticsProps> = ({ onNavigate }) => {
  const [decisionThreshold, setDecisionThreshold] = useState<number>(0.50);

  // Dynamic confusion matrix metrics calculated on the fly
  const metrics = calculateConfusionMatrixAtThreshold(decisionThreshold, 50000, 2056);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Risk Analytics & Detection Benchmark
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Model validation metrics, PR-AUC evaluation, and dynamic threshold calibration curves.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
          <span>Ensemble Fusion: PR-AUC 0.91 (+0.43 vs Rules)</span>
        </div>
      </div>

      {/* Top 4 Evaluation Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08]">
          <span className="text-xs font-medium text-slate-400">PR-AUC (Production Fusion)</span>
          <p className="text-2xl font-bold font-mono text-cyan-300 mt-2">0.912</p>
          <span className="text-[10px] text-emerald-400 mt-1 block">Baseline Rules: 0.480</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08]">
          <span className="text-xs font-medium text-slate-400">Recall @ Current Threshold</span>
          <p className="text-2xl font-bold font-mono text-white mt-2">{metrics.recall}%</p>
          <span className="text-[10px] text-emerald-400 mt-1 block">
            {metrics.truePositives} of 2,056 Frauds Captured
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08]">
          <span className="text-xs font-medium text-slate-400">Precision @ Current Threshold</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-2">{metrics.precision}%</p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            F1-Score: {metrics.f1Score} (MCC: {metrics.mcc})
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08]">
          <span className="text-xs font-medium text-slate-400">Brier Calibration Score</span>
          <p className="text-2xl font-bold font-mono text-white mt-2">0.042</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Isotonic Platt Scaled</span>
        </div>
      </div>

      {/* Model Benchmark Comparative Table */}
      <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Model Family Benchmark Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated on identical time splits across synthetic AMLSim & TransXion sets
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1627] border-b border-white/[0.08] text-slate-400 text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-3 font-mono">Model ID</th>
                <th className="py-3 px-3">Architecture Name</th>
                <th className="py-3 px-3">Family Type</th>
                <th className="py-3 px-3 text-center">PR-AUC</th>
                <th className="py-3 px-3 text-center">Precision@100</th>
                <th className="py-3 px-3 text-center">Recall@100</th>
                <th className="py-3 px-3 text-center">Brier Score</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {modelBenchmarks.map((mod) => (
                <tr key={mod.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-300">{mod.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-100">{mod.name}</td>
                  <td className="py-3 px-3 text-slate-400">{mod.type}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-cyan-400">
                    {mod.prAuc.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-200">
                    {Math.round(mod.precisionAt100 * 100)}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-200">
                    {Math.round(mod.recallAt100 * 100)}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400">
                    {mod.brierScore}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                        mod.status === 'production'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : mod.status === 'candidate'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-700/40 text-slate-400'
                      }`}
                    >
                      {mod.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Threshold Slider & Real-time Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Confusion Matrix */}
        <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Interactive Confusion Matrix</h3>
              <p className="text-xs text-slate-400">Real-time recalculation across 50,000 transactions</p>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
              Threshold: {decisionThreshold.toFixed(2)}
            </span>
          </div>

          {/* Threshold Slider Control */}
          <div className="p-3.5 rounded-xl bg-[#080d19] border border-white/[0.06] space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Decision Threshold Tuning
              </span>
              <span className="font-mono font-bold text-cyan-300">{decisionThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.02"
              value={decisionThreshold}
              onChange={(e) => setDecisionThreshold(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.10 (High Recall / Catch All)</span>
              <span>0.50 (Balanced)</span>
              <span>0.90 (High Precision / Low Alert Volume)</span>
            </div>
          </div>

          {/* 4 Quadrants Matrix */}
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
              <span className="text-[10px] text-emerald-400 font-mono block">TRUE POSITIVES (TP)</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {metrics.truePositives.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Correctly Flagged Laundering</span>
            </div>
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
              <span className="text-[10px] text-red-400 font-mono block">FALSE POSITIVES (FP)</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {metrics.falsePositives.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Legitimate Flagged</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <span className="text-[10px] text-amber-400 font-mono block">FALSE NEGATIVES (FN)</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {metrics.falseNegatives.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Undetected Fraud</span>
            </div>
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
              <span className="text-[10px] text-blue-400 font-mono block">TRUE NEGATIVES (TN)</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {metrics.trueNegatives.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Correctly Cleared Normal</span>
            </div>
          </div>
        </div>

        {/* Calibration Curve */}
        <div className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Reliability Calibration Diagram</h3>
            <p className="text-xs text-slate-400">Predicted Risk Probability vs Empirical Fraud Frequency</p>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-4 border-b border-white/[0.08] relative">
            {/* Guide line */}
            <div className="absolute inset-0 border-t border-dashed border-white/[0.08] transform rotate-[-26deg] origin-bottom-left pointer-events-none" />

            {[
              { bin: '0.1', predicted: 10, empirical: 11 },
              { bin: '0.3', predicted: 30, empirical: 29 },
              { bin: '0.5', predicted: 50, empirical: 52 },
              { bin: '0.7', predicted: 70, empirical: 68 },
              { bin: '0.9', predicted: 90, empirical: 91 },
            ].map((pt, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div
                  className="w-8 rounded-t bg-cyan-500 group-hover:bg-cyan-400 transition-all shadow-glow-cyan"
                  style={{ height: `${pt.empirical}%` }}
                />
                <span className="font-mono text-[10px] text-slate-400 mt-2">{pt.bin}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Predicted Probability Bin</span>
            <span>Empirical Match Rate: 98.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
