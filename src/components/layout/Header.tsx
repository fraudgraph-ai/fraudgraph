import React from 'react';
import {
  Search,
  Bell,
  Calendar,
  Database,
  Play,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { NavigationModule } from '../../types';

interface HeaderProps {
  currentModule: NavigationModule;
  onOpenCommandPalette: () => void;
  selectedDataset: string;
  onSelectDataset: (dataset: string) => void;
  selectedTimeRange: string;
  onSelectTimeRange: (range: string) => void;
  onTriggerAnalysis?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onOpenCommandPalette,
  selectedDataset,
  onSelectDataset,
  selectedTimeRange,
  onSelectTimeRange,
  onTriggerAnalysis,
}) => {
  return (
    <header className="h-16 border-b border-white/[0.07] bg-[#0a0f1b]/95 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0">
      {/* Search Bar & Global Command Palette Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-[#0e1627] hover:bg-[#121c32] border border-white/[0.09] hover:border-blue-500/40 text-slate-400 text-xs transition-all shadow-sm group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="flex-1 text-left text-slate-400 group-hover:text-slate-300">
            Search entities, accounts, transactions...
          </span>
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400 bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.05]">
            <span>⌘</span>
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Controls: Engine Health, Dataset, Time, Notifications, Action */}
      <div className="flex items-center gap-3">
        {/* Real-time Environment Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Graph Engine Online · 28 Agents Active</span>
        </div>

        {/* Dataset Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e1627] border border-white/[0.08] text-xs text-slate-300">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={selectedDataset}
            onChange={(e) => onSelectDataset(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            <option value="IBM AMLSim 500K" className="bg-[#0e1627] text-slate-200">
              IBM AMLSim 500K
            </option>
            <option value="Elliptic++ Bitcoin" className="bg-[#0e1627] text-slate-200">
              Elliptic++ Bitcoin
            </option>
            <option value="TransXion Ecosystem" className="bg-[#0e1627] text-slate-200">
              TransXion Ecosystem
            </option>
          </select>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e1627] border border-white/[0.08] text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedTimeRange}
            onChange={(e) => onSelectTimeRange(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            <option value="Last 24 Hours" className="bg-[#0e1627] text-slate-200">
              Last 24 Hours
            </option>
            <option value="Last 7 Days" className="bg-[#0e1627] text-slate-200">
              Last 7 Days
            </option>
            <option value="Last 30 Days" className="bg-[#0e1627] text-slate-200">
              Last 30 Days
            </option>
            <option value="All Time" className="bg-[#0e1627] text-slate-200">
              All Time
            </option>
          </select>
        </div>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative p-2 rounded-lg bg-[#0e1627] border border-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan" />
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onTriggerAnalysis}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/30 transition-all hover:shadow-blue-500/40 active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Run Analysis</span>
        </button>
      </div>
    </header>
  );
};
