"use client";

import { useFinancialFreedomStore } from '../store';
import { SliderField } from '@/components/ui/SliderField';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { ToolInput } from '@/components/ui/ToolInput';
import { formatCurrency, cn } from '@/src/lib/utils';
import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

function HybridSliderField({ 
  label, id, min, max, step = 1, value, onChange, format, error, showChips
}: {
  label: string; id: string; min: number; max: number; step?: number; 
  value: number; onChange: (v: number) => void; format?: (v: number) => string; 
  error?: boolean; showChips?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseInt(inputValue.replace(/,/g, ''), 10);
    if (!isNaN(parsed)) {
       onChange(Math.max(min, Math.min(max, parsed)));
    } else {
       setInputValue(String(value));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBlur();
    if (e.key === 'Escape') {
       setIsEditing(false);
       setInputValue(String(value));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className={cn("text-sm font-bold", error ? "text-error" : "text-text-2")}>{label}</label>
        {isEditing ? (
          <input
            id={id}
            type="number"
            autoFocus
            className="w-32 bg-surface border border-blue/50 rounded-lg px-2 py-1 text-sm font-black text-text text-right focus:outline-none focus:ring-1 focus:ring-blue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <button 
            onClick={() => { setInputValue(String(value)); setIsEditing(true); }}
            className={cn("text-sm font-black hover:text-blue transition-colors px-2 py-1 rounded hover:bg-surface-2 cursor-text border border-transparent hover:border-border", error ? "text-error" : "text-text")}
            title="Click to type exact amount"
            aria-label={`Edit ${label}`}
          >
            {format ? format(value) : value}
          </button>
        )}
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-11"
        value={[value]}
        onValueChange={(v) => onChange(v[0]!)}
        max={max}
        min={min}
        step={step}
      >
        <Slider.Track className={cn("relative grow rounded-full h-2", error ? "bg-error/20" : "bg-blue/20")}>
          <Slider.Range className={cn("absolute rounded-full h-full", error ? "bg-error" : "bg-brand-primary")} />
        </Slider.Track>
        <Slider.Thumb
          className={cn(
            "block w-6 h-6 bg-text border rounded-full shadow-md cursor-pointer hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-mat-base focus:outline-none transition-all active:scale-95",
            error ? "border-error focus-visible:ring-error" : "border-brand-primary focus-visible:ring-brand-primary"
          )}
          aria-label={label}
        />
      </Slider.Root>

      <div className="flex justify-between text-xs text-text-4 font-black uppercase tracking-widest-sm" aria-hidden="true">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>

      {showChips && (
        <div className="flex flex-wrap gap-2 pt-1">
          <button onClick={() => onChange(Math.max(min, value - 100000))} className="px-2.5 py-1 text-[10px] font-bold text-text-4 bg-surface border border-border hover:bg-surface-2 rounded-md transition-colors uppercase tracking-wider">-1L</button>
          <button onClick={() => onChange(Math.min(max, value + 100000))} className="px-2.5 py-1 text-[10px] font-bold text-blue bg-blue/10 hover:bg-blue/20 rounded-md transition-colors uppercase tracking-wider">+1L</button>
          <button onClick={() => onChange(Math.min(max, value + 500000))} className="px-2.5 py-1 text-[10px] font-bold text-blue bg-blue/10 hover:bg-blue/20 rounded-md transition-colors uppercase tracking-wider">+5L</button>
          <button onClick={() => onChange(Math.min(max, value + 1000000))} className="px-2.5 py-1 text-[10px] font-bold text-blue bg-blue/10 hover:bg-blue/20 rounded-md transition-colors uppercase tracking-wider">+10L</button>
          <button onClick={() => onChange(Math.min(max, value + 10000000))} className="px-2.5 py-1 text-[10px] font-bold text-blue bg-blue/10 hover:bg-blue/20 rounded-md transition-colors uppercase tracking-wider">+1Cr</button>
        </div>
      )}
    </div>
  );
}

export function InputPanel() {
  const inputs = useFinancialFreedomStore(state => state.inputs);
  const setInputs = useFinancialFreedomStore(state => state.setInputs);

  return (
    <div className="space-y-8 h-full bg-surface/50 rounded-4xl p-6 sm:p-8 border border-border">
      <div>
        <h2 className="text-xl font-bold text-text mb-6 font-display">Core Parameters</h2>
        <div className="space-y-6">
          <SliderField
            id="currentAge"
            label="Current Age"
            min={18}
            max={80}
            value={inputs.currentAge}
            onChange={(v) => setInputs({ currentAge: v })}
            format={(v) => `${v} years`}
          />
          
          <SliderField
            id="retirementAge"
            label="Target Retirement Age"
            min={Math.max(20, inputs.currentAge + 1)}
            max={100}
            value={inputs.retirementAge}
            onChange={(v) => setInputs({ retirementAge: v })}
            format={(v) => `${v} years`}
          />
          
          <HybridSliderField
            id="currentSavings"
            label="Current Savings"
            min={0}
            max={50000000}
            step={10000}
            value={inputs.currentSavings}
            onChange={(v) => setInputs({ currentSavings: v })}
            format={formatCurrency}
            showChips
          />
          
          <HybridSliderField
            id="monthlyIncome"
            label="Monthly Income (Post-tax)"
            min={0}
            max={2000000}
            step={5000}
            value={inputs.monthlyIncome}
            onChange={(v) => setInputs({ monthlyIncome: v })}
            format={formatCurrency}
          />
          
          <div className={inputs.monthlyExpenses > inputs.monthlyIncome ? "p-4 rounded-xl border-2 border-error bg-error/5 space-y-3" : "space-y-1"}>
            <HybridSliderField
              id="monthlyExpenses"
              label="Monthly Expenses"
              min={0}
              max={2000000}
              step={1000}
              value={inputs.monthlyExpenses}
              onChange={(v) => setInputs({ monthlyExpenses: v })}
              format={formatCurrency}
              error={inputs.monthlyExpenses > inputs.monthlyIncome}
            />
            {inputs.monthlyExpenses > inputs.monthlyIncome && (
              <div className="text-sm font-bold text-error bg-error/10 p-3 rounded-lg border border-error/20">
                Warning: Your monthly expenses exceed your income. You are currently running a deficit and cannot reach Financial Independence.
              </div>
            )}
          </div>
          
          <SliderField
            id="expectedAnnualReturn"
            label="Expected Annual Return"
            min={1}
            max={30}
            step={0.5}
            value={inputs.expectedAnnualReturn}
            onChange={(v) => setInputs({ expectedAnnualReturn: v })}
            format={(v) => `${v}%`}
          />
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced" className="border-none">
          <AccordionTrigger className="bg-surface rounded-xl px-4 border border-border hover:border-blue/50">
            Advanced Settings
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-1 space-y-6">
            <SliderField
              id="safeWithdrawalRate"
              label="Safe Withdrawal Rate"
              min={2}
              max={10}
              step={0.1}
              value={inputs.safeWithdrawalRate}
              onChange={(v) => setInputs({ safeWithdrawalRate: v })}
              format={(v) => `${v}%`}
            />
            
            <SliderField
              id="inflationRate"
              label="Inflation Rate"
              min={0}
              max={15}
              step={0.5}
              value={inputs.inflationRate}
              onChange={(v) => setInputs({ inflationRate: v })}
              format={(v) => `${v}%`}
            />
            
            <SliderField
              id="annualIncomeGrowth"
              label="Annual Income Growth"
              min={0}
              max={15}
              step={0.5}
              value={inputs.annualIncomeGrowth}
              onChange={(v) => setInputs({ annualIncomeGrowth: v })}
              format={(v) => `${v}%`}
            />
            
            <SliderField
              id="postRetirementReturn"
              label="Post-Retirement Return"
              min={0}
              max={15}
              step={0.5}
              value={inputs.postRetirementReturn}
              onChange={(v) => setInputs({ postRetirementReturn: v })}
              format={(v) => `${v}%`}
            />

            <ToolInput
              id="oneTimeWindfalls"
              label="One-Time Windfalls (₹)"
              placeholder="e.g., 500000, 100000"
              value={inputs.oneTimeWindfalls}
              onChange={(val) => setInputs({ oneTimeWindfalls: val })}
              description="Comma-separated amounts expected to be added to savings."
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
