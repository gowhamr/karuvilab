"use client";

import { useFinancialFreedomStore } from '../store';
import { MetricCard } from '@/components/ui/MetricCard';
import { Target, Clock, TrendingUp, AlertTriangle, Coins } from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';
import { m, AnimatePresence } from 'framer-motion';

export function ResultsPanel() {
  const results = useFinancialFreedomStore(state => state.results);
  const inputs = useFinancialFreedomStore(state => state.inputs);

  const {
    requiredCorpus,
    yearsToFI,
    monthlySavingsNeeded,
    monthlySavingsShortfall,
    actualMonthlySavings,
    projectedRetirementCorpus,
    isAchievable
  } = results;

  return (
    <div className="space-y-6" aria-live="polite">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          label="Required Corpus"
          value={formatCurrency(requiredCorpus)}
          icon={Target}
          accent
          sub={`At age ${inputs.retirementAge} (inflation adjusted)`}
        />
        
          <MetricCard
            label="Years to FI"
            value={yearsToFI === -1 ? 'Never' : `${yearsToFI} yrs`}
            icon={Clock}
            sub={
              inputs.monthlyExpenses > inputs.monthlyIncome 
                ? 'Deficit: Insufficient Income to Save' 
                : yearsToFI === -1 
                  ? 'Cannot reach FI with current savings' 
                  : `Reach FI at age ${inputs.currentAge + yearsToFI}`
            }
            trend={yearsToFI !== -1 && yearsToFI <= (inputs.retirementAge - inputs.currentAge) ? { value: 'On Track', isPositive: true } : { value: 'Falling Short', isPositive: false }}
          />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          label="Projected Corpus"
          value={formatCurrency(projectedRetirementCorpus)}
          icon={TrendingUp}
          sub="Expected corpus at retirement age"
          trend={isAchievable ? { value: 'Sufficient', isPositive: true } : { value: 'Insufficient', isPositive: false }}
        />
        
        <MetricCard
          label="Monthly Savings Target"
          value={formatCurrency(monthlySavingsNeeded)}
          icon={Coins}
          sub={`Currently saving ${formatCurrency(actualMonthlySavings)}/mo`}
        />
      </div>

      <AnimatePresence>
        {monthlySavingsShortfall > 0 && (
          <m.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-error/10 border border-error/20 p-4 rounded-xl flex items-start gap-3 text-sm text-text-2 mt-4"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-500 dark:text-red-400">Savings Shortfall</p>
              <p>You need to save an additional <strong>{formatCurrency(monthlySavingsShortfall)}</strong> per month to reach your required corpus by age {inputs.retirementAge}.</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
