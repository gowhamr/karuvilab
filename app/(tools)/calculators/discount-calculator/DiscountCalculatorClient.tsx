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
import { RotateCcw, AlertCircle, Tag, Percent, ShoppingBag } from "lucide-react";
import {
  calculateForwardDiscount,
  calculateFindDiscount,
  calculateFindOriginal,
  DiscountCalculatorMode,
  formatCurrency,
  formatPercent,
} from "@/src/features/calculators/discount";

export default function DiscountCalculatorClient() {
  const { state, setState, hasParams } = useUrlState({
    defaults: {
      mode: 'forward',
      price: '1000',
      discount: '20',
      extra: '0',
      tax: '0',
      target: '750',
      final: '800',
      // Legacy fallback
      originalPrice: '1000',
      discountPct: '20',
      targetPrice: '750',
    },
    debounceMs: 350,
  });

  const mode = (['forward', 'find_discount', 'find_original'].includes(state.mode as string)
    ? state.mode
    : 'forward') as DiscountCalculatorMode;

  const priceStr = (state.price as string) || (state.originalPrice as string) || '1000';
  const discountVal = parseFloat((state.discount as string) || (state.discountPct as string) || '20') || 20;
  const extraVal = parseFloat((state.extra as string) || '0') || 0;
  const taxVal = parseFloat((state.tax as string) || '0') || 0;
  const targetStr = (state.target as string) || (state.targetPrice as string) || '750';
  const finalStr = (state.final as string) || '800';

  const [isQrOpen, setIsQrOpen] = useState(false);

  const setMode = useCallback((m: DiscountCalculatorMode) => setState({ mode: m }), [setState]);
  const setPriceStr = useCallback((p: string) => setState({ price: p, originalPrice: p }), [setState]);
  const setDiscountVal = useCallback((d: number) => setState({ discount: String(d), discountPct: String(d) }), [setState]);
  const setExtraVal = useCallback((e: number) => setState({ extra: String(e) }), [setState]);
  const setTaxVal = useCallback((t: number) => setState({ tax: String(t) }), [setState]);
  const setTargetStr = useCallback((t: string) => setState({ target: t, targetPrice: t }), [setState]);
  const setFinalStr = useCallback((f: string) => setState({ final: f }), [setState]);

  const resetAll = () => {
    setState({
      mode: 'forward',
      price: '1000',
      discount: '20',
      extra: '0',
      tax: '0',
      target: '750',
      final: '800',
      originalPrice: '1000',
      discountPct: '20',
      targetPrice: '750',
    });
  };

  // Pure deterministic calculations
  const forwardResponse = useMemo(() => {
    return calculateForwardDiscount({
      originalPrice: parseFloat(priceStr) || 0,
      discountPercent: discountVal,
      extraDiscountPercent: extraVal,
      taxPercent: taxVal,
    });
  }, [priceStr, discountVal, extraVal, taxVal]);

  const findDiscountResponse = useMemo(() => {
    return calculateFindDiscount({
      originalPrice: parseFloat(priceStr) || 0,
      targetPrice: parseFloat(targetStr) || 0,
    });
  }, [priceStr, targetStr]);

  const findOriginalResponse = useMemo(() => {
    return calculateFindOriginal({
      finalPrice: parseFloat(finalStr) || 0,
      discountPercent: discountVal,
    });
  }, [finalStr, discountVal]);

  // Construct canonical share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?mode=${mode}&${
        mode === 'forward'
          ? `price=${encodeURIComponent(priceStr)}&discount=${discountVal}${
              extraVal > 0 ? `&extra=${extraVal}` : ''
            }${taxVal > 0 ? `&tax=${taxVal}` : ''}`
          : mode === 'find_discount'
          ? `price=${encodeURIComponent(priceStr)}&target=${encodeURIComponent(targetStr)}`
          : `final=${encodeURIComponent(finalStr)}&discount=${discountVal}`
      }`
    : `?mode=${mode}&price=${encodeURIComponent(priceStr)}&discount=${discountVal}`;

  const forwardSummary = forwardResponse.success
    ? `Discount Breakdown\n------------------\nOriginal Price: ${forwardResponse.data.formattedOriginalPrice}\nPrimary Discount: ${discountVal}%${
        extraVal > 0 ? `\nExtra Stacked Discount: ${extraVal}%` : ''
      }${taxVal > 0 ? `\nSales Tax: ${taxVal}%` : ''}\n\nFinal Payable: ${forwardResponse.data.formattedFinalPayable}\nTotal You Save: ${forwardResponse.data.formattedTotalSavings}\nEffective Discount: ${forwardResponse.data.formattedEffectiveDiscount}\n\nCalculated via KaruviLab`
    : '';

  const findDiscountSummary = findDiscountResponse.success
    ? `Required Discount\n-----------------\nOriginal Price: ${formatCurrency(findDiscountResponse.data.originalPrice)}\nTarget Price: ${formatCurrency(findDiscountResponse.data.targetPrice)}\n\nRequired Discount: ${findDiscountResponse.data.formattedRequiredDiscount}\nTotal Savings: ${findDiscountResponse.data.formattedTotalSavings}\n\nCalculated via KaruviLab`
    : '';

  const findOriginalSummary = findOriginalResponse.success
    ? `Original Price Recovery\n-----------------------\nSale Price: ${formatCurrency(findOriginalResponse.data.finalPrice)}\nDiscount Applied: ${discountVal}%\n\nOriginal MSRP: ${findOriginalResponse.data.formattedOriginalPrice}\nTotal Saved: ${findOriginalResponse.data.formattedTotalSavings}\n\nCalculated via KaruviLab`
    : '';

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Discount Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        tabs={{
          options: [
            { id: "forward", label: "Calculate Discount & Tax" },
            { id: "find_discount", label: "Find Required % Off" },
            { id: "find_original", label: "Find Original MSRP" },
          ],
          activeId: mode,
          onChange: (id) => setMode(id as DiscountCalculatorMode),
        }}
        layout="split"
        input={
          <form
            data-tool="discount-calculator"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 min-w-0 w-full"
          >
            {mode === "forward" && (
              <div className="space-y-5 min-w-0 w-full">
                <div data-input-field="original-price">
                  <ToolInput
                    label="Original Price"
                    id="disc-price"
                    type="number"
                    placeholder="e.g. 1000"
                    value={priceStr}
                    onChange={setPriceStr}
                  />
                </div>

                <div data-input-field="discount-percent">
                  <SliderField
                    label="Primary Discount (%)"
                    id="disc-pct"
                    min={0}
                    max={95}
                    step={1}
                    value={discountVal}
                    onChange={setDiscountVal}
                    format={(v) => `${v}%`}
                  />
                </div>

                <div data-input-field="extra-discount-percent">
                  <SliderField
                    label="Extra Stacked Coupon / Promo (%)"
                    id="disc-extra"
                    min={0}
                    max={50}
                    step={1}
                    value={extraVal}
                    onChange={setExtraVal}
                    format={(v) => `${v}%`}
                  />
                </div>

                <div data-input-field="tax-percent">
                  <SliderField
                    label="Sales Tax / VAT (%)"
                    id="disc-tax"
                    min={0}
                    max={30}
                    step={0.5}
                    value={taxVal}
                    onChange={setTaxVal}
                    format={(v) => `${v}%`}
                  />
                </div>
              </div>
            )}

            {mode === "find_discount" && (
              <div className="space-y-5 min-w-0 w-full">
                <div data-input-field="original-price">
                  <ToolInput
                    label="Original List Price"
                    id="rev-orig-price"
                    type="number"
                    placeholder="e.g. 1000"
                    value={priceStr}
                    onChange={setPriceStr}
                  />
                </div>
                <div data-input-field="target-price">
                  <ToolInput
                    label="Target Desired Price"
                    id="rev-target-price"
                    type="number"
                    placeholder="e.g. 750"
                    value={targetStr}
                    onChange={setTargetStr}
                  />
                </div>
              </div>
            )}

            {mode === "find_original" && (
              <div className="space-y-5 min-w-0 w-full">
                <div data-input-field="final-price">
                  <ToolInput
                    label="Final Sale Price Paid"
                    id="find-orig-final"
                    type="number"
                    placeholder="e.g. 800"
                    value={finalStr}
                    onChange={setFinalStr}
                  />
                </div>
                <div data-input-field="discount-percent">
                  <SliderField
                    label="Discount Applied (%)"
                    id="find-orig-discount"
                    min={1}
                    max={95}
                    step={1}
                    value={discountVal}
                    onChange={setDiscountVal}
                    format={(v) => `${v}%`}
                  />
                </div>
              </div>
            )}
          </form>
        }
        output={
          mode === "forward" ? (
            forwardResponse.success ? (
              <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
                {/* Machine-readable outputs */}
                <div className="sr-only" aria-hidden="true">
                  <output data-result-field="final-price">{forwardResponse.data.finalPayable}</output>
                  <output data-result-field="total-savings">{forwardResponse.data.totalSavings}</output>
                  <output data-result-field="effective-discount">{forwardResponse.data.effectiveDiscountPercent}</output>
                  <output data-result-field="tax-amount">{forwardResponse.data.taxAmount}</output>
                </div>

                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Sale Price Summary</h3>
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
                      title={`Save ${forwardResponse.data.formattedTotalSavings} (${forwardResponse.data.formattedEffectiveDiscount}) — Discount Calculator`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                {/* Primary Metric */}
                <div className="w-full min-w-0">
                  <MetricCard
                    label="Final Payable Price"
                    value={forwardResponse.data.formattedFinalPayable}
                    accent
                    className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                    valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                    sub={taxVal > 0 ? `Includes ${formatCurrency(forwardResponse.data.taxAmount)} tax (${taxVal}%)` : `Reduced from ${forwardResponse.data.formattedOriginalPrice}`}
                    dataResultField="final-price"
                  />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                  <MetricCard
                    label="Total Amount Saved"
                    value={forwardResponse.data.formattedTotalSavings}
                    sub={`Effective discount: ${forwardResponse.data.formattedEffectiveDiscount}`}
                    className="bg-emerald-500/5 border-emerald-500/20"
                    valueClassName="text-emerald-500 font-bold"
                    dataResultField="total-savings"
                  />
                  <MetricCard
                    label="Effective Combined Discount"
                    value={forwardResponse.data.formattedEffectiveDiscount}
                    sub={extraVal > 0 ? `${discountVal}% + ${extraVal}% stacked` : `${discountVal}% off`}
                    dataResultField="effective-discount"
                  />
                  {extraVal > 0 && (
                    <MetricCard
                      label="Extra Stacked Savings"
                      value={formatCurrency(forwardResponse.data.extraDiscountSavings)}
                      sub={`From ${extraVal}% secondary promo`}
                      dataResultField="extra-savings"
                    />
                  )}
                  {taxVal > 0 && (
                    <MetricCard
                      label="Sales Tax Amount"
                      value={formatCurrency(forwardResponse.data.taxAmount)}
                      sub={`${taxVal}% on net subtotal`}
                      dataResultField="tax-amount"
                    />
                  )}
                </div>

                {/* Copy Summary */}
                <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-text">
                      Pay {forwardResponse.data.formattedFinalPayable} (Save {forwardResponse.data.formattedTotalSavings})
                    </p>
                    <p className="text-[11px] text-text-muted font-mono truncate">
                      {forwardResponse.data.formula}
                    </p>
                  </div>
                  <CopyButton text={forwardSummary} label="Copy Summary" className="bg-surface border border-border" />
                </div>
              </div>
            ) : (
              <div
                role="alert"
                aria-live="assertive"
                data-error-code={forwardResponse.error.code}
                data-error-message={forwardResponse.error.message}
                className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                      Calculation Error
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {forwardResponse.error.message}
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
          ) : mode === "find_discount" ? (
            findDiscountResponse.success ? (
              <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
                {/* Machine-readable outputs */}
                <div className="sr-only" aria-hidden="true">
                  <output data-result-field="required-discount">{findDiscountResponse.data.requiredDiscountPercent}</output>
                  <output data-result-field="total-savings">{findDiscountResponse.data.totalSavings}</output>
                </div>

                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Required Percentage Off</h3>
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
                      title={`Need ${findDiscountResponse.data.formattedRequiredDiscount} off to reach ${formatCurrency(findDiscountResponse.data.targetPrice)} — Discount Calculator`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                <div className="w-full min-w-0">
                  <MetricCard
                    label="Required Markdown Discount"
                    value={findDiscountResponse.data.formattedRequiredDiscount}
                    accent
                    className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                    valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                    sub={`To drop from ${formatCurrency(findDiscountResponse.data.originalPrice)} to ${formatCurrency(findDiscountResponse.data.targetPrice)}`}
                    dataResultField="required-discount"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                  <MetricCard
                    label="Total Price Reduction"
                    value={findDiscountResponse.data.formattedTotalSavings}
                    sub="Absolute cash savings"
                    dataResultField="total-savings"
                  />
                  <MetricCard
                    label="Target Fraction"
                    value={formatPercent(100 - findDiscountResponse.data.requiredDiscountPercent)}
                    sub="Percentage of original price"
                  />
                </div>

                <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-text">
                      Required Discount: {findDiscountResponse.data.formattedRequiredDiscount}
                    </p>
                    <p className="text-[11px] text-text-muted font-mono truncate">
                      {findDiscountResponse.data.formula}
                    </p>
                  </div>
                  <CopyButton text={findDiscountSummary} label="Copy Summary" className="bg-surface border border-border" />
                </div>
              </div>
            ) : (
              <div
                role="alert"
                aria-live="assertive"
                data-error-code={findDiscountResponse.error.code}
                data-error-message={findDiscountResponse.error.message}
                className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                      Calculation Error
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {findDiscountResponse.error.message}
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
            findOriginalResponse.success ? (
              <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
                {/* Machine-readable outputs */}
                <div className="sr-only" aria-hidden="true">
                  <output data-result-field="original-price">{findOriginalResponse.data.originalPrice}</output>
                  <output data-result-field="total-savings">{findOriginalResponse.data.totalSavings}</output>
                </div>

                <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-text truncate">Original MSRP Result</h3>
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
                      title={`Original price was ${findOriginalResponse.data.formattedOriginalPrice} before ${discountVal}% off — Discount Calculator`}
                      onQrClick={() => setIsQrOpen(true)}
                    />
                  </div>
                </div>

                <div className="w-full min-w-0">
                  <MetricCard
                    label="Original Pre-Discount Price (MSRP)"
                    value={findOriginalResponse.data.formattedOriginalPrice}
                    accent
                    className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                    valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                    sub={`Before ${discountVal}% markdown was applied`}
                    dataResultField="original-price"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                  <MetricCard
                    label="Discount Markdown Savings"
                    value={findOriginalResponse.data.formattedTotalSavings}
                    sub={`Amount deducted at checkout`}
                    dataResultField="total-savings"
                  />
                  <MetricCard
                    label="Paid Percentage"
                    value={formatPercent(100 - discountVal)}
                    sub="Of original baseline MSRP"
                  />
                </div>

                <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-text">
                      Original Price: {findOriginalResponse.data.formattedOriginalPrice}
                    </p>
                    <p className="text-[11px] text-text-muted font-mono truncate">
                      {findOriginalResponse.data.formula}
                    </p>
                  </div>
                  <CopyButton text={findOriginalSummary} label="Copy Summary" className="bg-surface border border-border" />
                </div>
              </div>
            ) : (
              <div
                role="alert"
                aria-live="assertive"
                data-error-code={findOriginalResponse.error.code}
                data-error-message={findOriginalResponse.error.message}
                className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                      Calculation Error
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {findOriginalResponse.error.message}
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
