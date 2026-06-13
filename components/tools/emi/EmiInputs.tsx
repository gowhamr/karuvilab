"use client";

import React from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { SliderField } from "@/components/ui/SliderField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { useEmiStore } from "@/src/store/useEmiStore";
import { useShallow } from "zustand/react/shallow";

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

      <Accordion type="single" collapsible className="bg-bg/50 border border-border rounded-2xl px-6">
        <AccordionItem value="advanced-settings" className="border-none">
          <AccordionTrigger className="hover:no-underline py-4">
            <span className="text-xs font-black uppercase tracking-widest text-text-3">Advanced Settings</span>
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
                <div className="pt-2 pl-8">
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
                  <p className="mt-2 text-xs text-text-4">
                    Test how your EMI changes if the interest rate increases or decreases.
                  </p>
                </div>
              )}
            </div>

            {/* Moratorium Period */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <Checkbox
                id="enable-moratorium"
                label="Moratorium Period"
                checked={showMoratorium}
                onChange={() => toggleSection("moratorium")}
              />
              {showMoratorium && (
                <div className="pt-2 pl-8 space-y-4">
                  <ToolInput
                    label="Moratorium (Months)"
                    type="number"
                    value={String(inputs.moratorium?.months || 0)}
                    onChange={(val) => setInputs({ 
                      moratorium: { 
                        months: Number(val), 
                        type: inputs.moratorium?.type || "full" 
                      } 
                    })}
                  />
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <label htmlFor="moratorium-interest-only" className="flex items-center gap-2 text-xs font-bold text-text-2 cursor-pointer">
                      <input id="moratorium-interest-only"
                        type="radio"
                        name="moratorium-type"
                        checked={inputs.moratorium?.type === "interest-only"}
                        onChange={() => setInputs({ 
                          moratorium: { 
                            months: inputs.moratorium?.months || 0, 
                            type: "interest-only" 
                          } 
                        })}
                      />
                      Interest Only
                    </label>
                    <label htmlFor="moratorium-full" className="flex items-center gap-2 text-xs font-bold text-text-2 cursor-pointer">
                      <input id="moratorium-full"
                        type="radio"
                        name="moratorium-type"
                        checked={inputs.moratorium?.type === "full"}
                        onChange={() => setInputs({ 
                          moratorium: { 
                            months: inputs.moratorium?.months || 0, 
                            type: "full" 
                          } 
                        })}
                      />
                      Full Moratorium
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
