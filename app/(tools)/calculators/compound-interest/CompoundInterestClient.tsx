"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { useUrlState } from "@/src/hooks/useUrlState";
import { cn } from "@/src/lib/utils";
import { RotateCcw, AlertCircle, TrendingUp, DollarSign } from "lucide-react";
import {
  calculateCompoundInterest,
  CompoundingFrequency,
  formatCurrency,
  formatNumber,
} from "@/src/features/calculators/compound-interest";

const FREQ_OPTIONS = [
  { label: "Annually", value: 1 as CompoundingFrequency },
  { label: "Semi-Annually", value: 2 as CompoundingFrequency },
  { label: "Quarterly", value: 4 as CompoundingFrequency },
  { label: "Monthly", value: 12 as CompoundingFrequency },
  { label: "Daily", value: 365 as CompoundingFrequency },
];

export default function CompoundInterestClient() {
  const { state, setState, hasParams } = useUrlState({
    defaults: {
      principal: '100000',
      rate: '10',
      years: '10',
      freq: '1',
      monthly: '0',
      inflation: '0',
      // Legacy params support
      p: '100000',
      r: '10',
      t: '10',
      n: '1',
    },
    debounceMs: 350,
  });

  const principal = parseFloat((state.principal as string) || (state.p as string) || '100000') || 100000;
  const rate = parseFloat((state.rate as string) || (state.r as string) || '10') || 10;
  const years = parseFloat((state.years as string) || (state.t as string) || '10') || 10;
  const freq = (parseInt((state.freq as string) || (state.n as string) || '1', 10) || 1) as CompoundingFrequency;
  const monthly = parseFloat((state.monthly as string) || '0') || 0;
  const inflation = parseFloat((state.inflation as string) || '0') || 0;

  const [isQrOpen, setIsQrOpen] = useState(false);

  const setPrincipal = useCallback((p: number) => setState({ principal: String(p), p: String(p) }), [setState]);
  const setRate = useCallback((r: number) => setState({ rate: String(r), r: String(r) }), [setState]);
  const setYears = useCallback((y: number) => setState({ years: String(y), t: String(y) }), [setState]);
  const setFreq = useCallback((f: CompoundingFrequency) => setState({ freq: String(f), n: String(f) }), [setState]);
  const setMonthly = useCallback((m: number) => setState({ monthly: String(m) }), [setState]);
  const setInflation = useCallback((inf: number) => setState({ inflation: String(inf) }), [setState]);

  const resetAll = () => {
    setState({
      principal: '100000',
      rate: '10',
      years: '10',
      freq: '1',
      monthly: '0',
      inflation: '0',
      p: '100000',
      r: '10',
      t: '10',
      n: '1',
    });
  };

  // Pure deterministic calculations
  const ciResponse = useMemo(() => {
    return calculateCompoundInterest({
      principal,
      annualRate: rate,
      years,
      frequency: freq,
      monthlyContribution: monthly,
      inflationRate: inflation,
    });
  }, [principal, rate, years, freq, monthly, inflation]);

  // Construct canonical share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?principal=${principal}&rate=${rate}&years=${years}&freq=${freq}${
        monthly > 0 ? `&monthly=${monthly}` : ''
      }${inflation > 0 ? `&inflation=${inflation}` : ''}`
    : `?principal=${principal}&rate=${rate}&years=${years}&freq=${freq}`;

  const summary = ciResponse.success
    ? `Compound Interest Summary\n-------------------------\nPrincipal: ${formatCurrency(principal)}\nAnnual Rate: ${rate}%\nDuration: ${years} Years\nCompounding: ${FREQ_OPTIONS.find((f) => f.value === freq)?.label || 'Annually'}${
        monthly > 0 ? `\nMonthly Contribution: ${formatCurrency(monthly)}` : ''
      }\n\nFuture Value: ${ciResponse.data.formattedFutureValue}\nTotal Principal & Contributions: ${ciResponse.data.formattedTotalInvested}\nTotal Interest Earned: ${ciResponse.data.formattedTotalInterest}\nEffective Annual Rate (APY): ${ciResponse.data.formattedEffectiveRate}\nDoubling Time: ~${ciResponse.data.doublingYears} years${
        inflation > 0 ? `\nInflation-Adjusted Real Value (${inflation}%): ${formatCurrency(ciResponse.data.realFutureValue)}` : ''
      }\n\nCalculated via KaruviLab`
    : '';

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Compound Interest Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        input={
          <form
            data-tool="compound-interest"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 min-w-0 w-full"
          >
            <div data-input-field="principal">
              <SliderField
                id="ci-principal"
                label="Principal Amount"
                min={1000}
                max={10000000}
                step={1000}
                value={principal}
                onChange={setPrincipal}
                format={(v) => formatCurrency(v)}
              />
            </div>

            <div data-input-field="interest-rate">
              <SliderField
                id="ci-rate"
                label="Annual Interest Rate (%)"
                min={0.5}
                max={50}
                step={0.25}
                value={rate}
                onChange={setRate}
                format={(v) => `${v}%`}
              />
            </div>

            <div data-input-field="years">
              <SliderField
                id="ci-years"
                label="Duration (Years)"
                min={1}
                max={50}
                step={1}
                value={years}
                onChange={setYears}
                format={(v) => `${v} yr`}
              />
            </div>

            <div data-input-field="monthly-contribution">
              <SliderField
                id="ci-monthly"
                label="Monthly Contribution (Optional)"
                min={0}
                max={500000}
                step={500}
                value={monthly}
                onChange={setMonthly}
                format={(v) => formatCurrency(v)}
              />
            </div>

            <div data-input-field="inflation-rate">
              <SliderField
                id="ci-inflation"
                label="Expected Inflation Rate (%)"
                min={0}
                max={20}
                step={0.5}
                value={inflation}
                onChange={setInflation}
                format={(v) => `${v}%`}
              />
            </div>

            <div className="space-y-2" data-input-field="compounding-frequency">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Compounding Frequency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-label="Compounding Frequency">
                {FREQ_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFreq(opt.value)}
                    aria-pressed={freq === opt.value}
                    className={cn(
                      "py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer",
                      freq === opt.value
                        ? "bg-blue text-white border-blue shadow-sm shadow-blue/20"
                        : "bg-surface-2 border-border text-text-muted hover:text-text hover:border-blue/30"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        }
        output={
          ciResponse.success ? (
            <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
              {/* Machine-readable outputs for automation / agents */}
              <div className="sr-only" aria-hidden="true">
                <output data-result-field="future-value">{ciResponse.data.futureValue}</output>
                <output data-result-field="total-principal">{ciResponse.data.totalPrincipal}</output>
                <output data-result-field="total-contributions">{ciResponse.data.totalContributions}</output>
                <output data-result-field="total-interest">{ciResponse.data.totalInterest}</output>
                <output data-result-field="effective-rate">{ciResponse.data.effectiveAnnualRate}</output>
                <output data-result-field="real-future-value">{ciResponse.data.realFutureValue}</output>
                <output data-result-field="doubling-time">{ciResponse.data.doublingYears}</output>
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
                    title={`Compound Interest: ${ciResponse.data.formattedFutureValue} from ${formatCurrency(principal)} @ ${rate}% — KaruviLab`}
                    onQrClick={() => setIsQrOpen(true)}
                  />
                </div>
              </div>

              {/* Main Metric Card */}
              <div className="w-full min-w-0">
                <MetricCard
                  label="Total Future Maturity Value"
                  value={ciResponse.data.formattedFutureValue}
                  accent
                  className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                  valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                  sub={`From ${ciResponse.data.formattedTotalInvested} total invested over ${years} years`}
                  dataResultField="future-value"
                />
              </div>

              {/* Grid of Supporting Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                <MetricCard
                  label="Total Interest Earned"
                  value={ciResponse.data.formattedTotalInterest}
                  sub={`+${formatNumber((ciResponse.data.totalInterest / (ciResponse.data.totalInvested || 1)) * 100)}% on total invested`}
                  className="bg-emerald-500/5 border-emerald-500/20"
                  valueClassName="text-emerald-500 font-bold"
                  dataResultField="total-interest"
                />
                <MetricCard
                  label="Total Principal & Deposits"
                  value={ciResponse.data.formattedTotalInvested}
                  sub={monthly > 0 ? `Principal: ${formatCurrency(principal)} + ${formatCurrency(ciResponse.data.totalContributions)} SIP` : 'Initial principal'}
                  dataResultField="total-invested"
                />
                <MetricCard
                  label="Effective Annual Rate (APY)"
                  value={ciResponse.data.formattedEffectiveRate}
                  sub={`Nominal rate: ${rate}% p.a.`}
                  dataResultField="effective-rate"
                />
                <MetricCard
                  label="Rule of 72 Doubling Time"
                  value={`~${ciResponse.data.doublingYears} Years`}
                  sub="Time needed to 2x balance"
                  dataResultField="doubling-time"
                />
                {inflation > 0 && (
                  <MetricCard
                    label="Inflation-Adjusted Real Value"
                    value={formatCurrency(ciResponse.data.realFutureValue)}
                    sub={`Purchasing power at ${inflation}% inflation`}
                    className="sm:col-span-2 bg-amber-500/5 border-amber-500/20"
                    dataResultField="real-future-value"
                  />
                )}
              </div>

              {/* Summary Copy Banner */}
              <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-semibold text-text">
                    Future Value: {ciResponse.data.formattedFutureValue}
                  </p>
                  <p className="text-[11px] text-text-muted font-mono truncate">
                    {ciResponse.data.formula}
                  </p>
                </div>
                <CopyButton text={summary} label="Copy Summary" className="bg-surface border border-border" />
              </div>

              {/* Year-by-Year Schedule Table */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted px-1">
                  Year-by-Year Wealth Trajectory
                </h4>
                <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto w-full max-w-full min-w-0 max-h-72">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-surface-2 border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        <tr>
                          <th className="px-4 py-3">Year</th>
                          <th className="px-4 py-3">Opening</th>
                          <th className="px-4 py-3">Deposits</th>
                          <th className="px-4 py-3">Interest</th>
                          <th className="px-4 py-3">Ending Balance</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-border/60">
                        {ciResponse.data.projections.map((p) => (
                          <tr key={p.year} className="hover:bg-surface-2/30 transition-colors">
                            <td className="px-4 py-2.5 font-bold text-text">Yr {p.year}</td>
                            <td className="px-4 py-2.5 font-mono text-text-muted">{formatCurrency(p.startingBalance)}</td>
                            <td className="px-4 py-2.5 font-mono text-text-muted">{formatCurrency(p.contributions)}</td>
                            <td className="px-4 py-2.5 font-mono text-emerald-500 font-medium">+{formatCurrency(p.interestEarned)}</td>
                            <td className="px-4 py-2.5 font-mono font-bold text-text">{formatCurrency(p.endingBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              role="alert"
              aria-live="assertive"
              data-error-code={ciResponse.error.code}
              data-error-message={ciResponse.error.message}
              className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                    Calculation Error
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {ciResponse.error.message}
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
      />
    </div>
  );
}
