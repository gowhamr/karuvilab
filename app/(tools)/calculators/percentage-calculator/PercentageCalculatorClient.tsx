"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { useUrlState } from "@/src/hooks/useUrlState";
import { cn } from "@/src/lib/utils";
import {
  Percent,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ArrowRightLeft,
} from "lucide-react";
import {
  calculatePercentageOf,
  calculateWhatPercentage,
  calculatePercentageChange,
  calculateReversePercentage,
  PercentageCalculatorMode,
  formatNumber,
} from "@/src/features/calculators/percentage";

export default function PercentageCalculatorClient() {
  const { state, setState, hasParams } = useUrlState({
    defaults: {
      mode: 'pct_of',
      pct: '20',
      total: '500',
      part: '80',
      from: '200',
      to: '250',
      final: '120',
      type: 'increase',
    },
    debounceMs: 350,
  });

  const mode = (['pct_of', 'what_pct', 'change', 'reverse'].includes(state.mode as string)
    ? state.mode
    : 'pct_of') as PercentageCalculatorMode;

  const pctStr = (state.pct as string) || '20';
  const totalStr = (state.total as string) || '500';
  const partStr = (state.part as string) || '80';
  const fromStr = (state.from as string) || '200';
  const toStr = (state.to as string) || '250';
  const finalStr = (state.final as string) || '120';
  const changeType = (state.type as string) === 'decrease' ? 'decrease' : 'increase';

  const [isQrOpen, setIsQrOpen] = useState(false);

  // Setters
  const setMode = useCallback((m: PercentageCalculatorMode) => setState({ mode: m }), [setState]);
  const setPctStr = useCallback((v: string) => setState({ pct: v }), [setState]);
  const setTotalStr = useCallback((v: string) => setState({ total: v }), [setState]);
  const setPartStr = useCallback((v: string) => setState({ part: v }), [setState]);
  const setFromStr = useCallback((v: string) => setState({ from: v }), [setState]);
  const setToStr = useCallback((v: string) => setState({ to: v }), [setState]);
  const setFinalStr = useCallback((v: string) => setState({ final: v }), [setState]);
  const setChangeType = useCallback((v: 'increase' | 'decrease') => setState({ type: v }), [setState]);

  const swapChangeValues = () => {
    setState({ from: toStr, to: fromStr });
  };

  const resetAll = () => {
    setState({
      mode: 'pct_of',
      pct: '20',
      total: '500',
      part: '80',
      from: '200',
      to: '250',
      final: '120',
      type: 'increase',
    });
  };

  // Pure deterministic calculations
  const pctOfResponse = useMemo(() => {
    return calculatePercentageOf({
      percentage: parseFloat(pctStr) || 0,
      total: parseFloat(totalStr) || 0,
    });
  }, [pctStr, totalStr]);

  const whatPctResponse = useMemo(() => {
    return calculateWhatPercentage({
      part: parseFloat(partStr) || 0,
      total: parseFloat(totalStr) || 0,
    });
  }, [partStr, totalStr]);

  const changeResponse = useMemo(() => {
    return calculatePercentageChange({
      fromValue: parseFloat(fromStr) || 0,
      toValue: parseFloat(toStr) || 0,
    });
  }, [fromStr, toStr]);

  const reverseResponse = useMemo(() => {
    return calculateReversePercentage({
      finalValue: parseFloat(finalStr) || 0,
      percentage: parseFloat(pctStr) || 0,
      type: changeType,
    });
  }, [finalStr, pctStr, changeType]);

  // Construct canonical share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?mode=${mode}&pct=${encodeURIComponent(
        pctStr
      )}&total=${encodeURIComponent(totalStr)}&part=${encodeURIComponent(
        partStr
      )}&from=${encodeURIComponent(fromStr)}&to=${encodeURIComponent(
        toStr
      )}&final=${encodeURIComponent(finalStr)}&type=${changeType}`
    : `?mode=${mode}&pct=${encodeURIComponent(pctStr)}&total=${encodeURIComponent(totalStr)}`;

  // Summary Strings for copying
  const pctOfSummary = pctOfResponse.success
    ? `Percentage of Value\n-------------------\n${pctStr}% of ${totalStr} = ${pctOfResponse.data.formattedResult}\nFormula: ${pctOfResponse.data.formula}\n\nCalculated via KaruviLab`
    : '';

  const whatPctSummary = whatPctResponse.success
    ? `What Percentage\n---------------\n${partStr} is ${whatPctResponse.data.formattedPercentage} of ${totalStr}\nFormula: ${whatPctResponse.data.formula}\n\nCalculated via KaruviLab`
    : '';

  const changeSummary = changeResponse.success
    ? `Percentage Change\n-----------------\nFrom ${fromStr} to ${toStr} = ${changeResponse.data.formattedPercentage} (${changeResponse.data.changeType})\nAbsolute Change: ${formatNumber(changeResponse.data.absoluteChange)}\nMultiplier: ${formatNumber(changeResponse.data.multiplier)}x\n\nCalculated via KaruviLab`
    : '';

  const reverseSummary = reverseResponse.success
    ? `Reverse Percentage\n------------------\nFinal Value: ${finalStr}\nAdjustment: ${pctStr}% ${changeType}\nOriginal Value: ${reverseResponse.data.formattedOriginalValue}\nFormula: ${reverseResponse.data.formula}\n\nCalculated via KaruviLab`
    : '';

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Percentage Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        tabs={{
          options: [
            { id: 'pct_of', label: 'What is X% of Y?' },
            { id: 'what_pct', label: 'X is What % of Y?' },
            { id: 'change', label: '% Change (Increase/Decrease)' },
            { id: 'reverse', label: 'Reverse Percentage' },
          ],
          activeId: mode,
          onChange: (id) => setMode(id as PercentageCalculatorMode),
        }}
        layout="split"
        input={
          <form
            data-tool="percentage-calculator"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5 sm:space-y-6 min-w-0 w-full"
          >
            {mode === 'pct_of' && (
              <div className="space-y-4 sm:space-y-5 min-w-0 w-full">
                <div className="space-y-1.5">
                  <label htmlFor="pct-calc-pct" className="text-xs font-bold text-text uppercase tracking-wider">
                    Percentage (%)
                  </label>
                  <input
                    id="pct-calc-pct"
                    name="pct"
                    data-input-field="percentage"
                    type="number"
                    step="any"
                    value={pctStr}
                    onChange={(e) => setPctStr(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-base focus:outline-none focus:border-blue shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="pct-calc-total" className="text-xs font-bold text-text uppercase tracking-wider">
                    Total Value (Y)
                  </label>
                  <input
                    id="pct-calc-total"
                    name="total"
                    data-input-field="total"
                    type="number"
                    step="any"
                    value={totalStr}
                    onChange={(e) => setTotalStr(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-base focus:outline-none focus:border-blue shadow-sm"
                  />
                </div>
              </div>
            )}

            {mode === 'what_pct' && (
              <div className="space-y-4 sm:space-y-5 min-w-0 w-full">
                <div className="space-y-1.5">
                  <label htmlFor="pct-calc-part" className="text-xs font-bold text-text uppercase tracking-wider">
                    Part Value (X)
                  </label>
                  <input
                    id="pct-calc-part"
                    name="part"
                    data-input-field="part"
                    type="number"
                    step="any"
                    value={partStr}
                    onChange={(e) => setPartStr(e.target.value)}
                    placeholder="e.g. 80"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-base focus:outline-none focus:border-blue shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="pct-calc-total2" className="text-xs font-bold text-text uppercase tracking-wider">
                    Total Base (Y)
                  </label>
                  <input
                    id="pct-calc-total2"
                    name="total"
                    data-input-field="total"
                    type="number"
                    step="any"
                    value={totalStr}
                    onChange={(e) => setTotalStr(e.target.value)}
                    placeholder="e.g. 400"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-base focus:outline-none focus:border-blue shadow-sm"
                  />
                </div>
              </div>
            )}

            {mode === 'change' && (
              <div className="space-y-4 sm:space-y-5 min-w-0 w-full">
                <div className="space-y-1.5">
                  <label htmlFor="pct-calc-from" className="text-xs font-bold text-text uppercase tracking-wider">
                    Original Value (From)
                  </label>
                  <input
                    id="pct-calc-from"
                    name="from"
                    data-input-field="from-value"
                    type="number"
                    step="any"
                    value={fromStr}
                    onChange={(e) => setFromStr(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-base focus:outline-none focus:border-blue shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-center -my-1">
                  <button
                    type="button"
                    onClick={swapChangeValues}
                    className="p-2 rounded-xl bg-surface-2 border border-border text-text-muted hover:text-blue hover:border-blue/30 transition-all cursor-pointer shadow-xs"
                    title="Swap From and To values"
                    aria-label="Swap From and To values"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="pct-calc-to" className="text-xs font-bold text-text uppercase tracking-wider">
                    New Value (To)
                  </label>
                  <input
                    id="pct-calc-to"
                    name="to"
                    data-input-field="to-value"
                    type="number"
                    step="any"
                    value={toStr}
                    onChange={(e) => setToStr(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-base focus:outline-none focus:border-blue shadow-sm"
                  />
                </div>
              </div>
            )}

            {mode === 'reverse' && (
              <div className="space-y-4 sm:space-y-5 min-w-0 w-full">
                <div className="space-y-1.5">
                  <label htmlFor="pct-calc-final" className="text-xs font-bold text-text uppercase tracking-wider">
                    Final Adjusted Value
                  </label>
                  <input
                    id="pct-calc-final"
                    name="final"
                    data-input-field="final-value"
                    type="number"
                    step="any"
                    value={finalStr}
                    onChange={(e) => setFinalStr(e.target.value)}
                    placeholder="e.g. 120"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-base focus:outline-none focus:border-blue shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Adjustment Type
                  </label>
                  <div className="grid grid-cols-2 gap-2" role="group" aria-label="Adjustment Type">
                    {(['increase', 'decrease'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setChangeType(t)}
                        data-input-field="change-type"
                        className={cn(
                          "flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer",
                          changeType === t
                            ? "bg-blue border-blue text-white shadow-sm shadow-blue/20"
                            : "bg-surface-2 border-border text-text-muted hover:text-text hover:border-blue/30"
                        )}
                      >
                        {t === 'increase' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {t === 'increase' ? 'Markup (+)' : 'Discount (-)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="pct-calc-rate" className="text-xs font-bold text-text uppercase tracking-wider">
                    Percentage Rate (%)
                  </label>
                  <input
                    id="pct-calc-rate"
                    name="pct"
                    data-input-field="percentage"
                    type="number"
                    step="any"
                    value={pctStr}
                    onChange={(e) => setPctStr(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-mono text-base focus:outline-none focus:border-blue shadow-sm"
                  />
                </div>
              </div>
            )}
          </form>
        }
        output={
          mode === 'pct_of' ? (
            pctOfResponse.success ? (
              <div className="space-y-5 sm:space-y-6 min-w-0 w-full">
                {/* Machine-readable outputs for automation / agents */}
                <div className="sr-only" aria-hidden="true">
                  <output data-result-field="result-value">{pctOfResponse.data.result}</output>
                  <output data-result-field="percentage">{pctOfResponse.data.percentage}</output>
                  <output data-result-field="total">{pctOfResponse.data.total}</output>
                </div>

                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Percentage Result</h3>
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
                      title={`${pctStr}% of ${totalStr} = ${pctOfResponse.data.formattedResult} — KaruviLab`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                <div className="w-full min-w-0">
                  <MetricCard
                    label="Calculated Result"
                    value={pctOfResponse.data.formattedResult}
                    accent
                    className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                    valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                    sub={`${pctStr}% of ${totalStr}`}
                    dataResultField="result-value"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full min-w-0">
                  <MetricCard
                    label="Fraction Equivalent"
                    value={formatNumber(pctOfResponse.data.fraction, 4)}
                    sub="Base 1.0"
                    dataResultField="fraction"
                  />
                  <MetricCard
                    label="Formula"
                    value={`(${pctStr} / 100) × ${totalStr}`}
                    sub="Mathematical step"
                    dataResultField="formula"
                  />
                </div>

                <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-text">
                      {pctStr}% of {totalStr} = {pctOfResponse.data.formattedResult}
                    </p>
                    <p className="text-[11px] text-text-muted font-mono">
                      {pctOfResponse.data.formula}
                    </p>
                  </div>
                  <CopyButton text={pctOfSummary} label="Copy Summary" className="bg-surface border border-border" />
                </div>
              </div>
            ) : (
              <div
                role="alert"
                aria-live="assertive"
                data-error-code={pctOfResponse.error.code}
                data-error-message={pctOfResponse.error.message}
                className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                      Calculation Error
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {pctOfResponse.error.message}
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
          ) : mode === 'what_pct' ? (
            whatPctResponse.success ? (
              <div className="space-y-5 sm:space-y-6 min-w-0 w-full">
                {/* Machine-readable outputs */}
                <div className="sr-only" aria-hidden="true">
                  <output data-result-field="percentage-value">{whatPctResponse.data.percentage}</output>
                  <output data-result-field="part">{whatPctResponse.data.part}</output>
                  <output data-result-field="total">{whatPctResponse.data.total}</output>
                </div>

                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Percentage Share</h3>
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
                      title={`${partStr} is ${whatPctResponse.data.formattedPercentage} of ${totalStr} — KaruviLab`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                <div className="w-full min-w-0">
                  <MetricCard
                    label="Proportional Percentage"
                    value={whatPctResponse.data.formattedPercentage}
                    accent
                    className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                    valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                    sub={`${partStr} out of ${totalStr}`}
                    dataResultField="percentage-value"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full min-w-0">
                  <MetricCard
                    label="Decimal Ratio"
                    value={formatNumber(whatPctResponse.data.fraction, 4)}
                    sub="Part / Total"
                    dataResultField="fraction"
                  />
                  <MetricCard
                    label="Formula"
                    value={`(${partStr} / ${totalStr}) × 100`}
                    sub="Ratio calculation"
                    dataResultField="formula"
                  />
                </div>

                <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-text">
                      {partStr} is {whatPctResponse.data.formattedPercentage} of {totalStr}
                    </p>
                    <p className="text-[11px] text-text-muted font-mono">
                      {whatPctResponse.data.formula}
                    </p>
                  </div>
                  <CopyButton text={whatPctSummary} label="Copy Summary" className="bg-surface border border-border" />
                </div>
              </div>
            ) : (
              <div
                role="alert"
                aria-live="assertive"
                data-error-code={whatPctResponse.error.code}
                data-error-message={whatPctResponse.error.message}
                className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                      Calculation Error
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {whatPctResponse.error.message}
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
          ) : mode === 'change' ? (
            changeResponse.success ? (
              <div className="space-y-5 sm:space-y-6 min-w-0 w-full">
                {/* Machine-readable outputs */}
                <div className="sr-only" aria-hidden="true">
                  <output data-result-field="percentage-change">{changeResponse.data.percentageChange}</output>
                  <output data-result-field="absolute-change">{changeResponse.data.absoluteChange}</output>
                  <output data-result-field="change-type">{changeResponse.data.changeType}</output>
                  <output data-result-field="multiplier">{changeResponse.data.multiplier}</output>
                </div>

                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Percentage Change</h3>
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
                      title={`Percentage Change: ${changeResponse.data.formattedPercentage} (${fromStr} → ${toStr}) — KaruviLab`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                <div className="w-full min-w-0">
                  <MetricCard
                    label={changeResponse.data.changeType === 'increase' ? 'Percentage Increase' : changeResponse.data.changeType === 'decrease' ? 'Percentage Decrease' : 'No Change'}
                    value={changeResponse.data.formattedPercentage}
                    accent
                    className={cn(
                      "shadow-sm w-full min-w-0",
                      changeResponse.data.changeType === 'increase' ? "bg-emerald-500/5 border-emerald-500/20" : changeResponse.data.changeType === 'decrease' ? "bg-rose-500/5 border-rose-500/20" : "bg-primary/5 border-primary/20"
                    )}
                    valueClassName={cn(
                      "text-2xl sm:text-4xl leading-tight font-bold font-mono",
                      changeResponse.data.changeType === 'increase' ? "text-emerald-500" : changeResponse.data.changeType === 'decrease' ? "text-rose-500" : "text-blue"
                    )}
                    sub={`Shift from ${fromStr} to ${toStr}`}
                    dataResultField="percentage-change"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full min-w-0">
                  <MetricCard
                    label="Absolute Difference"
                    value={formatNumber(changeResponse.data.absoluteChange)}
                    sub={`|${toStr} - ${fromStr}|`}
                    dataResultField="absolute-change"
                  />
                  <MetricCard
                    label="Growth Multiplier"
                    value={`${formatNumber(changeResponse.data.multiplier, 4)}x`}
                    sub="Ratio (To / From)"
                    dataResultField="multiplier"
                  />
                </div>

                <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-text">
                      From {fromStr} to {toStr} is a {changeResponse.data.formattedPercentage} {changeResponse.data.changeType}
                    </p>
                    <p className="text-[11px] text-text-muted font-mono">
                      {changeResponse.data.formula}
                    </p>
                  </div>
                  <CopyButton text={changeSummary} label="Copy Summary" className="bg-surface border border-border" />
                </div>
              </div>
            ) : (
              <div
                role="alert"
                aria-live="assertive"
                data-error-code={changeResponse.error.code}
                data-error-message={changeResponse.error.message}
                className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                      Calculation Error
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {changeResponse.error.message}
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
          ) : (
            reverseResponse.success ? (
              <div className="space-y-5 sm:space-y-6 min-w-0 w-full">
                {/* Machine-readable outputs */}
                <div className="sr-only" aria-hidden="true">
                  <output data-result-field="original-value">{reverseResponse.data.originalValue}</output>
                  <output data-result-field="difference">{reverseResponse.data.difference}</output>
                </div>

                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Original Base Value</h3>
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
                      title={`Original Value: ${reverseResponse.data.formattedOriginalValue} (before ${pctStr}% ${changeType}) — KaruviLab`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                <div className="w-full min-w-0">
                  <MetricCard
                    label="Original Pre-Adjustment Value"
                    value={reverseResponse.data.formattedOriginalValue}
                    accent
                    className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                    valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                    sub={`Before ${pctStr}% ${changeType}`}
                    dataResultField="original-value"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full min-w-0">
                  <MetricCard
                    label="Adjustment Amount"
                    value={formatNumber(Math.abs(reverseResponse.data.difference))}
                    sub={reverseResponse.data.difference >= 0 ? 'Added markup' : 'Subtracted discount'}
                    dataResultField="adjustment-amount"
                  />
                  <MetricCard
                    label="Formula"
                    value={changeType === 'increase' ? `${finalStr} / (1 + ${pctStr}/100)` : `${finalStr} / (1 - ${pctStr}/100)`}
                    sub="Reversal step"
                    dataResultField="formula"
                  />
                </div>

                <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-text">
                      Original Value: {reverseResponse.data.formattedOriginalValue}
                    </p>
                    <p className="text-[11px] text-text-muted font-mono">
                      {reverseResponse.data.formula}
                    </p>
                  </div>
                  <CopyButton text={reverseSummary} label="Copy Summary" className="bg-surface border border-border" />
                </div>
              </div>
            ) : (
              <div
                role="alert"
                aria-live="assertive"
                data-error-code={reverseResponse.error.code}
                data-error-message={reverseResponse.error.message}
                className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                      Calculation Error
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {reverseResponse.error.message}
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
          )
        }
      />
    </div>
  );
}
