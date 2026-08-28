"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { useUrlState } from "@/src/hooks/useUrlState";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/src/lib/utils";
import { RotateCcw, AlertCircle, Download, Table, Sparkles } from "lucide-react";
import { exportToCSV } from "@/src/lib/calculator-utils";
import {
  calculateDeterministicInflation,
  formatCurrency,
  formatPercent,
  INFLATION_SECTOR_PRESETS,
  InflationPresetId,
} from "@/src/features/calculators/inflation";

export default function InflationCalculatorClient() {
  const { toast } = useToast();

  const { state, setState, hasParams } = useUrlState({
    defaults: {
      amount: '100000',
      rate: '6',
      years: '10',
      preset: 'general',
      // Legacy params support
      p: '100000',
      r: '6',
      t: '10',
    },
    debounceMs: 350,
  });

  const amount = parseFloat((state.amount as string) || (state.p as string) || '100000') || 100000;
  const rate = parseFloat((state.rate as string) || (state.r as string) || '6') || 0;
  const years = parseFloat((state.years as string) || (state.t as string) || '10') || 10;
  const preset = ((state.preset as string) || 'general') as InflationPresetId;

  const [showTable, setShowTable] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const setAmount = useCallback(
    (a: number) => setState({ amount: String(a), p: String(a) }),
    [setState]
  );

  const setRate = useCallback(
    (r: number) => {
      const match = INFLATION_SECTOR_PRESETS.find((p) => p.rate === r);
      setState({
        rate: String(r),
        r: String(r),
        preset: match ? match.id : 'custom',
      });
    },
    [setState]
  );

  const setYears = useCallback(
    (y: number) => setState({ years: String(y), t: String(y) }),
    [setState]
  );

  const selectPreset = useCallback(
    (presetItem: (typeof INFLATION_SECTOR_PRESETS)[0]) => {
      setState({
        rate: String(presetItem.rate),
        r: String(presetItem.rate),
        preset: presetItem.id,
      });
    },
    [setState]
  );

  const resetAll = useCallback(() => {
    setState({
      amount: '100000',
      rate: '6',
      years: '10',
      preset: 'general',
      p: '100000',
      r: '6',
      t: '10',
    });
  }, [setState]);

  // Pure deterministic calculations
  const inflationResponse = useMemo(() => {
    return calculateDeterministicInflation({
      amount,
      rate,
      years,
      preset,
    });
  }, [amount, rate, years, preset]);

  // Construct canonical share URL
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?amount=${amount}&rate=${rate}&years=${years}${
          preset && preset !== 'custom' ? `&preset=${preset}` : ''
        }`
      : `?amount=${amount}&rate=${rate}&years=${years}`;

  const currentPresetName =
    INFLATION_SECTOR_PRESETS.find((p) => p.id === preset)?.name || 'Custom';

  const summary = inflationResponse.success
    ? `Inflation Calculator Results
--------------------------
Initial Amount / Cost: ${inflationResponse.data.formattedAmount}
Annual Inflation Rate: ${rate}% (${currentPresetName})
Time Horizon: ${years} Years

Future Cost of Goods: ${inflationResponse.data.formattedFutureCost}
Future Purchasing Power: ${inflationResponse.data.formattedPurchasingPower}
Loss of Purchasing Power: ${inflationResponse.data.formattedLossPercent}
Rule of 70 Halving Time: ${inflationResponse.data.formattedHalvingYears}
Cumulative Cost Multiplier: ${inflationResponse.data.inflationMultiplier}x

Calculated via KaruviLab — https://karuvilab.com/calculators/inflation-calculator/`
    : '';

  const handleExport = useCallback(() => {
    if (!inflationResponse.success) return;
    const headers = [
      "Year",
      "Future Cost of Goods (₹)",
      "Purchasing Power (₹)",
      "Loss of Value (%)",
      "Cumulative Inflation Multiplier"
    ];
    const rows = inflationResponse.data.projections.map((p) => [
      p.year,
      p.futureCost,
      p.purchasingPower,
      `${p.purchasingPowerLossPercent}%`,
      `${p.cumulativeInflationMultiplier}x`,
    ]);
    exportToCSV(`inflation-projection-${Date.now()}.csv`, headers, rows);
    toast("Exported yearly inflation projection to CSV");
  }, [inflationResponse, toast]);

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Inflation Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        input={
          <form
            data-tool="inflation-calculator"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 min-w-0 w-full"
          >
            {/* Sector Presets Section */}
            <div className="space-y-2.5" data-input-field="preset">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue" aria-hidden="true" />
                  Sector Inflation Presets
                </label>
                <span className="text-[11px] font-medium text-text-muted">
                  {currentPresetName} ({rate}%)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Sector Inflation Presets">
                {INFLATION_SECTOR_PRESETS.map((p) => {
                  const isSelected = preset === p.id && rate === p.rate;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPreset(p)}
                      aria-pressed={isSelected}
                      className={cn(
                        "p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between",
                        isSelected
                          ? "bg-blue/10 text-text border-blue shadow-sm shadow-blue/10"
                          : "bg-surface-2 border-border text-text-muted hover:text-text hover:border-blue/30"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-text truncate">{p.name}</span>
                        <span className="text-xs font-mono font-bold text-blue">{p.rate}%</span>
                      </div>
                      <span className="text-[10px] text-text-muted line-clamp-1 mt-1">
                        {p.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Initial Amount Input */}
            <div data-input-field="amount">
              <SliderField
                label="Initial Amount / Current Price"
                id="inf-amount"
                min={1000}
                max={10000000}
                step={1000}
                value={amount}
                onChange={setAmount}
                format={(v) => formatCurrency(v)}
              />
            </div>

            {/* Rate & Duration Inputs */}
            <div className="space-y-6">
              <div data-input-field="rate">
                <SliderField
                  label="Annual Inflation Rate (%)"
                  id="inf-rate"
                  min={0.5}
                  max={30}
                  step={0.1}
                  value={rate}
                  onChange={setRate}
                  format={(v) => `${v.toFixed(1)}%`}
                />
              </div>
              <div data-input-field="years">
                <SliderField
                  label="Time Period (Years)"
                  id="inf-years"
                  min={1}
                  max={40}
                  step={1}
                  value={years}
                  onChange={setYears}
                  format={(v) => `${v} yr`}
                />
              </div>
            </div>
          </form>
        }
        output={
          inflationResponse.success ? (
            <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
              {/* Machine-readable outputs for automation / agents */}
              <div className="sr-only" aria-hidden="true">
                <output data-result-field="future-cost">{inflationResponse.data.futureCost}</output>
                <output data-result-field="purchasing-power">{inflationResponse.data.futurePurchasingPower}</output>
                <output data-result-field="loss-percent">{inflationResponse.data.purchasingPowerLossPercent}</output>
                <output data-result-field="halving-time">{inflationResponse.data.halvingYears}</output>
                <output data-result-field="multiplier">{inflationResponse.data.inflationMultiplier}</output>
              </div>

              {/* Actions Header Row */}
              <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-text truncate">
                  Inflation Projections
                </h3>
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
                    title={`Inflation Projection: ₹${amount.toLocaleString('en-IN')} @ ${rate}% over ${years} yrs — KaruviLab`}
                    onQrClick={() => setIsQrOpen(true)}
                  />
                </div>
              </div>

              {/* Dual Primary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0">
                <MetricCard
                  label="Future Cost of Same Goods"
                  value={inflationResponse.data.formattedFutureCost}
                  accent
                  className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                  valueClassName="text-2xl sm:text-4xl text-red-500 leading-tight font-bold font-mono"
                  sub={`What ${inflationResponse.data.formattedAmount} buys today will cost this in ${years} yrs`}
                  dataResultField="future-cost"
                />
                <MetricCard
                  label="Future Purchasing Power"
                  value={inflationResponse.data.formattedPurchasingPower}
                  className="bg-blue/5 border-blue/20 shadow-sm w-full min-w-0"
                  valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                  sub={`What ${inflationResponse.data.formattedAmount} cash will be worth in today's terms`}
                  dataResultField="purchasing-power"
                />
              </div>

              {/* Grid of Supporting Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full min-w-0">
                <MetricCard
                  label="Purchasing Power Loss"
                  value={inflationResponse.data.formattedLossPercent}
                  sub="Proportional real value lost"
                  className="bg-error/5 border-error/20"
                  valueClassName="text-error font-bold"
                  dataResultField="loss-percent"
                />
                <MetricCard
                  label="Rule of 70 Halving Time"
                  value={inflationResponse.data.formattedHalvingYears}
                  sub="Time for buying power to cut in half"
                  dataResultField="halving-time"
                />
                <MetricCard
                  label="Cumulative Price Multiplier"
                  value={`${inflationResponse.data.inflationMultiplier}x`}
                  sub="Overall price index growth"
                  dataResultField="multiplier"
                />
              </div>

              {/* Summary Copy Banner */}
              <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-semibold text-text">
                    Future Price: {inflationResponse.data.formattedFutureCost} | Real Value: {inflationResponse.data.formattedPurchasingPower}
                  </p>
                  <p className="text-[11px] text-text-muted font-mono truncate">
                    {inflationResponse.data.formula}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton text={summary} label="Copy Summary" className="bg-surface border border-border" />
                  <button
                    type="button"
                    onClick={() => setShowTable((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-surface border border-border rounded-xl hover:border-blue hover:text-blue transition-all cursor-pointer"
                    aria-expanded={showTable}
                  >
                    <Table className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{showTable ? "Hide" : "Show"} Yearly Breakdown</span>
                  </button>
                </div>
              </div>

              {/* Year-by-Year Schedule Table */}
              {showTable && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Year-by-Year Inflation Escalation
                    </h4>
                    <button
                      type="button"
                      onClick={handleExport}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue hover:underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      Export CSV
                    </button>
                  </div>
                  <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto w-full max-w-full min-w-0 max-h-72">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-surface-2 border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                          <tr>
                            <th className="px-4 py-3">Year</th>
                            <th className="px-4 py-3 text-right">Future Cost</th>
                            <th className="px-4 py-3 text-right">Purchasing Power</th>
                            <th className="px-4 py-3 text-right">Value Loss</th>
                            <th className="px-4 py-3 text-right">Multiplier</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-border/60 font-mono">
                          {inflationResponse.data.projections.map((row) => (
                            <tr key={row.year} className="hover:bg-surface-2/30 transition-colors">
                              <td className="px-4 py-2.5 font-sans font-bold text-text">Year {row.year}</td>
                              <td className="px-4 py-2.5 text-right font-bold text-red-500">
                                {formatCurrency(row.futureCost)}
                              </td>
                              <td className="px-4 py-2.5 text-right font-bold text-blue">
                                {formatCurrency(row.purchasingPower)}
                              </td>
                              <td className="px-4 py-2.5 text-right text-text-muted">
                                -{formatPercent(row.purchasingPowerLossPercent, 1)}
                              </td>
                              <td className="px-4 py-2.5 text-right text-text-muted">
                                {row.cumulativeInflationMultiplier}x
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              role="alert"
              aria-live="assertive"
              data-error-code={inflationResponse.error.code}
              data-error-message={inflationResponse.error.message}
              className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                    Calculation Error
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {inflationResponse.error.message}
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
