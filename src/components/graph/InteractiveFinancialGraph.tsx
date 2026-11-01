import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  User,
  CreditCard,
  Smartphone,
  Globe,
  Briefcase,
  AlertOctagon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  MousePointer,
  Hand,
  Sparkles,
} from 'lucide-react';
import { GraphNodeData, GraphEdgeData, RiskLevel } from '../../types';

interface InteractiveFinancialGraphProps {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  selectedNodeId: string | null;
  onSelectNode: (node: GraphNodeData) => void;
  showCommunities?: boolean;
  filterRisk?: string;
  filterType?: string;
}

interface NodePosition {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

export const InteractiveFinancialGraph: React.FC<InteractiveFinancialGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  showCommunities = false,
  filterRisk = 'all',
  filterType = 'all',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'pan'>('select');

  // Pre-calculated aesthetic radial coordinates around center TR-90421073
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({
    'node-center': { x: 420, y: 310 },
    'node-person-1': { x: 420, y: 470 },
    'node-acc-2': { x: 570, y: 190 },
    'node-acc-3': { x: 620, y: 330 },
    'node-acc-4': { x: 540, y: 440 },
    'node-acc-5': { x: 250, y: 190 },
    'node-acc-6': { x: 220, y: 360 },
    'node-card-1': { x: 340, y: 220 },
    'node-card-2': { x: 700, y: 230 },
    'node-device-1': { x: 470, y: 130 },
    'node-ip-1': { x: 380, y: 480 },
    'node-org-1': { x: 670, y: 110 },
  });

  // Filter nodes according to dropdown filters
  const filteredNodes = nodes.filter((n) => {
    if (filterRisk !== 'all' && n.riskLevel !== filterRisk) return false;
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = edges.filter(
    (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  );

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (activeTool === 'pan' || e.button === 1 || e.target === containerRef.current) {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (draggedNodeId) {
      // Calculate node new position considering zoom and pan
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = (e.clientX - rect.left - pan.x) / zoom;
        const mouseY = (e.clientY - rect.top - pan.y) / zoom;
        setNodePositions((prev) => ({
          ...prev,
          [draggedNodeId]: { x: mouseX, y: mouseY },
        }));
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggedNodeId(null);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.4), 2.5));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className="w-5 h-5 text-sky-300" />;
      case 'account':
        return <Building2 className="w-5 h-5 text-white" />;
      case 'card':
        return <CreditCard className="w-4 h-4 text-emerald-300" />;
      case 'device':
        return <Smartphone className="w-4 h-4 text-amber-300" />;
      case 'ip':
        return <Globe className="w-4 h-4 text-cyan-300" />;
      case 'organization':
        return <Briefcase className="w-5 h-5 text-purple-300" />;
      default:
        return <AlertOctagon className="w-4 h-4 text-red-300" />;
    }
  };

