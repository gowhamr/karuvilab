"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { ToolInput } from "@/components/ui/ToolInput";
import { CopyButton } from "@/components/ui/CopyButton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { Settings2, RotateCcw, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { useUrlState } from "@/src/hooks/useUrlState";
import { exportToCSV } from "@/src/lib/calculator-utils";
import {
  calculateDeterministicSip,
  formatCurrency,
  formatNumber,
} from "@/src/features/calculators/sip";

export default function SIPCalculatorClient() {
  const { toast } = useToast();

  const { state, setState, hasParams } = useUrlState({
    defaults: {
      monthly: '10000',
      rate: '12',
      years: '15',
      step_up: '0',
      lumpsum: '0',
      inflation: '0',
      tax: '0',
      fee: '0',
      // Legacy params support
      stepUp: '0',
      inflationRate: '0',
      taxRate: '0',
      feeRate: '0',
      p: '10000',
      r: '12',
      t: '15',
      s: '0',
    },
    debounceMs: 350,
  });

  const monthly = parseFloat((state.monthly as string) || (state.p as string) || '10000') || 0;
  const rate = parseFloat((state.rate as string) || (state.r as string) || '12') || 0;
  const years = parseFloat((state.years as string) || (state.t as string) || '15') || 0;
  const stepUp = parseFloat((state.step_up as string) || (state.stepUp as string) || (state.s as string) || '0') || 0;
  const lumpsum = parseFloat((state.lumpsum as string) || '0') || 0;
  const inflation = parseFloat((state.inflation as string) || (state.inflationRate as string) || '0') || 0;
  const tax = parseFloat((state.tax as string) || (state.taxRate as string) || '0') || 0;
  const fee = parseFloat((state.fee as string) || (state.feeRate as string) || '0') || 0;

  const [showTable, setShowTable] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const setMonthly = useCallback((m: number) => setState({ monthly: String(m), p: String(m) }), [setState]);
  const setRate = useCallback((r: number) => setState({ rate: String(r), r: String(r) }), [setState]);
  const setYears = useCallback((y: number) => setState({ years: String(y), t: String(y) }), [setState]);
  const setStepUp = useCallback((s: number) => setState({ step_up: String(s), stepUp: String(s), s: String(s) }), [setState]);
  const setLumpsum = useCallback((l: number) => setState({ lumpsum: String(l) }), [setState]);
  const setInflation = useCallback((inf: number) => setState({ inflation: String(inf), inflationRate: String(inf) }), [setState]);
  const setTax = useCallback((t: number) => setState({ tax: String(t), taxRate: String(t) }), [setState]);
  const setFee = useCallback((f: number) => setState({ fee: String(f), feeRate: String(f) }), [setState]);

  const resetAll = useCallback(() => {
    setState({
      monthly: '10000',
      rate: '12',
      years: '15',
      step_up: '0',
      lumpsum: '0',
      inflation: '0',
      tax: '0',
      fee: '0',
      stepUp: '0',
      inflationRate: '0',
      taxRate: '0',
      feeRate: '0',
      p: '10000',
      r: '12',
      t: '15',
      s: '0',
    });
  }, [setState]);

  // Pure deterministic calculations
  const sipResponse = useMemo(() => {
    return calculateDeterministicSip({
      monthlyInvestment: monthly,
      expectedAnnualReturn: rate,
      timeHorizonYears: years,
      annualStepUpPercent: stepUp,
      lumpsumAmount: lumpsum,
      annualInflationRate: inflation,
      capitalGainsTaxRate: tax,
      expenseRatio: fee,
    });
  }, [monthly, rate, years, stepUp, lumpsum, inflation, tax, fee]);

  // Canonical share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?monthly=${monthly}&rate=${rate}&years=${years}${
        stepUp > 0 ? `&step_up=${stepUp}` : ''
      }${lumpsum > 0 ? `&lumpsum=${lumpsum}` : ''}${
        inflation > 0 ? `&inflation=${inflation}` : ''
      }${tax > 0 ? `&tax=${tax}` : ''}${fee > 0 ? `&fee=${fee}` : ''}`
    : `?monthly=${monthly}&rate=${rate}&years=${years}${stepUp > 0 ? `&step_up=${stepUp}` : ''}`;

  const summary = sipResponse.success
    ? `SIP Calculator Results
