import React from 'react';

interface MacroRingChartProps {
  label: string;
  consumed: number;
  target: number;
  unit: string;
  color?: string; // hex or tailwind class
  secondaryColor?: string;
  size?: number; // diameter in px
  strokeWidth?: number;
  subtitle?: string;
}

export default function MacroRingChart({
  label,
  consumed,
  target,
  unit,
  color = '#ccff00',
  secondaryColor = 'rgba(255, 255, 255, 0.08)',
  size = 140,
  strokeWidth = 10,
  subtitle
}: MacroRingChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = target > 0 ? Math.min(100, Math.round((consumed / target) * 100)) : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={secondaryColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl sm:text-2xl font-black font-mono text-white leading-none">
            {Math.round(consumed)}
          </span>
          <span className="text-[10px] font-mono text-zinc-400 mt-0.5 leading-none">
            / {target} {unit}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#ccff00] mt-1 font-mono">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 block">
          {label}
        </span>
        {subtitle && (
          <span className="text-[10px] text-zinc-500 font-mono block">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
