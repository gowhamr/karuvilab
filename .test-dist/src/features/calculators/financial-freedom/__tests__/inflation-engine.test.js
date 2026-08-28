import { describe, it, expect } from 'vitest';
import { inflateAmount, calculateRealReturnRate, calculateCombinedAnnualExpenses } from '../engine/inflation-engine';
describe('Inflation Engine', () => {
    it('correctly inflates an amount over multiple years', () => {
        // 100,000 at 6% for 10 years = 100000 * 1.06^10 ≈ 179,084.77
        const result = inflateAmount(100000, 6, 10);
        expect(result).toBeCloseTo(179084.77, 1);
    });
    it('returns base amount when years <= 0 or baseAmount <= 0', () => {
        expect(inflateAmount(50000, 6, 0)).toBe(50000);
        expect(inflateAmount(0, 6, 10)).toBe(0);
        expect(inflateAmount(-100, 6, 5)).toBe(-100);
    });
    it('calculates real return rate via Fisher equation', () => {
        // Nominal 12%, Inflation 6% => (1.12 / 1.06 - 1) * 100 ≈ 5.66038%
        const realRate = calculateRealReturnRate(12, 6);
        expect(realRate).toBeCloseTo(5.66038, 3);
    });
    it('calculates combined annual expenses with separate general and medical inflation', () => {
        const combined = calculateCombinedAnnualExpenses(30000, 5000, 6, 12, 10);
        // General: 30000 * 12 * 1.06^10 ≈ 360000 * 1.7908477 ≈ 644,705.17
        // Medical: 5000 * 12 * 1.12^10 ≈ 60000 * 3.10584828 ≈ 186,350.90
        expect(combined.generalAnnual).toBeCloseTo(644705.17, 0);
        expect(combined.medicalAnnual).toBeCloseTo(186350.90, 0);
        expect(combined.totalAnnual).toBeCloseTo(644705.17 + 186350.90, 0);
    });
});
