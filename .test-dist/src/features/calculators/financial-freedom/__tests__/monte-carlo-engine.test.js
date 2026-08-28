import { describe, it, expect } from 'vitest';
import { runMonteCarloSimulation, runHistoricalBacktest, HISTORICAL_CRISES } from '../engine/monte-carlo-engine';
describe('Monte Carlo Simulation Engine', () => {
    const baseInputs = {
        currentAge: 30,
        targetAge: 50,
        longevityAge: 85,
        currentExpenses: 50000,
        expenseGrowthRate: 6,
        currentCorpus: 100000,
        monthlySip: 20000,
        expectedReturnRate: 12,
        retirementReturnRate: 8,
        withdrawalRate: 4,
        events: []
    };
    it('runs Monte Carlo simulation and returns percentiles', () => {
        // We run a small number of trials for the test to be fast and deterministic-ish
        const results = runMonteCarloSimulation(baseInputs, 10, 0); // stdDevMultiplier = 0 means deterministic returns
        expect(results.totalTrials).toBe(10);
        expect(results.successRate).toBeGreaterThanOrEqual(0);
        expect(results.percentiles.p50).toBeGreaterThan(0);
        // Since standard deviation is 0, all percentiles should be identical
        expect(results.percentiles.p5).toBeCloseTo(results.percentiles.p95, -2);
    });
    it('runs with stochastic variance', () => {
        const results = runMonteCarloSimulation(baseInputs, 100, 1.0);
        expect(results.totalTrials).toBe(100);
        // With variance, p95 should be significantly larger than p5
        expect(results.percentiles.p95).toBeGreaterThan(results.percentiles.p5);
    });
});
describe('Historical Backtesting Engine', () => {
    const baseInputs = {
        currentAge: 50, // retired immediately
        targetAge: 50,
        longevityAge: 85,
        currentExpenses: 100000, // 1L per month = 12L per year
        expenseGrowthRate: 6,
        currentCorpus: 30000000, // 3 Cr
        monthlySip: 0,
        expectedReturnRate: 12,
        retirementReturnRate: 8,
        withdrawalRate: 4,
        events: []
    };
    it('runs the 2008 GFC backtest', () => {
        const result = runHistoricalBacktest(baseInputs, '2008_GFC');
        expect(result.projections.length).toBeGreaterThan(0);
        // The first year return should match the 2008 GFC first year return (-37%)
        expect(result.projections[0]?.effectiveReturnRate).toBeCloseTo(-37, 0);
        // 2nd year is +26%
        expect(result.projections[1]?.effectiveReturnRate).toBeCloseTo(26, 0);
    });
    it('reverts to baseline after crisis period', () => {
        const result = runHistoricalBacktest(baseInputs, '2020_COVID');
        const crisisLength = HISTORICAL_CRISES['2020_COVID'].length;
        // year after crisis should return to baseline retirement return (8%)
        expect(result.projections[crisisLength]?.effectiveReturnRate).toBeCloseTo(8, 0);
    });
});
