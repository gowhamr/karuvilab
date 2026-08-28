"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { ToolInput } from "@/components/ui/ToolInput";
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
import {
  calculateDeterministicFd,
  formatCurrency,
  formatNumber,
  TenureUnit,
  FdType,
  CompoundingFrequency,
  PayoutFrequency,
} from "@/src/features/calculators/fd";

export default function FDCalculatorClient() {
  const { toast } = useToast();

  const { state, setState, hasParams } = useUrlState({
    defaults: {
      principal: '100000',
      rate: '6.5',
      tenure: '5',
      unit: 'years',
      compounding: '4',
      type: 'cumulative',
      payout_freq: '4',
      senior: '0',
      tds: '1',
      // Legacy parameter fallbacks
      p: '100000',
      r: '6.5',
      t: '5',
    },
    debounceMs: 350,
  });

  const principal = parseFloat((state.principal as string) || (state.p as string) || '100000') || 0;
  const rate = parseFloat((state.rate as string) || (state.r as string) || '6.5') || 0;
  const tenure = parseFloat((state.tenure as string) || (state.t as string) || '5') || 0;
  const tenureUnit = ((state.unit as string) || 'years') as TenureUnit;
  const compounding = (parseInt((state.compounding as string) || '4', 10) || 4) as CompoundingFrequency;
  const fdType = ((state.type as string) || 'cumulative') as FdType;
  const payoutFreq = (parseInt((state.payout_freq as string) || '4', 10) || 4) as PayoutFrequency;
  const isSenior = state.senior === '1' || state.senior === 'true';
  const applyTds = state.tds === '1' || state.tds === 'true' || state.tds === undefined;

  const [showTable, setShowTable] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const setPrincipal = useCallback((p: number) => setState({ principal: String(p), p: String(p) }), [setState]);
  const setRate = useCallback((r: number) => setState({ rate: String(r), r: String(r) }), [setState]);
  const setTenure = useCallback((t: number) => setState({ tenure: String(t), t: String(t) }), [setState]);
  const setTenureUnit = useCallback((unit: TenureUnit) => {
    // Reset or adjust tenure within reasonable bounds when switching unit
    let adjustedTenure = tenure;
    if (unit === 'days' && tenure < 7) adjustedTenure = 365;
    if (unit === 'months' && tenure > 120) adjustedTenure = 60;
    if (unit === 'years' && tenure > 30) adjustedTenure = 5;
    setState({ unit, tenure: String(adjustedTenure) });
  }, [tenure, setState]);
  const setCompounding = useCallback((c: number) => setState({ compounding: String(c) }), [setState]);
  const setFdType = useCallback((t: FdType) => setState({ type: t }), [setState]);
  const setPayoutFreq = useCallback((pf: number) => setState({ payout_freq: String(pf) }), [setState]);
  const setIsSenior = useCallback((s: boolean) => setState({ senior: s ? '1' : '0' }), [setState]);
  const setApplyTds = useCallback((t: boolean) => setState({ tds: t ? '1' : '0' }), [setState]);

  const resetAll = useCallback(() => {
    setState({
      principal: '100000',
      rate: '6.5',
      tenure: '5',
      unit: 'years',
      compounding: '4',
      type: 'cumulative',
      payout_freq: '4',
      senior: '0',
      tds: '1',
      p: '100000',
      r: '6.5',
      t: '5',
    });
  }, [setState]);

  // Pure deterministic calculations
  const fdResponse = useMemo(() => {
    return calculateDeterministicFd({
      principal,
      annualRate: rate,
      tenure,
      tenureUnit,
      compoundingFrequency: compounding,
      fdType,
      payoutFrequency: payoutFreq,
      isSeniorCitizen: isSenior,
      applyTds,
    });
  }, [principal, rate, tenure, tenureUnit, compounding, fdType, payoutFreq, isSenior, applyTds]);

  // Canonical share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?principal=${principal}&rate=${rate}&tenure=${tenure}&unit=${tenureUnit}&compounding=${compounding}${
        fdType !== 'cumulative' ? `&type=${fdType}` : ''
      }${payoutFreq !== 4 ? `&payout_freq=${payoutFreq}` : ''}${
        isSenior ? '&senior=1' : ''
      }${!applyTds ? '&tds=0' : ''}`
    : `?principal=${principal}&rate=${rate}&tenure=${tenure}&unit=${tenureUnit}&compounding=${compounding}`;

  const summary = fdResponse.success
    ? `FD Maturity Summary
