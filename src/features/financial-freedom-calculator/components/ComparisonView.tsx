"use client";

import { useFinancialFreedomStore } from '../store';
import { formatCurrency } from '@/src/lib/utils';
import { Trash2 } from 'lucide-react';

export function ComparisonView() {
  const scenarios = useFinancialFreedomStore(state => state.scenarios);
  const deleteScenario = useFinancialFreedomStore(state => state.deleteScenario);
  const loadScenario = useFinancialFreedomStore(state => state.loadScenario);

  if (scenarios.length === 0) {
    return (
      <div className="text-center p-8 text-text-3">
        <p>No saved scenarios to compare. Save your current inputs as a scenario to see them here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full pb-4">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-border">
            <th className="py-4 px-4 font-bold text-text-2 uppercase tracking-widest text-[11px]">Metric</th>
            {scenarios.map(s => (
              <th key={s.id} className="py-4 px-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-blue truncate">{s.name}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => loadScenario(s.id)}
                      className="text-[10px] uppercase font-bold tracking-widest bg-blue/10 text-blue px-2 py-1 rounded hover:bg-blue/20 transition-colors"
                      aria-label={`Load scenario ${s.name}`}
                    >
                      Load
                    </button>
                    <button 
                      onClick={() => deleteScenario(s.id)}
                      className="text-text-3 hover:text-red-500 transition-colors"
                      aria-label={`Delete scenario ${s.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          <tr className="hover:bg-surface/50 transition-colors">
            <td className="py-3 px-4 font-medium text-text-2">Retirement Age</td>
            {scenarios.map(s => <td key={s.id} className="py-3 px-4">{s.inputs.retirementAge}</td>)}
          </tr>
          <tr className="hover:bg-surface/50 transition-colors">
            <td className="py-3 px-4 font-medium text-text-2">Monthly Savings</td>
            {scenarios.map(s => <td key={s.id} className="py-3 px-4">{formatCurrency(s.results.actualMonthlySavings)}</td>)}
          </tr>
          <tr className="hover:bg-surface/50 transition-colors">
            <td className="py-3 px-4 font-medium text-text-2">Required Corpus</td>
            {scenarios.map(s => <td key={s.id} className="py-3 px-4 font-bold">{formatCurrency(s.results.requiredCorpus)}</td>)}
          </tr>
          <tr className="hover:bg-surface/50 transition-colors">
            <td className="py-3 px-4 font-medium text-text-2">Projected Corpus</td>
            {scenarios.map(s => (
              <td key={s.id} className={`py-3 px-4 font-bold ${s.results.isAchievable ? 'text-emerald-500' : 'text-red-500'}`}>
                {formatCurrency(s.results.projectedRetirementCorpus)}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-surface/50 transition-colors">
            <td className="py-3 px-4 font-medium text-text-2">Years to FI</td>
            {scenarios.map(s => <td key={s.id} className="py-3 px-4">{s.results.yearsToFI === -1 ? 'Never' : s.results.yearsToFI}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
