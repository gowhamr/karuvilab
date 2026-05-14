"use client";

import React from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { SliderField } from "@/components/ui/SliderField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { useEmiStore } from "@/src/store/useEmiStore";

export function EmiInputs() {
  const { 
    inputs, 
    setInputs, 
    showMoratorium, 
    showFloatingRate, 
    toggleSection 
  } = useEmiStore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToolInput
          label="Loan Amount"
          type="number"
          value={String(inputs.loanAmount)}
          onChange={(val) => setInputs({ loanAmount: Number(val) })}
          description="Total principal amount"
        />
        <ToolInput
          label="Interest Rate (%)"
          type="number"
          value={String(inputs.interestRate)}
          onChange={(val) => setInputs({ interestRate: Number(val) })}
          description="Annual interest percentage"
        />
        <SliderField
          id="tenure-slider"
          label="Tenure (Months)"
          min={12}
          max={360}
          step={12}
          value={inputs.tenureMonths}
          onChange={(val) => setInputs({ tenureMonths: val })}
          format={(v) => `${v} mo (${(v / 12).toFixed(1)} yr)`}
        />
      </div>

      <Accordion type="multiple">
        {/* Floating Rate Stress Test */}
        <AccordionItem value="floating-rate">
          <div className="py-2">
            <Checkbox
              id="enable-floating"
              label="Floating Rate Stress Test"
              checked={showFloatingRate}
              onChange={() => toggleSection('floatingRate')}
            />
          </div>
          {showFloatingRate && (
            <div className="pt-4 pb-6 pl-8">
              <SliderField
                id="floating-delta"
                label="Interest Rate Delta (±%)"
                min={-3}
                max={3}
                step={0.25}
                value={inputs.floatingRateDelta || 0}
                onChange={(val) => setInputs({ floatingRateDelta: val })}
                format={(v) => `${v > 0 ? '+' : ''}${v}%`}
              />
              <p className="mt-2 text-[10px] text-text-4">
                Test how your EMI changes if the interest rate increases or decreases.
              </p>
            </div>
          )}
        </AccordionItem>

        {/* Moratorium Period */}
        <AccordionItem value="moratorium">
          <div className="py-2">
            <Checkbox
              id="enable-moratorium"
              label="Moratorium Period"
              checked={showMoratorium}
              onChange={() => toggleSection('moratorium')}
            />
          </div>
          {showMoratorium && (
            <div className="pt-4 pb-6 pl-8 space-y-4">
              <ToolInput
                label="Moratorium (Months)"
                type="number"
                value={String(inputs.moratorium?.months || 0)}
                onChange={(val) => setInputs({ 
                  moratorium: { 
                    months: Number(val), 
                    type: inputs.moratorium?.type || 'full' 
                  } 
                })}
              />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-bold text-text-2">
                  <input
                    type="radio"
                    name="moratorium-type"
                    checked={inputs.moratorium?.type === 'interest-only'}
                    onChange={() => setInputs({ 
                      moratorium: { 
                        months: inputs.moratorium?.months || 0, 
                        type: 'interest-only' 
                      } 
                    })}
                  />
                  Interest Only
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-text-2">
                  <input
                    type="radio"
                    name="moratorium-type"
                    checked={inputs.moratorium?.type === 'full'}
                    onChange={() => setInputs({ 
                      moratorium: { 
                        months: inputs.moratorium?.months || 0, 
                        type: 'full' 
                      } 
                    })}
                  />
                  Full Moratorium
                </label>
              </div>
            </div>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
