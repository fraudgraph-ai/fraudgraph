import React, { useState, useEffect } from 'react';
import {
  Search,
  FolderSearch,
  Network,
  Bot,
  Database,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
  X,
} from 'lucide-react';
import { NavigationModule } from '../../types';
import { casesList, specialistAgentsCatalog, initialGraphNodes } from '../../data/mockData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: NavigationModule) => void;
  onSelectEntity?: (entityId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectEntity,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCases = casesList.filter(
    (c) =>
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.targetAccount.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNodes = initialGraphNodes.filter(
    (n) =>
      n.label.toLowerCase().includes(query.toLowerCase()) ||
      (n.properties.owner && n.properties.owner.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredAgents = specialistAgentsCatalog.filter(
    (a) =>
      a.id.toLowerCase().includes(query.toLowerCase()) ||
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0d1322] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-[#0f172a]/80">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, accounts (e.g. TR-90421073), agents, or evidence..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white text-xs p-1 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.08]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Navigation Shortcuts */}
          {!query && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                <button
                  onClick={() => {
                    onNavigate('command-center');
                    onClose();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-all text-left"
                >
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  <span>Command Center Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('graph-explorer');
                    onClose();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-all text-left"
                >
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Interactive Graph Explorer</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('investigation');
                    onClose();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-all text-left"
                >
                  <FolderSearch className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Investigation Workspace (FG-8421)</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('agents');
                    onClose();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-all text-left"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Agent Operations (36 Specialists)</span>
                </button>
              </div>
            </div>
          )}

          {/* Cases Results */}
          {filteredCases.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Investigations & Cases ({filteredCases.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onNavigate('investigation');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderSearch className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-mono font-semibold text-cyan-300">{c.id}</span>
                      <span className="text-slate-300">{c.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                        Score {c.riskScore}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Graph Entities Results */}
          {filteredNodes.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Graph Entities & Accounts ({filteredNodes.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredNodes.slice(0, 5).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (onSelectEntity) onSelectEntity(n.id);
                      onNavigate('graph-explorer');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Network className="w-3.5 h-3.5 text-purple-400" />
                      <span className="font-mono font-semibold text-slate-200">{n.label}</span>
                      {n.properties.owner && (
                        <span className="text-slate-400">({n.properties.owner})</span>
                      )}
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        n.riskLevel === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {n.type} · {n.riskScore}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specialist Agents */}
          {filteredAgents.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Specialist Agents ({filteredAgents.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredAgents.slice(0, 4).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onNavigate('agents');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-all text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-mono font-semibold text-cyan-300">{a.id}</span>
                      <span className="text-slate-200">{a.name}</span>
                      <span className="text-[10px] text-slate-500">[{a.domainLabel}]</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {a.successRate}% succ.
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#090d16] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with ⌘K or search query</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
