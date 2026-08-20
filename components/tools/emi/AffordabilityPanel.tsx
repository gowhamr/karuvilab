"use client";

import React, { useMemo } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { useEmiStore } from "@/src/features/emi-calculator/store";
import { checkAffordability } from "@/src/lib/emi-calculations";
import { cn } from "@/src/lib/utils";
import { ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";

export function AffordabilityPanel({ currentEmi }: { currentEmi: number }) {
  const affordability = useEmiStore(state => state.affordability);
  const setAffordability = useEmiStore(state => state.setAffordability);
  const showAffordability = useEmiStore(state => state.showAffordability);
  const toggleSection = useEmiStore(state => state.toggleSection);

  const result = useMemo(() => 
    checkAffordability(currentEmi, affordability), 
  [currentEmi, affordability]);

  const riskColors = {
    low: "bg-emerald-500",
    medium: "bg-amber-500",
    high: "bg-red-500"
  };

  const riskTextColors = {
    low: "text-emerald-400",
    medium: "text-amber-400",
    high: "text-red-400"
  };

  const riskIcons = {
    low: ShieldCheck,
    medium: AlertTriangle,
    high: AlertCircle
  };

  const RiskIcon = riskIcons[result.riskLevel];

  return (
    <div className="bg-surface border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <Checkbox
          id="enable-affordability"
          label="Loan Affordability & DTI Assessment"
          checked={showAffordability}
          onChange={() => toggleSection('affordability')}
        />
      </div>

      {showAffordability && (
        <div className="space-y-6 pt-6 border-t border-border/60 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <ToolInput
              label="Monthly Take-Home"
              type="number"
              value={String(affordability.monthlyIncome)}
              onChange={(val) => setAffordability({ monthlyIncome: Number(val) })}
              description="Net salary / income"
            />
            <ToolInput
              label="Existing Other EMIs"
              type="number"
              value={String(affordability.existingEmis)}
              onChange={(val) => setAffordability({ existingEmis: Number(val) })}
              description="Current active loan EMIs"
            />
            <ToolInput
              label="Monthly Living Expenses"
              type="number"
              value={String(affordability.monthlyExpenses)}
              onChange={(val) => setAffordability({ monthlyExpenses: Number(val) })}
              description="Rent, food, utilities, etc."
            />
          </div>

          <div className="space-y-3 bg-surface-2/40 border border-border/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Debt-to-Income (DTI) Ratio</span>
              <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", 
                result.riskLevel === 'low' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                result.riskLevel === 'medium' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                "bg-red-500/10 text-red-400 border-red-500/20"
              )}>
                <RiskIcon className="w-3.5 h-3.5" />
                <span>{result.riskLevel} Risk ({result.emiPercentOfDisposable.toFixed(1)}%)</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-3 w-full bg-surface-2 border border-border rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-700 ease-out rounded-full", riskColors[result.riskLevel])}
                style={{ width: `${Math.min(result.emiPercentOfDisposable, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase tracking-wider">
              <span>0% Safe</span>
              <span>25%</span>
              <span>50% Max Recommended</span>
              <span>75%</span>
              <span>100% Critical</span>
            </div>

            <p className={cn("text-xs font-semibold leading-relaxed p-3.5 rounded-xl border mt-2", 
              result.riskLevel === 'low' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" :
              result.riskLevel === 'medium' ? "bg-amber-500/10 border-amber-500/20 text-amber-300" :
              "bg-red-500/10 border-red-500/20 text-red-300"
            )}>
              {result.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
