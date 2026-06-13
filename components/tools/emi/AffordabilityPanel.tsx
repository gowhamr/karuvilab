"use client";

import React, { useMemo } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { useEmiStore } from "@/src/store/useEmiStore";
import { checkAffordability } from "@/src/lib/emi-calculations";
import { cn } from "@/src/lib/utils";

export function AffordabilityPanel({ currentEmi }: { currentEmi: number }) {
  const affordability = useEmiStore(state => state.affordability);
  const setAffordability = useEmiStore(state => state.setAffordability);
  const showAffordability = useEmiStore(state => state.showAffordability);
  const toggleSection = useEmiStore(state => state.toggleSection);

  const result = useMemo(() => 
    checkAffordability(currentEmi, affordability), 
  [currentEmi, affordability]);

  const riskColors = {
    low: "bg-green-500",
    medium: "bg-orange-500",
    high: "bg-red-500"
  };

  const riskTextColors = {
    low: "text-emerald-700 dark:text-emerald-400",
    medium: "text-orange-700 dark:text-orange-400",
    high: "text-red-700 dark:text-red-400"
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="mb-6">
        <Checkbox
          id="enable-affordability"
          label="Affordability Check"
          checked={showAffordability}
          onChange={() => toggleSection('affordability')}
        />
      </div>

      {showAffordability && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ToolInput
              label="Monthly Take-Home"
              type="number"
              value={String(affordability.monthlyIncome)}
              onChange={(val) => setAffordability({ monthlyIncome: Number(val) })}
            />
            <ToolInput
              label="Existing EMIs"
              type="number"
              value={String(affordability.existingEmis)}
              onChange={(val) => setAffordability({ existingEmis: Number(val) })}
            />
            <ToolInput
              label="Monthly Expenses"
              type="number"
              value={String(affordability.monthlyExpenses)}
              onChange={(val) => setAffordability({ monthlyExpenses: Number(val) })}
            />
          </div>

          <div className="space-y-4">
            <dl className="flex justify-between items-end">
              <dt className="text-xs font-black uppercase tracking-widest text-text-4">Risk Indicator</dt>
              <dd className={cn("text-sm font-black uppercase tracking-widest", riskTextColors[result.riskLevel])}>
                {result.riskLevel} Risk
              </dd>
            </dl>
            
            <div className="relative h-3 w-full bg-bg border border-border rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-1000 ease-out", riskColors[result.riskLevel])}
                style={{ width: `${Math.min(result.emiPercentOfDisposable, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs font-bold text-text-4 uppercase tracking-tighter">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>

            <p className={cn("text-xs font-bold leading-relaxed p-3 rounded-lg border", 
              result.riskLevel === 'low' ? "bg-green-500/5 border-green-500/10 text-green-700" :
              result.riskLevel === 'medium' ? "bg-orange-500/5 border-orange-500/10 text-orange-700" :
              "bg-red-500/5 border-red-500/10 text-red-700"
            )}>
              {result.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
