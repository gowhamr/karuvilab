import { describe, it, expect } from 'vitest';
import { calculateFIRE } from '../../features/financial-freedom-calculator/utils';
import { DEFAULT_INPUTS } from '../../features/financial-freedom-calculator/constants';

describe('Financial Freedom Calculator', () => {
  it('should calculate basic FIRE metrics correctly', () => {
    // Override some defaults for predictable math
    const inputs = {
      ...DEFAULT_INPUTS,
      currentAge: 30,
      retirementAge: 50,
      currentSavings: 1000000, // 10L
      monthlyIncome: 100000,   // 1L
      monthlyExpenses: 50000,  // 50k
      expectedAnnualReturn: 12,
      inflationRate: 6,
      safeWithdrawalRate: 4,
    };

    const results = calculateFIRE(inputs);

    // Actual savings = 50,000
    expect(results.actualMonthlySavings).toBe(50000);

    // Future expenses in 20 years at 6% inflation
    // 50000 * 12 = 6,00,000
    // 600000 * (1.06)^20 ≈ 19,24,281
    // Required Corpus = 19,24,281 / 0.04 = 48,107,025
    expect(results.requiredCorpus).toBeGreaterThan(48000000);
    expect(results.requiredCorpus).toBeLessThan(49000000);

    // With 12% return and 50k monthly savings over 20 years, they should reach it.
    expect(results.isAchievable).toBe(true);
    
    // FI age should be before or at retirement age
    expect(results.yearsToFI).toBeLessThanOrEqual(20);
    expect(results.yearsToFI).toBeGreaterThan(0);
  });

  it('should handle shortfall correctly', () => {
    const inputs = {
      ...DEFAULT_INPUTS,
      currentAge: 40,
      retirementAge: 50,
      currentSavings: 0,
      monthlyIncome: 60000,
      monthlyExpenses: 50000, // saving 10k/month
      expectedAnnualReturn: 10,
    };

    const results = calculateFIRE(inputs);

    expect(results.isAchievable).toBe(false);
    expect(results.monthlySavingsNeeded).toBeGreaterThan(inputs.monthlyIncome - inputs.monthlyExpenses);
    expect(results.monthlySavingsShortfall).toBeGreaterThan(0);
    expect(results.yearsToFI).toBe(-1); // Never reach FI in this scenario
  });

  it('should apply windfalls correctly', () => {
    const baseInputs = {
      ...DEFAULT_INPUTS,
      currentAge: 30,
      retirementAge: 50,
      currentSavings: 0,
      monthlyIncome: 100000,
      monthlyExpenses: 50000,
      oneTimeWindfalls: '',
    };

    const inputsWithWindfall = {
      ...baseInputs,
      oneTimeWindfalls: '5000000, 1000000', // 60L total
    };

    const baseResults = calculateFIRE(baseInputs);
    const windfallResults = calculateFIRE(inputsWithWindfall);

    expect(windfallResults.projectedRetirementCorpus).toBeGreaterThan(baseResults.projectedRetirementCorpus);
    expect(windfallResults.monthlySavingsNeeded).toBeLessThan(baseResults.monthlySavingsNeeded);
  });

  it('should generate projections up to MAX_AGE', () => {
    const results = calculateFIRE(DEFAULT_INPUTS);
    
    expect(results.projections).toBeDefined();
    expect(results.projections.length).toBeGreaterThan(0);
    expect(results.projections[results.projections.length - 1]?.age).toBe(100);
  });
});
