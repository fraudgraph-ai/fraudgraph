import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  FolderSearch,
  Network,
  ArrowLeftRight,
  Bot,
  Fingerprint,
  TrendingUp,
  BrainCircuit,
  Database,
  Scale,
  Settings,
  MoreVertical,
  ChevronRight,
} from 'lucide-react';
import { NavigationModule } from '../../types';
import { currentUser } from '../../data/mockData';

interface SidebarProps {
  currentModule: NavigationModule;
  onSelectModule: (module: NavigationModule) => void;
  collapsed?: boolean;
}

interface NavItem {
  id: NavigationModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
  { id: 'alerts', label: 'Alert Intelligence', icon: ShieldAlert, badge: '27', badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  { id: 'investigation', label: 'Investigation Workspace', icon: FolderSearch, badge: '3', badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  { id: 'graph-explorer', label: 'Graph Explorer', icon: Network },
  { id: 'transactions', label: 'Transaction Intelligence', icon: ArrowLeftRight },
  { id: 'agents', label: 'Agent Operations', icon: Bot, badge: '36', badgeColor: 'bg-cyan-500/10 text-cyan-400' },
  { id: 'evidence', label: 'Evidence Center', icon: Fingerprint },
  { id: 'risk-analytics', label: 'Risk Analytics', icon: TrendingUp },
  { id: 'models', label: 'Model Intelligence', icon: BrainCircuit },
  { id: 'datasets', label: 'Dataset Registry', icon: Database },
  { id: 'compliance', label: 'Compliance & Audit', icon: Scale },
  { id: 'system-admin', label: 'System Administration', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, onSelectModule }) => {
  return (
    <aside className="w-64 bg-[#0a0f1b] border-r border-white/[0.07] flex flex-col h-screen select-none shrink-0 z-30">
      {/* Brand Logo Header */}
      <div className="h-16 px-4 flex items-center gap-3 border-b border-white/[0.07]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
          <svg
            className="w-5 h-5 text-cyan-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="5" r="2.5" fill="currentColor" fillOpacity="0.4" />
            <circle cx="5" cy="18" r="2.5" fill="currentColor" fillOpacity="0.4" />
            <circle cx="19" cy="18" r="2.5" fill="currentColor" fillOpacity="0.4" />
            <line x1="12" y1="7.5" x2="5" y2="15.5" />
            <line x1="12" y1="7.5" x2="19" y2="15.5" />
            <line x1="7.5" y1="18" x2="16.5" y2="18" strokeDasharray="2 2" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
            FraudGraph AI
          </span>
          <span className="text-[11px] text-slate-400 font-medium tracking-tight">
            Financial Crime Intelligence
          </span>
        </div>
      </div>

      {/* Navigation Modules List */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-blue-600/20 text-white font-semibold shadow-inner border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r shadow-glow-cyan" />
              )}
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    item.badgeColor || 'bg-white/10 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Current User Profile Card */}
      <div className="p-3 border-t border-white/[0.07] bg-[#080c16]">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-cyan-200 flex items-center justify-center font-bold text-xs shadow-md border border-blue-400/30">
              {currentUser.avatarInitials}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400">{currentUser.role}</span>
            </div>
          </div>
          <button
            title="User options"
            className="text-slate-400 hover:text-slate-200 p-1 hover:bg-white/10 rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
