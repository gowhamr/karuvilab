"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { Settings2, RotateCcw, AlertCircle, ShieldCheck, UserCheck } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { useUrlState } from "@/src/hooks/useUrlState";
import { exportToCSV } from "@/src/lib/calculator-utils";
import { cn } from "@/src/lib/utils";
import {
  calculateDeterministicRd,
  formatCurrency,
  formatNumber,
  RdCompoundingFrequency,
} from "@/src/features/calculators/rd";

const FREQ_OPTIONS: { label: string; value: RdCompoundingFrequency; sub: string }[] = [
  { label: "Quarterly", value: 4, sub: "Indian Standard" },
  { label: "Monthly", value: 12, sub: "High Frequency" },
  { label: "Half-Yearly", value: 2, sub: "Semi-Annual" },
  { label: "Annually", value: 1, sub: "Annual Credit" },
];

const RDCalculatorClient = memo(function RDCalculatorClient() {
  const { toast } = useToast();

  const { state, setState, hasParams } = useUrlState({
    defaults: {
      monthly: '5000',
      rate: '7',
      years: '5',
      compounding: '4',
      senior: '0',
      tds: '0',
      tds_rate: '10',
      // Legacy params support
      p: '5000',
      r: '7',
      t: '5',
      freq: '4',
    },
    debounceMs: 350,
  });

  const monthly = parseFloat((state.monthly as string) || (state.p as string) || '5000') || 0;
  const rate = parseFloat((state.rate as string) || (state.r as string) || '7') || 0;
  const years = parseFloat((state.years as string) || (state.t as string) || '5') || 0;
  const compounding = (parseInt((state.compounding as string) || (state.freq as string) || '4', 10) || 4) as RdCompoundingFrequency;
  const isSenior = state.senior === '1' || state.senior === 'true';
  const applyTds = state.tds === '1' || state.tds === 'true';
  const tdsRate = parseFloat((state.tds_rate as string) || '10') || 10;

  const [showTable, setShowTable] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const setMonthly = useCallback((m: number) => setState({ monthly: String(m), p: String(m) }), [setState]);
  const setRate = useCallback((r: number) => setState({ rate: String(r), r: String(r) }), [setState]);
  const setYears = useCallback((y: number) => setState({ years: String(y), t: String(y) }), [setState]);
  const setCompounding = useCallback((c: RdCompoundingFrequency) => setState({ compounding: String(c), freq: String(c) }), [setState]);
  const setIsSenior = useCallback((s: boolean) => setState({ senior: s ? '1' : '0' }), [setState]);
  const setApplyTds = useCallback((t: boolean) => setState({ tds: t ? '1' : '0' }), [setState]);
  const setTdsRate = useCallback((tr: number) => setState({ tds_rate: String(tr) }), [setState]);

  const resetAll = useCallback(() => {
    setState({
      monthly: '5000',
      rate: '7',
      years: '5',
      compounding: '4',
      senior: '0',
      tds: '0',
      tds_rate: '10',
      p: '5000',
      r: '7',
      t: '5',
      freq: '4',
    });
  }, [setState]);

  // Pure deterministic calculations
  const rdResponse = useMemo(() => {
    return calculateDeterministicRd({
      monthlyDeposit: monthly,
      annualInterestRate: rate,
      tenureYears: years,
      compoundingFrequency: compounding,
      isSeniorCitizen: isSenior,
      applyTds,
      tdsRate,
    });
  }, [monthly, rate, years, compounding, isSenior, applyTds, tdsRate]);

  // Canonical share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?monthly=${monthly}&rate=${rate}&years=${years}&compounding=${compounding}${
        isSenior ? '&senior=1' : ''
      }${applyTds ? `&tds=1&tds_rate=${tdsRate}` : ''}`
    : `?monthly=${monthly}&rate=${rate}&years=${years}&compounding=${compounding}`;

  const summary = rdResponse.success
    ? `Recurring Deposit (RD) Results
------------------------------
Monthly Deposit: ${rdResponse.data.formattedMonthlyDeposit}
Interest Rate: ${rate}% p.a.${isSenior ? ' (+0.50% Senior Citizen Boost = ' + rdResponse.data.effectiveInterestRate + '%)' : ''}
Duration: ${years} Years (${rdResponse.data.totalMonths} Months)
Compounding: ${compounding === 4 ? 'Quarterly (Indian Standard)' : compounding === 12 ? 'Monthly' : compounding === 2 ? 'Half-Yearly' : 'Annual'}
Effective APY Yield: ${rdResponse.data.formattedEffectiveApy}

Total Invested: ${rdResponse.data.formattedTotalInvested}
Interest Earned: ${rdResponse.data.formattedTotalInterest}
Gross Maturity Amount: ${rdResponse.data.formattedMaturityAmount}${
        applyTds
          ? `\nEstimated TDS (${tdsRate}%): ${rdResponse.data.formattedTdsAmount}\nNet Maturity Amount: ${rdResponse.data.formattedNetMaturityAmount}`
          : ''
      }

Calculated via KaruviLab — https://karuvilab.com/calculators/rd-calculator/`
    : '';

  const handleExport = useCallback(() => {
    if (!rdResponse.success) return;
    const headers = [
      "Year",
      "Months Completed",
      "Monthly Deposit (₹)",
      "Annual Deposit (₹)",
      "Cumulative Invested (₹)",
      "Interest Earned This Year (₹)",
      "Cumulative Interest (₹)",
      "Estimated TDS (₹)",
      "Gross Maturity Value (₹)",
      "Net Maturity Value (₹)"
    ];
    const rows = rdResponse.data.projections.map(p => [
      p.year,
      p.monthsCompleted,
      monthly,
      p.annualDeposit,
      p.cumulativeInvested,
      p.interestEarnedThisYear,
      p.cumulativeInterest,
      p.estimatedTds,
      p.maturityValue,
      p.netMaturityValue
    ]);
    exportToCSV(`rd-projection-${Date.now()}.csv`, headers, rows);
    toast("Exported yearly RD projection schedule to CSV");
  }, [rdResponse, monthly, toast]);

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Recurring Deposit (RD) Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        input={
          <form
            data-tool="rd-calculator"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 min-w-0 w-full"
          >
            <div data-input-field="monthly-deposit">
              <SliderField
                label="Monthly Deposit Amount"
                id="rd-monthly"
                min={500}
                max={500000}
                step={500}
                value={monthly}
                onChange={setMonthly}
                format={(v) => formatCurrency(v)}
              />
            </div>

            <div data-input-field="interest-rate">
              <SliderField
                label="Annual Interest Rate (%)"
                id="rd-rate"
                min={1}
                max={15}
                step={0.1}
                value={rate}
                onChange={setRate}
                format={(v) => `${v.toFixed(1)}%`}
              />
            </div>

            <div data-input-field="tenure-years">
              <SliderField
                label="Tenure Duration (Years)"
                id="rd-years"
                min={1}
                max={10}
                step={1}
                value={years}
                onChange={setYears}
                format={(v) => `${v} yr (${v * 12} mo)`}
              />
            </div>

            {/* Senior Citizen Rate Privilege */}
            <div
              data-input-field="senior-citizen"
              className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface-2/40 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <UserCheck className={cn("w-4 h-4 flex-shrink-0", isSenior ? "text-blue" : "text-text-muted")} />
                <div>
                  <label htmlFor="rd-senior-toggle" className="text-xs sm:text-sm font-semibold text-text block cursor-pointer">
                    Senior Citizen (+0.50% Boost)
                  </label>
                  <p className="text-[11px] text-text-muted">
                    Preferential interest rates for depositors aged 60+
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="rd-senior-toggle"
                role="switch"
                aria-checked={isSenior}
                onClick={() => setIsSenior(!isSenior)}
                className={cn(
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue/30",
                  isSenior ? "bg-blue" : "bg-border"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                    isSenior ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* Compounding Frequency Selector */}
            <div className="space-y-2" data-input-field="compounding-frequency">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                Compounding Frequency
              </label>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Compounding Frequency">
                {FREQ_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCompounding(opt.value)}
                    aria-pressed={compounding === opt.value}
                    className={cn(
                      "py-2 px-3 rounded-xl text-left border transition-all cursor-pointer",
                      compounding === opt.value
                        ? "bg-blue/10 text-blue border-blue shadow-sm shadow-blue/10 font-bold"
                        : "bg-surface-2 border-border text-text-muted hover:text-text hover:border-blue/30"
                    )}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[10px] opacity-75">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Adjustments (TDS Modeling) */}
            <Accordion type="single" collapsible className="border-t border-border pt-2">
              <AccordionItem value="adjustments" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2 text-blue">
                    <Settings2 className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">Tax & TDS Adjustments</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div
                    data-input-field="tds-rate"
                    className="p-3.5 rounded-xl border border-border bg-surface-2/40 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <ShieldCheck className={cn("w-4 h-4 flex-shrink-0", applyTds ? "text-emerald-500" : "text-text-muted")} />
                        <div>
                          <label htmlFor="rd-tds-toggle" className="text-xs sm:text-sm font-semibold text-text block cursor-pointer">
                            Model Section 194A TDS
                          </label>
                          <p className="text-[11px] text-text-muted">
                            10% TDS on interest above ₹{isSenior ? "50,000 (80TTB)" : "40,000"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        id="rd-tds-toggle"
                        role="switch"
                        aria-checked={applyTds}
                        onClick={() => setApplyTds(!applyTds)}
                        className={cn(
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue/30",
                          applyTds ? "bg-emerald-600" : "bg-border"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            applyTds ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    {applyTds && (
                      <div className="pt-2 border-t border-border/50">
                        <SliderField
                          label="TDS Rate (%)"
                          id="rd-tds-rate"
                          min={5}
                          max={30}
                          step={1}
                          value={tdsRate}
                          onChange={setTdsRate}
                          format={(v) => `${v}% ${v === 10 ? "(With PAN)" : v === 20 ? "(No PAN)" : ""}`}
                        />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </form>
        }
        output={
          rdResponse.success ? (
            <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
              {/* Machine-readable outputs for automation / agents */}
              <div className="sr-only" aria-hidden="true">
                <output data-result-field="maturity-amount">{rdResponse.data.maturityAmount}</output>
                <output data-result-field="total-invested">{rdResponse.data.totalInvested}</output>
                <output data-result-field="total-interest">{rdResponse.data.totalInterest}</output>
                <output data-result-field="effective-apy">{rdResponse.data.effectiveApy}</output>
                <output data-result-field="tds-amount">{rdResponse.data.tdsAmount}</output>
                <output data-result-field="net-maturity-amount">{rdResponse.data.netMaturityAmount}</output>
              </div>

              {/* Actions Header Row */}
              <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-text truncate">Maturity Projections</h3>
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
                    title={`RD Maturity: ${rdResponse.data.formattedMaturityAmount} from ${formatCurrency(monthly)}/mo @ ${rate}% — KaruviLab`}
                    onQrClick={() => setIsQrOpen(true)}
                  />
                </div>
              </div>

              {/* Main Metric Card */}
              <div className="w-full min-w-0">
                <MetricCard
                  label="Total Maturity Amount"
                  value={rdResponse.data.formattedMaturityAmount}
                  accent
                  className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                  valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                  sub={`From ${rdResponse.data.formattedTotalInvested} total invested over ${years} years`}
                  dataResultField="maturity-amount"
                />
              </div>

              {/* Grid of Supporting Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                <MetricCard
                  label="Total Invested Amount"
                  value={rdResponse.data.formattedTotalInvested}
                  sub={`${formatCurrency(monthly)} × ${rdResponse.data.totalMonths} monthly installments`}
                  dataResultField="total-invested"
                />
                <MetricCard
                  label="Total Interest Earned"
                  value={rdResponse.data.formattedTotalInterest}
                  sub={`+${formatNumber(rdResponse.data.totalInvested > 0 ? (rdResponse.data.totalInterest / rdResponse.data.totalInvested) * 100 : 0)}% return on principal`}
                  className="bg-emerald-500/5 border-emerald-500/20"
                  valueClassName="text-emerald-500 font-bold"
                  dataResultField="total-interest"
                />
                <MetricCard
                  label="Effective Annual APY Yield"
                  value={rdResponse.data.formattedEffectiveApy}
                  sub={`${compounding === 4 ? "Quarterly compounding" : compounding === 12 ? "Monthly compounding" : compounding === 2 ? "Half-yearly compounding" : "Annual compounding"} @ ${rdResponse.data.effectiveInterestRate}% nominal`}
                  dataResultField="effective-apy"
                />
                <MetricCard
                  label="Applied Interest Rate"
                  value={`${rdResponse.data.effectiveInterestRate}% p.a.`}
                  sub={isSenior ? "Base 7.0% + 0.50% Senior Privilege" : "Standard general citizen rate"}
                />
                {applyTds && (
                  <>
                    <MetricCard
                      label="Estimated TDS Deduction"
                      value={rdResponse.data.formattedTdsAmount}
                      sub={rdResponse.data.isTdsApplicable ? `10% TDS above ₹${formatNumber(rdResponse.data.tdsThreshold)} threshold` : `Interest under ₹${formatNumber(rdResponse.data.tdsThreshold)} (No TDS)`}
                      className={rdResponse.data.isTdsApplicable ? "bg-amber-500/5 border-amber-500/20" : ""}
                      valueClassName={rdResponse.data.isTdsApplicable ? "text-amber-500 font-bold" : ""}
                      dataResultField="tds-amount"
                    />
                    <MetricCard
                      label="Net Post-TDS Maturity"
                      value={rdResponse.data.formattedNetMaturityAmount}
                      sub="Take-home proceeds after tax deduction"
                      className="bg-blue/5 border-blue/20"
                      dataResultField="net-maturity-amount"
                    />
                  </>
                )}
              </div>

              {/* Summary Copy Banner */}
              <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-semibold text-text">
                    Maturity Corpus: {rdResponse.data.formattedMaturityAmount}
                  </p>
                  <p className="text-[11px] text-text-muted font-mono truncate">
                    {rdResponse.data.formula}
                  </p>
                </div>
                <CopyButton text={summary} label="Copy Summary" className="bg-surface border border-border" />
              </div>
            </div>
          ) : (
            <div
              role="alert"
              aria-live="assertive"
              data-error-code={rdResponse.error.code}
              data-error-message={rdResponse.error.message}
              className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                    Calculation Error
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {rdResponse.error.message}
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
              toolId="rd-calculator"
              historyLabel={`${formatCurrency(monthly)}/mo for ${years}y @ ${rate}%`}
              historyData={{
                monthly,
                rate,
                years,
                compounding,
                isSenior,
                applyTds,
                tdsRate,
                result: rdResponse.success
                  ? {
                      totalInvested: rdResponse.data.totalInvested,
                      maturityAmount: rdResponse.data.maturityAmount,
                      totalInterest: rdResponse.data.totalInterest,
                      netMaturityAmount: rdResponse.data.netMaturityAmount,
                    }
                  : null,
              }}
              onExport={handleExport}
              showProjection={showTable}
              onToggleProjection={() => setShowTable(!showTable)}
            />

            {showTable && rdResponse.success && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-text">Yearly Trajectory Schedule</h2>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-surface-2 border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        <th className="px-4 py-3">Year</th>
                        <th className="px-4 py-3 text-right">Deposited (Year)</th>
                        <th className="px-4 py-3 text-right">Cumulative Invested</th>
                        <th className="px-4 py-3 text-right">Interest (Year)</th>
                        <th className="px-4 py-3 text-right">Maturity Corpus</th>
                        {applyTds && <th className="px-4 py-3 text-right">Net Post-TDS</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 font-mono">
                      {rdResponse.data.projections.map((row) => (
                        <tr
                          key={row.year}
                          className="hover:bg-surface-2/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-text font-sans font-medium">Year {row.year}</td>
                          <td className="px-4 py-3 text-right text-text-muted">{formatCurrency(row.annualDeposit)}</td>
                          <td className="px-4 py-3 text-right text-text">{formatCurrency(row.cumulativeInvested)}</td>
                          <td className="px-4 py-3 text-right text-emerald-500 font-medium">
                            +{formatCurrency(row.interestEarnedThisYear)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-blue">
                            {formatCurrency(row.maturityValue)}
                          </td>
                          {applyTds && (
                            <td className="px-4 py-3 text-right font-bold text-text">
                              {formatCurrency(row.netMaturityValue)}
                            </td>
                          )}
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
});

export default RDCalculatorClient;
