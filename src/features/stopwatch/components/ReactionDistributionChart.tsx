"use client";

import React from 'react';
import { ReactionAnalyticsSummary } from '../types';

interface ReactionDistributionChartProps {
  analytics: ReactionAnalyticsSummary;
  className?: string;
}

export function ReactionDistributionChart({ analytics, className }: ReactionDistributionChartProps) {
  const { distribution, attemptCount } = analytics;
  if (attemptCount === 0) return null;

  const tiers = [
    {
      label: 'Top Tier (<200ms)',
      count: distribution.topTierCount,
      pct: (distribution.topTierCount / attemptCount) * 100,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Fast (200–260ms)',
      count: distribution.fastCount,
      pct: (distribution.fastCount / attemptCount) * 100,
      color: 'bg-blue',
      textColor: 'text-blue',
    },
    {
      label: 'Typical (260–340ms)',
      count: distribution.typicalCount,
      pct: (distribution.typicalCount / attemptCount) * 100,
      color: 'bg-amber-400',
      textColor: 'text-amber-400',
    },
    {
      label: 'Slower (>340ms)',
      count: distribution.slowCount,
      pct: (distribution.slowCount / attemptCount) * 100,
      color: 'bg-slate-500',
      textColor: 'text-text-muted',
    },
  ];

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs font-bold text-text-muted mb-2">
        <span>Reaction Tier Distribution</span>
        <span>{attemptCount} Attempts</span>
      </div>

      <div className="space-y-2 bg-surface-2/30 border border-border rounded-2xl p-3.5">
        {tiers.map((t, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className={t.textColor}>{t.label}</span>
              <span className="text-text-muted font-mono">
                {t.count} ({t.pct.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${t.color}`}
                style={{ width: `${t.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
