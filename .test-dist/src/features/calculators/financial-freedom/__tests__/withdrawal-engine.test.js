import { describe, it, expect } from 'vitest';
import { calculateRequiredCorpus, calculateInitialAnnualWithdrawal, calculateAdjustedWithdrawal } from '../engine/withdrawal-engine';
describe('Withdrawal Engine', () => {
    it('calculates 25x corpus for standard 4% SWR', () => {
        const annualExpenses = 1200000; // 12 Lakhs/year
        const corpus = calculateRequiredCorpus(annualExpenses, 4.0);
        // 1,200,000 / 0.04 = 30,000,000 (3 Crores)
        expect(corpus).toBe(30000000);
    });
    it('calculates 33.33x corpus for conservative 3.0% SWR', () => {
        const annualExpenses = 1200000;
        const corpus = calculateRequiredCorpus(annualExpenses, 3.0);
        // 1,200,000 / 0.03 = 40,000,000
        expect(corpus).toBe(40000000);
    });
    it('calculates 20x corpus for 5.0% SWR', () => {
        const annualExpenses = 1000000;
        const corpus = calculateRequiredCorpus(annualExpenses, 5.0);
        // 1,000,000 / 0.05 = 20,000,000
        expect(corpus).toBe(20000000);
    });
    it('calculates initial annual withdrawal amount', () => {
        const initialWithdrawal = calculateInitialAnnualWithdrawal(25000000, 4.0);
        expect(initialWithdrawal).toBe(1000000);
    });
    it('adjusts subsequent annual withdrawals for inflation', () => {
        const initialWithdrawal = 1000000;
        // 5 years into retirement at 6% inflation
        // 1000000 * 1.06^5 = 1,338,225.58
        const adjusted = calculateAdjustedWithdrawal(initialWithdrawal, 6, 5);
        expect(adjusted).toBeCloseTo(1338225.58, 1);
    });
});
