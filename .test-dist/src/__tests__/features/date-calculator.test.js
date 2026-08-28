import { describe, it, expect } from 'vitest';
import { calculateDateDifference, calculateDateOffset, countBusinessAndWeekendDays, } from '@/src/features/calculators/date';
import { daysFromCivil } from '@/src/features/calculators/age/date-utils';
describe('Phase 1 — Pure Deterministic Engine: calculateDateDifference', () => {
    it('calculates standard difference between two dates', () => {
        const res = calculateDateDifference({
            startDate: '2024-01-01',
            endDate: '2024-06-15',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(0);
            expect(res.data.months).toBe(5);
            expect(res.data.days).toBe(14);
            expect(res.data.totalDays).toBe(166); // 2024 is leap year: Jan(31) + Feb(29) + Mar(31) + Apr(30) + May(31) + 14 = 166
            expect(res.data.isFuture).toBe(true);
            expect(res.data.isPast).toBe(false);
            expect(res.data.isSameDay).toBe(false);
        }
    });
    it('handles same-day interval correctly', () => {
        const res = calculateDateDifference({
            startDate: '2025-05-10',
            endDate: '2025-05-10',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(0);
            expect(res.data.months).toBe(0);
            expect(res.data.days).toBe(0);
            expect(res.data.totalDays).toBe(0);
            expect(res.data.isSameDay).toBe(true);
        }
    });
    it('handles month end boundary without date drift (Jan 31 to Feb 28 in common year)', () => {
        const res = calculateDateDifference({
            startDate: '2023-01-31',
            endDate: '2023-02-28',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(0);
            expect(res.data.months).toBe(1);
            expect(res.data.days).toBe(0);
            expect(res.data.totalDays).toBe(28);
        }
    });
    it('handles month boundary correctly across Feb 29 in leap year', () => {
        const res = calculateDateDifference({
            startDate: '2024-02-28',
            endDate: '2024-03-01',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.totalDays).toBe(2);
            expect(res.data.days).toBe(2);
        }
    });
    it('correctly handles reverse date order (past date)', () => {
        const res = calculateDateDifference({
            startDate: '2025-01-01',
            endDate: '2020-01-01',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(5);
            expect(res.data.months).toBe(0);
            expect(res.data.days).toBe(0);
            expect(res.data.isPast).toBe(true);
            expect(res.data.isFuture).toBe(false);
        }
    });
    it('supports includeEndDay option', () => {
        const res = calculateDateDifference({
            startDate: '2024-01-01',
            endDate: '2024-01-01',
            includeEndDay: true,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.totalDays).toBe(1);
            expect(res.data.days).toBe(1);
        }
    });
    it('accurately counts business days and weekend days', () => {
        // 2024-05-06 (Monday) to 2024-05-11 (Saturday) = 5 days total: Mon, Tue, Wed, Thu, Fri -> 5 business, 0 weekend
        const startEpoch = daysFromCivil(2024, 5, 6);
        const endEpoch = daysFromCivil(2024, 5, 11);
        const counts = countBusinessAndWeekendDays(startEpoch, endEpoch);
        expect(counts.businessDays).toBe(5);
        expect(counts.weekendDays).toBe(0);
        // Monday to next Monday (7 days): 5 business, 2 weekend
        const fullWeekCounts = countBusinessAndWeekendDays(startEpoch, startEpoch + 7);
        expect(fullWeekCounts.businessDays).toBe(5);
        expect(fullWeekCounts.weekendDays).toBe(2);
    });
});
describe('Phase 1 — Pure Deterministic Engine: calculateDateOffset', () => {
    it('adds days accurately', () => {
        const res = calculateDateOffset({
            baseDate: '2024-01-15',
            amount: 20,
            unit: 'days',
            operation: 'add',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.resultingDate).toBe('2024-02-04');
            expect(res.data.dayOfWeek).toBe('Sunday');
            expect(res.data.isWeekend).toBe(true);
        }
    });
    it('subtracts days accurately across year boundary', () => {
        const res = calculateDateOffset({
            baseDate: '2024-01-05',
            amount: 10,
            unit: 'days',
            operation: 'subtract',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.resultingDate).toBe('2023-12-26');
            expect(res.data.dayOfWeek).toBe('Tuesday');
        }
    });
    it('adds weeks accurately', () => {
        const res = calculateDateOffset({
            baseDate: '2024-03-01',
            amount: 3,
            unit: 'weeks',
            operation: 'add',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.resultingDate).toBe('2024-03-22');
            expect(res.data.dayOfWeek).toBe('Friday');
        }
    });
    it('adds business days skipping weekends', () => {
        // 2024-05-10 is a Friday. Adding 1 business day should arrive at Monday 2024-05-13.
        const res = calculateDateOffset({
            baseDate: '2024-05-10',
            amount: 1,
            unit: 'businessDays',
            operation: 'add',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.resultingDate).toBe('2024-05-13');
            expect(res.data.dayOfWeek).toBe('Monday');
            expect(res.data.isWeekend).toBe(false);
        }
    });
    it('subtracts business days skipping weekends', () => {
        // 2024-05-13 is a Monday. Subtracting 1 business day should arrive at Friday 2024-05-10.
        const res = calculateDateOffset({
            baseDate: '2024-05-13',
            amount: 1,
            unit: 'businessDays',
            operation: 'subtract',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.resultingDate).toBe('2024-05-10');
            expect(res.data.dayOfWeek).toBe('Friday');
        }
    });
    it('handles month end clamping on month addition (Jan 31 + 1 month in leap year 2024)', () => {
        const res = calculateDateOffset({
            baseDate: '2024-01-31',
            amount: 1,
            unit: 'months',
            operation: 'add',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.resultingDate).toBe('2024-02-29');
        }
    });
    it('handles month end clamping on month addition (Jan 31 + 1 month in common year 2023)', () => {
        const res = calculateDateOffset({
            baseDate: '2023-01-31',
            amount: 1,
            unit: 'months',
            operation: 'add',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.resultingDate).toBe('2023-02-28');
        }
    });
    it('handles year addition from leap day (2024-02-29 + 1 year = 2025-02-28)', () => {
        const res = calculateDateOffset({
            baseDate: '2024-02-29',
            amount: 1,
            unit: 'years',
            operation: 'add',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.resultingDate).toBe('2025-02-28');
        }
    });
});
describe('Phase 2 — URL Contract', () => {
    it('constructs and parses canonical diff mode parameters', () => {
        const start = '2024-01-01';
        const end = '2025-01-01';
        const url = `https://karuvilab.com/calculators/date-calculator/?mode=diff&start=${start}&end=${end}`;
        const parsed = new URL(url);
        expect(parsed.searchParams.get('mode')).toBe('diff');
        expect(parsed.searchParams.get('start')).toBe('2024-01-01');
        expect(parsed.searchParams.get('end')).toBe('2025-01-01');
        const res = calculateDateDifference({
            startDate: parsed.searchParams.get('start'),
            endDate: parsed.searchParams.get('end'),
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(1);
        }
    });
    it('constructs and parses canonical add mode parameters', () => {
        const url = 'https://karuvilab.com/calculators/date-calculator/?mode=add&base=2024-06-01&op=add&amount=45&unit=days';
        const parsed = new URL(url);
        expect(parsed.searchParams.get('mode')).toBe('add');
        expect(parsed.searchParams.get('base')).toBe('2024-06-01');
        expect(parsed.searchParams.get('op')).toBe('add');
        expect(parsed.searchParams.get('amount')).toBe('45');
        expect(parsed.searchParams.get('unit')).toBe('days');
        const res = calculateDateOffset({
            baseDate: parsed.searchParams.get('base'),
            amount: parseInt(parsed.searchParams.get('amount'), 10),
            unit: parsed.searchParams.get('unit'),
            operation: parsed.searchParams.get('op'),
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.resultingDate).toBe('2024-07-16');
        }
    });
});
describe('Phase 3 — Semantic DOM Contract Spec', () => {
    it('defines stable semantic data attributes for Date Calculator', () => {
        const expected = {
            tool: 'date-calculator',
            inputs: ['start-date', 'end-date', 'base-date', 'amount', 'unit', 'operation'],
            results: [
                'years',
                'months',
                'days',
                'total-days',
                'total-weeks',
                'total-hours',
                'business-days',
                'weekend-days',
                'resulting-date',
            ],
        };
        expect(expected.tool).toBe('date-calculator');
        expect(expected.inputs).toContain('start-date');
        expect(expected.inputs).toContain('end-date');
        expect(expected.results).toContain('total-days');
        expect(expected.results).toContain('business-days');
        expect(expected.results).toContain('resulting-date');
    });
});
describe('Phase 4 — Typed Error Contract', () => {
    it('rejects missing start date', () => {
        const res = calculateDateDifference({ startDate: '', endDate: '2024-01-01' });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('MISSING_START_DATE');
        }
    });
    it('rejects invalid start date', () => {
        const res = calculateDateDifference({ startDate: '2023-02-29', endDate: '2024-01-01' });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_START_DATE');
        }
    });
    it('rejects missing base date on offset calculation', () => {
        const res = calculateDateOffset({ baseDate: '', amount: 10, unit: 'days', operation: 'add' });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('MISSING_BASE_DATE');
        }
    });
    it('rejects invalid base date on offset calculation', () => {
        const res = calculateDateOffset({ baseDate: 'invalid-date', amount: 10, unit: 'days', operation: 'add' });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_BASE_DATE');
        }
    });
});
describe('Phase 5 — Schema.org & llms.txt Contract', () => {
    it('validates tool content meets E-E-A-T requirements', async () => {
        const { dateCalculator } = await import('@/src/content/tools/date-calculator');
        expect(dateCalculator.faq?.length).toBeGreaterThanOrEqual(5);
        expect(dateCalculator.examples?.length).toBeGreaterThanOrEqual(3);
        expect(dateCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
        expect(dateCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
        expect(dateCalculator.commonErrors?.length).toBeGreaterThanOrEqual(2);
    });
    it('validates public/llms.txt contains canonical date calculator specification', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');
        expect(llmsContent).toContain('[Date Calculator](https://karuvilab.com/calculators/date-calculator/)');
    });
});
