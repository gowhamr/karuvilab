import { describe, it, expect } from 'vitest';
import { calculateFire } from '../../features/calculators/financial-freedom/fire-utils';
import { FireInputs } from '../../features/calculators/financial-freedom/types';

describe('Financial Freedom Calculator Engine', () => {
  it('calculates deterministic FIRE target and required SIP', () => {
    const inputs: FireInputs = {
      currentAge: 25,
      targetAge: 45,
      currentIncome: 50000,
      currentExpenses: 30000,
      currentCorpus: 500000,
      monthlySip: 10000,
      expectedReturnRate: 12,
      expectedInflationRate: 6,
      incomeGrowthRate: 10,
      expenseGrowthRate: 6,
      withdrawalRate: 4
    };

    const results = calculateFire(inputs);

    expect(results.targetCorpus).toBeGreaterThan(0);
    expect(results.projectedCorpus).toBeGreaterThan(0);
    expect(results.estimatedFreedomAge).toBeDefined();
    expect(results.projections.length).toBeGreaterThan(0);
    // Rough checks
    // 30,000 growing at 6% for 20 years = ~96214
    expect(results.targetMonthlyExpense).toBeCloseTo(30000 * Math.pow(1.06, 20), 0);
  });
});