------------------
Principal: ${fdResponse.data.formattedPrincipal}
Base Interest Rate: ${rate}% p.a.${isSenior ? ' (+0.50% Senior Citizen Boost = ' + fdResponse.data.effectiveRate + '%)' : ''}
Deposit Type: ${fdType === 'cumulative' ? 'Cumulative (Reinvestment)' : 'Non-Cumulative (Regular Payout)'}
Tenure: ${tenure} ${tenureUnit} (${fdResponse.data.tenureYears} Years)
Compounding: ${fdResponse.data.compoundingLabel}
Effective Annual Yield (APY): ${fdResponse.data.formattedApy}

${fdType === 'cumulative' ? `Gross Maturity Value: ${fdResponse.data.formattedMaturityValue}\nTotal Interest Earned: ${fdResponse.data.formattedTotalInterest}` : `Periodic Payout: ${fdResponse.data.formattedPeriodicPayout}\nTotal Interest: ${fdResponse.data.formattedTotalInterest}\nPrincipal Returned: ${fdResponse.data.formattedPrincipal}`}
${fdResponse.data.isTdsApplicable && applyTds ? `TDS Deducted (10% on >₹${fdResponse.data.tdsThreshold.toLocaleString('en-IN')}): ${fdResponse.data.formattedTotalTds}\nNet Post-TDS Interest: ${fdResponse.data.formattedNetInterest}` : 'TDS: ₹0 (Under threshold or exempt)'}

