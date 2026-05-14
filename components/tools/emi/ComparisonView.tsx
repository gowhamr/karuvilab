"use client";

import React, { useMemo } from "react";
import { X, Plus, ArrowRightLeft } from "lucide-react";
import { useEmiStore, SavedScenario } from "@/src/store/useEmiStore";
import { generateSchedule } from "@/src/lib/emi-calculations";
import { formatCurrency } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";

export function ComparisonView() {
  const { comparisonList, removeFromComparison, addToComparison, clearComparison } = useEmiStore();

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="w-5 h-5 text-blue" />
          <h3 className="text-sm font-black uppercase tracking-widest text-text">Scenario Comparison</h3>
        </div>
        <button 
          onClick={clearComparison}
          className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparisonData.map((d) => (
          <div key={d.id} className="bg-surface border border-border rounded-2xl p-5 relative group overflow-hidden">
            <button
              onClick={() => removeFromComparison(d.id)}
              className="absolute top-2 right-2 p-1.5 bg-bg/50 rounded-lg text-text-4 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue mb-1">Scenario</p>
                <p className="text-sm font-black text-text truncate">{d.name}</p>
              </div>

              <div className="space-y-4">
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
                  value={`${d.tenure} Months`} 
                />
              </div>

              <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-2 text-[9px] font-bold text-text-4 uppercase tracking-tighter">
                <div>
                  <p>Principal</p>
                  <p className="text-text">{formatCurrency(d.config.loanAmount)}</p>
                </div>
                <div>
                  <p>Rate</p>
                  <p className="text-text">{d.config.interestRate}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {comparisonList.length < 4 && (
          <button
            onClick={addToComparison}
            className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-8 gap-3 text-text-4 hover:border-blue hover:text-blue hover:bg-blue/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center group-hover:bg-blue group-hover:text-white transition-all">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Add Current</span>
          </button>
        )}
      </div>
    </div>
  );
}

function MetricItem({ label, value, isBest, diff }: { label: string, value: string, isBest?: boolean, diff?: number }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-text-4 uppercase tracking-tighter">{label}</p>
      <p className={cn("text-lg font-black tabular-nums", isBest ? "text-green-600" : "text-text")}>
        {value}
      </p>
      {diff !== undefined && diff > 0 && (
        <p className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">
          +{formatCurrency(diff)} extra
        </p>
      )}
    </div>
  );
}
