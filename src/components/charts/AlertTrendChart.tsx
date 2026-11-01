import React, { useState } from 'react';

interface AlertTrendDataPoint {
  date: string;
  high: number;
  medium: number;
  low: number;
}

interface AlertTrendChartProps {
  data?: AlertTrendDataPoint[];
}

export const AlertTrendChart: React.FC<AlertTrendChartProps> = ({
  data = [
    { date: 'Mar 1', high: 32, medium: 45, low: 72 },
    { date: 'Mar 8', high: 28, medium: 52, low: 68 },
    { date: 'Mar 15', high: 46, medium: 48, low: 74 },
    { date: 'Mar 22', high: 39, medium: 58, low: 70 },
    { date: 'Mar 29', high: 54, medium: 63, low: 79 },
  ],
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 360;
  const height = 150;
  const padding = { top: 15, right: 15, bottom: 25, left: 30 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = 80;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - (val / maxVal) * graphHeight;

  const createPath = (key: 'high' | 'medium' | 'low') => {
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`)
      .join(' ');
  };

  return (
    <div className="w-full relative select-none">
      {/* Top Legend */}
      <div className="flex items-center justify-end gap-3 mb-1 text-[11px] font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-slate-300">High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-slate-300">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span className="text-slate-300">Low</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 overflow-visible">
        {/* Horizontal gridlines */}
        {[0, 20, 40, 60, 80].map((val) => (
          <g key={val}>
            <line
              x1={padding.left}
              y1={getY(val)}
              x2={width - padding.right}
              y2={getY(val)}
              stroke="#1e293b"
              strokeDasharray="2 3"
              strokeWidth="1"
            />
            <text
              x={padding.left - 6}
              y={getY(val) + 3}
              textAnchor="end"
              fill="#64748b"
              fontSize="9"
              fontFamily="monospace"
            >
              {val}
            </text>
          </g>
        ))}

        {/* X axis dates */}
        {data.map((d, i) => (
          <text
            key={d.date}
            x={getX(i)}
            y={height - 6}
            textAnchor="middle"
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
          >
            {d.date}
          </text>
        ))}

        {/* Low Series Line (Blue/Cyan) */}
        <path
          d={createPath('low')}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Medium Series Line (Amber) */}
        <path
          d={createPath('medium')}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* High Series Line (Red) */}
        <path
          d={createPath('high')}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Interactive Dots */}
        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={getX(i)}
              cy={getY(d.high)}
              r={hoveredIdx === i ? 4.5 : 3}
              fill="#ef4444"
              stroke="#090d16"
              strokeWidth="1.5"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIdx(i)}
            />
            <circle
              cx={getX(i)}
              cy={getY(d.medium)}
              r={hoveredIdx === i ? 4.5 : 3}
              fill="#f59e0b"
              stroke="#090d16"
              strokeWidth="1.5"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIdx(i)}
            />
            <circle
              cx={getX(i)}
              cy={getY(d.low)}
              r={hoveredIdx === i ? 4.5 : 3}
              fill="#0ea5e9"
              stroke="#090d16"
              strokeWidth="1.5"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIdx(i)}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};
