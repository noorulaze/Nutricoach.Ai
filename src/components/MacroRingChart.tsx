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
  color = '#8BAF78',
  secondaryColor,
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
            stroke={secondaryColor || 'currentColor'}
            strokeWidth={strokeWidth}
            className={secondaryColor ? '' : 'text-[#edf2ea] dark:text-[#394139]'}
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
          <span className="text-xl sm:text-2xl font-black font-mono text-[#192418] dark:text-[#E8EDE7] leading-none">
            {Math.round(consumed)}
          </span>
          <span className="text-[10px] font-mono text-[#7a8c79] dark:text-[#A2AAA1] mt-0.5 leading-none">
            / {target} {unit}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#5ba83c] dark:text-[#8BAF78] mt-1 font-mono">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[#192418] dark:text-[#E8EDE7] block">
          {label}
        </span>
        {subtitle && (
          <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-mono block">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
