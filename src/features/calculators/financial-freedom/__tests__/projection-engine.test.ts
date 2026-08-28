import { describe, it, expect } from 'vitest';
import { calculateProjection } from '../engine/projection-engine';
import { FireInputs } from '../models/assumptions';

describe('Projection Engine', () => {
  const baseInputs: FireInputs = {
    currentAge: 25,
    targetAge: 45,
    traditionalRetirementAge: 65,
    longevityAge: 85,
    currentIncome: 50000,
    currentExpenses: 30000,
    currentMedicalExpenses: 0,
    currentCorpus: 500000,
    monthlySip: 10000,
    expectedReturnRate: 12,
    retirementReturnRate: 8,
    expectedInflationRate: 6,
    healthcareInflationRate: 10,
    incomeGrowthRate: 10,
    expenseGrowthRate: 6,
    withdrawalRate: 4,
    fireVariant: 'regular',
    leanMultiplier: 0.7,
    fatMultiplier: 1.5,
    baristaMonthlyIncome: 15000,
    events: []
  };

  it('calculates deterministic FIRE target and required SIP for regular FIRE', () => {
    const results = calculateProjection(baseInputs);

    expect(results.targetCorpus).toBeGreaterThan(0);
    expect(results.projectedCorpus).toBeGreaterThan(0);
    expect(results.estimatedFreedomAge).toBeDefined();
    expect(results.projections.length).toBe(60); // 85 - 25 = 60 years
    // 30,000 growing at 6% for 20 years = ~96,214
    expect(results.targetMonthlyExpense).toBeCloseTo(30000 * Math.pow(1.06, 20), 0);
  });

  it('calculates leaner target for Lean FIRE', () => {
    const results = calculateProjection({ ...baseInputs, fireVariant: 'lean' });
    const regResults = calculateProjection(baseInputs);
    expect(results.targetCorpus).toBeLessThan(regResults.targetCorpus);
  });

  it('calculates fatter target for Fat FIRE', () => {
    const results = calculateProjection({ ...baseInputs, fireVariant: 'fat' });
    const regResults = calculateProjection(baseInputs);
    expect(results.targetCorpus).toBeGreaterThan(regResults.targetCorpus);
  });

  it('calculates smaller required SIP for Coast FIRE', () => {
    const results = calculateProjection({ ...baseInputs, fireVariant: 'coast' });
    const regResults = calculateProjection(baseInputs);
    expect(results.targetCorpus).toBeLessThan(regResults.targetCorpus);
    expect(results.requiredMonthlySip).toBeLessThan(regResults.requiredMonthlySip);
  });

  it('handles Barista FIRE by offsetting living expenses with retirement part-time income', () => {
    const results = calculateProjection({ ...baseInputs, fireVariant: 'barista', baristaMonthlyIncome: 15000 });
    const regResults = calculateProjection(baseInputs);
    expect(results.targetCorpus).toBeLessThan(regResults.targetCorpus);
  });

  it('supports dual-phase return rates (accumulation return vs retirement return)', () => {
    // Aggressive accumulation (14%) vs conservative retirement (6%)
    const dualPhaseResults = calculateProjection({
      ...baseInputs,
      expectedReturnRate: 14,
      retirementReturnRate: 6
    });

    const singlePhaseResults = calculateProjection({
      ...baseInputs,
      expectedReturnRate: 14,
      retirementReturnRate: 14
    });

    // In accumulation phase (year 10), effective return rate is 14%
    expect(dualPhaseResults.projections[9]?.effectiveReturnRate).toBe(14);
    // In retirement phase (year 25, age 50), effective return rate is 6%
    expect(dualPhaseResults.projections[24]?.effectiveReturnRate).toBe(6);
    expect(singlePhaseResults.projections[24]?.effectiveReturnRate).toBe(14);
  });

  it('calculates independent healthcare inflation trajectory', () => {
    const withMedical = calculateProjection({
      ...baseInputs,
      currentMedicalExpenses: 5000,
      expectedInflationRate: 6,
      healthcareInflationRate: 12
    });

    const withoutMedical = calculateProjection({
      ...baseInputs,
      currentMedicalExpenses: 0
    });

    expect(withMedical.targetCorpus).toBeGreaterThan(withoutMedical.targetCorpus);
    // In year 20, medical expense should have grown by 1.12^20
    expect(withMedical.projections[19]?.medicalExpenses).toBeCloseTo(5000 * 12 * Math.pow(1.12, 19), -2);
  });

  it('supports configurable longevity horizon up to age 105', () => {
    const results = calculateProjection({
      ...baseInputs,
      longevityAge: 100
    });

    expect(results.projections.length).toBe(75); // 100 - 25 = 75
    expect(results.projections[results.projections.length - 1]?.age).toBe(100);
  });

  it('applies one-time windfall inflow and outflow events to timeline and freedom calculation', () => {
    const withWindfall = calculateProjection({
      ...baseInputs,
      events: [
        {
          id: 'windfall-1',
          title: 'ESOP Vesting',
          yearOrAge: 30,
          amount: 5000000,
          type: 'inflow',
          isRecurring: false,
          inflationAdjusted: false,
          category: 'windfall'
        }
      ]
    });

    const normal = calculateProjection(baseInputs);

    // Windfall should accelerate freedom age or increase ending net worth
    expect(withWindfall.projections[4]?.eventInflows).toBe(5000000);
    const withWindfallCorpus = withWindfall.projections[4]?.endCorpus ?? 0;
    const normalCorpus = normal.projections[4]?.endCorpus ?? 0;
    expect(withWindfallCorpus).toBeGreaterThan(normalCorpus);
    expect(withWindfall.eventsApplied).toBe(1);
  });

  it('sanitizes and clamps invalid or extreme inputs gracefully without crashing', () => {
    const result = calculateProjection({
      currentAge: -5,
      targetAge: 150,
      currentExpenses: -20000,
      withdrawalRate: -1
    });

    expect(result.targetCorpus).toBeGreaterThanOrEqual(0);
    expect(result.projections.length).toBeGreaterThan(0);
    expect(isNaN(result.targetCorpus)).toBe(false);
  });
});
