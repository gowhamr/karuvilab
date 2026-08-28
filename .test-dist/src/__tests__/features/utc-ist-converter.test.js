import { describe, it, expect } from 'vitest';
import { parseInputToUtcEpoch, formatUtcIso, formatIstIso, formatToDateTimeLocal, formatFriendlyDisplay, detectDateRollover, verifyRoundTrip, generateMachineOutput, processBatchLines, exportBatchToCsv, exportBatchToJson, IST_OFFSET_MS, } from '@/src/features/calculators/utc-ist/engine';
describe('UTC ↔ IST Deterministic Engine & Boundary Tests', () => {
    describe('1. Core Offset & Conversion Accuracy (+5:30)', () => {
        it('verifies exact 5 hour 30 minute offset (19,800,000 ms)', () => {
            expect(IST_OFFSET_MS).toBe(19800000);
            expect(IST_OFFSET_MS / (60 * 1000)).toBe(330);
        });
        it('converts UTC 00:00 to IST 05:30 same day', () => {
            const utcStr = '2026-06-15T00:00:00';
            const parsed = parseInputToUtcEpoch(utcStr, false);
            expect(parsed.success).toBe(true);
            expect(formatUtcIso(parsed.epochMs, 'sec')).toBe('2026-06-15T00:00:00Z');
            expect(formatIstIso(parsed.epochMs, 'sec')).toBe('2026-06-15T05:30:00+05:30');
        });
        it('converts IST 05:30 to UTC 00:00 same day', () => {
            const istStr = '2026-06-15T05:30:00';
            const parsed = parseInputToUtcEpoch(istStr, true);
            expect(parsed.success).toBe(true);
            expect(formatUtcIso(parsed.epochMs, 'sec')).toBe('2026-06-15T00:00:00Z');
            expect(formatIstIso(parsed.epochMs, 'sec')).toBe('2026-06-15T05:30:00+05:30');
        });
    });
    describe('2. Date Rollover & Midnight Boundaries', () => {
        it('detects +1 Day rollover when UTC is 19:00 (rolls to 00:30 next day in IST)', () => {
            const utcStr = '2026-08-25T19:00:00';
            const parsed = parseInputToUtcEpoch(utcStr, false);
            expect(parsed.success).toBe(true);
            const rollover = detectDateRollover(parsed.epochMs);
            expect(rollover.isSameDay).toBe(false);
            expect(rollover.isNextDay).toBe(true);
            expect(rollover.daysDiff).toBe(1);
            expect(rollover.label).toContain('+1 Day');
            expect(rollover.utcDateStr).toBe('2026-08-25');
            expect(rollover.istDateStr).toBe('2026-08-26');
            expect(formatIstIso(parsed.epochMs, 'sec')).toBe('2026-08-26T00:30:00+05:30');
        });
        it('detects -1 Day rollover when IST is 02:00 (rolls to 20:30 previous day in UTC)', () => {
            const istStr = '2026-08-26T02:00:00';
            const parsed = parseInputToUtcEpoch(istStr, true);
            expect(parsed.success).toBe(true);
            const rollover = detectDateRollover(parsed.epochMs);
            expect(rollover.isSameDay).toBe(false);
            expect(rollover.isNextDay).toBe(true); // From UTC perspective, IST is +1 day
            expect(rollover.utcDateStr).toBe('2026-08-25');
            expect(rollover.istDateStr).toBe('2026-08-26');
            expect(formatUtcIso(parsed.epochMs, 'sec')).toBe('2026-08-25T20:30:00Z');
        });
        it('handles Year-End Boundary (Dec 31 23:00 UTC -> Jan 1 04:30 IST)', () => {
            const utcStr = '2025-12-31T23:00:00';
            const parsed = parseInputToUtcEpoch(utcStr, false);
            expect(parsed.success).toBe(true);
            const rollover = detectDateRollover(parsed.epochMs);
            expect(rollover.isNextDay).toBe(true);
            expect(rollover.utcDateStr).toBe('2025-12-31');
            expect(rollover.istDateStr).toBe('2026-01-01');
            expect(formatIstIso(parsed.epochMs, 'sec')).toBe('2026-01-01T04:30:00+05:30');
        });
        it('handles Leap Year Feb 28 -> Feb 29 rollover in 2024', () => {
            const utcStr = '2024-02-28T20:00:00';
            const parsed = parseInputToUtcEpoch(utcStr, false);
            expect(parsed.success).toBe(true);
            const rollover = detectDateRollover(parsed.epochMs);
            expect(rollover.isNextDay).toBe(true);
            expect(rollover.utcDateStr).toBe('2024-02-28');
            expect(rollover.istDateStr).toBe('2024-02-29');
            expect(formatIstIso(parsed.epochMs, 'sec')).toBe('2024-02-29T01:30:00+05:30');
        });
    });
    describe('3. Precision Preservation (Seconds & Milliseconds)', () => {
        it('preserves millisecond precision correctly', () => {
            const isoWithMs = '2026-08-25T14:30:45.678Z';
            const parsed = parseInputToUtcEpoch(isoWithMs, false);
            expect(parsed.success).toBe(true);
            expect(parsed.precision).toBe('ms');
            expect(formatUtcIso(parsed.epochMs, 'ms')).toBe('2026-08-25T14:30:45.678Z');
            expect(formatIstIso(parsed.epochMs, 'ms')).toBe('2026-08-25T20:00:45.678+05:30');
            expect(formatToDateTimeLocal(parsed.epochMs, 0, 'ms')).toBe('2026-08-25T14:30:45.678');
            expect(formatToDateTimeLocal(parsed.epochMs, IST_OFFSET_MS, 'ms')).toBe('2026-08-25T20:00:45.678');
        });
        it('preserves seconds precision without adding unwanted ms', () => {
            const isoWithSec = '2026-08-25T14:30:45';
            const parsed = parseInputToUtcEpoch(isoWithSec, false);
            expect(parsed.success).toBe(true);
            expect(parsed.precision).toBe('sec');
            expect(formatUtcIso(parsed.epochMs, 'sec')).toBe('2026-08-25T14:30:45Z');
            expect(formatIstIso(parsed.epochMs, 'sec')).toBe('2026-08-25T20:00:45+05:30');
        });
    });
    describe('4. Unix Timestamp Parsing & Generation', () => {
        it('parses 10-digit epoch seconds correctly', () => {
            const epochSeconds = '1787682084';
            const parsed = parseInputToUtcEpoch(epochSeconds, false);
            expect(parsed.success).toBe(true);
            expect(parsed.epochMs).toBe(1787682084000);
            expect(formatUtcIso(parsed.epochMs, 'sec')).toContain('Z');
        });
        it('parses 13-digit epoch milliseconds correctly', () => {
            const epochMsStr = '1787682084123';
            const parsed = parseInputToUtcEpoch(epochMsStr, false);
            expect(parsed.success).toBe(true);
            expect(parsed.epochMs).toBe(1787682084123);
            expect(formatUtcIso(parsed.epochMs, 'ms')).toBe('2026-08-25T18:21:24.123Z');
        });
        it('parses negative epoch timestamps (pre-1970)', () => {
            const negativeEpoch = '-315619200'; // 1960-01-01
            const parsed = parseInputToUtcEpoch(negativeEpoch, false);
            expect(parsed.success).toBe(true);
            expect(parsed.epochMs).toBe(-315619200000);
            expect(formatUtcIso(parsed.epochMs, 'sec')).toContain('1960');
        });
    });
    describe('5. Round-Trip Parity Verification', () => {
        it('verifies 0ms drift on random epoch timestamps', () => {
            const testTimestamps = [
                Date.now(),
                0, // 1970-01-01T00:00:00Z
                1700000000000,
                1787682084567,
                -1000000000
            ];
            testTimestamps.forEach(ts => {
                const check = verifyRoundTrip(ts);
                expect(check.isVerified).toBe(true);
                expect(check.driftMs).toBe(0);
            });
        });
    });
    describe('6. 12-Hour vs 24-Hour Formatting', () => {
        it('formats 12-hour AM/PM display accurately', () => {
            const parsed = parseInputToUtcEpoch('2026-08-25T00:15:00', false);
            expect(parsed.success).toBe(true);
            const str12 = formatFriendlyDisplay(parsed.epochMs, 0, false, 'min');
            expect(str12).toContain('12:15 AM');
            const str12Pm = formatFriendlyDisplay(parsed.epochMs + 12 * 3600000, 0, false, 'min');
            expect(str12Pm).toContain('12:15 PM');
        });
        it('formats 24-hour display accurately', () => {
            const parsed = parseInputToUtcEpoch('2026-08-25T18:45:30', false);
            expect(parsed.success).toBe(true);
            const str24 = formatFriendlyDisplay(parsed.epochMs, 0, true, 'sec');
            expect(str24).toContain('18:45:30');
        });
    });
    describe('7. Machine-Readable Output Generation', () => {
        it('generates complete machine JSON data structure', () => {
            const ts = 1787682084000;
            const machine = generateMachineOutput(ts, 'sec');
            expect(machine.epochSeconds).toBe(1787682084);
            expect(machine.epochMs).toBe(1787682084000);
            expect(machine.offsetString).toBe('+05:30 (IST)');
            expect(machine.roundTripVerified).toBe(true);
            expect(machine.utcIso).toBe('2026-08-25T18:21:24Z');
            expect(machine.istIso).toBe('2026-08-25T23:51:24+05:30');
            expect(machine.rollover).toBeDefined();
        });
    });
    describe('8. Batch Conversion & CSV/JSON Export', () => {
        it('processes batch lines and exports to CSV and JSON', () => {
            const rawLines = `
        2026-08-25T12:00:00
        1787682084
        invalid-date-string
        2026-12-31T23:30:00
      `;
            const batch = processBatchLines(rawLines, 'auto', true);
            expect(batch.total).toBe(4);
            expect(batch.validCount).toBe(3);
            expect(batch.errorCount).toBe(1);
            const csv = exportBatchToCsv(batch);
            expect(csv).toContain('UTC (ISO 8601)');
            expect(csv).toContain('ERROR');
            expect(csv).toContain('2026-08-25T12:00:00Z');
            const jsonStr = exportBatchToJson(batch);
            const parsedJson = JSON.parse(jsonStr);
            expect(Array.isArray(parsedJson)).toBe(true);
            expect(parsedJson.length).toBe(4);
            expect(parsedJson[2].valid).toBe(false);
        });
    });
    describe('9. Structured Error Handling (No silent fallback)', () => {
        it('returns descriptive error on invalid inputs', () => {
            const res = parseInputToUtcEpoch('not a date', false);
            expect(res.success).toBe(false);
            expect(res.error).toBeDefined();
            expect(res.error).toContain('Unrecognized date/time format');
        });
        it('returns error on empty input', () => {
            const res = parseInputToUtcEpoch('', false);
            expect(res.success).toBe(false);
            expect(res.error).toContain('empty');
        });
        it('returns error on out of range date values', () => {
            const res = parseInputToUtcEpoch('2026-15-45T99:99:99', false);
            expect(res.success).toBe(false);
            expect(res.error).toContain('valid calendar range');
        });
    });
});
