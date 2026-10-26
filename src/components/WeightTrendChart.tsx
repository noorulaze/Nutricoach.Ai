import React from 'react';
import { ProgressEntry } from '../types';

interface WeightTrendChartProps {
  entries: ProgressEntry[];
  targetWeight?: number;
}

export default function WeightTrendChart({ entries, targetWeight }: WeightTrendChartProps) {
  // Take last 7 entries in chronological order
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-7);

  if (sorted.length < 2) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-[#7a8c79] dark:text-[#A2AAA1] font-medium">
        Log at least 2 check-ins to generate your personal weight trend curve.
      </div>
    );
  }

  const weights = sorted.map((e) => e.weightKg);
  const minWeight = Math.min(...weights) - 1;
  const maxWeight = Math.max(...weights) + 1;
  const range = maxWeight - minWeight || 1;

  const width = 500;
  const height = 140;
  const paddingX = 35;
  const paddingY = 20;

  // Calculate points
  const points = sorted.map((entry, index) => {
    const x = paddingX + (index / (sorted.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((entry.weightKg - minWeight) / range) * (height - 2 * paddingY);
    return { x, y, ...entry };
  });

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    return `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Area path for subtle gradient fill under curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 overflow-visible">
        <defs>
          <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8BAF78" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8BAF78" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Subtle Horizontal grid lines */}
        <line
          x1={paddingX}
          y1={paddingY}
          x2={width - paddingX}
          y2={paddingY}
          stroke="currentColor"
          strokeDasharray="4 4"
          className="text-[#f0f4ee] dark:text-[#394139]"
        />
        <line
          x1={paddingX}
          y1={height / 2}
          x2={width - paddingX}
          y2={height / 2}
          stroke="currentColor"
          strokeDasharray="4 4"
          className="text-[#f0f4ee] dark:text-[#394139]"
        />
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="currentColor"
          className="text-[#e8ede6] dark:text-[#394139]"
        />

        {/* Shaded Area under Curve */}
        <path d={areaD} fill="url(#weightAreaGrad)" />

        {/* Line Curve */}
        <path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#5ba83c] dark:text-[#8BAF78]"
        />

        {/* Data points */}
        {points.map((pt, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              className="fill-white dark:fill-[#272E29] stroke-[#5ba83c] dark:stroke-[#8BAF78] stroke-2 group-hover:r-6 transition-all"
            />
            {/* Value Label */}
            <text
              x={pt.x}
              y={pt.y - 10}
              textAnchor="middle"
              className="text-[10px] font-bold fill-[#192418] dark:fill-[#E8EDE7]"
            >
              {pt.weightKg}kg
            </text>
            {/* Date Label */}
            <text
              x={pt.x}
              y={height - 5}
              textAnchor="middle"
              className="text-[9px] font-medium fill-[#7a8c79] dark:fill-[#A2AAA1]"
            >
              {pt.date.split('-').slice(1).join('/')}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
