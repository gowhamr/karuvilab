"use client";

import React, { useState, useEffect } from "react";
import { useEmiStore } from "@/src/store/useEmiStore";
import { useSessionStore } from "@/src/store/useSessionStore";
import { SessionRestoredBanner } from "@/components/ui/SessionRestoredBanner";
import { EmiInputs as EmiInputsType, EmiResult } from "@/src/lib/emi-calculations";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { EmiInputs } from "./EmiInputs";
import { PrepaymentSection } from "./PrepaymentSection";
import { AffordabilityPanel } from "./AffordabilityPanel";
import { AmortisationTable } from "./AmortisationTable";
import { AmortisationChart } from "./AmortisationChart";
import { ComparisonView } from "./ComparisonView";
import { ExportButtons } from "./ExportButtons";
import { SaveLoadScenarios } from "./SaveLoadScenarios";
import { formatCurrency } from "@/src/lib/utils";
import { MetricCard } from "@/components/ui/MetricCard";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";
import { Calculator, TrendingDown, Receipt, Calendar, Info } from "lucide-react";
import { useMemo } from "react";

export default function EMICalculatorClient() {
  const inputs = useEmiStore(state => state.inputs);
  const setInputs = useEmiStore(state => state.setInputs);
  const saveState = useSessionStore(state => state.saveState);
  const loadState = useSessionStore(state => state.loadState);
  const clearState = useSessionStore(state => state.clearState);
  const [result, setResult] = useState<EmiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRestoredBanner, setShowRestoredBanner] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle Hydration
  useEffect(() => {
    const unsub = useSessionStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    if (useSessionStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    return unsub;
  }, []);

  // Load state only after hydration
  useEffect(() => {
    if (!isHydrated) return;
    const savedState = loadState<EmiInputsType>( 'emi-calculator');
    if (savedState) {
      setInputs(savedState);
      setShowRestoredBanner(true);
    }
  }, [isHydrated, loadState, setInputs]);

  useEffect(() => {
    if (!isHydrated) return;
    saveState('emi-calculator', inputs);
    
    let active = true;
    const calculate = async () => {
      setIsLoading(true);
      try {
        const res = await workerOrchestrator.run('calculateEmiSchedule', [inputs]) as EmiResult;
        if (active) setResult(res);
      } catch (err) {
        console.error("Calculation failed:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    calculate();
    return () => { active = false; };
  }, [inputs, saveState]);

  const summary = useMemo(() => {
    if (!result) return "";
    let s = `EMI Calculator Summary\n`;
    s += `----------------------\n`;
    s += `Loan Amount: ${formatCurrency(inputs.loanAmount)}\n`;
    s += `Interest Rate: ${inputs.interestRate}%\n`;
    s += `Tenure: ${inputs.tenureMonths} Months\n`;
    
    if (inputs.floatingRateDelta) {
      s += `Floating Rate Delta: ${inputs.floatingRateDelta > 0 ? '+' : ''}${inputs.floatingRateDelta}%\n`;
    }
    
    if (inputs.moratorium) {
      s += `Moratorium: ${inputs.moratorium.months} Months (${inputs.moratorium.type})\n`;
    }

    s += `\nResults:\n`;
    s += `Monthly EMI: ${formatCurrency(result.monthlyEmi)}\n`;
    s += `Total Interest: ${formatCurrency(result.totalInterest)}\n`;
    s += `Total Payment: ${formatCurrency(result.totalPayment)}\n`;
    s += `Effective Tenure: ${result.effectiveTenure} Months\n`;
    
    if (result.savings) {
      s += `\nSavings via Prepayment:\n`;
      s += `Interest Saved: ${formatCurrency(result.savings.interest)}\n`;
      s += `Tenure Saved: ${result.savings.months} Months\n`;
    }
    
    s += `\nGenerated via KaruviLab`;
    return s;
  }, [inputs, result]);

  const handleClearSession = () => {
    clearState('emi-calculator');
    const defaultInputs: Partial<EmiInputsType> = { 
      loanAmount: 5000000, 
      interestRate: 8.5, 
      tenureMonths: 240 
    };
    setInputs(defaultInputs);
    setShowRestoredBanner(false);
  };


  return (
    <div className="relative space-y-12">
      <SessionRestoredBanner 
        isVisible={showRestoredBanner}
        onClear={handleClearSession}
        onDismiss={() => setShowRestoredBanner(false)}
      />
      
      {/* Top Section: Inputs & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface border border-border rounded-2xl sm:rounded-4xl p-4 sm:p-8 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue mb-8 flex items-center gap-3">
              <Calculator className="w-4 h-4" />
              Loan Configuration
            </h2>
            <EmiInputs />
          </div>

          <PrepaymentSection savings={result?.savings ?? undefined} />
          <AffordabilityPanel currentEmi={result?.monthlyEmi || 0} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-text-4 px-2">Loan Summary</h2>
          
          <MetricCard
            label="Monthly EMI"
            value={formatCurrency(result?.monthlyEmi || 0)}
            icon={Receipt}
            loading={isLoading || !result}
            trend={(inputs.floatingRateDelta !== undefined && inputs.floatingRateDelta !== 0) ? {
              value: `${inputs.floatingRateDelta > 0 ? '+' : ''}${inputs.floatingRateDelta}%`,
              isPositive: inputs.floatingRateDelta < 0,
              label: "Stress Test"
            } : undefined}
          />

          <MetricCard
            label="Total Interest"
            value={formatCurrency(result?.totalInterest || 0)}
            icon={TrendingDown}
            loading={isLoading || !result}
            className="bg-bg/50"
          />

          <MetricCard
            label="Total Payment"
            value={formatCurrency(result?.totalPayment || 0)}
            icon={Calendar}
            loading={isLoading || !result}
          />

          <div className="p-4 sm:p-6 bg-blue/5 border border-blue/10 rounded-2xl sm:rounded-4xl space-y-3 relative overflow-hidden">
            { (isLoading || !result) && <div className="absolute inset-0 bg-surface/50 shimmer-wrapper z-10" /> }
            <div className="flex items-center gap-2 text-blue">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Effective Tenure</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-text tabular-nums">
              {result?.effectiveTenure || 0} <span className="text-sm text-text-4 font-bold">Months</span>
            </p>
            <p className="text-[10px] text-text-3 font-medium leading-relaxed">
              {(result?.effectiveTenure || 0) / 12 >= 1 
                ? `${((result?.effectiveTenure || 0) / 12).toFixed(1)} years until debt-free.` 
                : "Loan will be closed within a year."}
            </p>
          </div>

          <CalculatorActionBar 
            summary={summary}
            toolId="emi-calculator"
            historyLabel={`${formatCurrency(inputs.loanAmount)} @ ${inputs.interestRate}%`}
            historyData={{ inputs, result }}
          />

          <div className="no-print pt-4">
             <SaveLoadScenarios />
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="no-print">
        <ComparisonView />
      </div>

      {/* Results & Visualization */}
      {result && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <AmortisationChart schedule={result.schedule} />
            </div>
            <div className="space-y-8">
              <div className="flex items-center justify-between no-print">
                 <h3 className="text-sm font-black uppercase tracking-widest text-text">Reports & Export</h3>
                 <ExportButtons schedule={result.schedule} />
              </div>
              <AmortisationTable schedule={result.schedule} />
            </div>
          </div>
        </div>
      )}

      {/* Print-Only Header */}
      <div className="hidden print-only py-10 border-b-2 border-border mb-10">
         <h2 className="text-4xl font-black">KV EMI Report</h2>
         <p className="text-text-3 mt-2 font-bold uppercase tracking-widest">
           {new Date().toLocaleDateString()} · Advanced Loan Analysis
         </p>
      </div>
    </div>
  );
}
