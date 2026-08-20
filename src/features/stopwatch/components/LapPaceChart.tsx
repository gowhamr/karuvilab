"use client";

import React, { useMemo } from 'react';
import { LapRecord, PrecisionMode } from '../types';
import { formatStopwatchTime } from '../timing-engine';

interface LapPaceChartProps {
  laps: LapRecord[];
  precision?: PrecisionMode;
  className?: string;
}

export function LapPaceChart({ laps, precision = 'centiseconds', className }: LapPaceChartProps) {
  const chartData = useMemo(() => {
    if (!laps || laps.length < 2) return null;

    const times = laps.map((l) => l.lapTimeMs);
    const min = Math.min(...times);
    const max = Math.max(...times);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;

    // ViewBox dimensions
    const width = 600;
    const height = 200;
    const padding = { top: 20, right: 30, bottom: 30, left: 50 };

    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    // Y scale range with padding
    const yRange = max - min || 1;
    const yMin = Math.max(0, min - yRange * 0.15);
    const yMax = max + yRange * 0.15;

    const getX = (index: number) => padding.left + (index / (laps.length - 1)) * innerWidth;
    const getY = (val: number) => padding.top + innerHeight - ((val - yMin) / (yMax - yMin)) * innerHeight;

    const points = laps.map((lap, idx) => ({
      x: getX(idx),
      y: getY(lap.lapTimeMs),
      lap,
    }));

    const pathData = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaData = `${pathData} L ${points[points.length - 1]?.x.toFixed(1)} ${height - padding.bottom} L ${points[0]?.x.toFixed(1)} ${height - padding.bottom} Z`;

    const avgY = getY(avg);

    return {
      width,
      height,
      points,
      pathData,
      areaData,
      avgY,
      avg,
      min,
      max,
      padding,
      innerWidth,
      innerHeight,
    };
  }, [laps]);

  if (!chartData) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs font-bold text-text-muted mb-2">
        <span>Lap Pace Curve</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-blue" /> Lap Time
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-amber-400 stroke-dasharray-2" /> Average ({formatStopwatchTime(chartData.avg, precision)})
          </span>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-2xl bg-surface-2/30 border border-border p-2">
        <svg
          viewBox={`0 0 ${chartData.width} ${chartData.height}`}
          className="w-full h-auto select-none"
          style={{ maxHeight: '200px' }}
        >
          <defs>
            <linearGradient id="lapPaceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={chartData.padding.left}
            y1={chartData.height - chartData.padding.bottom}
            x2={chartData.width - chartData.padding.right}
            y2={chartData.height - chartData.padding.bottom}
            stroke="currentColor"
            className="text-border"
            strokeWidth="1"
          />

          {/* Average reference line */}
          <line
            x1={chartData.padding.left}
            y1={chartData.avgY}
            x2={chartData.width - chartData.padding.right}
            y2={chartData.avgY}
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Area fill */}
          <path d={chartData.areaData} fill="url(#lapPaceGradient)" />

          {/* Line path */}
          <path
            d={chartData.pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {chartData.points.map((p, idx) => {
            const isBest = p.lap.isFastest;
            const isWorst = p.lap.isSlowest;
            const color = isBest ? '#10b981' : isWorst ? '#ef4444' : '#3b82f6';

            return (
              <g key={p.lap.id} className="cursor-pointer group">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isBest || isWorst ? 5 : 3.5}
                  fill={color}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                {/* X Axis Labels */}
                <text
                  x={p.x}
                  y={chartData.height - 10}
                  textAnchor="middle"
                  className="fill-current text-text-muted text-[10px] font-mono"
                >
                  L{p.lap.lapNumber}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
