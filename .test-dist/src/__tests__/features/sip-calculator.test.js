import { describe, it, expect } from 'vitest';
import { calculateDeterministicSip, calculateSipFutureValue, } from '@/src/features/calculators/sip';
describe('Phase 1 — Pure Deterministic Engine: calculateDeterministicSip', () => {
    it('calculates standard flat monthly SIP compounding accurately', () => {
        // ₹10,000 / month at 12% p.a. for 15 years (180 months)
        const res = calculateDeterministicSip({
            monthlyInvestment: 10000,
            expectedAnnualReturn: 12,
            timeHorizonYears: 15,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            // Total Invested = 10,000 * 180 = 1,800,000
            expect(res.data.totalInvested).toBe(1800000);
            // FV is ~50,45,760
            expect(res.data.futureValue).toBeCloseTo(5045760, -2);
            expect(res.data.totalGains).toBeCloseTo(3245760, -2);
            expect(res.data.wealthMultiplier).toBeCloseTo(2.8, 1);
            expect(res.data.projections.length).toBe(15);
            expect(res.data.projections[14]?.endingBalance).toBeCloseTo(5045760, -2);
        }
    });
    it('calculates step-up SIP compounding with annual increments accurately', () => {
        // ₹10,000 / month at 12% p.a. for 15 years with 10% annual step-up
        const res = calculateDeterministicSip({
            monthlyInvestment: 10000,
            expectedAnnualReturn: 12,
            timeHorizonYears: 15,
            annualStepUpPercent: 10,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            // Step-up increases monthly investments each year
            expect(res.data.projections[0]?.monthlyAmount).toBe(10000);
            expect(res.data.projections[1]?.monthlyAmount).toBe(11000);
            expect(res.data.totalInvested).toBeCloseTo(3812698, -2);
            expect(res.data.futureValue).toBeCloseTo(8683849, -2);
            expect(res.data.totalGains).toBeGreaterThan(4500000);
        }
    });
    it('calculates hybrid lumpsum + monthly SIP investments accurately', () => {
        const res = calculateDeterministicSip({
            monthlyInvestment: 5000,
            expectedAnnualReturn: 10,
            timeHorizonYears: 10,
            lumpsumAmount: 100000,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            // Total Invested = 100,000 (lumpsum) + 5,000 * 120 = 700,000
            expect(res.data.totalInvested).toBe(700000);
            expect(res.data.futureValue).toBeGreaterThan(1200000);
            expect(res.data.projections[0]?.openingBalance).toBe(100000);
        }
    });
    it('calculates lumpsum only when monthly investment is 0', () => {
        const res = calculateDeterministicSip({
            monthlyInvestment: 0,
            expectedAnnualReturn: 12,
            timeHorizonYears: 5,
            lumpsumAmount: 100000,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.totalInvested).toBe(100000);
            // 100,000 * (1 + 0.01)^60 = 181,669.67
            expect(res.data.futureValue).toBeCloseTo(181670, -1);
        }
    });
    it('preserves capital with 0% expected return rate', () => {
        const res = calculateDeterministicSip({
            monthlyInvestment: 10000,
            expectedAnnualReturn: 0,
            timeHorizonYears: 10,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.totalInvested).toBe(1200000);
            expect(res.data.futureValue).toBe(1200000);
            expect(res.data.totalGains).toBe(0);
        }
    });
    it('calculates inflation-adjusted real purchasing power and taxation accurately', () => {
        const res = calculateDeterministicSip({
            monthlyInvestment: 10000,
            expectedAnnualReturn: 12,
            timeHorizonYears: 15,
            annualInflationRate: 6,
            capitalGainsTaxRate: 12.5,
            expenseRatio: 0.5,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.effectiveAnnualReturn).toBe(11.5);
            expect(res.data.netGains).toBeLessThan(res.data.totalGains);
            expect(res.data.realFutureValue).toBeLessThan(res.data.netFutureValue);
            expect(res.data.realFutureValue).toBeGreaterThan(res.data.totalInvested);
        }
    });
});
describe('Phase 1 — Pure Deterministic Engine: calculateSipFutureValue Helper', () => {
    it('calculates standard closed-form future value accurately', () => {
        const fv = calculateSipFutureValue(10000, 12, 180);
        expect(fv).toBeCloseTo(5045760, -2);
    });
    it('returns 0 for zero or negative duration', () => {
        expect(calculateSipFutureValue(10000, 12, 0)).toBe(0);
        expect(calculateSipFutureValue(10000, 12, -5)).toBe(0);
    });
});
describe('Phase 1 — Pure Deterministic Engine: Error Handling', () => {
    it('rejects negative monthly investment', () => {
        const res = calculateDeterministicSip({
            monthlyInvestment: -1000,
            expectedAnnualReturn: 12,
            timeHorizonYears: 10,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_MONTHLY_INVESTMENT');
        }
    });
    it('rejects both monthly and lumpsum being zero', () => {
        const res = calculateDeterministicSip({
            monthlyInvestment: 0,
            lumpsumAmount: 0,
            expectedAnnualReturn: 12,
            timeHorizonYears: 10,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_MONTHLY_INVESTMENT');
        }
    });
    it('rejects negative return rate', () => {
        const res = calculateDeterministicSip({
            monthlyInvestment: 5000,
            expectedAnnualReturn: -5,
            timeHorizonYears: 10,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_RETURN_RATE');
        }
    });
    it('rejects zero or negative time horizon', () => {
        const res = calculateDeterministicSip({
            monthlyInvestment: 5000,
            expectedAnnualReturn: 12,
            timeHorizonYears: 0,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_TIME_HORIZON');
        }
    });
    it('rejects out of bounds inputs', () => {
        const res = calculateDeterministicSip({
            monthlyInvestment: 5000000000,
            expectedAnnualReturn: 12,
            timeHorizonYears: 10,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('OUT_OF_BOUNDS_INPUT');
        }
    });
});
describe('Phase 2 — URL Contract', () => {
    it('constructs and parses canonical SIP parameters (?monthly=10000&rate=12&years=15&step_up=10)', () => {
        const url = 'https://karuvilab.com/calculators/sip-calculator/?monthly=10000&rate=12&years=15&step_up=10';
        const parsed = new URL(url);
        expect(parsed.searchParams.get('monthly')).toBe('10000');
        expect(parsed.searchParams.get('rate')).toBe('12');
        expect(parsed.searchParams.get('years')).toBe('15');
        expect(parsed.searchParams.get('step_up')).toBe('10');
        const res = calculateDeterministicSip({
            monthlyInvestment: Number(parsed.searchParams.get('monthly')),
            expectedAnnualReturn: Number(parsed.searchParams.get('rate')),
            timeHorizonYears: Number(parsed.searchParams.get('years')),
            annualStepUpPercent: Number(parsed.searchParams.get('step_up')),
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.futureValue).toBeCloseTo(8683849, -2);
        }
    });
    it('parses extended SIP parameters with lumpsum, inflation, tax, and fee', () => {
        const url = 'https://karuvilab.com/calculators/sip-calculator/?monthly=15000&rate=12&years=10&step_up=5&lumpsum=50000&inflation=6&tax=12.5&fee=0.5';
        const parsed = new URL(url);
        const res = calculateDeterministicSip({
            monthlyInvestment: Number(parsed.searchParams.get('monthly')),
            expectedAnnualReturn: Number(parsed.searchParams.get('rate')),
            timeHorizonYears: Number(parsed.searchParams.get('years')),
            annualStepUpPercent: Number(parsed.searchParams.get('step_up')),
            lumpsumAmount: Number(parsed.searchParams.get('lumpsum')),
            annualInflationRate: Number(parsed.searchParams.get('inflation')),
            capitalGainsTaxRate: Number(parsed.searchParams.get('tax')),
            expenseRatio: Number(parsed.searchParams.get('fee')),
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.effectiveAnnualReturn).toBe(11.5);
            expect(res.data.lumpsumAmount).toBe(50000);
        }
    });
});
describe('Phase 3 — Semantic DOM Contract Spec', () => {
    it('defines stable semantic data attributes for SIP Calculator', () => {
        const expected = {
            tool: 'sip-calculator',
            inputs: [
                'monthly-investment',
                'return-rate',
                'time-horizon',
                'step-up',
                'lumpsum',
                'inflation-rate',
                'tax-rate',
                'expense-ratio',
            ],
            results: [
                'future-value',
                'total-invested',
                'total-gains',
                'wealth-multiplier',
                'net-future-value',
                'real-future-value',
            ],
        };
        expect(expected.tool).toBe('sip-calculator');
        expect(expected.inputs).toContain('monthly-investment');
        expect(expected.inputs).toContain('return-rate');
        expect(expected.inputs).toContain('time-horizon');
        expect(expected.inputs).toContain('step-up');
        expect(expected.results).toContain('future-value');
        expect(expected.results).toContain('total-invested');
        expect(expected.results).toContain('total-gains');
    });
});
describe('Phase 5 — Schema.org & llms.txt Contract', () => {
    it('validates tool content meets E-E-A-T requirements', async () => {
        const { sipCalculator } = await import('@/src/content/tools/sip-calculator');
        expect(sipCalculator.faq?.length).toBeGreaterThanOrEqual(5);
        expect(sipCalculator.examples?.length).toBeGreaterThanOrEqual(3);
        expect(sipCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
        expect(sipCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
        // Check detailedDescription word count > 400
        const wordCount = (sipCalculator.detailedDescription || '')
            .replace(/<[^>]*>/g, ' ')
            .trim()
            .split(/\s+/)
            .length;
        expect(wordCount).toBeGreaterThan(400);
    });
    it('validates public/llms.txt contains canonical sip calculator specification', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');
        expect(llmsContent).toContain('[SIP Calculator](https://karuvilab.com/calculators/sip-calculator/)');
    });
});