----------------------
Monthly SIP: ${sipResponse.data.formattedMonthlyInvestment}
Expected Return: ${rate}% p.a. | Duration: ${years} Years${stepUp > 0 ? ` | Step-Up: ${stepUp}%/yr` : ''}${
        lumpsum > 0 ? ` | Initial Lumpsum: ${formatCurrency(lumpsum)}` : ''
      }${fee > 0 ? ` | Expense Ratio: ${fee}%` : ''}${
        tax > 0 ? ` | Tax Rate: ${tax}%` : ''
      }${inflation > 0 ? ` | Inflation: ${inflation}%` : ''}

Future Maturity Value: ${sipResponse.data.formattedFutureValue}
Total Invested: ${sipResponse.data.formattedTotalInvested}
Estimated Gains: ${sipResponse.data.formattedTotalGains}
Wealth Multiplier: ${sipResponse.data.wealthMultiplier}x${
        tax > 0 ? `\nNet Post-Tax Value: ${sipResponse.data.formattedNetFutureValue}` : ''
      }${
        inflation > 0 ? `\nInflation-Adjusted Real Value: ${sipResponse.data.formattedRealFutureValue}` : ''
      }

Calculated via KaruviLab — https://karuvilab.com/calculators/sip-calculator/`
    : '';

  const handleExport = useCallback(() => {
    if (!sipResponse.success) return;
    const headers = [
      "Year",
      "Monthly SIP (₹)",
      "Annual Contribution (₹)",
      "Cumulative Invested (₹)",
      "Interest Earned This Year (₹)",
      "Cumulative Interest (₹)",
      "Ending Balance (₹)",
      "Inflation Adjusted Balance (₹)"
    ];
    const rows = sipResponse.data.projections.map(p => [
      p.year,
      p.monthlyAmount,
      p.annualContribution,
      p.cumulativeInvested,
      p.interestEarnedThisYear,
      p.cumulativeInterest,
      p.endingBalance,
      p.inflationAdjustedBalance
    ]);
    exportToCSV(`sip-projection-${Date.now()}.csv`, headers, rows);
    toast("Exported yearly SIP projection to CSV");
  }, [sipResponse, toast]);

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="SIP Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        input={
          <form
            data-tool="sip-calculator"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 min-w-0 w-full"
          >
            <div data-input-field="monthly-investment">
              <SliderField
                label="Monthly SIP Amount"
                id="sip-monthly"
                min={500}
                max={500000}
                step={500}
                value={monthly}
                onChange={setMonthly}
                format={(v) => formatCurrency(v)}
              />
            </div>

            <div data-input-field="return-rate">
              <SliderField
                label="Expected Annual Return"
                id="sip-rate"
                min={1}
                max={30}
                step={0.5}
                value={rate}
                onChange={setRate}
                format={(v) => `${v}%`}
              />
            </div>

            <div data-input-field="time-horizon">
              <SliderField
                label="Investment Duration"
                id="sip-years"
                min={1}
                max={40}
                step={1}
                value={years}
                onChange={setYears}
                format={(v) => `${v} yr`}
              />
            </div>

            <div data-input-field="step-up">
              <SliderField
                label="Annual Step-Up (%)"
                id="sip-stepup"
                min={0}
                max={30}
                step={1}
                value={stepUp}
                onChange={setStepUp}
                format={(v) => `${v}%`}
              />
            </div>

            <Accordion type="single" collapsible className="border-t border-border pt-2">
              <AccordionItem value="adjustments" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2 text-blue">
                    <Settings2 className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">Advanced Adjustments</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div data-input-field="lumpsum">
                    <ToolInput
                      label="One-time Initial Lumpsum (optional)"
                      id="sip-lumpsum"
                      type="number"
                      placeholder="0"
                      value={lumpsum > 0 ? String(lumpsum) : ""}
                      onChange={(v) => {
                        const num = Number(v);
                        if (!isNaN(num) && num >= 0 && num <= 10000000000) setLumpsum(num);
                      }}
                      description={lumpsum > 0 ? formatCurrency(lumpsum) : "₹0 initial deposit"}
                    />
                  </div>

                  <div data-input-field="inflation-rate">
                    <SliderField
                      label="Annual Inflation Rate"
                      id="sip-inflation"
                      min={0}
                      max={15}
                      step={0.5}
                      value={inflation}
                      onChange={setInflation}
                      format={(v) => `${v}%`}
                    />
                  </div>

                  <div data-input-field="tax-rate">
                    <SliderField
                      label="Capital Gains Tax (%)"
                      id="sip-tax"
                      min={0}
                      max={40}
                      step={0.5}
                      value={tax}
                      onChange={setTax}
                      format={(v) => `${v}%`}
                    />
                  </div>

                  <div data-input-field="expense-ratio">
                    <SliderField
                      label="Management Fees / Expense Ratio (%)"
                      id="sip-fees"
                      min={0}
                      max={5}
                      step={0.1}
                      value={fee}
                      onChange={setFee}
                      format={(v) => `${v}%`}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </form>
        }
        output={
          sipResponse.success ? (
            <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
              {/* Machine-readable outputs for automation / agents */}
              <div className="sr-only" aria-hidden="true">
                <output data-result-field="future-value">{sipResponse.data.futureValue}</output>
                <output data-result-field="total-invested">{sipResponse.data.totalInvested}</output>
                <output data-result-field="total-gains">{sipResponse.data.totalGains}</output>
                <output data-result-field="wealth-multiplier">{sipResponse.data.wealthMultiplier}</output>
                <output data-result-field="net-future-value">{sipResponse.data.netFutureValue}</output>
                <output data-result-field="real-future-value">{sipResponse.data.realFutureValue}</output>
              </div>

              {/* Actions Header Row */}
              <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-text truncate">Growth Projections</h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="flex items-center justify-center gap-1.5 bg-surface-2 border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-text-muted hover:text-text transition-colors cursor-pointer whitespace-nowrap"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Reset</span>
                  </button>
                  <ShareButton
                    url={shareUrl}
                    title={`SIP Projection: ${sipResponse.data.formattedFutureValue} from ${formatCurrency(monthly)}/mo @ ${rate}% — KaruviLab`}
                    onQrClick={() => setIsQrOpen(true)}
                  />
                </div>
              </div>

              {/* Main Metric Card */}
              <div className="w-full min-w-0">
                <MetricCard
                  label="Total Future Maturity Value"
                  value={sipResponse.data.formattedFutureValue}
                  accent
                  className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                  valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                  sub={`From ${sipResponse.data.formattedTotalInvested} total invested over ${years} years`}
                  dataResultField="future-value"
                />
              </div>

              {/* Grid of Supporting Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                <MetricCard
                  label="Total Capital Invested"
                  value={sipResponse.data.formattedTotalInvested}
                  sub={stepUp > 0 ? `Started at ${formatCurrency(monthly)}/mo (+${stepUp}%/yr)` : `Flat ${formatCurrency(monthly)}/mo`}
                  dataResultField="total-invested"
                />
                <MetricCard
                  label="Total Wealth Gains"
                  value={sipResponse.data.formattedTotalGains}
                  sub={`+${formatNumber(sipResponse.data.totalInvested > 0 ? (sipResponse.data.totalGains / sipResponse.data.totalInvested) * 100 : 0)}% profit yield`}
                  className="bg-emerald-500/5 border-emerald-500/20"
                  valueClassName="text-emerald-500 font-bold"
                  dataResultField="total-gains"
                />
                <MetricCard
                  label="Wealth Multiplier"
                  value={`${sipResponse.data.wealthMultiplier}x`}
                  sub="Total corpus / invested capital"
                  dataResultField="wealth-multiplier"
                />
                <MetricCard
                  label="Effective Annual Return"
                  value={`${sipResponse.data.effectiveAnnualReturn}%`}
                  sub={fee > 0 ? `Gross ${rate}% minus ${fee}% expense ratio` : "Direct mutual fund index rate"}
                />
                {tax > 0 && (
                  <MetricCard
                    label="Net Post-Tax Value"
                    value={sipResponse.data.formattedNetFutureValue}
                    sub={`Estimated after ${tax}% LTCG tax on profits`}
                    className="bg-blue/5 border-blue/20"
                    dataResultField="net-future-value"
                  />
                )}
                {inflation > 0 && (
                  <MetricCard
                    label="Inflation-Adjusted Real Value"
                    value={sipResponse.data.formattedRealFutureValue}
                    sub={`Purchasing power at ${inflation}% annual inflation`}
                    className="bg-amber-500/5 border-amber-500/20"
                    dataResultField="real-future-value"
                  />
                )}
              </div>

              {/* Summary Copy Banner */}
              <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-semibold text-text">
                    Maturity Corpus: {sipResponse.data.formattedFutureValue}
                  </p>
                  <p className="text-[11px] text-text-muted font-mono truncate">
                    {sipResponse.data.formula}
                  </p>
                </div>
                <CopyButton text={summary} label="Copy Summary" className="bg-surface border border-border" />
              </div>
            </div>
          ) : (
            <div
              role="alert"
              aria-live="assertive"
              data-error-code={sipResponse.error.code}
              data-error-message={sipResponse.error.message}
              className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                    Calculation Error
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {sipResponse.error.message}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-error/10 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-border text-text hover:text-blue transition-colors cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          )
        }
        infoPanel={
          <div className="space-y-6">
            <CalculatorActionBar
              summary={summary}
              toolId="sip-calculator"
              historyLabel={`${formatCurrency(monthly)}/mo for ${years}y`}
              historyData={{
                monthly,
                rate,
                years,
                stepUp,
                lumpsum,
                inflation,
                tax,
                fee,
                result: sipResponse.success
                  ? {
                      totalInvested: sipResponse.data.totalInvested,
                      futureValue: sipResponse.data.futureValue,
                      netFutureValue: sipResponse.data.netFutureValue,
                    }
                  : null,
              }}
              onExport={handleExport}
              showProjection={showTable}
              onToggleProjection={() => setShowTable(!showTable)}
            />

            {showTable && sipResponse.success && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-text">Yearly Trajectory Schedule</h2>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-surface-2 border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        <th className="px-4 py-3">Year</th>
                        <th className="px-4 py-3 text-right">Monthly SIP</th>
                        <th className="px-4 py-3 text-right">Cumulative Invested</th>
                        <th className="px-4 py-3 text-right">Interest (Year)</th>
                        <th className="px-4 py-3 text-right">Ending Corpus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 font-mono">
                      {sipResponse.data.projections.map((row) => (
                        <tr
                          key={row.year}
                          className="hover:bg-surface-2/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-text font-sans font-medium">Year {row.year}</td>
                          <td className="px-4 py-3 text-right text-text-muted">{formatCurrency(row.monthlyAmount)}</td>
                          <td className="px-4 py-3 text-right text-text">{formatCurrency(row.cumulativeInvested)}</td>
                          <td className="px-4 py-3 text-right text-emerald-500 font-medium">
                            +{formatCurrency(row.interestEarnedThisYear)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-blue">
                            {formatCurrency(row.endingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
