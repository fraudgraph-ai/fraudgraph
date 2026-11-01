import React, { useState } from 'react';
import {
  Search,
  Filter,
  Play,
  Share2,
  Download,
  Layers,
  Sparkles,
  Maximize2,
  ChevronDown,
} from 'lucide-react';
import { InteractiveFinancialGraph } from '../../components/graph/InteractiveFinancialGraph';
import { EntityInspectorPanel } from '../../components/graph/EntityInspectorPanel';
import { initialGraphNodes, initialGraphEdges } from '../../data/mockData';
import { calculatePageRank, detectCircularFlows } from '../../utils/graphAlgorithms';
import { useToast } from '../../components/ui/Toast';
import { GraphNodeData, NavigationModule } from '../../types';

interface GraphExplorerProps {
  onNavigate: (module: NavigationModule) => void;
  onOpenCase: (caseId: string) => void;
  onViewEvidence: (evidenceId: string) => void;
  initialSelectedNodeId?: string;
}

export const GraphExplorer: React.FC<GraphExplorerProps> = ({
  onNavigate,
  onOpenCase,
  onViewEvidence,
  initialSelectedNodeId = 'node-center',
}) => {
  const { toast } = useToast();
  const [nodes, setNodes] = useState<GraphNodeData[]>(initialGraphNodes);
  const [edges, setEdges] = useState(initialGraphEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialSelectedNodeId);

  // Filter states
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>('all');
  const [amountFilter, setAmountFilter] = useState<string>('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState<string>('30d');
  const [showCommunities, setShowCommunities] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    toast({
      type: 'info',
      title: 'Executing Graph Analytics Engine',
      description: 'Computing PageRank centrality & Johnson cycle detection over directed edges...',
    });

    setTimeout(() => {
      // Calculate real PageRank
      const ranks = calculatePageRank(
        nodes.map((n) => ({ id: n.id, label: n.label, riskScore: n.riskScore })),
        edges.map((e) => ({ id: e.id, source: e.source, target: e.target, amount: e.amount }))
      );

      // Detect circular flows
      const cycles = detectCircularFlows(
        nodes.map((n) => ({ id: n.id, label: n.label, riskScore: n.riskScore })),
        edges.map((e) => ({ id: e.id, source: e.source, target: e.target, amount: e.amount }))
      );

      setIsAnalyzing(false);
      setShowCommunities(true);

      toast({
        type: 'success',
        title: 'Network Analysis Completed',
        description: `PageRank centrality mapped for ${Object.keys(ranks).length} nodes. ${cycles.length > 0 ? `${cycles.length} circular round-trip cycles detected.` : 'No complete circular round-trips in current radius.'}`,
      });
    }, 900);
  };

  const handleExportGraphJSON = () => {
    const graphData = {
      exportedAt: new Date().toISOString(),
      metadata: {
        filterRisk: riskLevelFilter,
        filterType: entityTypeFilter,
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
      nodes,
      edges,
    };

    const blob = new Blob([JSON.stringify(graphData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FINANCIAL_GRAPH_EXPORT_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      type: 'success',
      title: 'Graph Snapshot Exported',
      description: 'Full JSON topology and node metadata downloaded.',
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header & Search Bar */}
      <div className="h-14 px-6 border-b border-white/[0.08] bg-[#0a0f1b] flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Graph Explorer
          </h1>
          <p className="text-[11px] text-slate-400">
            Explore transaction networks, entity relationships and risk patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Filter Search */}
          <div className="relative w-64 md:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entities, accounts, transactions... ⌘K"
              className="w-full pl-8 pr-12 py-1.5 rounded-lg bg-[#0e1627] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
            />
            <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 bg-white/[0.06] px-1 rounded">
              ⌘K
            </span>
          </div>

          {/* Run Analysis Button */}
          <button
            onClick={handleRunAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/30 transition-all active:scale-95"
          >
            <Play className={`w-3.5 h-3.5 fill-white ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing Network...' : 'Run Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar Bar */}
      <div className="h-11 px-6 border-b border-white/[0.06] bg-[#0c1222] flex items-center justify-between text-xs text-slate-300 shrink-0">
        <div className="flex items-center gap-3">
          {/* Entity Type Filter */}
          <div className="flex items-center gap-1.5 bg-[#0f172a] px-2.5 py-1 rounded-md border border-white/[0.06]">
            <span className="text-slate-400 text-[11px]">Entity Type:</span>
            <select
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0f172a]">All Types</option>
              <option value="account" className="bg-[#0f172a]">Bank Accounts</option>
              <option value="person" className="bg-[#0f172a]">Persons / Owners</option>
              <option value="card" className="bg-[#0f172a]">Cards</option>
              <option value="device" className="bg-[#0f172a]">Devices</option>
              <option value="ip" className="bg-[#0f172a]">IP Addresses</option>
              <option value="organization" className="bg-[#0f172a]">Corporate</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 bg-[#0f172a] px-2.5 py-1 rounded-md border border-white/[0.06]">
            <span className="text-slate-400 text-[11px]">Risk Level:</span>
            <select
              value={riskLevelFilter}
              onChange={(e) => setRiskLevelFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0f172a]">All Levels</option>
              <option value="high" className="bg-[#0f172a]">High Risk (≥0.80)</option>
              <option value="medium" className="bg-[#0f172a]">Medium Risk (0.50-0.79)</option>
              <option value="low" className="bg-[#0f172a]">Low Risk (&lt;0.50)</option>
            </select>
          </div>

          {/* Amount Filter */}
          <div className="flex items-center gap-1.5 bg-[#0f172a] px-2.5 py-1 rounded-md border border-white/[0.06]">
            <span className="text-slate-400 text-[11px]">Amount:</span>
            <select
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0f172a]">Any Amount</option>
              <option value="1m" className="bg-[#0f172a]">&gt; ₺1,000,000</option>
              <option value="5m" className="bg-[#0f172a]">&gt; ₺5,000,000</option>
              <option value="10m" className="bg-[#0f172a]">&gt; ₺10,000,000</option>
            </select>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center gap-1.5 bg-[#0f172a] px-2.5 py-1 rounded-md border border-white/[0.06]">
            <span className="text-slate-400 text-[11px]">Time Range:</span>
            <select
              value={timeRangeFilter}
              onChange={(e) => setTimeRangeFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="24h" className="bg-[#0f172a]">Last 24 Hours</option>
              <option value="7d" className="bg-[#0f172a]">Last 7 Days</option>
              <option value="30d" className="bg-[#0f172a]">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Right toggles */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showCommunities}
              onChange={(e) => setShowCommunities(e.target.checked)}
              className="rounded bg-slate-800 border-white/[0.2] text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-xs text-slate-300 font-medium">Show Communities</span>
          </label>

          <button
            onClick={handleExportGraphJSON}
            title="Export Graph Image / JSON"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas + Right Inspector Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Interactive Graph Canvas */}
        <div className="flex-1 h-full relative">
          <InteractiveFinancialGraph
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNodeId}
            onSelectNode={(node) => setSelectedNodeId(node.id)}
            showCommunities={showCommunities}
            filterRisk={riskLevelFilter}
            filterType={entityTypeFilter}
          />
        </div>

        {/* Right Inspector Panel */}
        <EntityInspectorPanel
          selectedNode={selectedNode}
          onOpenCase={onOpenCase}
          onViewEvidence={onViewEvidence}
        />
      </div>
    </div>
  );
};
