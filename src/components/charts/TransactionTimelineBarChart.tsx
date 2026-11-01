import React, { useState } from 'react';

interface TimelinePoint {
  day: string;
  volume: number; // in 100K
  isAnomalous?: boolean;
}

interface TransactionTimelineBarChartProps {
  data?: TimelinePoint[];
}

export const TransactionTimelineBarChart: React.FC<TransactionTimelineBarChartProps> = ({
  data = [
    { day: 'Mar 1', volume: 15 },
    { day: 'Mar 3', volume: 18 },
    { day: 'Mar 5', volume: 22 },
    { day: 'Mar 7', volume: 19 },
    { day: 'Mar 9', volume: 24 },
    { day: 'Mar 11', volume: 16 },
    { day: 'Mar 13', volume: 28 },
    { day: 'Mar 15', volume: 20 },
    { day: 'Mar 17', volume: 25 },
    { day: 'Mar 19', volume: 30 },
    { day: 'Mar 21', volume: 22 },
    { day: 'Mar 23', volume: 45, isAnomalous: true },
    { day: 'Mar 25', volume: 78, isAnomalous: true },
    { day: 'Mar 27', volume: 84, isAnomalous: true },
    { day: 'Mar 29', volume: 92, isAnomalous: true },
  ],
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVolume = 100;

  return (
    <div className="w-full bg-[#0a0f1c] p-3 rounded-xl border border-white/[0.06] select-none">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-semibold text-slate-300">Transaction Timeline</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2 h-2 rounded-sm bg-slate-600" />
            Baseline
          </span>
          <span className="flex items-center gap-1 text-red-400">
            <span className="w-2 h-2 rounded-sm bg-red-500 shadow-glow-red" />
            Anomalous Spike
          </span>
        </div>
      </div>

      {/* Bars container */}
      <div className="flex items-end justify-between gap-1.5 h-20 pt-2 px-1 border-b border-white/[0.08]">
        {data.map((point, idx) => {
          const heightPercent = Math.min((point.volume / maxVolume) * 100, 100);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-7 z-20 px-1.5 py-0.5 rounded bg-slate-900 border border-white/[0.2] text-[10px] font-mono text-white whitespace-nowrap shadow-xl">
                  {point.day}: ₺{(point.volume * 100).toLocaleString()}K
                </div>
              )}

              {/* Bar */}
              <div
                className={`w-full rounded-t-sm transition-all duration-200 ${
                  point.isAnomalous
                    ? 'bg-red-500 shadow-glow-red group-hover:bg-red-400'
                    : 'bg-slate-700/80 group-hover:bg-cyan-500/80'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Axis dates */}
      <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1 px-1">
        <span>Mar 1</span>
        <span>Mar 9</span>
        <span>Mar 17</span>
        <span>Mar 25</span>
        <span>Mar 29</span>
      </div>
    </div>
  );
};
