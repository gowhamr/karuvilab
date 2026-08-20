"use client";

import React, { useMemo } from "react";
import { X, Plus, ArrowRightLeft } from "lucide-react";
import { useEmiStore } from "@/src/features/emi-calculator/store";
import { generateSchedule } from "@/src/lib/emi-calculations";
import { formatCurrency } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";

export function ComparisonView() {
  const comparisonList = useEmiStore(state => state.comparisonList);
  const removeFromComparison = useEmiStore(state => state.removeFromComparison);
  const addToComparison = useEmiStore(state => state.addToComparison);
  const clearComparison = useEmiStore(state => state.clearComparison);

  const comparisonData = useMemo(() => {
    return comparisonList.map(item => {
      const res = generateSchedule(item.config);
      return {
        ...item,
        emi: res.monthlyEmi,
        totalInterest: res.totalInterest,
        totalPayment: res.totalPayment,
        tenure: res.effectiveTenure
      };
    });
  }, [comparisonList]);

  if (comparisonList.length === 0) return null;

  const minEmi = Math.min(...comparisonData.map(d => d.emi));
  const minInterest = Math.min(...comparisonData.map(d => d.totalInterest));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ArrowRightLeft className="w-4 h-4 text-blue" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-text">Scenario Comparison</h3>
        </div>
        <button 
          onClick={clearComparison}
          className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparisonData.map((d) => (
          <div key={d.id} className="bg-surface border border-border rounded-2xl p-5 relative group overflow-hidden shadow-sm">
            <button
              onClick={() => removeFromComparison(d.id)}
              className="absolute top-2 right-2 p-1.5 bg-surface-2 rounded-lg text-text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Remove scenario"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue mb-0.5">Scenario</p>
                <p className="text-sm font-bold text-text truncate">{d.name}</p>
              </div>

              <div className="space-y-3">
                <MetricItem 
                  label="Monthly EMI" 
                  value={formatCurrency(d.emi)} 
                  isBest={d.emi === minEmi}
                  diff={d.emi - minEmi}
                />
                <MetricItem 
                  label="Total Interest" 
                  value={formatCurrency(d.totalInterest)} 
                  isBest={d.totalInterest === minInterest}
                  diff={d.totalInterest - minInterest}
                />
                <MetricItem 
                  label="Tenure" 
                  value={`${d.tenure} Months (${(d.tenure / 12).toFixed(1)} Yrs)`} 
                />
              </div>

              <dl className="pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-xs font-medium text-text-muted">
                <div>
                  <dt className="text-[10px] uppercase text-text-muted">Principal</dt>
                  <dd className="text-text font-bold text-xs">{formatCurrency(d.config.loanAmount)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-text-muted">Rate</dt>
                  <dd className="text-text font-bold text-xs">{d.config.interestRate}%</dd>
                </div>
              </dl>
            </div>
          </div>
        ))}

        {comparisonList.length < 4 && (
          <button
            onClick={addToComparison}
            className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-6 gap-2 text-text-muted hover:border-blue hover:text-blue hover:bg-blue/5 transition-all group cursor-pointer min-h-[160px]"
          >
            <div className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center group-hover:bg-blue group-hover:text-white transition-all">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Save Current</span>
          </button>
        )}
      </div>
    </div>
  );
}

function MetricItem({ label, value, isBest, diff }: { label: string, value: string, isBest?: boolean, diff?: number }) {
  return (
    <dl className="space-y-0.5">
      <dt className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</dt>
      <dd className={cn("text-base font-bold tabular-nums", isBest ? "text-emerald-400" : "text-text")}>
        {value}
      </dd>
      {diff !== undefined && diff > 0 && (
        <dd className="text-[10px] font-semibold text-amber-400">
          +{formatCurrency(diff)} diff
        </dd>
      )}
    </dl>
  );
}
