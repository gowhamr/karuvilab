/**
 * src/features/dev-tools/EmptyStateMetrics.tsx
 * Developer-only dashboard to monitor tool engagement and bounce rates.
 * Strictly local data from IndexedDB.
 */

"use client";

import React, { useMemo } from "react";
import { useAnalyticsStore } from "@/src/store/analyticsStore";
import { ALL_TOOLS } from "@/src/registry";
import { cn } from "@/src/lib/utils";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer2, 
  CheckCircle2, 
  LogOut,
  RefreshCw
} from "lucide-react";

export function EmptyStateMetrics() {
  const { views, engagements, conversions, bounces, resetMetrics } = useAnalyticsStore();

  const toolStats = useMemo(() => {
    return ALL_TOOLS.map(tool => {
      const v = views[tool.id] || 0;
      const e = engagements[tool.id] || 0;
      const c = conversions[tool.id] || 0;
      const b = bounces[tool.id] || 0;

      const engagementRate = v > 0 ? (e / v) * 100 : 0;
      const conversionRate = v > 0 ? (c / v) * 100 : 0;
      const bounceRate = v > 0 ? (b / v) * 100 : 0;

      return {
        ...tool,
        v, e, c, b,
        engagementRate,
        conversionRate,
        bounceRate
      };
    }).filter(t => t.v > 0).sort((a, b) => b.v - a.v);
  }, [views, engagements, conversions, bounces]);

  if (toolStats.length === 0) {
    return (
      <div className="p-12 text-center bg-mat-surface border border-mat-border rounded-[32px] shadow-mat-shine">
        <BarChart3 className="w-12 h-12 text-text-4 mx-auto mb-4 opacity-20" />
        <p className="text-text-3 font-bold">No analytics data recorded yet.</p>
        <p className="text-xs text-text-4 mt-1">Start using tools to see metrics appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-mat-base p-6 rounded-[32px] border border-mat-border">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight">Empty State Performance</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-4">Local Diagnostics Dashboard</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black uppercase">
             <TrendingUp className="w-3 h-3" /> Target {" > "} 75% Eng.
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black uppercase">
             <TrendingDown className="w-3 h-3" /> Target {" < "} 25% Bounce
           </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-text-4">
              <th className="px-4 py-2">Tool</th>
              <th className="px-4 py-2"><div className="flex items-center gap-1.5"><Eye className="w-3 h-3" /> Views</div></th>
              <th className="px-4 py-2"><div className="flex items-center gap-1.5"><MousePointer2 className="w-3 h-3" /> Eng.</div></th>
              <th className="px-4 py-2"><div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Conv.</div></th>
              <th className="px-4 py-2"><div className="flex items-center gap-1.5"><LogOut className="w-3 h-3" /> Bounce</div></th>
              <th className="px-4 py-2 text-right">Engagement %</th>
              <th className="px-4 py-2 text-right">Bounce %</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {toolStats.map(tool => (
              <tr key={tool.id} className="bg-mat-surface border border-mat-border shadow-mat-shine group hover:bg-mat-hover transition-colors">
                <td className="px-4 py-4 rounded-l-2xl">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-text">{tool.name}</span>
                    <span className="text-[9px] text-text-4 uppercase font-black">{tool.category}</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-mono text-xs">{tool.v}</td>
                <td className="px-4 py-4 font-mono text-xs text-brand-primary">{tool.e}</td>
                <td className="px-4 py-4 font-mono text-xs text-green-500">{tool.c}</td>
                <td className="px-4 py-4 font-mono text-xs text-red-500">{tool.b}</td>
                <td className={cn(
                  "px-4 py-4 font-black text-right text-xs",
                  tool.engagementRate >= 75 ? "text-green-500" : "text-red-400"
                )}>
                  {tool.engagementRate.toFixed(1)}%
                </td>
                <td className={cn(
                  "px-4 py-4 font-black text-right text-xs",
                  tool.bounceRate <= 25 ? "text-green-500" : "text-red-400"
                )}>
                  {tool.bounceRate.toFixed(1)}%
                </td>
                <td className="px-4 py-4 rounded-r-2xl text-right">
                  <button 
                    onClick={() => resetMetrics(tool.id)}
                    className="p-2 hover:bg-red-500/10 text-text-4 hover:text-red-500 rounded-lg transition-colors"
                    title="Reset Metrics"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
