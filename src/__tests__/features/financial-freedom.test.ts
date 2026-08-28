import { describe, it, expect } from 'vitest';
import { calculateFire } from '../../features/calculators/financial-freedom/fire-utils';
import { FireInputs } from '../../features/calculators/financial-freedom/types';

describe('Financial Freedom Calculator Engine', () => {
  const baseInputs: FireInputs = {
    currentAge: 25,
    targetAge: 45,
    traditionalRetirementAge: 65,
    currentIncome: 50000,
    currentExpenses: 30000,
    currentCorpus: 500000,
    monthlySip: 10000,
    expectedReturnRate: 12,
    expectedInflationRate: 6,
    incomeGrowthRate: 10,
    expenseGrowthRate: 6,
    withdrawalRate: 4,
    fireVariant: 'regular',
    leanMultiplier: 0.7,
    fatMultiplier: 1.5,
    baristaMonthlyIncome: 15000,
  };

  it('calculates deterministic FIRE target and required SIP for regular FIRE', () => {
    const results = calculateFire(baseInputs);

    expect(results.targetCorpus).toBeGreaterThan(0);
    expect(results.projectedCorpus).toBeGreaterThan(0);
    expect(results.estimatedFreedomAge).toBeDefined();
    expect(results.projections.length).toBeGreaterThan(0);
    // 30,000 growing at 6% for 20 years = ~96214
    expect(results.targetMonthlyExpense).toBeCloseTo(30000 * Math.pow(1.06, 20), 0);
  });

  it('calculates leaner target for Lean FIRE', () => {
    const results = calculateFire({ ...baseInputs, fireVariant: 'lean' });
    const regResults = calculateFire(baseInputs);
    expect(results.targetCorpus).toBeLessThan(regResults.targetCorpus);
  });

  it('calculates fatter target for Fat FIRE', () => {
    const results = calculateFire({ ...baseInputs, fireVariant: 'fat' });
    const regResults = calculateFire(baseInputs);
    expect(results.targetCorpus).toBeGreaterThan(regResults.targetCorpus);
  });

  it('calculates smaller required SIP for Coast FIRE', () => {
    const results = calculateFire({ ...baseInputs, fireVariant: 'coast' });
    const regResults = calculateFire(baseInputs);
    // Coast FIRE target corpus today should be smaller because it has 20 years to compound
    expect(results.targetCorpus).toBeLessThan(regResults.targetCorpus);
    expect(results.requiredMonthlySip).toBeLessThan(regResults.requiredMonthlySip);
  });
});
