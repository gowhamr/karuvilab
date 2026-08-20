"use client";

import React, { useState, useEffect } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { SliderField } from "@/components/ui/SliderField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { useEmiStore } from "@/src/features/emi-calculator/store";
import { useShallow } from "zustand/react/shallow";
import { formatCurrency } from "@/src/lib/utils";
import { Home, Car, Briefcase, GraduationCap, RotateCcw } from "lucide-react";

const LOAN_CATEGORIES = [
  { 
    id: "home", 
    label: "Home Loan", 
    icon: Home, 
    amount: 5000000, 
    rate: 8.5, 
    tenureMonths: 240 
  },
  { 
    id: "car", 
    label: "Car Loan", 
    icon: Car, 
    amount: 1000000, 
    rate: 9.0, 
    tenureMonths: 60 
  },
  { 
    id: "personal", 
    label: "Personal Loan", 
    icon: Briefcase, 
    amount: 500000, 
    rate: 12.5, 
    tenureMonths: 36 
  },
  { 
    id: "education", 
    label: "Education Loan", 
    icon: GraduationCap, 
    amount: 1500000, 
    rate: 10.0, 
    tenureMonths: 84 
  },
];

const LOAN_PRESETS = [
  { label: "₹5 Lakh", value: 500000 },
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
  { label: "14.0%", value: 14.0 },
];

