"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { useUrlState } from "@/src/hooks/useUrlState";
import { cn } from "@/src/lib/utils";
import { RotateCcw, AlertCircle, ArrowRightLeft, Info, Receipt, ShieldCheck } from "lucide-react";
import {
  calculateGst,
  GstCalculationType,
  GST_RATE_SLABS,
  formatCurrency,
  formatPercent,
} from "@/src/features/calculators/gst";

export default function GSTCalculatorClient() {
  const { state, setState, hasParams } = useUrlState({
    defaults: {
      amount: '10000',
      rate: '18',
      type: 'exclusive',
      interstate: 'false',
      // Legacy fallback support
      mode: 'exclusive',
      gstRate: '18',
      isInterstate: 'false',
    },
    debounceMs: 350,
  });

  const rawType = (state.type as string) || (state.mode as string) || 'exclusive';
  const type: GstCalculationType = rawType === 'inclusive' || rawType === 'remove' ? 'inclusive' : 'exclusive';

  const amountStr = (state.amount as string) || '10000';
  const parsedRate = parseFloat((state.rate as string) || (state.gstRate as string) || '18');
  const rateVal = isNaN(parsedRate) ? 18 : parsedRate;
  const isInterstate = state.interstate === 'true' || state.interstate === '1' || state.isInterstate === 'true' || state.isInterstate === '1';

  const [isQrOpen, setIsQrOpen] = useState(false);

  const setType = useCallback((t: GstCalculationType) => setState({ type: t, mode: t }), [setState]);
  const setAmountStr = useCallback((a: string) => setState({ amount: a }), [setState]);
  const setRateVal = useCallback((r: number) => setState({ rate: String(r), gstRate: String(r) }), [setState]);
  const toggleInterstate = useCallback(() => {
    setState({
      interstate: isInterstate ? 'false' : 'true',
      isInterstate: isInterstate ? 'false' : 'true',
    });
  }, [isInterstate, setState]);

  const resetAll = () => {
    setState({
      amount: '10000',
      rate: '18',
      type: 'exclusive',
      interstate: 'false',
      mode: 'exclusive',
      gstRate: '18',
      isInterstate: 'false',
    });
  };

  // Pure deterministic calculations
  const gstResponse = useMemo(() => {
    const numericAmount = parseFloat(amountStr);
    return calculateGst({
      amount: isNaN(numericAmount) ? 0 : numericAmount,
      gstRatePercent: rateVal,
      type,
      isInterstate,
    });
  }, [amountStr, rateVal, type, isInterstate]);

  // Construct canonical share URL (?amount=10000&rate=18&type=exclusive&interstate=false)
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?amount=${encodeURIComponent(amountStr)}&rate=${rateVal}&type=${type}&interstate=${isInterstate}`
    : `?amount=${encodeURIComponent(amountStr)}&rate=${rateVal}&type=${type}&interstate=${isInterstate}`;

  const summary = gstResponse.success
    ? `GST Tax Invoice Calculation (${rateVal}% ${type === "exclusive" ? "Exclusive / Added" : "Inclusive / Extracted"})\n------------------------------------------------\nNet Base Amount: ${gstResponse.data.formattedNetBaseAmount}\nTotal GST Tax (${rateVal}%): ${gstResponse.data.formattedGstAmount}\n${
        isInterstate
          ? `Integrated Tax (IGST): ${gstResponse.data.taxBreakdown.formattedIgst}`
          : `Central Tax (CGST ${rateVal / 2}%): ${gstResponse.data.taxBreakdown.formattedCgst}\nState Tax (SGST ${rateVal / 2}%): ${gstResponse.data.taxBreakdown.formattedSgst}`
      }\nTotal Gross Payable: ${gstResponse.data.formattedTotalGrossAmount}\n\nCalculated via KaruviLab (Offline & Deterministic)`
    : '';

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="GST Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        tabs={{
          options: [
            { id: "exclusive", label: "Add GST (Exclusive)" },
            { id: "inclusive", label: "Remove GST (Inclusive)" },
          ],
          activeId: type,
          onChange: (id) => setType(id as GstCalculationType),
        }}
        input={
          <form
            data-tool="gst-calculator"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 min-w-0 w-full"
          >
            <div className="space-y-5 min-w-0 w-full">
              <div data-input-field="amount">
                <ToolInput
                  label={type === "exclusive" ? "Net Base Amount (₹)" : "Gross Total / MRP (₹)"}
                  id="gst-amount"
                  type="number"
                  placeholder="e.g. 10000"
                  value={amountStr}
                  onChange={setAmountStr}
                  description={type === "exclusive" ? "Pre-tax quote" : "Tax-inclusive total"}
                />
              </div>

              <div data-input-field="rate" className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="gst-rate-slider" className="text-sm font-bold text-text-2">
                    GST Rate Slab
                  </label>
                  <span className="text-xs font-bold text-blue bg-blue/10 px-2.5 py-1 rounded-full">
                    {rateVal}% Selected
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {GST_RATE_SLABS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRateVal(r)}
                      aria-pressed={rateVal === r}
                      className={cn(
                        "py-3 rounded-2xl text-xs font-black transition-all cursor-pointer min-h-[44px]",
                        rateVal === r
                          ? "bg-blue text-white shadow-md shadow-blue/20"
                          : "bg-surface-2 border border-border text-text-muted hover:border-blue/50 hover:text-blue"
                      )}
                    >
                      {r}%
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <SliderField
                    label="Custom Tax Rate (%)"
                    id="gst-rate-slider"
                    min={0}
                    max={50}
                    step={0.25}
                    value={rateVal}
                    onChange={setRateVal}
                    format={(v) => `${v}%`}
                  />
                </div>
              </div>

              <div
                data-input-field="interstate"
                className="p-4 bg-surface-2/60 border border-border rounded-2xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                    <ArrowRightLeft className="w-5 h-5 text-blue" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-text truncate">Interstate Supply (IGST)</p>
                    <p className="text-[11px] text-text-muted">
                      {isInterstate ? "Single Integrated Tax (100% IGST)" : "Intrastate Split (50% CGST + 50% SGST)"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isInterstate}
                  onClick={toggleInterstate}
                  aria-label="Toggle Interstate Supply (IGST)"
                  className={cn(
                    "w-12 h-7 rounded-full transition-colors relative cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue",
                    isInterstate ? "bg-blue" : "bg-border"
                  )}
                >
                  <span
                    className={cn(
                      "block w-5 h-5 bg-white rounded-full transition-transform transform shadow-sm absolute top-1",
                      isInterstate ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>
          </form>
        }
        output={
          gstResponse.success ? (
            <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
              {/* Machine-readable outputs for deterministic contract */}
              <div className="sr-only" aria-hidden="true">
                <output data-result-field="net-amount">{gstResponse.data.netBaseAmount}</output>
                <output data-result-field="gst-amount">{gstResponse.data.gstAmount}</output>
                <output data-result-field="total-amount">{gstResponse.data.totalGrossAmount}</output>
                <output data-result-field="cgst-amount">{gstResponse.data.taxBreakdown.cgst}</output>
                <output data-result-field="sgst-amount">{gstResponse.data.taxBreakdown.sgst}</output>
                <output data-result-field="igst-amount">{gstResponse.data.taxBreakdown.igst}</output>
              </div>

              <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-text truncate">
                  {type === "exclusive" ? "Tax Addition Summary" : "Reverse Tax Breakdown"}
                </h3>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="flex items-center justify-center gap-1.5 bg-surface-2 border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-text-muted hover:text-text transition-colors cursor-pointer whitespace-nowrap min-h-[40px]"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Reset</span>
                  </button>
                  <ShareButton
                    url={shareUrl}
                    title={`${gstResponse.data.formattedTotalGrossAmount} (${rateVal}% GST) — GST Calculator`}
                    onQrClick={() => setIsQrOpen(true)}
                  />
                </div>
              </div>

              {/* Primary Metric */}
              <div className="w-full min-w-0">
                <MetricCard
                  label="Total Gross Amount"
                  value={gstResponse.data.formattedTotalGrossAmount}
                  accent
                  className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                  valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                  sub={type === "exclusive" ? `Includes ${gstResponse.data.formattedGstAmount} total tax (${rateVal}%)` : `Gross inclusive invoice total`}
                  dataResultField="total-amount"
                />
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                <MetricCard
                  label="Net Base Amount"
                  value={gstResponse.data.formattedNetBaseAmount}
                  sub="Taxable value before GST"
                  className="bg-surface-2/40 border-border"
                  dataResultField="net-amount"
                />
                <MetricCard
                  label={`Total GST Tax (${rateVal}%)`}
                  value={gstResponse.data.formattedGstAmount}
                  sub={isInterstate ? "100% IGST levy" : `${rateVal / 2}% CGST + ${rateVal / 2}% SGST`}
                  className="bg-amber-500/5 border-amber-500/20"
                  valueClassName="text-amber-500 font-bold font-mono"
                  dataResultField="gst-amount"
                />
              </div>

              {/* Tax Component Breakdown Card */}
              <div className="bg-surface-2/40 border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-blue" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text">
                      Statutory Tax Breakdown
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    {isInterstate ? "Interstate (IGST)" : "Intrastate (Dual GST)"}
                  </span>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  <dl className="space-y-3">
                    {!isInterstate ? (
                      <>
                        <div className="flex justify-between items-center pb-3 border-b border-border/50">
                          <div>
                            <dt className="text-xs font-bold text-text">CGST (Central Tax)</dt>
                            <dd className="text-[11px] text-text-muted">{formatPercent(rateVal / 2)} of taxable base</dd>
                          </div>
                          <dd className="font-mono text-base sm:text-lg font-bold text-text" data-result-field="cgst-amount">
                            {gstResponse.data.taxBreakdown.formattedCgst}
                          </dd>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <dt className="text-xs font-bold text-text">SGST (State Tax)</dt>
                            <dd className="text-[11px] text-text-muted">{formatPercent(rateVal / 2)} of taxable base</dd>
                          </div>
                          <dd className="font-mono text-base sm:text-lg font-bold text-text" data-result-field="sgst-amount">
                            {gstResponse.data.taxBreakdown.formattedSgst}
                          </dd>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <dt className="text-xs font-bold text-text">IGST (Integrated Tax)</dt>
                          <dd className="text-[11px] text-text-muted">{formatPercent(rateVal)} interstate supply</dd>
                        </div>
                        <dd className="font-mono text-xl sm:text-2xl font-bold text-blue" data-result-field="igst-amount">
                          {gstResponse.data.taxBreakdown.formattedIgst}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="bg-surface/80 rounded-2xl p-4 space-y-2 border border-border/60">
                    <div className="flex items-center gap-2 text-blue">
                      <Info className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider">Formula Verification</span>
                    </div>
                    <p className="text-xs font-mono text-text-muted leading-relaxed break-all">
                      {gstResponse.data.formula}
                    </p>
                  </div>
                </div>
              </div>

              {/* Copy Summary Card */}
              <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-semibold text-text">
                    Invoice Total: {gstResponse.data.formattedTotalGrossAmount} (GST: {gstResponse.data.formattedGstAmount})
                  </p>
                  <p className="text-[11px] text-text-muted font-mono truncate">
                    Base: {gstResponse.data.formattedNetBaseAmount} | Slab: {rateVal}%
                  </p>
                </div>
                <CopyButton text={summary} label="Copy Summary" className="bg-surface border border-border" />
              </div>
            </div>
          ) : (
            <div
              role="alert"
              aria-live="assertive"
              data-error-code={gstResponse.error.code}
              data-error-message={gstResponse.error.message}
              className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                    Calculation Error
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {gstResponse.error.message}
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
