"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useEmiStore } from "@/src/features/emi-calculator/store";
import { useSessionStore } from "@/src/store/useSessionStore";
import { SessionRestoredBanner } from "@/components/ui/SessionRestoredBanner";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { ShareButton } from "@/components/ui/ShareButton";
import { QRModal } from "@/components/ui/QRModal";
import { useUrlState } from "@/src/hooks/useUrlState";
import {
  calculateDeterministicEmi,
  formatCurrency,
} from "@/src/features/calculators/emi";
import { EmiInputs } from "./EmiInputs";
import { PrepaymentSection } from "./PrepaymentSection";
import { AffordabilityPanel } from "./AffordabilityPanel";
import { AmortisationTable } from "./AmortisationTable";
import { AmortisationChart } from "./AmortisationChart";
import { ComparisonView } from "./ComparisonView";
import { ExportButtons } from "./ExportButtons";
import { SaveLoadScenarios } from "./SaveLoadScenarios";
import { MetricCard } from "@/components/ui/MetricCard";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";
import { Calculator, TrendingDown, Receipt, Calendar, Info, Sparkles, AlertCircle } from "lucide-react";
import { EmiInputs as EmiInputsType, EmiResult } from "@/src/lib/emi-calculations";

export default function EMICalculatorClient() {
  const { state: urlState, setState: setUrlState, hasParams } = useUrlState({
    defaults: {
      amount: '5000000',
      rate: '8.5',
      tenure: '240',
      floating: '0',
      prep_recurring: '0',
      prep_start: '1',
      // Legacy params support
      p: '5000000',
      r: '8.5',
      t: '240',
      n: '240',
    },
    debounceMs: 350,
  });

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
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Sync initial URL params to store if present
  useEffect(() => {
    const rawAmt = (urlState.amount as string) || (urlState.p as string);
    const rawRate = (urlState.rate as string) || (urlState.r as string);
    const rawTenure = (urlState.tenure as string) || (urlState.t as string) || (urlState.n as string);
    const rawFloating = urlState.floating as string;
    const rawPrepRec = urlState.prep_recurring as string;
    const rawPrepStart = urlState.prep_start as string;

    const updates: Partial<EmiInputsType> = {};
    if (rawAmt && !isNaN(Number(rawAmt))) updates.loanAmount = Number(rawAmt);
    if (rawRate && !isNaN(Number(rawRate))) updates.interestRate = Number(rawRate);
    if (rawTenure && !isNaN(Number(rawTenure))) updates.tenureMonths = Number(rawTenure);
    if (rawFloating && !isNaN(Number(rawFloating))) updates.floatingRateDelta = Number(rawFloating);
    if (rawPrepRec && Number(rawPrepRec) > 0) {
      updates.recurringPrepayment = {
        amount: Number(rawPrepRec),
        startMonth: Number(rawPrepStart) || 1,
      };
    }

    if (Object.keys(updates).length > 0) {
      setInputs(updates);
    }
  }, [urlState.amount, urlState.p, urlState.rate, urlState.r, urlState.tenure, urlState.t, urlState.n, urlState.floating, urlState.prep_recurring, urlState.prep_start, setInputs]);

  // Sync store changes back to URL
  useEffect(() => {
    setUrlState({
      amount: String(inputs.loanAmount || 5000000),
      rate: String(inputs.interestRate || 8.5),
      tenure: String(inputs.tenureMonths || 240),
      floating: String(inputs.floatingRateDelta || 0),
      prep_recurring: String(inputs.recurringPrepayment?.amount || 0),
      prep_start: String(inputs.recurringPrepayment?.startMonth || 1),
      p: String(inputs.loanAmount || 5000000),
      r: String(inputs.interestRate || 8.5),
      t: String(inputs.tenureMonths || 240),
      n: String(inputs.tenureMonths || 240),
    });
  }, [inputs.loanAmount, inputs.interestRate, inputs.tenureMonths, inputs.floatingRateDelta, inputs.recurringPrepayment, setUrlState]);

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

  // Load state only after hydration if no URL params were present
  useEffect(() => {
    if (!isHydrated || hasParams) return;
    const savedState = loadState<EmiInputsType>('emi-calculator');
    if (savedState) {
      Promise.resolve().then(() => {
        setInputs(savedState);
        setShowRestoredBanner(true);
      });
    }
  }, [isHydrated, loadState, setInputs, hasParams]);

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

  // Pure deterministic calculation response
  const emiResponse = useMemo(() => {
    return calculateDeterministicEmi({
      loanAmount: activeInputs.loanAmount,
      annualInterestRate: activeInputs.interestRate,
      tenureMonths: activeInputs.tenureMonths,
      prepayments: activeInputs.prepayments,
      recurringPrepayment: activeInputs.recurringPrepayment,
      moratorium: activeInputs.moratorium,
      floatingRateDelta: activeInputs.floatingRateDelta,
    });
  }, [activeInputs]);

  // Legacy result compatibility adapter for charts and tables
  const result: EmiResult | null = useMemo(() => {
    if (!emiResponse.success) return null;
    return {
      monthlyEmi: emiResponse.data.monthlyEmi,
      totalInterest: emiResponse.data.totalInterest,
      totalPayment: emiResponse.data.totalPayment,
      effectiveTenure: emiResponse.data.effectiveTenureMonths,
      savings: emiResponse.data.savings ? {
        interest: emiResponse.data.savings.interestSaved,
        months: emiResponse.data.savings.monthsSaved,
      } : undefined,
      schedule: emiResponse.data.monthlySchedule.map(m => ({
        month: m.month,
        year: m.year,
        emi: m.emi,
        principal: m.principalPaid,
        interest: m.interestPaid,
        prepayment: m.prepaymentPaid,
        balance: m.endingBalance,
        totalInterestPaid: m.totalInterestPaid,
        totalPrincipalPaid: m.totalPrincipalPaid,
      })),
    };
  }, [emiResponse]);

  useEffect(() => {
    if (!isHydrated) return;
    saveState('emi-calculator', inputs);
  }, [inputs, saveState, isHydrated]);

  // Canonical share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?amount=${activeInputs.loanAmount}&rate=${activeInputs.interestRate}&tenure=${activeInputs.tenureMonths}${
        activeInputs.floatingRateDelta ? `&floating=${activeInputs.floatingRateDelta}` : ''
      }${
        activeInputs.recurringPrepayment?.amount ? `&prep_recurring=${activeInputs.recurringPrepayment.amount}&prep_start=${activeInputs.recurringPrepayment.startMonth}` : ''
      }`
    : `?amount=${activeInputs.loanAmount}&rate=${activeInputs.interestRate}&tenure=${activeInputs.tenureMonths}`;

  const summary = useMemo(() => {
    if (!emiResponse.success) return "";
    const data = emiResponse.data;
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
    s += `Monthly EMI: ${data.formattedMonthlyEmi}\n`;
    s += `Total Interest: ${data.formattedTotalInterest}\n`;
    s += `Total Payment: ${data.formattedTotalPayment}\n`;
    s += `Effective Tenure: ${data.effectiveTenureMonths} Months (${(data.effectiveTenureMonths / 12).toFixed(1)} Years)\n`;
    
    if (data.savings && (data.savings.interestSaved > 0 || data.savings.monthsSaved > 0)) {
      s += `\nSavings via Prepayment:\n`;
      s += `Interest Saved: ${data.savings.formattedInterestSaved}\n`;
      s += `Tenure Saved: ${data.savings.monthsSaved} Months\n`;
    }
    
    s += `\nGenerated via KaruviLab`;
    return s;
  }, [activeInputs, emiResponse]);

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

  return (
    <div className="relative space-y-8 sm:space-y-12 min-w-0 w-full">
      <SharedResultBanner hasParams={hasParams} toolName="EMI Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      
      <SessionRestoredBanner 
        isVisible={showRestoredBanner}
        onClear={handleClearSession}
        onDismiss={() => setShowRestoredBanner(false)}
      />

      {/* Machine-readable outputs for AI and test automation */}
      {emiResponse.success && (
        <div className="sr-only" aria-hidden="true">
          <output data-result-field="monthly-emi">{emiResponse.data.monthlyEmi}</output>
          <output data-result-field="total-interest">{emiResponse.data.totalInterest}</output>
          <output data-result-field="total-payment">{emiResponse.data.totalPayment}</output>
          <output data-result-field="effective-tenure">{emiResponse.data.effectiveTenureMonths}</output>
          {emiResponse.data.savings && (
            <>
              <output data-result-field="interest-saved">{emiResponse.data.savings.interestSaved}</output>
              <output data-result-field="months-saved">{emiResponse.data.savings.monthsSaved}</output>
            </>
          )}
        </div>
      )}
      
      {/* Top Section: Inputs & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start min-w-0 w-full">
        <form
          data-tool="emi-calculator"
          onSubmit={(e) => e.preventDefault()}
          className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0 w-full"
        >
          <div className="bg-surface border border-border rounded-2xl sm:rounded-4xl p-4 sm:p-8 shadow-sm min-w-0 w-full">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue mb-6 flex items-center gap-2.5">
              <Calculator className="w-4 h-4" />
              Loan Configuration
            </h2>
            <EmiInputs />
          </div>

          <PrepaymentSection result={result} />
          <AffordabilityPanel currentEmi={emiResponse.success ? emiResponse.data.monthlyEmi : 0} />
        </form>

        <div className="space-y-6 lg:sticky lg:top-8 min-w-0 w-full">
          <div className="flex items-center justify-between gap-2 px-2 min-w-0">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted truncate">Loan Summary</h2>
            <ShareButton
              url={shareUrl}
              title={`EMI for ${formatCurrency(activeInputs.loanAmount)} @ ${activeInputs.interestRate}%: ${emiResponse.success ? emiResponse.data.formattedMonthlyEmi : ''} — KaruviLab`}
              onQrClick={() => setIsQrOpen(true)}
            />
          </div>
          
          {emiResponse.success ? (
            <>
              <div className="space-y-4 sm:space-y-6 min-w-0 w-full">
                <MetricCard
                  label="Monthly EMI"
                  value={emiResponse.data.formattedMonthlyEmi}
                  icon={Receipt}
                  accent
                  dataResultField="monthly-emi"
                  trend={(activeInputs.floatingRateDelta !== undefined && activeInputs.floatingRateDelta !== 0) ? {
                    value: `${activeInputs.floatingRateDelta > 0 ? '+' : ''}${activeInputs.floatingRateDelta}%`,
                    isPositive: activeInputs.floatingRateDelta < 0,
                    label: "Stress Test"
                  } : undefined}
                />

                <MetricCard
                  label="Total Interest"
                  value={emiResponse.data.formattedTotalInterest}
                  icon={TrendingDown}
                  className="bg-surface-2/40"
                  dataResultField="total-interest"
                />
              </div>

              <MetricCard
                label="Total Payment (Principal + Interest)"
                value={emiResponse.data.formattedTotalPayment}
                icon={Calendar}
                dataResultField="total-payment"
              />

              <div className="p-4 sm:p-6 bg-blue/5 border border-blue/10 rounded-2xl sm:rounded-4xl space-y-2 relative overflow-hidden min-w-0 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Effective Tenure</span>
                  </div>
                  {emiResponse.data.savings && emiResponse.data.savings.monthsSaved > 0 && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <Sparkles className="w-3 h-3" />
                      <span>Early Payoff</span>
                    </div>
                  )}
                </div>

                <p className="text-2xl sm:text-3xl font-black text-text tabular-nums">
                  {emiResponse.data.effectiveTenureMonths} <span className="text-sm text-text-muted font-bold">Months</span>
                  <span className="text-sm font-semibold text-text-muted ml-2">
                    ({(emiResponse.data.effectiveTenureMonths / 12).toFixed(1)} Years)
                  </span>
                </p>
                <p className="text-xs text-text-muted font-medium leading-relaxed">
                  {emiResponse.data.savings && emiResponse.data.savings.monthsSaved > 0 
                    ? `You will be completely debt-free ${(emiResponse.data.savings.monthsSaved / 12).toFixed(1)} years (${emiResponse.data.savings.monthsSaved} months) earlier!`
                    : (emiResponse.data.effectiveTenureMonths / 12 >= 1 
                        ? `${(emiResponse.data.effectiveTenureMonths / 12).toFixed(1)} years until debt-free.` 
                        : "Loan will be closed within a year.")}
                </p>
              </div>

              <CalculatorActionBar 
                summary={summary}
                toolId="emi-calculator"
                historyLabel={`${formatCurrency(activeInputs.loanAmount)} @ ${activeInputs.interestRate}%`}
                historyData={{ inputs: activeInputs, result }}
              />

              <div className="no-print pt-2">
                 <SaveLoadScenarios />
              </div>
            </>
          ) : (
            <div
              role="alert"
              aria-live="assertive"
              data-error-code={emiResponse.error.code}
              data-error-message={emiResponse.error.message}
              className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                    Calculation Error
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {emiResponse.error.message}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-error/10 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearSession}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-border text-text hover:text-blue transition-colors cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Section */}
      <div className="no-print min-w-0 w-full">
        <ComparisonView />
      </div>

      {/* Results & Visualization */}
      {result && (
        <div className="space-y-8 sm:space-y-12 min-w-0 w-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 items-start min-w-0 w-full">
            <div className="space-y-8 min-w-0 w-full">
              <AmortisationChart schedule={result.schedule} />
            </div>
            <div className="space-y-8 min-w-0 w-full">
              <div className="flex items-center justify-between no-print">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-text">Reports & Export</h3>
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
         <p className="text-text-muted mt-2 font-bold uppercase tracking-wider">
           {new Date().toLocaleDateString()} · Advanced Loan Analysis
         </p>
      </div>
    </div>
  );
}
