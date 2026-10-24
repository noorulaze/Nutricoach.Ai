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
      <div className="h-44 flex items-center justify-center text-xs text-zinc-500 font-mono">
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
            <stop offset="0%" stopColor="#ccff00" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ccff00" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Subtle Horizontal grid lines */}
        <line
          x1={paddingX}
          y1={paddingY}
          x2={width - paddingX}
          y2={paddingY}
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="4 4"
        />
        <line
          x1={paddingX}
          y1={height / 2}
          x2={width - paddingX}
          y2={height / 2}
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="4 4"
        />
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="rgba(255,255,255,0.08)"
        />

        {/* Shaded Area under Curve */}
        <path d={areaD} fill="url(#weightAreaGrad)" />

        {/* Line Curve */}
        <path
          d={pathD}
          fill="none"
          stroke="#ccff00"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((pt, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill="#090a0f"
              stroke="#ccff00"
              strokeWidth="2"
            />
            {/* Value Label */}
            <text
              x={pt.x}
              y={pt.y - 8}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {pt.weightKg}kg
            </text>
            {/* Date label */}
            <text
              x={pt.x}
              y={height - 5}
              textAnchor="middle"
              fill="#71717a"
              fontSize="9"
              fontFamily="monospace"
            >
              {pt.date.split('-').slice(1).join('/')}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
