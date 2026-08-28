import { describe, it, expect } from 'vitest';
import { detectEpochUnit, normalizeToMilliseconds, parseEpoch, convertDateToEpoch, calculateEpochOffset, parseBatchTimestamps, exportBatchToCsv, isLeapYear, getDayOfYear, getIsoWeekNumber, CODE_SNIPPETS } from '../../features/developer-tools/unix-timestamp/engine';
describe('Unix Timestamp Engine', () => {
    describe('Unit Auto-Detection', () => {
        it('detects seconds (<= 11 digits)', () => {
            expect(detectEpochUnit('1771987200')).toBe('seconds');
            expect(detectEpochUnit(0)).toBe('seconds');
            expect(detectEpochUnit('2147483647')).toBe('seconds');
        });
        it('detects milliseconds (12-14 digits)', () => {
            expect(detectEpochUnit('1771987200000')).toBe('milliseconds');
        });
        it('detects microseconds (15-17 digits)', () => {
            expect(detectEpochUnit('1771987200000000')).toBe('microseconds');
        });
        it('detects nanoseconds (> 17 digits)', () => {
            expect(detectEpochUnit('1771987200000000000')).toBe('nanoseconds');
        });
    });
    describe('Normalize to Milliseconds', () => {
        it('normalizes seconds to milliseconds', () => {
            expect(normalizeToMilliseconds('1000')).toBe(1000000);
        });
        it('normalizes milliseconds directly', () => {
            expect(normalizeToMilliseconds('1771987200000')).toBe(1771987200000);
        });
        it('normalizes microseconds to milliseconds', () => {
            expect(normalizeToMilliseconds('1771987200000000')).toBe(1771987200000);
        });
        it('normalizes nanoseconds to milliseconds', () => {
            expect(normalizeToMilliseconds('1771987200000000000')).toBe(1771987200000);
        });
    });
    describe('Epoch Parsing and Formatting', () => {
        it('parses Epoch Zero (0)', () => {
            const result = parseEpoch('0');
            expect(result).not.toBeNull();
            expect(result?.epochSeconds).toBe(0);
            expect(result?.iso8601).toBe('1970-01-01T00:00:00.000Z');
            expect(result?.utcFormatted).toBe('1970-01-01 00:00:00 UTC');
            expect(result?.dayOfWeek).toBe('Thursday');
            expect(result?.isLeapYear).toBe(false);
            expect(result?.isYear2038Overflow).toBe(false);
        });
        it('parses Y2K (946684800)', () => {
            const result = parseEpoch('946684800');
            expect(result).not.toBeNull();
            expect(result?.epochSeconds).toBe(946684800);
            expect(result?.iso8601).toBe('2000-01-01T00:00:00.000Z');
            expect(result?.isLeapYear).toBe(true);
        });
        it('flags Year 2038 overflow for timestamps > 2147483647', () => {
            const result = parseEpoch('2147483648');
            expect(result).not.toBeNull();
            expect(result?.isYear2038Overflow).toBe(true);
        });
    });
    describe('Date to Epoch Conversion', () => {
        it('converts UTC date and time to epoch', () => {
            const result = convertDateToEpoch('2026-08-27', '03:40:00', 'UTC');
            expect(result).not.toBeNull();
            expect(result?.iso8601).toBe('2026-08-27T03:40:00.000Z');
        });
        it('converts IST date and time with offset (+05:30)', () => {
            const result = convertDateToEpoch('2026-08-27', '09:10:00', 'IST');
            expect(result).not.toBeNull();
            // 09:10 IST is 03:40 UTC
            expect(result?.iso8601).toBe('2026-08-27T03:40:00.000Z');
        });
    });
    describe('Epoch Arithmetic', () => {
        it('adds and subtracts seconds', () => {
            const base = 1000;
            const added = calculateEpochOffset(base, 'add', 60, 'seconds');
            expect(added?.epochSeconds).toBe(1060);
            const subtracted = calculateEpochOffset(base, 'subtract', 30, 'seconds');
            expect(subtracted?.epochSeconds).toBe(970);
        });
        it('adds days and weeks correctly', () => {
            const base = 100000;
            const plus1Day = calculateEpochOffset(base, 'add', 1, 'days');
            expect(plus1Day?.epochSeconds).toBe(base + 86400);
            const plus1Week = calculateEpochOffset(base, 'add', 1, 'weeks');
            expect(plus1Week?.epochSeconds).toBe(base + 7 * 86400);
        });
    });
    describe('Batch Conversions', () => {
        it('parses multi-line mixed timestamps', () => {
            const input = `0\n946684800\n2026-08-27T03:40:00.000Z\ninvalid-date`;
            const rows = parseBatchTimestamps(input);
            expect(rows).toHaveLength(4);
            expect(rows[0]?.status).toBe('valid');
            expect(rows[0]?.epochSeconds).toBe(0);
            expect(rows[1]?.epochSeconds).toBe(946684800);
            expect(rows[2]?.status).toBe('valid');
            expect(rows[3]?.status).toBe('invalid');
        });
        it('exports rows to valid CSV format', () => {
            const rows = parseBatchTimestamps(`0\n946684800`);
            const csv = exportBatchToCsv(rows);
            expect(csv).toContain('Epoch Seconds');
            expect(csv).toContain('1970-01-01');
            expect(csv).toContain('2000-01-01');
        });
    });
    describe('Calendar Utilities', () => {
        it('identifies leap years accurately', () => {
            expect(isLeapYear(2000)).toBe(true);
            expect(isLeapYear(2024)).toBe(true);
            expect(isLeapYear(2026)).toBe(false);
            expect(isLeapYear(1900)).toBe(false);
        });
        it('computes day of year and ISO week numbers', () => {
            const jan1 = new Date(Date.UTC(2026, 0, 1));
            expect(getDayOfYear(jan1)).toBe(1);
            expect(getIsoWeekNumber(jan1)).toBe(1);
        });
    });
    describe('Code Snippets', () => {
        it('provides snippets for major programming languages', () => {
            expect(CODE_SNIPPETS.length).toBeGreaterThanOrEqual(8);
            const js = CODE_SNIPPETS.find(s => s.language.includes('JavaScript'));
            expect(js?.getEpoch).toContain('Date.now()');
        });
    });
});
