"use client";

import React, { useState } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { SliderField } from "@/components/ui/SliderField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { useEmiStore } from "@/src/features/emi-calculator/store";
import { useShallow } from "zustand/react/shallow";
import { formatCurrency } from "@/src/lib/utils";

const LOAN_PRESETS = [
  { label: "₹10 Lakh", value: 1000000 },
  { label: "₹25 Lakh", value: 2500000 },
  { label: "₹50 Lakh", value: 5000000 },
  { label: "₹75 Lakh", value: 7500000 },
  { label: "₹1 Crore", value: 10000000 },
  { label: "₹2 Crore", value: 20000000 },
];

const RATE_PRESETS = [
  { label: "6.5%", value: 6.5 },
  { label: "7.5%", value: 7.5 },
  { label: "8.5%", value: 8.5 },
  { label: "9.5%", value: 9.5 },
  { label: "10.5%", value: 10.5 },
  { label: "12.0%", value: 12.0 },
];

const YEAR_PRESETS = [
  { label: "5Y", years: 5, months: 60 },
  { label: "10Y", years: 10, months: 120 },
  { label: "15Y", years: 15, months: 180 },
  { label: "20Y", years: 20, months: 240 },
  { label: "25Y", years: 25, months: 300 },
  { label: "30Y", years: 30, months: 360 },
];

function formatIndianNumberWords(num: number): string {
  if (!num || isNaN(num) || num <= 0) return "";
  if (num >= 10000000) {
    const cr = num / 10000000;
    return `${cr % 1 === 0 ? cr : cr.toFixed(2)} Crore`;
  }
  if (num >= 100000) {
    const lakh = num / 100000;
    return `${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
  }
  if (num >= 1000) {
    const k = num / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(1)} Thousand`;
  }
  return "";
}