  const getNodeStyles = (node: GraphNodeData) => {
    if (node.isCenter || node.id === 'node-center') {
      return {
        bg: 'bg-red-600',
        border: 'border-red-400',
        ring: 'ring-8 ring-red-500/30 ring-offset-4 ring-offset-[#090d16]',
        glow: 'shadow-glow-red',
        size: 'w-16 h-16',
      };
    }
    switch (node.type) {
      case 'person':
        return {
          bg: 'bg-blue-600/90',
          border: 'border-blue-400',
          ring: 'ring-2 ring-blue-500/20',
          glow: 'shadow-glow-blue',
          size: 'w-12 h-12',
        };
      case 'account':
        return {
          bg: 'bg-purple-700/90',
          border: 'border-purple-400',
          ring: 'ring-2 ring-purple-500/20',
          glow: 'shadow-lg shadow-purple-500/20',
          size: 'w-12 h-12',
        };
      case 'card':
        return {
          bg: 'bg-emerald-600/90',
          border: 'border-emerald-400',
          ring: 'ring-2 ring-emerald-500/20',
          glow: 'shadow-lg shadow-emerald-500/20',
          size: 'w-10 h-10',
        };
      case 'device':
        return {
          bg: 'bg-amber-600/90',
          border: 'border-amber-400',
          ring: 'ring-2 ring-amber-500/20',
          glow: 'shadow-lg shadow-amber-500/20',
          size: 'w-10 h-10',
        };
      case 'ip':
        return {
          bg: 'bg-cyan-700/90',
          border: 'border-cyan-400',
          ring: 'ring-2 ring-cyan-500/20',
          glow: 'shadow-glow-cyan',
          size: 'w-10 h-10',
        };
      case 'organization':
        return {
          bg: 'bg-indigo-700/90',
          border: 'border-indigo-400',
          ring: 'ring-2 ring-indigo-500/20',
          glow: 'shadow-lg shadow-indigo-500/20',
          size: 'w-13 h-13',
        };
      default:
        return {
          bg: 'bg-slate-700',
          border: 'border-slate-500',
          ring: '',
          glow: '',
          size: 'w-10 h-10',
        };
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDownCanvas}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={(e) => {
        e.preventDefault();
        handleZoom(e.deltaY > 0 ? -0.08 : 0.08);
      }}
      className="relative w-full h-full bg-[#080d19] overflow-hidden select-none cursor-grab active:cursor-grabbing border border-white/[0.06] rounded-xl"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, #111a2f 0%, #080d19 100%),
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
        backgroundSize: '100% 100%, 32px 32px, 32px 32px',
      }}
    >
      {/* Floating Left Graph Controls Toolbar */}
      <div className="absolute left-4 top-4 z-20 flex flex-col gap-1 bg-[#0d1424]/90 backdrop-blur-md p-1.5 rounded-lg border border-white/[0.1] shadow-2xl">
        <button
          onClick={() => setActiveTool('select')}
          title="Select tool"
          className={`p-2 rounded-md transition-all ${
            activeTool === 'select'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
          }`}
        >
          <MousePointer className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTool('pan')}
          title="Pan tool"
          className={`p-2 rounded-md transition-all ${
            activeTool === 'pan'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
          }`}
        >
          <Hand className="w-4 h-4" />
        </button>
        <div className="w-full h-px bg-white/[0.1] my-1" />
        <button
          onClick={() => handleZoom(0.15)}
          title="Zoom In"
          className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.15)}
          title="Zoom Out"
          className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          title="Reset View"
          className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          title="Fit to Screen"
          onClick={() => {
            setZoom(0.9);
            setPan({ x: 40, y: 20 });
          }}
          className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Community Overlay Indicator */}
      {showCommunities && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-medium flex items-center gap-2 backdrop-blur-md shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Louvain Community #4 Highlighted (6 Accounts)</span>
        </div>
      )}

      {/* SVG Canvas for High-Precision Edges & Pulsing Nodes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          <marker
            id="arrowhead-red"
            markerWidth="8"
            markerHeight="6"
            refX="28"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
          </marker>
          <marker
            id="arrowhead-blue"
            markerWidth="8"
            markerHeight="6"
            refX="24"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
          </marker>
          <marker
            id="arrowhead-gray"
            markerWidth="8"
            markerHeight="6"
            refX="24"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
          </marker>
        </defs>

        {/* Render Edges */}
        {filteredEdges.map((edge) => {
          const sPos = nodePositions[edge.source] || { x: 300, y: 300 };
          const tPos = nodePositions[edge.target] || { x: 500, y: 300 };

          const midX = (sPos.x + tPos.x) / 2;
          const midY = (sPos.y + tPos.y) / 2;

          return (
            <g key={edge.id}>
              {/* Suspicious or standard edge */}
              <line
                x1={sPos.x}
                y1={sPos.y}
                x2={tPos.x}
                y2={tPos.y}
                stroke={edge.isSuspicious ? '#ef4444' : '#334155'}
                strokeWidth={edge.isSuspicious ? 2.2 : 1.4}
                strokeDasharray={edge.isSuspicious ? '5 4' : 'none'}
                markerEnd={
                  edge.isSuspicious
                    ? 'url(#arrowhead-red)'
                    : 'url(#arrowhead-blue)'
                }
                className={edge.isSuspicious ? 'animate-pulse' : ''}
              />
              {/* Transfer amount badge if present */}
              {edge.amount > 0 && (
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-38"
                    y="-10"
                    width="76"
                    height="18"
                    rx="9"
                    fill="#0b1120"
                    stroke={edge.isSuspicious ? '#ef4444' : '#3b82f6'}
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill={edge.isSuspicious ? '#fca5a5' : '#93c5fd'}
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    ₺{(edge.amount / 1000000).toFixed(1)}M
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Render Node DOM Elements with Real Icons, Glows and Badges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {filteredNodes.map((node) => {
          const pos = nodePositions[node.id] || { x: 400, y: 300 };
          const isSelected = selectedNodeId === node.id;
          const styles = getNodeStyles(node);

          return (
            <div
              key={node.id}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                onSelectNode(node);
                setDraggedNodeId(node.id);
              }}
              className="absolute pointer-events-auto flex flex-col items-center cursor-pointer group"
            >
              {/* Halo animation for center / high risk node */}
              {(node.isCenter || node.id === 'node-center') && (
                <div className="absolute inset-0 -m-3 rounded-full bg-red-500/25 animate-ping pointer-events-none" />
              )}

              {/* Node Circle Shape */}
              <div
                className={`relative rounded-full flex items-center justify-center transition-transform group-hover:scale-110 border-2 ${styles.size} ${styles.bg} ${styles.border} ${styles.ring} ${styles.glow} ${
                  isSelected ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-[#090d16]' : ''
                }`}
              >
                {getNodeIcon(node.type)}

                {/* Risk score badge badgelet */}
                {node.riskScore > 0 && (
                  <div
                    className={`absolute -top-1.5 -right-1.5 text-[9px] font-bold font-mono px-1 py-0.2 rounded-full border shadow ${
                      node.riskLevel === 'high'
                        ? 'bg-red-600 text-white border-red-400'
                        : 'bg-amber-600 text-white border-amber-400'
                    }`}
                  >
                    {node.riskScore}
                  </div>
                )}
              </div>

              {/* Node Label Below */}
              <div className="mt-1.5 flex flex-col items-center">
                <span className="text-[11px] font-semibold text-slate-200 tracking-tight whitespace-nowrap bg-[#0b1120]/80 px-2 py-0.5 rounded border border-white/[0.08] backdrop-blur-sm shadow">
                  {node.label}
                </span>

                {/* Node Status Pill (e.g. High Risk) */}
                {node.riskLevel === 'high' && (
                  <span className="mt-0.5 text-[9px] font-bold font-mono text-red-400 bg-red-950/80 px-1.5 py-0.2 rounded border border-red-500/30">
                    High Risk
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
