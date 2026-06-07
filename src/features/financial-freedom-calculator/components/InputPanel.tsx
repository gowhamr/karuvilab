"use client";

import { useFinancialFreedomStore } from '../store';
import { SliderField } from '@/components/ui/SliderField';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { ToolInput } from '@/components/ui/ToolInput';
import { formatCurrency } from '@/src/lib/utils';

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
          
          <SliderField
            id="currentSavings"
            label="Current Savings"
            min={0}
            max={50000000}
            step={10000}
            value={inputs.currentSavings}
            onChange={(v) => setInputs({ currentSavings: v })}
            format={formatCurrency}
          />
          
          <SliderField
            id="monthlyIncome"
            label="Monthly Income (Post-tax)"
            min={0}
            max={2000000}
            step={5000}
            value={inputs.monthlyIncome}
            onChange={(v) => setInputs({ monthlyIncome: v })}
            format={formatCurrency}
          />
          
          <SliderField
            id="monthlyExpenses"
            label="Monthly Expenses"
            min={0}
            max={2000000}
            step={1000}
            value={inputs.monthlyExpenses}
            onChange={(v) => setInputs({ monthlyExpenses: v })}
            format={formatCurrency}
          />
          
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