const YEAR_PRESETS = [
  { label: "1Y", months: 12 },
  { label: "3Y", months: 36 },
  { label: "5Y", months: 60 },
  { label: "7Y", months: 84 },
  { label: "10Y", months: 120 },
  { label: "15Y", months: 180 },
  { label: "20Y", months: 240 },
  { label: "25Y", months: 300 },
  { label: "30Y", months: 360 },
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

  // Local string buffers to enable clearing and typing smoothly without snapping back
  const [localYears, setLocalYears] = useState<string>(() => {
    const yr = (inputs.tenureMonths || 240) / 12;
    return String(yr % 1 === 0 ? yr : parseFloat(yr.toFixed(2)));
  });
  const [localMonths, setLocalMonths] = useState<string>(() => String(inputs.tenureMonths || 240));
  const [localAmount, setLocalAmount] = useState<string>(() => String(inputs.loanAmount || 5000000));
  const [localRate, setLocalRate] = useState<string>(() => String(inputs.interestRate || 8.5));

  // Synchronize local buffers when store changes externally (e.g. from preset chips or resets)
  useEffect(() => {
    const yr = (inputs.tenureMonths || 240) / 12;
    const yrStr = String(yr % 1 === 0 ? yr : parseFloat(yr.toFixed(2)));
    setLocalYears(prev => {
      if (prev === "" || parseFloat(prev) === yr) return prev;
      return yrStr;
    });
    setLocalMonths(prev => {
      if (prev === "" || parseInt(prev, 10) === inputs.tenureMonths) return prev;
      return String(inputs.tenureMonths);
    });
  }, [inputs.tenureMonths]);

  useEffect(() => {
    setLocalAmount(prev => {
      if (prev === "" || parseFloat(prev) === inputs.loanAmount) return prev;
      return String(inputs.loanAmount);
    });
  }, [inputs.loanAmount]);

  useEffect(() => {
    setLocalRate(prev => {
      if (prev === "" || parseFloat(prev) === inputs.interestRate) return prev;
      return String(inputs.interestRate);
    });
  }, [inputs.interestRate]);

  // Handlers with empty string tolerance
  const handleYearsChange = (val: string) => {
    setLocalYears(val);
    if (val === "" || val === "." || isNaN(Number(val))) return;
    const yr = parseFloat(val);
    if (yr > 0 && yr <= 50) {
      const mo = Math.round(yr * 12);
      setLocalMonths(String(mo));
      setInputs({ tenureMonths: mo });
    }
  };

  const handleMonthsChange = (val: string) => {
    setLocalMonths(val);
    if (val === "" || isNaN(Number(val))) return;
    const mo = parseInt(val, 10);
    if (mo >= 1 && mo <= 600) {
      const yr = mo / 12;
      setLocalYears(String(yr % 1 === 0 ? yr : parseFloat(yr.toFixed(2))));
      setInputs({ tenureMonths: mo });
    }
  };

  const handleAmountChange = (val: string) => {
    setLocalAmount(val);
    if (val === "" || isNaN(Number(val))) return;
    const amt = parseFloat(val);
    if (amt >= 0 && amt <= 1000000000000) {
      setInputs({ loanAmount: amt });
    }
  };

  const handleRateChange = (val: string) => {
    setLocalRate(val);
    if (val === "" || val === "." || isNaN(Number(val))) return;
    const r = parseFloat(val);
    if (r >= 0 && r <= 100) {
      setInputs({ interestRate: r });
    }
  };

  const tenureYears = inputs.tenureMonths / 12;
  const wordDisplay = formatIndianNumberWords(inputs.loanAmount);

  const handleResetDefaults = () => {
    setLocalAmount("5000000");
    setLocalRate("8.5");
    setLocalYears("20");
    setLocalMonths("240");
    setInputs({
      loanAmount: 5000000,
      interestRate: 8.5,
      tenureMonths: 240,
      floatingRateDelta: 0,
      moratorium: undefined,
      recurringPrepayment: undefined,
      prepayments: []
    });
  };

  return (
    <div className="space-y-6">
      {/* 0. Quick Loan Category Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Loan Type Presets</span>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-muted hover:text-text transition-colors cursor-pointer"
            title="Reset to default home loan"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LOAN_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = 
              inputs.loanAmount === cat.amount && 
              inputs.interestRate === cat.rate && 
              inputs.tenureMonths === cat.tenureMonths;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setLocalAmount(String(cat.amount));
                  setLocalRate(String(cat.rate));
                  setLocalMonths(String(cat.tenureMonths));
                  setLocalYears(String(cat.tenureMonths / 12));
                  setInputs({ 
                    loanAmount: cat.amount, 
                    interestRate: cat.rate, 
                    tenureMonths: cat.tenureMonths 
                  });
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue/10 border-blue text-blue shadow-sm"
                    : "bg-surface-2/40 border-border hover:border-border/80 text-text hover:bg-surface-2/70"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isSelected ? "bg-blue text-white" : "bg-surface text-text-muted"}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{cat.label}</p>
                  <p className="text-[10px] text-text-muted truncate">{cat.rate}% · {cat.tenureMonths / 12}Y</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Loan Amount Section */}
      <div className="space-y-2">
        <ToolInput
          label="Loan Amount"
          type="number"
          value={localAmount}
          onChange={handleAmountChange}
          description={wordDisplay ? `Total Principal: ${formatCurrency(inputs.loanAmount)} (${wordDisplay})` : "Total Principal Amount"}
        />
        {/* Quick Amount Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {LOAN_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setLocalAmount(String(preset.value));
                setInputs({ loanAmount: preset.value });
              }}
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
          label="Interest Rate (% p.a.)"
          type="number"
          value={localRate}
          onChange={handleRateChange}
          description="Annual Interest Rate Percentage"
        />
        {/* Quick Rate Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {RATE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setLocalRate(String(preset.value));
                setInputs({ interestRate: preset.value });
              }}
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

      {/* 3. Loan Tenure Section (Dual Synchronized Years & Months) */}
      <div className="space-y-3 p-4 bg-surface-2/30 border border-border/80 rounded-2xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text">Loan Tenure</span>
          <span className="text-xs font-mono font-bold text-blue">
            {tenureYears.toFixed(tenureYears % 1 === 0 ? 0 : 1)} Years ({inputs.tenureMonths} Months)
          </span>
        </div>

        {/* Dual Side-by-Side Inputs: Years & Months with robust local text state */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <ToolInput
            label="Tenure in Years"
            type="number"
            value={localYears}
            onChange={handleYearsChange}
            description="Enter loan duration in years (e.g. 5, 10, 20, 30)"
          />
          <ToolInput
            label="Tenure in Months"
            type="number"
            value={localMonths}
            onChange={handleMonthsChange}
            description="Enter loan duration in months (e.g. 60, 120, 240, 360)"
          />
        </div>

        {/* Real-Time Interactive Slider */}
        <div className="pt-2">
          <SliderField
            id="tenure-slider"
            label="Adjust Tenure Duration"
            min={12}
            max={360}
            step={6}
            value={inputs.tenureMonths}
            onChange={(val) => {
              const yr = val / 12;
              setLocalMonths(String(val));
              setLocalYears(String(yr % 1 === 0 ? yr : parseFloat(yr.toFixed(2))));
              setInputs({ tenureMonths: val });
            }}
            format={(v) => `${(v / 12).toFixed(v % 12 === 0 ? 0 : 1)} Yr (${v} Mo)`}
          />
        </div>

        {/* Quick Tenure Preset Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {YEAR_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                const yr = preset.months / 12;
                setLocalMonths(String(preset.months));
                setLocalYears(String(yr % 1 === 0 ? yr : parseFloat(yr.toFixed(2))));
                setInputs({ tenureMonths: preset.months });
              }}
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
