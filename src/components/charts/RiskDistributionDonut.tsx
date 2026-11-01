import React from 'react';

interface RiskDistributionDonutProps {
  highRisk?: number;
  mediumRisk?: number;
  lowRisk?: number;
  total?: string;
}

export const RiskDistributionDonut: React.FC<RiskDistributionDonutProps> = ({
  highRisk = 6.8,
  mediumRisk = 18.4,
  lowRisk = 74.8,
  total = '184.2K',
}) => {
  // SVG Donut calculations (radius = 56, circumference = 2 * PI * 56 = 351.86)
  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  const lowOffset = 0;
  const lowDash = (lowRisk / 100) * circumference;

  const medOffset = -lowDash;
  const medDash = (mediumRisk / 100) * circumference;

  const highOffset = -(lowDash + medDash);
  const highDash = (highRisk / 100) * circumference;

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {/* Donut SVG Ring */}
      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
          {/* Base track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#131d31"
            strokeWidth="16"
          />
          {/* Low Risk Segment (Cyan/Blue) */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#0ea5e9"
            strokeWidth="16"
            strokeDasharray={`${lowDash} ${circumference}`}
            strokeDashoffset={lowOffset}
            className="transition-all duration-700"
          />
          {/* Medium Risk Segment (Amber) */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#f59e0b"
            strokeWidth="16"
            strokeDasharray={`${medDash} ${circumference}`}
            strokeDashoffset={medOffset}
            className="transition-all duration-700"
          />
          {/* High Risk Segment (Red) */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#ef4444"
            strokeWidth="16"
            strokeDasharray={`${highDash} ${circumference}`}
            strokeDashoffset={highOffset}
            className="transition-all duration-700"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="font-mono text-base font-bold text-white tracking-tight">{total}</span>
          <span className="text-[10px] text-slate-400 font-medium">Transactions</span>
        </div>
      </div>

      {/* Legend & Percentages */}
      <div className="flex flex-col space-y-2 flex-1 min-w-0 pr-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-glow-red" />
            <span className="text-slate-300 font-medium">High Risk</span>
          </div>
          <span className="font-mono font-bold text-slate-100">{highRisk}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300 font-medium">Medium Risk</span>
          </div>
          <span className="font-mono font-bold text-slate-100">{mediumRisk}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-300 font-medium">Low Risk</span>
          </div>
          <span className="font-mono font-bold text-slate-100">{lowRisk}%</span>
        </div>
      </div>
    </div>
  );
};
