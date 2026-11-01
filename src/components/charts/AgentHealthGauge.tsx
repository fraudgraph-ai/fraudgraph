import React from 'react';

interface AgentHealthGaugeProps {
  percentage?: number;
  running?: number;
  idle?: number;
  error?: number;
  disabled?: number;
}

export const AgentHealthGauge: React.FC<AgentHealthGaugeProps> = ({
  percentage = 98,
  running = 26,
  idle = 5,
  error = 0,
  disabled = 3,
}) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {/* Gauge Ring */}
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#131d31"
            strokeWidth="12"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#10b981"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 shadow-glow-cyan"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="font-mono text-xl font-extrabold text-white">{percentage}%</span>
          <span className="text-[10px] text-emerald-400 font-semibold tracking-wide uppercase">
            Healthy
          </span>
        </div>
      </div>

      {/* Legend Column */}
      <div className="flex flex-col space-y-1.5 flex-1 min-w-0 pr-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Running</span>
          </div>
          <span className="font-mono font-bold text-slate-100">{running}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-slate-300">Idle</span>
          </div>
          <span className="font-mono font-bold text-slate-100">{idle}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-300">Error</span>
          </div>
          <span className="font-mono font-bold text-slate-100">{error}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="text-slate-300">Disabled</span>
          </div>
          <span className="font-mono font-bold text-slate-100">{disabled}</span>
        </div>
      </div>
    </div>
  );
};
