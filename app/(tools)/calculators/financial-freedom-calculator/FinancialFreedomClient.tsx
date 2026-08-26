"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToolInput } from '@/components/ui/ToolInput';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { formatCurrency } from '@/src/lib/utils';
import { calculateFire } from '@/src/features/calculators/financial-freedom/fire-utils';
import { FireInputs } from '@/src/features/calculators/financial-freedom/types';

export default function FinancialFreedomClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse initial state from URL or use defaults
  const [inputs, setInputs] = useState<FireInputs>(() => ({
    currentAge: parseInt(searchParams.get('age') || '25', 10),
    targetAge: parseInt(searchParams.get('target_age') || '45', 10),
    currentIncome: parseInt(searchParams.get('income') || '50000', 10),
    currentExpenses: parseInt(searchParams.get('expenses') || '30000', 10),
    currentCorpus: parseInt(searchParams.get('savings') || '500000', 10),
    monthlySip: parseInt(searchParams.get('sip') || '10000', 10),
    expectedReturnRate: parseFloat(searchParams.get('return') || '12'),
    expectedInflationRate: parseFloat(searchParams.get('inflation') || '6'),
    incomeGrowthRate: parseFloat(searchParams.get('income_growth') || '10'),
    expenseGrowthRate: parseFloat(searchParams.get('expense_growth') || '6'),
    withdrawalRate: parseFloat(searchParams.get('withdrawal') || '4'),
  }));

  // Update URL on debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      params.set('age', inputs.currentAge.toString());
      params.set('target_age', inputs.targetAge.toString());
      params.set('income', inputs.currentIncome.toString());
      params.set('expenses', inputs.currentExpenses.toString());
      params.set('savings', inputs.currentCorpus.toString());
      params.set('sip', inputs.monthlySip.toString());
      params.set('return', inputs.expectedReturnRate.toString());
      params.set('inflation', inputs.expectedInflationRate.toString());
      params.set('income_growth', inputs.incomeGrowthRate.toString());
      params.set('expense_growth', inputs.expenseGrowthRate.toString());
      params.set('withdrawal', inputs.withdrawalRate.toString());
      
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 500);
    return () => clearTimeout(timeout);
  }, [inputs, router]);

  const handleChange = useCallback((key: keyof FireInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value || 0 }));
  }, []);

  const results = useMemo(() => calculateFire(inputs), [inputs]);

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
      {/* 1. Results Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Financial Freedom Results">
        <MetricCard
          label="Target FIRE Corpus"
          value={formatCurrency(results.targetCorpus)}
          dataResultField="target-corpus"
          accent
          className="sm:col-span-2"
        />
        <MetricCard
          label="Required Monthly SIP"
          value={formatCurrency(results.requiredMonthlySip)}
          dataResultField="required-sip"
          sub={`To hit target by age ${inputs.targetAge}`}
        />
        <MetricCard
          label="Freedom Age"
          value={results.estimatedFreedomAge !== -1 ? results.estimatedFreedomAge.toString() : 'Not Reached'}
          dataResultField="freedom-age"
          sub={results.estimatedFreedomAge !== -1 ? `In ${results.yearsToFreedom} years` : 'Increase SIP'}
        />
      </section>

      {/* 2. Form Inputs */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-2 p-4 sm:p-6 rounded-3xl min-w-0 w-full border border-border">
        <div className="space-y-6">
          <h3 className="font-bold text-lg text-text mb-4">Personal Details</h3>
          <div data-input-field="current-age">
            <SliderField
              id="fire-current-age"
              label="Current Age"
              value={inputs.currentAge}
              onChange={(val) => handleChange('currentAge', val)}
              min={18} max={80}
            />
          </div>
          <div data-input-field="target-age">
            <SliderField
              id="fire-target-age"
              label="Target FIRE Age"
              value={inputs.targetAge}
              onChange={(val) => handleChange('targetAge', val)}
              min={inputs.currentAge + 1} max={90}
            />
          </div>
          <div data-input-field="current-corpus">
            <ToolInput
              id="fire-current-corpus"
              label="Current Savings (Corpus)"
              value={inputs.currentCorpus.toString()}
              onChange={(val) => handleChange('currentCorpus', parseInt(val, 10) || 0)}
              type="number"
            />
          </div>
          <div data-input-field="monthly-sip">
            <ToolInput
              id="fire-monthly-sip"
              label="Current Monthly SIP"
              value={inputs.monthlySip.toString()}
              onChange={(val) => handleChange('monthlySip', parseInt(val, 10) || 0)}
              type="number"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-lg text-text mb-4">Cashflow & Rates</h3>
          <div className="grid grid-cols-2 gap-4">
            <div data-input-field="current-income">
              <ToolInput
                id="fire-current-income"
                label="Monthly Income"
                value={inputs.currentIncome.toString()}
                onChange={(val) => handleChange('currentIncome', parseInt(val, 10) || 0)}
                type="number"
              />
            </div>
            <div data-input-field="current-expenses">
              <ToolInput
                id="fire-current-expenses"
                label="Monthly Expenses"
                value={inputs.currentExpenses.toString()}
                onChange={(val) => handleChange('currentExpenses', parseInt(val, 10) || 0)}
                type="number"
              />
            </div>
          </div>
          
          <div data-input-field="return-rate">
            <SliderField
              id="fire-return-rate"
              label="Expected Return Rate (%)"
              value={inputs.expectedReturnRate}
              onChange={(val) => handleChange('expectedReturnRate', val)}
              min={1} max={30} step={0.5}
            />
          </div>
          <div data-input-field="inflation-rate">
            <SliderField
              id="fire-inflation-rate"
              label="Expense Inflation Rate (%)"
              value={inputs.expenseGrowthRate}
              onChange={(val) => handleChange('expenseGrowthRate', val)}
              min={1} max={15} step={0.5}
            />
          </div>
          <div data-input-field="withdrawal-rate">
            <SliderField
              id="fire-withdrawal-rate"
              label="Withdrawal Rate (4% Rule)"
              value={inputs.withdrawalRate}
              onChange={(val) => handleChange('withdrawalRate', val)}
              min={1} max={10} step={0.1}
            />
          </div>
        </div>
      </section>

      {/* 3. Detailed Breakdown */}
      <section className="bg-surface-2 p-4 sm:p-6 rounded-3xl min-w-0 w-full border border-border">
        <h3 className="font-bold text-lg text-text mb-4">Year-by-Year Projection</h3>
        <div className="overflow-x-auto w-full max-w-full min-w-0">
          <table className="w-full text-sm text-left text-text-muted whitespace-nowrap">
            <thead className="text-xs text-text uppercase bg-surface">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Age</th>
                <th className="px-4 py-3">Expenses (Annual)</th>
                <th className="px-4 py-3">Invested</th>
                <th className="px-4 py-3 rounded-r-lg">Corpus</th>
              </tr>
            </thead>
            <tbody>
              {results.projections.filter((p, i) => i % 5 === 0 || i === inputs.targetAge - inputs.currentAge - 1).map((proj) => (
                <tr key={proj.year} className={`border-b border-border/50 ${proj.isFinanciallyFree ? 'bg-primary/5' : ''}`}>
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    {proj.age}
                    {proj.age === inputs.targetAge && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">Target</span>}
                    {proj.isFinanciallyFree && <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full font-bold">FIRE</span>}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(Math.round(proj.annualExpenses))}</td>
                  <td className="px-4 py-3">{formatCurrency(Math.round(proj.totalInvested))}</td>
                  <td className="px-4 py-3 font-bold">{formatCurrency(Math.round(proj.endCorpus))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Hidden JSON output for AI */}
      <div className="hidden" aria-hidden="true" data-result-field="json-payload">
        {JSON.stringify(results, null, 2)}
      </div>
    </div>
  );
}
