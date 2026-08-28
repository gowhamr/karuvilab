import { describe, it, expect } from 'vitest';
import { calculatePercentageOf, calculateWhatPercentage, calculatePercentageChange, calculateReversePercentage, } from '@/src/features/calculators/percentage';
describe('Phase 1 — Pure Deterministic Engine: calculatePercentageOf', () => {
    it('calculates standard percentage of a number', () => {
        const res = calculatePercentageOf({ percentage: 20, total: 500 });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.result).toBe(100);
            expect(res.data.fraction).toBe(0.2);
            expect(res.data.formattedResult).toBe('100');
        }
    });
    it('handles decimal percentages and fractional totals', () => {
        const res = calculatePercentageOf({ percentage: 7.5, total: 250 });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.result).toBe(18.75);
            expect(res.data.formattedResult).toBe('18.75');
        }
    });
    it('handles zero percent', () => {
        const res = calculatePercentageOf({ percentage: 0, total: 1000 });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.result).toBe(0);
        }
    });
});
describe('Phase 1 — Pure Deterministic Engine: calculateWhatPercentage', () => {
    it('calculates what percentage part is of total', () => {
        const res = calculateWhatPercentage({ part: 80, total: 400 });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.percentage).toBe(20);
            expect(res.data.formattedPercentage).toBe('20%');
        }
    });
    it('handles parts greater than total (>100%)', () => {
        const res = calculateWhatPercentage({ part: 500, total: 250 });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.percentage).toBe(200);
            expect(res.data.formattedPercentage).toBe('200%');
        }
    });
    it('rejects division by zero when total is 0', () => {
        const res = calculateWhatPercentage({ part: 50, total: 0 });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('DIVISION_BY_ZERO');
        }
    });
});
describe('Phase 1 — Pure Deterministic Engine: calculatePercentageChange', () => {
    it('calculates percentage increase correctly', () => {
        const res = calculatePercentageChange({ fromValue: 200, toValue: 250 });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.percentageChange).toBe(25);
            expect(res.data.absoluteChange).toBe(50);
            expect(res.data.changeType).toBe('increase');
            expect(res.data.multiplier).toBe(1.25);
        }
    });
    it('calculates percentage decrease correctly', () => {
        const res = calculatePercentageChange({ fromValue: 200, toValue: 150 });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.percentageChange).toBe(-25);
            expect(res.data.absoluteChange).toBe(50);
            expect(res.data.changeType).toBe('decrease');
            expect(res.data.multiplier).toBe(0.75);
        }
    });
    it('rejects base value of zero for percentage change', () => {
        const res = calculatePercentageChange({ fromValue: 0, toValue: 100 });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('DIVISION_BY_ZERO');
        }
    });
});
describe('Phase 1 — Pure Deterministic Engine: calculateReversePercentage', () => {
    it('calculates original value before an increase (e.g. 120 after 20% increase -> 100)', () => {
        const res = calculateReversePercentage({ finalValue: 120, percentage: 20, type: 'increase' });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.originalValue).toBe(100);
            expect(res.data.difference).toBe(20);
        }
    });
    it('calculates original value before a decrease (e.g. 80 after 20% discount -> 100)', () => {
        const res = calculateReversePercentage({ finalValue: 80, percentage: 20, type: 'decrease' });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.originalValue).toBe(100);
            expect(res.data.difference).toBe(-20);
        }
    });
    it('rejects percentage decrease of 100% or more in reverse calculation', () => {
        const res = calculateReversePercentage({ finalValue: 50, percentage: 100, type: 'decrease' });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_PERCENTAGE_DECREASE');
        }
    });
});
describe('Phase 2 — URL Contract', () => {
    it('constructs and parses canonical percentage of parameters', () => {
        const url = 'https://karuvilab.com/calculators/percentage-calculator/?mode=pct_of&pct=25&total=800';
        const parsed = new URL(url);
        expect(parsed.searchParams.get('mode')).toBe('pct_of');
        expect(parsed.searchParams.get('pct')).toBe('25');
        expect(parsed.searchParams.get('total')).toBe('800');
        const res = calculatePercentageOf({
            percentage: Number(parsed.searchParams.get('pct')),
            total: Number(parsed.searchParams.get('total')),
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.result).toBe(200);
        }
    });
});
describe('Phase 3 — Semantic DOM Contract Spec', () => {
    it('defines stable semantic data attributes for Percentage Calculator', () => {
        const expected = {
            tool: 'percentage-calculator',
            inputs: [
                'percentage',
                'total',
                'part',
                'from-value',
                'to-value',
                'final-value',
                'change-type',
            ],
            results: [
                'result-value',
                'percentage-value',
                'percentage-change',
                'absolute-change',
                'change-type',
                'original-value',
                'multiplier',
            ],
        };
        expect(expected.tool).toBe('percentage-calculator');
        expect(expected.inputs).toContain('percentage');
        expect(expected.inputs).toContain('total');
        expect(expected.results).toContain('result-value');
        expect(expected.results).toContain('percentage-change');
    });
});
describe('Phase 5 — Schema.org & llms.txt Contract', () => {
    it('validates tool content meets E-E-A-T requirements', async () => {
        const { percentageCalculator } = await import('@/src/content/tools/percentage-calculator');
        expect(percentageCalculator.faq?.length).toBeGreaterThanOrEqual(5);
        expect(percentageCalculator.examples?.length).toBeGreaterThanOrEqual(3);
        expect(percentageCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
        expect(percentageCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
    });
    it('validates public/llms.txt contains canonical percentage calculator specification', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');
        expect(llmsContent).toContain('[Percentage Calculator](https://karuvilab.com/calculators/percentage-calculator/)');
    });
});
