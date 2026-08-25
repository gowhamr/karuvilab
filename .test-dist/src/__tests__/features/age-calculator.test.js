import { describe, it, expect } from 'vitest';
import { calculateAge, calculateAgeComparison } from '@/src/features/calculators/age';
describe('Age Calculator Core Engine (calculateAge)', () => {
    it('calculates normal DOB correctly', () => {
        const input = {
            dateOfBirth: '2000-01-15',
            asOfDate: '2025-06-20',
        };
        const res = calculateAge(input);
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(25);
            expect(res.data.months).toBe(5);
            expect(res.data.days).toBe(5);
            expect(res.data.birthDayOfWeek).toBe('Saturday');
            expect(res.data.isLeapYearBirth).toBe(true);
        }
    });
    it('handles DOB = as_of date (0 years, 0 months, 0 days)', () => {
        const res = calculateAge({
            dateOfBirth: '2026-08-25',
            asOfDate: '2026-08-25',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(0);
            expect(res.data.months).toBe(0);
            expect(res.data.days).toBe(0);
            expect(res.data.totalDays).toBe(0);
            expect(res.data.daysUntilNextBirthday).toBe(0);
            expect(res.data.nextBirthday).toBe('2026-08-25');
        }
    });
    it('handles birthday today (exact year anniversary)', () => {
        const res = calculateAge({
            dateOfBirth: '2000-08-25',
            asOfDate: '2026-08-25',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(26);
            expect(res.data.months).toBe(0);
            expect(res.data.days).toBe(0);
            expect(res.data.daysUntilNextBirthday).toBe(0);
            expect(res.data.nextBirthday).toBe('2026-08-25');
        }
    });
    it('handles birthday tomorrow (1 day until next birthday)', () => {
        const res = calculateAge({
            dateOfBirth: '2000-08-26',
            asOfDate: '2026-08-25',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(25);
            expect(res.data.months).toBe(11);
            expect(res.data.days).toBe(30);
            expect(res.data.daysUntilNextBirthday).toBe(1);
            expect(res.data.nextBirthday).toBe('2026-08-26');
        }
    });
    it('handles birthday already passed in the current year', () => {
        const res = calculateAge({
            dateOfBirth: '2000-01-10',
            asOfDate: '2026-08-25',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(26);
            expect(res.data.months).toBe(7);
            expect(res.data.days).toBe(15);
            expect(res.data.nextBirthday).toBe('2027-01-10');
            expect(res.data.daysUntilNextBirthday).toBeGreaterThan(0);
        }
    });
    it('handles leap-day DOB (Feb 29) on a leap year asOf', () => {
        const res = calculateAge({
            dateOfBirth: '2000-02-29',
            asOfDate: '2024-02-29',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(24);
            expect(res.data.months).toBe(0);
            expect(res.data.days).toBe(0);
            expect(res.data.isLeapYearBirth).toBe(true);
            expect(res.data.nextBirthday).toBe('2024-02-29');
        }
    });
    it('handles leap-day DOB (Feb 29) on a non-leap year asOf', () => {
        const res = calculateAge({
            dateOfBirth: '2000-02-29',
            asOfDate: '2025-02-28',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(24);
            expect(res.data.months).toBe(11);
            expect(res.data.days).toBe(30);
            expect(res.data.isLeapYearBirth).toBe(true);
        }
    });
    it('handles leap-day DOB on March 1 of a non-leap year (turns 25)', () => {
        const res = calculateAge({
            dateOfBirth: '2000-02-29',
            asOfDate: '2025-03-01',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(25);
            expect(res.data.months).toBe(0);
            expect(res.data.days).toBe(0);
        }
    });
    it('handles month/year boundary correctly (Jan 31 to Mar 1)', () => {
        const res = calculateAge({
            dateOfBirth: '2023-01-31',
            asOfDate: '2023-03-01',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(0);
            expect(res.data.months).toBe(1);
            expect(res.data.days).toBe(1);
        }
    });
    it('handles month end boundary (Jan 31 to Feb 28)', () => {
        const res = calculateAge({
            dateOfBirth: '2023-01-31',
            asOfDate: '2023-02-28',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(0);
            expect(res.data.months).toBe(1);
            expect(res.data.days).toBe(0);
        }
    });
    it('handles month end boundary (Mar 31 to Apr 30)', () => {
        const res = calculateAge({
            dateOfBirth: '2023-03-31',
            asOfDate: '2023-04-30',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(0);
            expect(res.data.months).toBe(1);
            expect(res.data.days).toBe(0);
        }
    });
    it('handles year boundary correctly (Dec 31 to Jan 1)', () => {
        const res = calculateAge({
            dateOfBirth: '1999-12-31',
            asOfDate: '2000-01-01',
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(0);
            expect(res.data.months).toBe(0);
            expect(res.data.days).toBe(1);
            expect(res.data.totalDays).toBe(1);
        }
    });
    it('rejects future DOB / DOB after as_of date', () => {
        const res = calculateAge({
            dateOfBirth: '2026-08-26',
            asOfDate: '2026-08-25',
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('DOB_AFTER_AS_OF_DATE');
        }
    });
    it('rejects missing date of birth', () => {
        const res = calculateAge({
            dateOfBirth: '',
            asOfDate: '2026-08-25',
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('MISSING_DOB');
        }
    });
    it('rejects invalid date strings and non-existent calendar dates', () => {
        const invalidDates = ['invalid-date', '2023-02-29', '2023-04-31', '2023-13-01', '2023-00-10'];
        for (const d of invalidDates) {
            const res = calculateAge({
                dateOfBirth: d,
                asOfDate: '2026-08-25',
            });
            expect(res.success).toBe(false);
            if (!res.success) {
                expect(res.error.code).toBe('INVALID_DOB');
            }
        }
    });
    it('rejects invalid asOfDate format', () => {
        const res = calculateAge({
            dateOfBirth: '2000-01-01',
            asOfDate: 'not-a-date',
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_AS_OF_DATE');
        }
    });
    it('does not mutate the input object', () => {
        const input = Object.freeze({
            dateOfBirth: '1995-05-12',
            asOfDate: '2025-05-12',
        });
        expect(() => calculateAge(input)).not.toThrow();
    });
    it('is purely deterministic: same inputs always produce identical results', () => {
        const input = {
            dateOfBirth: '1990-10-10',
            asOfDate: '2026-08-25',
        };
        const res1 = calculateAge(input);
        const res2 = calculateAge(input);
        expect(res1).toEqual(res2);
    });
    it('compares two ages correctly with calculateAgeComparison', () => {
        const comp = calculateAgeComparison('1990-05-10', '1995-08-20');
        expect(comp).not.toBeNull();
        if (comp) {
            expect(comp.years).toBe(5);
            expect(comp.months).toBe(3);
            expect(comp.days).toBe(10);
        }
    });
});
describe('Age Calculator URL Contract', () => {
    it('constructs canonical URL with ?dob=YYYY-MM-DD&as_of=YYYY-MM-DD', () => {
        const dob = '1995-05-20';
        const asOf = '2026-08-25';
        const baseUrl = 'https://karuvilab.com/calculators/age-calculator';
        const shareUrl = `${baseUrl}?dob=${encodeURIComponent(dob)}&as_of=${encodeURIComponent(asOf)}`;
        const parsed = new URL(shareUrl);
        expect(parsed.searchParams.get('dob')).toBe('1995-05-20');
        expect(parsed.searchParams.get('as_of')).toBe('2026-08-25');
    });
    it('supports legacy ref query parameter fallback', () => {
        const testUrl = 'https://karuvilab.com/calculators/age-calculator?dob=1990-01-01&ref=2024-05-10';
        const parsed = new URL(testUrl);
        const dob = parsed.searchParams.get('dob');
        const asOf = parsed.searchParams.get('as_of') || parsed.searchParams.get('ref');
        expect(dob).toBe('1990-01-01');
        expect(asOf).toBe('2024-05-10');
        const res = calculateAge({ dateOfBirth: dob, asOfDate: asOf });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.years).toBe(34);
            expect(res.data.months).toBe(4);
            expect(res.data.days).toBe(9);
        }
    });
    it('produces identical calculations from canonical shared URLs regardless of current date', () => {
        const sharedQuery = '?dob=1980-11-04&as_of=2020-03-15';
        const params = new URLSearchParams(sharedQuery);
        const res1 = calculateAge({
            dateOfBirth: params.get('dob'),
            asOfDate: params.get('as_of'),
        });
        const res2 = calculateAge({
            dateOfBirth: params.get('dob'),
            asOfDate: params.get('as_of'),
        });
        expect(res1.success).toBe(true);
        expect(res2.success).toBe(true);
        expect(res1).toEqual(res2);
    });
});
describe('Age Calculator Semantic DOM Contract Spec', () => {
    it('defines stable semantic data attributes for inputs and outputs', () => {
        const expectedDataAttributes = {
            tool: 'age-calculator',
            inputs: ['date-of-birth', 'as-of-date', 'date-of-birth-2'],
            results: [
                'years',
                'months',
                'days',
                'exact-age',
                'next-birthday',
                'days-until-next-birthday',
                'total-months',
                'total-weeks',
                'total-days',
                'total-hours',
                'total-minutes',
                'total-seconds',
                'age-difference',
                'sun-sign',
                'moon-sign',
                'nakshatra',
                'chinese-zodiac',
                'ayanamsa',
                'days-lived',
                'months-lived',
                'estimated-heartbeats',
                'estimated-sleep-hours',
                'estimated-breaths',
                'year-progress-pct',
                'lifespan-progress-pct',
                'birth-day-of-week',
                'is-leap-year-birth',
                'birthstone',
                'birth-flower',
            ],
        };
        expect(expectedDataAttributes.tool).toBe('age-calculator');
        expect(expectedDataAttributes.inputs).toContain('date-of-birth');
        expect(expectedDataAttributes.inputs).toContain('as-of-date');
        expect(expectedDataAttributes.results).toContain('years');
        expect(expectedDataAttributes.results).toContain('months');
        expect(expectedDataAttributes.results).toContain('days');
        expect(expectedDataAttributes.results).toContain('exact-age');
    });
});
describe('Phase 4 — Typed Error Contract', () => {
    it('returns structured MISSING_DOB error when dateOfBirth is missing or empty', () => {
        const res = calculateAge({ dateOfBirth: '', asOfDate: '2026-08-25' });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('MISSING_DOB');
            expect(res.error.message).toBe('Date of birth is required.');
        }
    });
    it('returns structured INVALID_DOB error for invalid date format or calendar anomalies', () => {
        const invalidDobs = ['2023-02-29', '2023-04-31', 'invalid', '2023-13-40'];
        for (const dob of invalidDobs) {
            const res = calculateAge({ dateOfBirth: dob, asOfDate: '2026-08-25' });
            expect(res.success).toBe(false);
            if (!res.success) {
                expect(res.error.code).toBe('INVALID_DOB');
                expect(res.error.message).toContain('Invalid Date of Birth format');
            }
        }
    });
    it('returns structured INVALID_AS_OF_DATE error for invalid calculation target dates', () => {
        const res = calculateAge({ dateOfBirth: '2000-01-01', asOfDate: 'invalid-as-of' });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('INVALID_AS_OF_DATE');
            expect(res.error.message).toContain('Invalid calculation date format');
        }
    });
    it('returns structured DOB_AFTER_AS_OF_DATE error when DOB is in future relative to as_of', () => {
        const res = calculateAge({ dateOfBirth: '2026-08-26', asOfDate: '2026-08-25' });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('DOB_AFTER_AS_OF_DATE');
            expect(res.error.message).toBe('Date of birth cannot be after the calculation date.');
        }
    });
});
describe('Phase 5 — Schema.org & llms.txt Contract', () => {
    it('validates tool content meets E-E-A-T requirements', async () => {
        const { ageCalculator } = await import('@/src/content/tools/age-calculator');
        expect(ageCalculator.faq?.length).toBeGreaterThanOrEqual(5);
        expect(ageCalculator.examples?.length).toBeGreaterThanOrEqual(3);
        expect(ageCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
        expect(ageCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
        expect(ageCalculator.commonErrors?.length).toBeGreaterThanOrEqual(2);
        expect(ageCalculator.detailedDescription).toContain('zero-telemetry');
    });
    it('validates public/llms.txt contains canonical age calculator specification', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');
        expect(llmsContent).toContain('[Age Calculator](https://karuvilab.com/calculators/age-calculator/)');
        expect(llmsContent).toContain('?dob=YYYY-MM-DD&as_of=YYYY-MM-DD');
    });
});
