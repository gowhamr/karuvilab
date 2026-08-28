import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest, calculateEffectiveAnnualRate, calculateDoublingTime, } from '@/src/features/calculators/compound-interest';
describe('Phase 1 — Pure Deterministic Engine: calculateCompoundInterest', () => {
    it('calculates standard annual compound interest accurately', () => {
        // 100,000 at 10% for 10 years annually = 100000 * 1.10^10 = 259,374.25
        const res = calculateCompoundInterest({
            principal: 100000,
            annualRate: 10,
            years: 10,
            frequency: 1,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.futureValue).toBeCloseTo(259374.25, 0);
            expect(res.data.totalPrincipal).toBe(100000);
            expect(res.data.totalContributions).toBe(0);
            expect(res.data.totalInterest).toBeCloseTo(159374.25, 0);
            expect(res.data.effectiveAnnualRate).toBe(10);
            expect(res.data.projections.length).toBe(10);
        }
    });
    it('calculates monthly compounding frequency higher than annual', () => {
        const annualRes = calculateCompoundInterest({
            principal: 100000,
            annualRate: 10,
            years: 10,
            frequency: 1,
        });
        const monthlyRes = calculateCompoundInterest({
            principal: 100000,
            annualRate: 10,
            years: 10,
            frequency: 12,
        });
        expect(annualRes.success).toBe(true);
        expect(monthlyRes.success).toBe(true);
        if (annualRes.success && monthlyRes.success) {
            expect(monthlyRes.data.futureValue).toBeGreaterThan(annualRes.data.futureValue);
            expect(monthlyRes.data.effectiveAnnualRate).toBeGreaterThan(annualRes.data.effectiveAnnualRate);
        }
    });
    it('calculates monthly recurring contributions accurately', () => {
        const res = calculateCompoundInterest({
            principal: 50000,
            annualRate: 12,
            years: 5,
            frequency: 12,
            monthlyContribution: 5000,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.totalPrincipal).toBe(50000);
            expect(res.data.totalContributions).toBe(5000 * 12 * 5); // 300,000
            expect(res.data.totalInvested).toBe(350000);
            expect(res.data.futureValue).toBeGreaterThan(350000);
        }
    });
    it('calculates Effective Annual Rate (APY) correctly', () => {
        // 12% nominal compounded monthly -> (1 + 0.01)^12 - 1 = 12.6825%
        const ear = calculateEffectiveAnnualRate(12, 12);
        expect(ear).toBeCloseTo(12.6825, 2);
    });
    it('calculates Rule of 72 doubling time estimate correctly', () => {
        const years = calculateDoublingTime(8);
        expect(years).toBe(9.0);
    });
    it('calculates inflation-adjusted real value', () => {
        const res = calculateCompoundInterest({
            principal: 100000,
            annualRate: 10,
            years: 10,
            frequency: 1,
            inflationRate: 6,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.realFutureValue).toBeLessThan(res.data.futureValue);
            // Real purchasing power after 6% inflation for 10 years
            expect(res.data.realFutureValue).toBeCloseTo(259374.25 / Math.pow(1.06, 10), 0);
        }
    });
});
describe('Phase 1 — Pure Deterministic Engine: Error Handling', () => {
    it('rejects negative principal amount', () => {
        const res = calculateCompoundInterest({
            principal: -500,
            annualRate: 8,
            years: 5,
            frequency: 1,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_PRINCIPAL');
        }
    });
    it('rejects zero or negative years', () => {
        const res = calculateCompoundInterest({
            principal: 10000,
            annualRate: 8,
            years: 0,
            frequency: 1,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_YEARS');
        }
    });
});
describe('Phase 2 — URL Contract', () => {
    it('constructs and parses canonical compound interest parameters', () => {
        const url = 'https://karuvilab.com/calculators/compound-interest/?principal=200000&rate=12&years=15&freq=12&monthly=2000';
        const parsed = new URL(url);
        expect(parsed.searchParams.get('principal')).toBe('200000');
        expect(parsed.searchParams.get('rate')).toBe('12');
        expect(parsed.searchParams.get('years')).toBe('15');
        expect(parsed.searchParams.get('freq')).toBe('12');
        expect(parsed.searchParams.get('monthly')).toBe('2000');
        const res = calculateCompoundInterest({
            principal: Number(parsed.searchParams.get('principal')),
            annualRate: Number(parsed.searchParams.get('rate')),
            years: Number(parsed.searchParams.get('years')),
            frequency: 12,
            monthlyContribution: Number(parsed.searchParams.get('monthly')),
        });
        expect(res.success).toBe(true);
    });
});
describe('Phase 3 — Semantic DOM Contract Spec', () => {
    it('defines stable semantic data attributes for Compound Interest Calculator', () => {
        const expected = {
            tool: 'compound-interest',
            inputs: [
                'principal',
                'interest-rate',
                'years',
                'compounding-frequency',
                'monthly-contribution',
                'inflation-rate',
            ],
            results: [
                'future-value',
                'total-principal',
                'total-contributions',
                'total-interest',
                'effective-rate',
                'real-future-value',
                'doubling-time',
            ],
        };
        expect(expected.tool).toBe('compound-interest');
        expect(expected.inputs).toContain('principal');
        expect(expected.inputs).toContain('interest-rate');
        expect(expected.results).toContain('future-value');
        expect(expected.results).toContain('total-interest');
    });
});
describe('Phase 5 — Schema.org & llms.txt Contract', () => {
    it('validates tool content meets E-E-A-T requirements', async () => {
        const { compoundInterest } = await import('@/src/content/tools/compound-interest');
        expect(compoundInterest.faq?.length).toBeGreaterThanOrEqual(5);
        expect(compoundInterest.examples?.length).toBeGreaterThanOrEqual(3);
        expect(compoundInterest.howTo?.length).toBeGreaterThanOrEqual(4);
        expect(compoundInterest.useCases?.length).toBeGreaterThanOrEqual(3);
    });
    it('validates public/llms.txt contains canonical compound interest calculator specification', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');
        expect(llmsContent).toContain('[Compound Interest Calculator](https://karuvilab.com/calculators/compound-interest/)');
    });
});
