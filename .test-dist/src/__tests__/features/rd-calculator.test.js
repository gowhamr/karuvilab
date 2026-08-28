import { describe, it, expect } from 'vitest';
import { calculateDeterministicRd, calculateRdMaturityValue, calculateEffectiveApy, } from '@/src/features/calculators/rd';
describe('Phase 1 — Pure Deterministic Engine: calculateDeterministicRd', () => {
    it('calculates Indian standard quarterly compounding RD accurately', () => {
        // ₹5,000 / month at 7% p.a. for 5 years (60 months) with quarterly compounding
        const res = calculateDeterministicRd({
            monthlyDeposit: 5000,
            annualInterestRate: 7,
            tenureYears: 5,
            compoundingFrequency: 4,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            // Total Invested = 5,000 * 60 = 300,000
            expect(res.data.totalInvested).toBe(300000);
            // Maturity ~ ₹3,59,664
            expect(res.data.maturityAmount).toBeCloseTo(359663.95, 0);
            expect(res.data.totalInterest).toBeCloseTo(59663.95, 0);
            // Effective APY yield for 7% compounded quarterly is ~7.19%
            expect(res.data.effectiveApy).toBeCloseTo(7.19, 2);
            expect(res.data.projections.length).toBe(5);
            expect(res.data.projections[4]?.maturityValue).toBeCloseTo(359663.95, 0);
            expect(res.data.projections[4]?.cumulativeInvested).toBe(300000);
        }
    });
    it('calculates senior citizen rate boost (+0.50%) accurately', () => {
        // Regular rate: 7.0%, Senior Citizen rate: 7.50%
        const resRegular = calculateDeterministicRd({
            monthlyDeposit: 5000,
            annualInterestRate: 7,
            tenureYears: 5,
            isSeniorCitizen: false,
        });
        const resSenior = calculateDeterministicRd({
            monthlyDeposit: 5000,
            annualInterestRate: 7,
            tenureYears: 5,
            isSeniorCitizen: true,
            seniorCitizenRateBoost: 0.5,
        });
        expect(resRegular.success).toBe(true);
        expect(resSenior.success).toBe(true);
        if (resRegular.success && resSenior.success) {
            expect(resSenior.data.effectiveInterestRate).toBe(7.5);
            expect(resSenior.data.effectiveApy).toBeCloseTo(7.71, 2);
            expect(resSenior.data.maturityAmount).toBeGreaterThan(resRegular.data.maturityAmount);
            expect(resSenior.data.maturityAmount).toBeCloseTo(364448.61, 0);
        }
    });
    it('models TDS deduction under Section 194A accurately when threshold is crossed', () => {
        // ₹5,000 / month at 7% p.a. for 5 years: Total Interest = ₹59,663.95
        // Regular threshold = ₹40,000 -> Since 59,663.95 > 40,000, 10% TDS applies
        const res = calculateDeterministicRd({
            monthlyDeposit: 5000,
            annualInterestRate: 7,
            tenureYears: 5,
            applyTds: true,
            tdsRate: 10,
            isSeniorCitizen: false,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.isTdsApplicable).toBe(true);
            expect(res.data.tdsThreshold).toBe(40000);
            expect(res.data.tdsAmount).toBeCloseTo(5966.4, 1);
            expect(res.data.netTotalInterest).toBeCloseTo(53697.55, 1);
            expect(res.data.netMaturityAmount).toBeCloseTo(353697.55, 1);
        }
    });
    it('exempts TDS when interest is below the Section 194A / 80TTB threshold', () => {
        // ₹2,000 / month at 6% for 2 years (24 months) -> Interest is ~ ₹3,066 (well below ₹40k / ₹50k)
        const res = calculateDeterministicRd({
            monthlyDeposit: 2000,
            annualInterestRate: 6,
            tenureYears: 2,
            applyTds: true,
            tdsRate: 10,
            isSeniorCitizen: false,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.isTdsApplicable).toBe(false);
            expect(res.data.tdsAmount).toBe(0);
            expect(res.data.netMaturityAmount).toBe(res.data.maturityAmount);
        }
    });
    it('evaluates senior citizen TDS threshold of ₹50,000 under Section 80TTB', () => {
        // Senior citizen deposit with total interest between ₹40,000 and ₹50,000
        // ₹5,000 / month at 7.0% (+0.5% boost = 7.5%) for 4 years (48 months) -> Total interest = ₹40,345.46
        const res = calculateDeterministicRd({
            monthlyDeposit: 5000,
            annualInterestRate: 7.0,
            tenureYears: 4,
            isSeniorCitizen: true,
            applyTds: true,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.tdsThreshold).toBe(50000);
            expect(res.data.totalInterest).toBeLessThan(50000);
            expect(res.data.totalInterest).toBeGreaterThan(40000);
            expect(res.data.isTdsApplicable).toBe(false);
            expect(res.data.tdsAmount).toBe(0);
        }
    });
    it('compares compounding frequencies (Monthly > Quarterly > Half-Yearly > Annual)', () => {
        const monthlyRes = calculateDeterministicRd({ monthlyDeposit: 5000, annualInterestRate: 8, tenureYears: 5, compoundingFrequency: 12 });
        const quarterlyRes = calculateDeterministicRd({ monthlyDeposit: 5000, annualInterestRate: 8, tenureYears: 5, compoundingFrequency: 4 });
        const halfYearlyRes = calculateDeterministicRd({ monthlyDeposit: 5000, annualInterestRate: 8, tenureYears: 5, compoundingFrequency: 2 });
        const annualRes = calculateDeterministicRd({ monthlyDeposit: 5000, annualInterestRate: 8, tenureYears: 5, compoundingFrequency: 1 });
        expect(monthlyRes.success && quarterlyRes.success && halfYearlyRes.success && annualRes.success).toBe(true);
        if (monthlyRes.success && quarterlyRes.success && halfYearlyRes.success && annualRes.success) {
            expect(monthlyRes.data.maturityAmount).toBeGreaterThan(quarterlyRes.data.maturityAmount);
            expect(quarterlyRes.data.maturityAmount).toBeGreaterThan(halfYearlyRes.data.maturityAmount);
            expect(halfYearlyRes.data.maturityAmount).toBeGreaterThan(annualRes.data.maturityAmount);
        }
    });
    it('preserves principal with 0% interest rate', () => {
        const res = calculateDeterministicRd({
            monthlyDeposit: 5000,
            annualInterestRate: 0,
            tenureYears: 3,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.totalInvested).toBe(180000);
            expect(res.data.maturityAmount).toBe(180000);
            expect(res.data.totalInterest).toBe(0);
            expect(res.data.effectiveApy).toBe(0);
        }
    });
    it('supports direct tenureMonths input', () => {
        const res = calculateDeterministicRd({
            monthlyDeposit: 10000,
            annualInterestRate: 7.5,
            tenureYears: 0,
            tenureMonths: 18,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.totalMonths).toBe(18);
            expect(res.data.totalInvested).toBe(180000);
            expect(res.data.projections.length).toBe(2);
        }
    });
});
describe('Phase 1 — Pure Deterministic Engine: Helper Functions', () => {
    it('calculates closed-form RD future value accurately', () => {
        const val = calculateRdMaturityValue(5000, 7, 60, 4);
        expect(val).toBeCloseTo(359663.95, 0);
    });
    it('returns 0 for zero or negative deposit/duration', () => {
        expect(calculateRdMaturityValue(0, 7, 60)).toBe(0);
        expect(calculateRdMaturityValue(5000, 7, 0)).toBe(0);
        expect(calculateRdMaturityValue(5000, 7, -12)).toBe(0);
    });
    it('calculates Effective APY yield correctly', () => {
        // 7% compounded quarterly: ((1 + 0.07/4)^4 - 1) * 100 = 7.1859%
        const apy = calculateEffectiveApy(7, 4);
        expect(apy).toBeCloseTo(7.1859, 2);
        // 12% compounded monthly: ((1 + 0.01)^12 - 1) * 100 = 12.6825%
        const monthlyApy = calculateEffectiveApy(12, 12);
        expect(monthlyApy).toBeCloseTo(12.6825, 2);
    });
});
describe('Phase 1 — Pure Deterministic Engine: Error Handling', () => {
    it('rejects zero or negative monthly deposit', () => {
        const res = calculateDeterministicRd({
            monthlyDeposit: 0,
            annualInterestRate: 7,
            tenureYears: 5,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_MONTHLY_DEPOSIT');
        }
    });
    it('rejects negative interest rate', () => {
        const res = calculateDeterministicRd({
            monthlyDeposit: 5000,
            annualInterestRate: -3,
            tenureYears: 5,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_INTEREST_RATE');
        }
    });
    it('rejects zero or negative tenure', () => {
        const res = calculateDeterministicRd({
            monthlyDeposit: 5000,
            annualInterestRate: 7,
            tenureYears: 0,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_TENURE');
        }
    });
    it('rejects invalid compounding frequency', () => {
        const res = calculateDeterministicRd({
            monthlyDeposit: 5000,
            annualInterestRate: 7,
            tenureYears: 5,
            compoundingFrequency: 5,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_COMPOUNDING_FREQUENCY');
        }
    });
    it('rejects out of bounds inputs', () => {
        const res = calculateDeterministicRd({
            monthlyDeposit: 500000000,
            annualInterestRate: 7,
            tenureYears: 5,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('OUT_OF_BOUNDS_INPUT');
        }
    });
});
describe('Phase 2 — URL Contract', () => {
    it('constructs and parses canonical RD parameters (?monthly=5000&rate=7&years=5&compounding=4)', () => {
        const url = 'https://karuvilab.com/calculators/rd-calculator/?monthly=5000&rate=7&years=5&compounding=4';
        const parsed = new URL(url);
        expect(parsed.searchParams.get('monthly')).toBe('5000');
        expect(parsed.searchParams.get('rate')).toBe('7');
        expect(parsed.searchParams.get('years')).toBe('5');
        expect(parsed.searchParams.get('compounding')).toBe('4');
        const res = calculateDeterministicRd({
            monthlyDeposit: Number(parsed.searchParams.get('monthly')),
            annualInterestRate: Number(parsed.searchParams.get('rate')),
            tenureYears: Number(parsed.searchParams.get('years')),
            compoundingFrequency: Number(parsed.searchParams.get('compounding')),
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.maturityAmount).toBeCloseTo(359663.95, 0);
        }
    });
    it('parses extended RD parameters with senior citizen and TDS flags', () => {
        const url = 'https://karuvilab.com/calculators/rd-calculator/?monthly=10000&rate=7.5&years=3&compounding=4&senior=1&tds=1';
        const parsed = new URL(url);
        const res = calculateDeterministicRd({
            monthlyDeposit: Number(parsed.searchParams.get('monthly')),
            annualInterestRate: Number(parsed.searchParams.get('rate')),
            tenureYears: Number(parsed.searchParams.get('years')),
            compoundingFrequency: Number(parsed.searchParams.get('compounding')),
            isSeniorCitizen: parsed.searchParams.get('senior') === '1',
            applyTds: parsed.searchParams.get('tds') === '1',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.effectiveInterestRate).toBe(8.0);
            expect(res.data.isSeniorCitizen).toBe(true);
        }
    });
});
describe('Phase 3 — Semantic DOM Contract Spec', () => {
    it('defines stable semantic data attributes for RD Calculator', () => {
        const expected = {
            tool: 'rd-calculator',
            inputs: [
                'monthly-deposit',
                'interest-rate',
                'tenure-years',
                'compounding-frequency',
                'senior-citizen',
                'tds-rate',
            ],
            results: [
                'maturity-amount',
                'total-invested',
                'total-interest',
                'effective-apy',
                'tds-amount',
                'net-maturity-amount',
            ],
        };
        expect(expected.tool).toBe('rd-calculator');
        expect(expected.inputs).toContain('monthly-deposit');
        expect(expected.inputs).toContain('interest-rate');
        expect(expected.inputs).toContain('tenure-years');
        expect(expected.inputs).toContain('compounding-frequency');
        expect(expected.results).toContain('maturity-amount');
        expect(expected.results).toContain('total-invested');
        expect(expected.results).toContain('total-interest');
        expect(expected.results).toContain('effective-apy');
    });
});
describe('Phase 5 — Schema.org & llms.txt Contract', () => {
    it('validates tool content meets E-E-A-T requirements', async () => {
        const { rdCalculator } = await import('@/src/content/tools/rd-calculator');
        expect(rdCalculator.faq?.length).toBeGreaterThanOrEqual(5);
        expect(rdCalculator.examples?.length).toBeGreaterThanOrEqual(3);
        expect(rdCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
        expect(rdCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
        // Check detailedDescription word count > 400
        const wordCount = (rdCalculator.detailedDescription || '')
            .replace(/<[^>]*>/g, ' ')
            .trim()
            .split(/\s+/)
            .length;
        expect(wordCount).toBeGreaterThan(400);
    });
    it('validates public/llms.txt contains canonical rd calculator specification', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');
        expect(llmsContent).toContain('rd-calculator');
    });
});
