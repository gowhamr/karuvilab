"use client";

import React from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { useEmiStore } from "@/src/features/emi-calculator/store";
import { formatCurrency } from "@/src/lib/utils";

export function PrepaymentSection({ savings }: { savings?: { interest: number; months: number } | undefined }) {
  const inputs = useEmiStore(state => state.inputs);
  const setInputs = useEmiStore(state => state.setInputs);
  const showPrepayment = useEmiStore(state => state.showPrepayment);
  const toggleSection = useEmiStore(state => state.toggleSection);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Checkbox
            id="enable-prepayment"
            label="Prepayment Simulator"
            checked={showPrepayment}
            onChange={() => toggleSection('prepayment')}
          />
        </div>
        {showPrepayment && savings && (savings.interest > 0 || savings.months > 0) && (
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <span className="text-xs font-black text-green-600 uppercase tracking-widest">
              Savings: {formatCurrency(savings.interest)} & {savings.months} Months
            </span>
          </div>
        )}
      </div>

      {showPrepayment && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ToolInput
              label="Recurring Prepayment"
              type="number"
              value={String(inputs.recurringPrepayment?.amount || 0)}
              onChange={(val) => setInputs({ 
                recurringPrepayment: { 
                  amount: Number(val), 
                  startMonth: inputs.recurringPrepayment?.startMonth || 1 
                } 
              })}
              description="Monthly extra amount"
            />
            <ToolInput
              label="Start from Month"
              type="number"
              value={String(inputs.recurringPrepayment?.startMonth || 1)}
              onChange={(val) => setInputs({ 
                recurringPrepayment: { 
                  amount: inputs.recurringPrepayment?.amount || 0, 
                  startMonth: Number(val) 
                } 
              })}
              description="e.g., month 1, 12, etc."
            />
          </div>
          
          <div className="p-4 bg-blue/5 border border-blue/10 rounded-xl">
            <p className="text-xs text-text-3 leading-relaxed">
              Adding recurring prepayments significantly reduces your total interest and loan tenure. 
              The simulation assumes you continue this extra payment until the loan is closed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