Calculated via KaruviLab — https://karuvilab.com/calculators/fd-calculator/`
    : '';

  const handleExport = useCallback(() => {
    if (!fdResponse.success) return;
    const headers = [
      "Year",
      "Opening Balance (₹)",
      "Interest Earned (₹)",
      "TDS Deducted (₹)",
      "Net Interest (₹)",
      "Payout / Withdrawal (₹)",
      "Closing Balance (₹)",
      "Cumulative Interest (₹)",
      "Cumulative TDS (₹)"
    ];
    const rows = fdResponse.data.yearlySchedule.map(p => [
      p.year,
      p.openingBalance,
      p.interestEarned,
      p.tdsDeducted,
      p.netInterest,
      p.payoutAmount,
      p.closingBalance,
      p.cumulativeInterest,
      p.cumulativeTds
    ]);
    exportToCSV(`fd-schedule-${Date.now()}.csv`, headers, rows);
    toast("Exported FD amortization schedule to CSV");
  }, [fdResponse, toast]);

  const maxTenure = tenureUnit === 'years' ? 30 : tenureUnit === 'months' ? 120 : 3650;
  const minTenure = tenureUnit === 'days' ? 7 : 1;

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="FD Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        input={
          <form
            data-tool="fd-calculator"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 min-w-0 w-full"
          >
            <div data-input-field="principal">
              <SliderField
                label="Principal Deposit Amount"
                id="fd-principal"
                min={1000}
                max={10000000}
                step={5000}
                value={principal}
                onChange={setPrincipal}
                format={(v) => formatCurrency(v)}
              />
            </div>

            <div data-input-field="interest-rate">
              <SliderField
                label="Annual Interest Rate (%)"
                id="fd-rate"
                min={1}
                max={15}
                step={0.1}
                value={rate}
                onChange={setRate}
                format={(v) => `${v}%`}
              />
            </div>

            <div className="space-y-3" data-input-field="tenure">
              <div className="flex items-center justify-between">
                <label htmlFor="fd-tenure" className="text-sm font-bold text-text-2">Investment Tenure</label>
                <div className="flex gap-1.5" data-input-field="tenure-unit">
                  {(['days', 'months', 'years'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setTenureUnit(u)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        tenureUnit === u
                          ? 'bg-blue text-white shadow-md shadow-blue/10'
                          : 'bg-surface-2 border border-border text-text-muted hover:text-text hover:border-blue/50'
                      }`}
                    >
                      {u.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <SliderField
                label=""
                id="fd-tenure"
                min={minTenure}
                max={maxTenure}
                step={1}
                value={tenure}
                onChange={setTenure}
                format={(v) => `${v} ${tenureUnit}`}
              />
            </div>

            <div className="space-y-2 pt-1" data-input-field="compounding-frequency">
              <label htmlFor="compounding-select" className="text-sm font-bold text-text-2 block">
                Compounding Frequency
              </label>
              <select
                id="compounding-select"
                value={compounding}
                onChange={(e) => setCompounding(Number(e.target.value))}
                className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all text-text font-medium text-sm cursor-pointer"
              >
                <option value={12}>Monthly (12 times/yr)</option>
                <option value={4}>Quarterly (4 times/yr — Standard RBI)</option>
                <option value={2}>Half-Yearly (2 times/yr)</option>
                <option value={1}>Annual (1 time/yr)</option>
              </select>
            </div>

            <Accordion type="single" collapsible className="border-t border-border pt-2">
              <AccordionItem value="advanced-options" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-2 text-blue">
                    <Settings2 className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">Advanced Options & Tax</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-5 pt-3">
                  <div className="space-y-2" data-input-field="deposit-type">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                      Deposit Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFdType('cumulative')}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                          fdType === 'cumulative'
                            ? 'bg-blue/10 border-blue text-blue font-bold shadow-sm'
                            : 'bg-surface-2 border-border text-text-muted hover:text-text'
                        }`}
                      >
                        Cumulative (Reinvest)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFdType('non-cumulative')}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                          fdType === 'non-cumulative'
                            ? 'bg-blue/10 border-blue text-blue font-bold shadow-sm'
                            : 'bg-surface-2 border-border text-text-muted hover:text-text'
                        }`}
                      >
                        Non-Cumulative (Payout)
                      </button>
                    </div>
                  </div>

                  {fdType === 'non-cumulative' && (
                    <div className="space-y-2" data-input-field="payout-frequency">
                      <label htmlFor="payout-freq-select" className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                        Interest Payout Frequency
                      </label>
                      <select
                        id="payout-freq-select"
                        value={payoutFreq}
                        onChange={(e) => setPayoutFreq(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-surface-2 border border-border rounded-xl text-text text-xs font-medium focus:ring-2 focus:ring-blue outline-none"
                      >
                        <option value={12}>Monthly Payout</option>
                        <option value={4}>Quarterly Payout</option>
                        <option value={2}>Half-Yearly Payout</option>
                        <option value={1}>Annual Payout</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border" data-input-field="senior-citizen">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-text">Senior Citizen (+0.50% Boost)</span>
                      </div>
                      <p className="text-[11px] text-text-muted">Ages 60+ get preferential higher interest rate & ₹50k TDS limit</p>
                    </div>
                    <input
                      type="checkbox"
                      id="senior-citizen-toggle"
                      checked={isSenior}
                      onChange={(e) => setIsSenior(e.target.checked)}
                      className="w-4 h-4 rounded text-blue focus:ring-blue cursor-pointer"
                      aria-label="Senior Citizen Rate Boost"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border" data-input-field="tds-deduction">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue" />
                        <span className="text-xs font-bold text-text">Estimate 10% TDS Deduction</span>
                      </div>
                      <p className="text-[11px] text-text-muted">Section 194A threshold: ₹{isSenior ? '50,000' : '40,000'}/yr</p>
                    </div>
                    <input
                      type="checkbox"
                      id="tds-toggle"
                      checked={applyTds}
                      onChange={(e) => setApplyTds(e.target.checked)}
                      className="w-4 h-4 rounded text-blue focus:ring-blue cursor-pointer"
                      aria-label="TDS Deduction"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </form>
        }
        output={
          fdResponse.success ? (
            <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
              {/* Machine-readable outputs for automation and headless agent evaluation */}
              <div className="sr-only" aria-hidden="true">
                <output data-result-field="maturity-value">{fdResponse.data.maturityValue}</output>
                <output data-result-field="total-interest">{fdResponse.data.totalInterest}</output>
                <output data-result-field="net-interest">{fdResponse.data.netInterest}</output>
                <output data-result-field="effective-apy">{fdResponse.data.effectiveAnnualYield}</output>
                <output data-result-field="total-tds">{fdResponse.data.totalTds}</output>
                <output data-result-field="periodic-payout">{fdResponse.data.periodicPayout}</output>
                <output data-result-field="effective-rate">{fdResponse.data.effectiveRate}</output>
              </div>

              {/* Actions Header Row */}
              <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-text truncate">Maturity Breakdown</h3>
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
                    title={`FD Maturity: ${fdResponse.data.formattedMaturityValue} from ${fdResponse.data.formattedPrincipal} @ ${fdResponse.data.effectiveRate}% — KaruviLab`}
                    onQrClick={() => setIsQrOpen(true)}
                  />
                </div>
              </div>

              {/* Main Metric Card */}
              <div className="w-full min-w-0">
                {fdType === 'cumulative' ? (
                  <MetricCard
                    label="Total Maturity Amount"
                    value={fdResponse.data.formattedMaturityValue}
                    accent
                    className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                    valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                    sub={`Principal + Total Interest over ${tenure} ${tenureUnit}`}
                    dataResultField="maturity-value"
                  />
                ) : (
                  <MetricCard
                    label="Periodic Interest Payout"
                    value={fdResponse.data.formattedPeriodicPayout}
                    accent
                    className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                    valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                    sub={`Disbursed every period across ${fdResponse.data.totalPayouts} total payouts`}
                    dataResultField="periodic-payout"
                  />
                )}
              </div>

              {/* Supporting Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                <MetricCard
                  label="Total Interest Earned"
                  value={fdResponse.data.formattedTotalInterest}
                  sub={`At ${fdResponse.data.effectiveRate}% p.a.${isSenior ? ' (Senior Rate)' : ''}`}
                  className="bg-emerald-500/5 border-emerald-500/20"
                  valueClassName="text-emerald-500 font-bold"
                  dataResultField="total-interest"
                />
                <MetricCard
                  label="Effective Annual Yield (APY)"
                  value={fdResponse.data.formattedApy}
                  sub={`Nominal rate: ${fdResponse.data.effectiveRate}% (${fdResponse.data.compoundingLabel} compounding)`}
                  dataResultField="effective-apy"
                />
                <MetricCard
                  label="Principal Invested"
                  value={fdResponse.data.formattedPrincipal}
                  sub={`Tenure: ${fdResponse.data.tenureDisplay}`}
                />
                {applyTds && (
                  <MetricCard
                    label="Estimated TDS Deducted"
                    value={fdResponse.data.formattedTotalTds}
                    sub={
                      fdResponse.data.isTdsApplicable
                        ? `10% TDS (Interest exceeded ₹${fdResponse.data.tdsThreshold.toLocaleString('en-IN')})`
                        : `₹0 (Interest below ₹${fdResponse.data.tdsThreshold.toLocaleString('en-IN')} threshold)`
                    }
                    className={fdResponse.data.isTdsApplicable ? "bg-amber-500/5 border-amber-500/20" : ""}
                    valueClassName={fdResponse.data.isTdsApplicable ? "text-amber-500 font-bold" : ""}
                    dataResultField="total-tds"
                  />
                )}
                {applyTds && fdResponse.data.isTdsApplicable && (
                  <MetricCard
                    label="Net Post-TDS Interest"
                    value={fdResponse.data.formattedNetInterest}
                    sub="Net interest after 10% advance tax withholding"
                    className="bg-blue/5 border-blue/20"
                    dataResultField="net-interest"
                  />
                )}
              </div>

              {/* Mathematical Formula Banner */}
              <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-semibold text-text">
                    Calculation Formula & Engine Spec
                  </p>
                  <p className="text-[11px] text-text-muted font-mono truncate">
                    {fdResponse.data.formula}
                  </p>
                </div>
                <CopyButton text={summary} label="Copy Summary" className="bg-surface border border-border" />
              </div>
            </div>
          ) : (
            <div
              role="alert"
              aria-live="assertive"
              data-error-code={fdResponse.error.code}
              data-error-message={fdResponse.error.message}
              className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                    Calculation Error
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {fdResponse.error.message}
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
              toolId="fd-calculator"
              historyLabel={`${formatCurrency(principal)} for ${tenure} ${tenureUnit}`}
              historyData={{
                principal,
                rate,
                tenure,
                tenureUnit,
                compounding,
                fdType,
                isSenior,
                result: fdResponse.success
                  ? {
                      maturityValue: fdResponse.data.maturityValue,
                      totalInterest: fdResponse.data.totalInterest,
                      netInterest: fdResponse.data.netInterest,
                    }
                  : null,
              }}
              onExport={handleExport}
              showProjection={showTable}
              onToggleProjection={() => setShowTable(!showTable)}
            />

            {showTable && fdResponse.success && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-text">Year-by-Year Schedule</h2>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-surface-2 border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        <th className="px-4 py-3">Year</th>
                        <th className="px-4 py-3 text-right">Opening Bal</th>
                        <th className="px-4 py-3 text-right">Interest</th>
                        {applyTds && <th className="px-4 py-3 text-right">TDS</th>}
                        <th className="px-4 py-3 text-right">{fdType === 'cumulative' ? 'Closing Bal' : 'Payout'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 font-mono">
                      {fdResponse.data.yearlySchedule.map((row) => (
                        <tr
                          key={row.year}
                          className="hover:bg-surface-2/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-text font-sans font-medium">Year {row.year}</td>
                          <td className="px-4 py-3 text-right text-text-muted">{formatCurrency(row.openingBalance)}</td>
                          <td className="px-4 py-3 text-right text-emerald-500 font-medium">
                            +{formatCurrency(row.interestEarned)}
                          </td>
                          {applyTds && (
                            <td className="px-4 py-3 text-right text-amber-500">
                              {row.tdsDeducted > 0 ? `-${formatCurrency(row.tdsDeducted)}` : '₹0'}
                            </td>
                          )}
                          <td className="px-4 py-3 text-right font-bold text-blue">
                            {formatCurrency(fdType === 'cumulative' ? row.closingBalance : row.payoutAmount)}
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