export function EmiInputs() {
  const { 
    inputs, 
    setInputs, 
    showMoratorium, 
    showFloatingRate, 
    toggleSection 
  } = useEmiStore(useShallow(state => ({
    inputs: state.inputs,
    setInputs: state.setInputs,
    showMoratorium: state.showMoratorium,
    showFloatingRate: state.showFloatingRate,
    toggleSection: state.toggleSection
  })));

  // Tenure mode: 'years' or 'months'
  const [tenureUnit, setTenureUnit] = useState<"years" | "months">("years");

  const tenureYears = inputs.tenureMonths / 12;
  const wordDisplay = formatIndianNumberWords(inputs.loanAmount);

  return (
    <div className="space-y-6">
      {/* 1. Loan Amount Section */}
      <div className="space-y-2">
        <ToolInput
          label="Loan Amount"
          type="number"
          value={String(inputs.loanAmount)}
          onChange={(val) => {
            const num = Number(val);
            if (num >= 0 && num <= 1000000000000) setInputs({ loanAmount: num });
          }}
          description={wordDisplay ? `Total Principal: ${formatCurrency(inputs.loanAmount)} (${wordDisplay})` : "Total Principal Amount"}
        />
        {/* Quick Amount Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {LOAN_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setInputs({ loanAmount: preset.value })}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                inputs.loanAmount === preset.value
                  ? "bg-blue text-white border-blue shadow-sm"
                  : "bg-surface-2 text-text-muted hover:text-text border-border hover:border-border/80"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interest Rate Section */}
      <div className="space-y-2">
        <ToolInput
          label="Interest Rate (%)"
          type="number"
          value={String(inputs.interestRate)}
          onChange={(val) => {
            const num = Number(val);
            if (num >= 0 && num <= 100) setInputs({ interestRate: num });
          }}
          description="Annual Interest Percentage (p.a.)"
        />
        {/* Quick Rate Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {RATE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setInputs({ interestRate: preset.value })}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                inputs.interestRate === preset.value
                  ? "bg-blue text-white border-blue shadow-sm"
                  : "bg-surface-2 text-text-muted hover:text-text border-border hover:border-border/80"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Loan Tenure Section (Years vs Months Switcher) */}
      <div className="space-y-3 p-4 bg-surface-2/30 border border-border/80 rounded-2xl">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-text">Loan Tenure</span>
            <p className="text-xs text-text-muted font-medium">
              {tenureUnit === "years" 
                ? `${tenureYears.toFixed(tenureYears % 1 === 0 ? 0 : 1)} Years (${inputs.tenureMonths} Months)` 
                : `${inputs.tenureMonths} Months (${(inputs.tenureMonths / 12).toFixed(1)} Years)`}
            </p>
          </div>

          {/* Unit Toggle Switcher: Years vs Months */}
          <div className="grid grid-cols-2 gap-1 bg-surface p-1 rounded-xl border border-border text-xs">
            <button
              type="button"
              onClick={() => setTenureUnit("years")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                tenureUnit === "years"
                  ? "bg-blue text-white shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Years
            </button>
            <button
              type="button"
              onClick={() => setTenureUnit("months")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                tenureUnit === "months"
                  ? "bg-blue text-white shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Months
            </button>
          </div>
        </div>

        {/* Input & Slider for Years Mode */}
        {tenureUnit === "years" ? (
          <div className="space-y-3">
            <ToolInput
              label="Tenure in Years"
              type="number"
              value={String(tenureYears % 1 === 0 ? tenureYears : tenureYears.toFixed(1))}
              onChange={(val) => {
                const yr = Number(val);
                if (yr >= 0 && yr <= 50) {
                  setInputs({ tenureMonths: Math.max(1, Math.round(yr * 12)) });
                }
              }}
              description="Enter loan duration in years"
            />
            <SliderField
              id="tenure-years-slider"
              label="Tenure Slider (Years)"
              min={1}
              max={30}
              step={1}
              value={Math.round(tenureYears)}
              onChange={(val) => setInputs({ tenureMonths: val * 12 })}
              format={(v) => `${v} Years (${v * 12} Mo)`}
            />
          </div>
        ) : (
          /* Input & Slider for Months Mode */
          <div className="space-y-3">
            <ToolInput
              label="Tenure in Months"
              type="number"
              value={String(inputs.tenureMonths)}
              onChange={(val) => {
                const mo = Number(val);
                if (mo >= 1 && mo <= 600) {
                  setInputs({ tenureMonths: mo });
                }
              }}
              description="Enter loan duration in months"
            />
            <SliderField
              id="tenure-months-slider"
              label="Tenure Slider (Months)"
              min={12}
              max={360}
              step={6}
              value={inputs.tenureMonths}
              onChange={(val) => setInputs({ tenureMonths: val })}
              format={(v) => `${v} Mo (${(v / 12).toFixed(1)} Yr)`}
            />
          </div>
        )}

        {/* Quick Tenure Preset Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {YEAR_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setInputs({ tenureMonths: preset.months })}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                inputs.tenureMonths === preset.months
                  ? "bg-blue text-white border-blue shadow-sm"
                  : "bg-surface text-text-muted hover:text-text border-border hover:border-border/80"
              }`}
            >
              {preset.label} ({preset.months}M)
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Settings: Floating Rate & Moratorium */}
      <Accordion type="single" collapsible className="bg-surface-2/30 border border-border/80 rounded-2xl px-4 sm:px-6">
        <AccordionItem value="advanced-settings" className="border-none">
          <AccordionTrigger className="hover:no-underline py-4 cursor-pointer">
            <span className="text-xs font-bold uppercase tracking-wider text-text">Advanced Settings (Floating Rate & Moratorium)</span>
          </AccordionTrigger>
          <AccordionContent className="pb-6 space-y-6">
            {/* Floating Rate Stress Test */}
            <div className="space-y-4">
              <Checkbox
                id="enable-floating"
                label="Floating Rate Stress Test"
                checked={showFloatingRate}
                onChange={() => toggleSection("floatingRate")}
              />
              {showFloatingRate && (
                <div className="pt-2 sm:pl-6 space-y-2">
                  <SliderField
                    id="floating-delta"
                    label="Interest Rate Delta (±%)"
                    min={-3}
                    max={3}
                    step={0.25}
                    value={inputs.floatingRateDelta || 0}
                    onChange={(val) => setInputs({ floatingRateDelta: val })}
                    format={(v) => `${v > 0 ? "+" : ""}${v}%`}
                  />
                  <p className="text-xs text-text-muted leading-relaxed">
                    Test how your EMI changes if the interest rate increases or decreases due to market changes.
                  </p>
                </div>
              )}
            </div>

            {/* Moratorium Period */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <Checkbox
                id="enable-moratorium"
                label="Moratorium / Repayment Holiday Period"
                checked={showMoratorium}
                onChange={() => toggleSection("moratorium")}
              />
              {showMoratorium && (
                <div className="pt-2 sm:pl-6 space-y-4">
                  <ToolInput
                    label="Moratorium Duration (Months)"
                    type="number"
                    value={String(inputs.moratorium?.months || 0)}
                    onChange={(val) => setInputs({ 
                      moratorium: { 
                        months: Number(val), 
                        type: inputs.moratorium?.type || "full" 
                      } 
                    })}
                    description="Number of initial months where repayment is deferred"
                  />
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                    <label htmlFor="moratorium-interest-only" className="flex items-center gap-2 text-xs font-bold text-text cursor-pointer">
                      <input 
                        id="moratorium-interest-only"
                        type="radio"
                        name="moratorium-type"
                        checked={inputs.moratorium?.type === "interest-only"}
                        onChange={() => setInputs({ 
                          moratorium: { 
                            months: inputs.moratorium?.months || 0, 
                            type: "interest-only" 
                          } 
                        })}
                        className="accent-blue"
                      />
                      <span>Interest Only (Pay interest during moratorium)</span>
                    </label>
                    <label htmlFor="moratorium-full" className="flex items-center gap-2 text-xs font-bold text-text cursor-pointer">
                      <input 
                        id="moratorium-full"
                        type="radio"
                        name="moratorium-type"
                        checked={inputs.moratorium?.type === "full"}
                        onChange={() => setInputs({ 
                          moratorium: { 
                            months: inputs.moratorium?.months || 0, 
                            type: "full" 
                          } 
                        })}
                        className="accent-blue"
                      />
                      <span>Full Moratorium (Interest capitalized to principal)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
