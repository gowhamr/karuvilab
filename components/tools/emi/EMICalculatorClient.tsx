"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useEmiStore } from "@/src/features/emi-calculator/store";
import { useSessionStore } from "@/src/store/useSessionStore";
import { SessionRestoredBanner } from "@/components/ui/SessionRestoredBanner";
import { EmiInputs as EmiInputsType, EmiResult, generateSchedule } from "@/src/lib/emi-calculations";
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
import { Calculator, TrendingDown, Receipt, Calendar, Info, Sparkles } from "lucide-react";

export default function EMICalculatorClient() {
  const inputs = useEmiStore(state => state.inputs);
  const setInputs = useEmiStore(state => state.setInputs);
  const showPrepayment = useEmiStore(state => state.showPrepayment);
  const showMoratorium = useEmiStore(state => state.showMoratorium);
  const showFloatingRate = useEmiStore(state => state.showFloatingRate);

  const saveState = useSessionStore(state => state.saveState);
  const loadState = useSessionStore(state => state.loadState);
  const clearState = useSessionStore(state => state.clearState);

  const [showRestoredBanner, setShowRestoredBanner] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle Hydration
  useEffect(() => {
    const unsub = useSessionStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    if (useSessionStore.persist.hasHydrated()) {
      Promise.resolve().then(() => {
        setIsHydrated(true);
      });
    }
    return unsub;
  }, []);

  // Load state only after hydration
  useEffect(() => {
    if (!isHydrated) return;
    const savedState = loadState<EmiInputsType>('emi-calculator');
    if (savedState) {
      Promise.resolve().then(() => {
        setInputs(savedState);
        setShowRestoredBanner(true);
      });
    }
  }, [isHydrated, loadState, setInputs]);

  // Compute active inputs reflecting checkbox states
  const activeInputs = useMemo((): EmiInputsType => {
    return {
      loanAmount: Number(inputs.loanAmount) || 0,
      interestRate: Number(inputs.interestRate) || 0,
      tenureMonths: Number(inputs.tenureMonths) || 12,
      prepayments: showPrepayment ? (inputs.prepayments || []) : [],
      recurringPrepayment: (showPrepayment && inputs.recurringPrepayment && inputs.recurringPrepayment.amount > 0)
        ? inputs.recurringPrepayment
        : undefined,
      moratorium: (showMoratorium && inputs.moratorium && inputs.moratorium.months > 0)
        ? inputs.moratorium
        : undefined,
      floatingRateDelta: showFloatingRate ? (Number(inputs.floatingRateDelta) || 0) : 0,
    };
  }, [inputs, showPrepayment, showMoratorium, showFloatingRate]);

  // Pure reactive calculation — updates instantaneously with 0 lag
  const result: EmiResult = useMemo(() => {
    return generateSchedule(activeInputs);
  }, [activeInputs]);

  useEffect(() => {
    if (!isHydrated) return;
    saveState('emi-calculator', inputs);
  }, [inputs, saveState, isHydrated]);

  const summary = useMemo(() => {
    if (!result) return "";
    let s = `EMI Calculator Summary\n`;
    s += `----------------------\n`;
    s += `Loan Amount: ${formatCurrency(activeInputs.loanAmount)}\n`;
    s += `Interest Rate: ${activeInputs.interestRate}%\n`;
    s += `Tenure: ${activeInputs.tenureMonths} Months (${(activeInputs.tenureMonths / 12).toFixed(1)} Years)\n`;
    
    if (activeInputs.floatingRateDelta) {
      s += `Floating Rate Delta: ${activeInputs.floatingRateDelta > 0 ? '+' : ''}${activeInputs.floatingRateDelta}%\n`;
    }
    
    if (activeInputs.moratorium) {
      s += `Moratorium: ${activeInputs.moratorium.months} Months (${activeInputs.moratorium.type})\n`;
    }

    s += `\nResults:\n`;
    s += `Monthly EMI: ${formatCurrency(result.monthlyEmi)}\n`;
    s += `Total Interest: ${formatCurrency(result.totalInterest)}\n`;
    s += `Total Payment: ${formatCurrency(result.totalPayment)}\n`;
    s += `Effective Tenure: ${result.effectiveTenure} Months (${(result.effectiveTenure / 12).toFixed(1)} Years)\n`;
    
    if (result.savings && (result.savings.interest > 0 || result.savings.months > 0)) {
      s += `\nSavings via Prepayment:\n`;
      s += `Interest Saved: ${formatCurrency(result.savings.interest)}\n`;
      s += `Tenure Saved: ${result.savings.months} Months\n`;
    }
    
    s += `\nGenerated via KaruviLab`;
    return s;
  }, [activeInputs, result]);

  const handleClearSession = () => {
    clearState('emi-calculator');
    const defaultInputs: Partial<EmiInputsType> = { 
      loanAmount: 5000000, 
      interestRate: 8.5, 
      tenureMonths: 240,
      floatingRateDelta: 0,
      moratorium: undefined,
      recurringPrepayment: undefined,
      prepayments: []
    };
    setInputs(defaultInputs);
    setShowRestoredBanner(false);
  };

  const [isSticky, setIsSticky] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!resultRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsSticky(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
        }
      },
      { threshold: 0 }
    );

    observer.observe(resultRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative space-y-12">
      <SessionRestoredBanner 
        isVisible={showRestoredBanner}
        onClear={handleClearSession}
        onDismiss={() => setShowRestoredBanner(false)}
      />

      {/* Mobile Sticky Bar */}
      <AnimatePresence>
        {isSticky && result && (
          <m.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-nav bg-surface/95 backdrop-blur-md border-t border-border p-3.5 shadow-2xl flex items-center justify-between"
          >
            <div className="space-y-0.5">
               <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Monthly EMI</p>
               <p className="text-base font-bold text-text">{formatCurrency(result.monthlyEmi)}</p>
            </div>
            <div className="text-right space-y-0.5">
               <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Total Interest</p>
               <p className="text-xs font-semibold text-text">{formatCurrency(result.totalInterest)}</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
      
      {/* Top Section: Inputs & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface border border-border rounded-2xl sm:rounded-4xl p-4 sm:p-8 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue mb-6 flex items-center gap-2.5">
              <Calculator className="w-4 h-4" />
              Loan Configuration
            </h2>
            <EmiInputs />
          </div>

          <PrepaymentSection result={result} />
          <AffordabilityPanel currentEmi={result.monthlyEmi} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted px-2">Loan Summary</h2>
          
          <div ref={resultRef} className="space-y-6">
            <MetricCard
              label="Monthly EMI"
              value={formatCurrency(result.monthlyEmi)}
              icon={Receipt}
              trend={(activeInputs.floatingRateDelta !== undefined && activeInputs.floatingRateDelta !== 0) ? {
                value: `${activeInputs.floatingRateDelta > 0 ? '+' : ''}${activeInputs.floatingRateDelta}%`,
                isPositive: activeInputs.floatingRateDelta < 0,
                label: "Stress Test"
              } : undefined}
            />

            <MetricCard
              label="Total Interest"
              value={formatCurrency(result.totalInterest)}
              icon={TrendingDown}
              className="bg-surface-2/40"
            />
          </div>

          <MetricCard
            label="Total Payment (Principal + Interest)"
            value={formatCurrency(result.totalPayment)}
            icon={Calendar}
          />

          <div className="p-4 sm:p-6 bg-blue/5 border border-blue/10 rounded-2xl sm:rounded-4xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue">
                <Info className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Effective Tenure</span>
              </div>
              {result.savings && result.savings.months > 0 && (
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Early Payoff</span>
                </div>
              )}
            </div>

            <p className="text-2xl sm:text-3xl font-black text-text tabular-nums">
              {result.effectiveTenure} <span className="text-sm text-text-muted font-bold">Months</span>
              <span className="text-sm font-semibold text-text-muted ml-2">
                ({(result.effectiveTenure / 12).toFixed(1)} Years)
              </span>
            </p>
            <p className="text-xs text-text-muted font-medium leading-relaxed">
              {result.savings && result.savings.months > 0 
                ? `You will be completely debt-free ${(result.savings.months / 12).toFixed(1)} years (${result.savings.months} months) earlier!`
                : (result.effectiveTenure / 12 >= 1 
                    ? `${(result.effectiveTenure / 12).toFixed(1)} years until debt-free.` 
                    : "Loan will be closed within a year.")}
            </p>
          </div>

          <CalculatorActionBar 
            summary={summary}
            toolId="emi-calculator"
            historyLabel={`${formatCurrency(activeInputs.loanAmount)} @ ${activeInputs.interestRate}%`}
            historyData={{ inputs: activeInputs, result }}
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
      <div className="space-y-12">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <AmortisationChart schedule={result.schedule} />
          </div>
          <div className="space-y-8">
            <div className="flex items-center justify-between no-print">
               <h3 className="text-sm font-bold uppercase tracking-wider text-text">Reports & Export</h3>
               <ExportButtons schedule={result.schedule} />
            </div>
            <AmortisationTable schedule={result.schedule} />
          </div>
        </div>
      </div>

      {/* Print-Only Header */}
      <div className="hidden print-only py-10 border-b-2 border-border mb-10">
         <h2 className="text-4xl font-black">KV EMI Report</h2>
         <p className="text-text-muted mt-2 font-bold uppercase tracking-wider">
           {new Date().toLocaleDateString()} · Advanced Loan Analysis
         </p>
      </div>
    </div>
  );
}
