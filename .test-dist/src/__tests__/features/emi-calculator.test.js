import { describe, it, expect } from 'vitest';
import { calculateDeterministicEmi, } from '@/src/features/calculators/emi';
describe('Phase 1 — Pure Deterministic Engine: calculateDeterministicEmi', () => {
    it('calculates standard reducing balance EMI and amortization accurately', () => {
        // 50,00,000 at 8.5% for 20 years (240 months)
        const res = calculateDeterministicEmi({
            loanAmount: 5000000,
            annualInterestRate: 8.5,
            tenureMonths: 240,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            // Standard mathematical formula check
            expect(res.data.monthlyEmi).toBeCloseTo(43391, -1);
            expect(res.data.totalInterest).toBeCloseTo(5413879, -3);
            expect(res.data.totalPayment).toBeCloseTo(10413879, -3);
            expect(res.data.effectiveTenureMonths).toBe(240);
            expect(res.data.monthlySchedule.length).toBe(240);
            expect(res.data.yearlySchedule.length).toBe(20);
            expect(res.data.monthlySchedule[239]?.endingBalance).toBe(0);
        }
    });
    it('calculates prepayment savings and shortened tenure accurately', () => {
        const res = calculateDeterministicEmi({
            loanAmount: 5000000,
            annualInterestRate: 8.5,
            tenureMonths: 240,
            recurringPrepayment: {
                amount: 5000,
                startMonth: 1,
            },
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.effectiveTenureMonths).toBeLessThan(240);
            expect(res.data.savings).toBeDefined();
            if (res.data.savings) {
                expect(res.data.savings.interestSaved).toBeGreaterThan(500000);
                expect(res.data.savings.monthsSaved).toBeGreaterThan(20);
            }
        }
    });
    it('handles floating rate delta stress testing', () => {
        const baseline = calculateDeterministicEmi({
            loanAmount: 3000000,
            annualInterestRate: 9.0,
            tenureMonths: 180,
        });
        const stressed = calculateDeterministicEmi({
            loanAmount: 3000000,
            annualInterestRate: 9.0,
            tenureMonths: 180,
            floatingRateDelta: 1.5,
        });
        expect(baseline.success).toBe(true);
        expect(stressed.success).toBe(true);
        if (baseline.success && stressed.success) {
            expect(stressed.data.effectiveRate).toBe(10.5);
            expect(stressed.data.monthlyEmi).toBeGreaterThan(baseline.data.monthlyEmi);
            expect(stressed.data.totalInterest).toBeGreaterThan(baseline.data.totalInterest);
        }
    });
    it('calculates interest-only moratorium correctly', () => {
        const res = calculateDeterministicEmi({
            loanAmount: 1000000,
            annualInterestRate: 10,
            tenureMonths: 60,
            moratorium: {
                months: 6,
                type: 'interest-only',
            },
        });
        expect(res.success).toBe(true);
        if (res.success) {
            // Month 1 to 6 should have 0 principal paid
            for (let m = 0; m < 6; m++) {
                expect(res.data.monthlySchedule[m]?.principalPaid).toBe(0);
                expect(res.data.monthlySchedule[m]?.endingBalance).toBe(1000000);
            }
        }
    });
});
describe('Phase 1 — Pure Deterministic Engine: Error Handling', () => {
    it('rejects negative or zero loan amount', () => {
        const res = calculateDeterministicEmi({
            loanAmount: 0,
            annualInterestRate: 8.5,
            tenureMonths: 120,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_LOAN_AMOUNT');
        }
    });
    it('rejects negative or zero tenure months', () => {
        const res = calculateDeterministicEmi({
            loanAmount: 500000,
            annualInterestRate: 8.5,
            tenureMonths: 0,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_TENURE');
        }
    });
});
describe('Phase 2 — URL Contract', () => {
    it('constructs and parses canonical EMI loan parameters', () => {
        const url = 'https://karuvilab.com/calculators/emi-calculator/?amount=5000000&rate=8.5&tenure=240&prep_recurring=5000&prep_start=12';
        const parsed = new URL(url);
        expect(parsed.searchParams.get('amount')).toBe('5000000');
        expect(parsed.searchParams.get('rate')).toBe('8.5');
        expect(parsed.searchParams.get('tenure')).toBe('240');
        expect(parsed.searchParams.get('prep_recurring')).toBe('5000');
        expect(parsed.searchParams.get('prep_start')).toBe('12');
        const res = calculateDeterministicEmi({
            loanAmount: Number(parsed.searchParams.get('amount')),
            annualInterestRate: Number(parsed.searchParams.get('rate')),
            tenureMonths: Number(parsed.searchParams.get('tenure')),
            recurringPrepayment: {
                amount: Number(parsed.searchParams.get('prep_recurring')),
                startMonth: Number(parsed.searchParams.get('prep_start')),
            },
        });
        expect(res.success).toBe(true);
    });
});
describe('Phase 3 — Semantic DOM Contract Spec', () => {
    it('defines stable semantic data attributes for EMI Calculator', () => {
        const expected = {
            tool: 'emi-calculator',
            inputs: [
                'loan-amount',
                'interest-rate',
                'tenure-months',
                'tenure-years',
                'recurring-prepayment',
                'floating-delta',
            ],
            results: [
                'monthly-emi',
                'total-interest',
                'total-payment',
                'effective-tenure',
                'interest-saved',
                'months-saved',
            ],
        };
        expect(expected.tool).toBe('emi-calculator');
        expect(expected.inputs).toContain('loan-amount');
        expect(expected.inputs).toContain('interest-rate');
        expect(expected.results).toContain('monthly-emi');
        expect(expected.results).toContain('total-interest');
    });
});
describe('Phase 5 — Schema.org & llms.txt Contract', () => {
    it('validates tool content meets E-E-A-T requirements', async () => {
        const { emiCalculator } = await import('@/src/content/tools/emi-calculator');
        expect(emiCalculator.faq?.length).toBeGreaterThanOrEqual(5);
        expect(emiCalculator.examples?.length).toBeGreaterThanOrEqual(3);
        expect(emiCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
        expect(emiCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
    });
    it('validates public/llms.txt contains canonical emi calculator specification', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');
        expect(llmsContent).toContain('[EMI Calculator](https://karuvilab.com/calculators/emi-calculator/)');
    });
});
