import { describe, it, expect } from 'vitest';
import { calculateElapsed, splitTimeComponents, formatStopwatchTime, formatDeltaTime, getReactionBenchmarkTier, } from '../../features/stopwatch/timing-engine';
import { computeLapRecords, computeStopwatchStats, } from '../../features/stopwatch/lap-analytics';
import { exportStopwatchJSON, exportStopwatchCSV, exportStopwatchText, } from '../../features/stopwatch/export-utils';
import { computeSessionPaceTrend, computeLapDistribution, } from '../../features/stopwatch/session-analytics';
import { computeReactionStats, } from '../../features/stopwatch/reaction-analytics';
import { compareStopwatchSessions, } from '../../features/stopwatch/comparison-utils';
// ==========================================
// 1. Timing Engine Tests
// ==========================================
describe('Timing Engine: calculateElapsed', () => {
    it('returns 0 when startTime is null', () => {
        expect(calculateElapsed(null, 1000, 0)).toBe(0);
        expect(calculateElapsed(null, 5000, 2000)).toBe(2000);
    });
    it('calculates elapsed monotonic difference correctly', () => {
        expect(calculateElapsed(1000, 2500, 0)).toBe(1500);
        expect(calculateElapsed(2000, 3500, 5000)).toBe(6500);
        expect(calculateElapsed(10000, 10000, 500)).toBe(500);
    });
    it('clamps negative or reversed timestamps safely to 0', () => {
        expect(calculateElapsed(5000, 1000, 0)).toBe(0);
        expect(calculateElapsed(null, 1000, -500)).toBe(0);
    });
    it('maintains precision with large timestamps', () => {
        const start = 1700000000000;
        const now = 1700000060000; // 60s later
        expect(calculateElapsed(start, now, 0)).toBe(60000);
    });
});
describe('Timing Engine: splitTimeComponents', () => {
    it('handles 0 ms input', () => {
        expect(splitTimeComponents(0)).toEqual({
            hours: 0,
            minutes: 0,
            seconds: 0,
            centiseconds: 0,
            milliseconds: 0,
        });
    });
    it('handles sub-second milliseconds', () => {
        expect(splitTimeComponents(750)).toEqual({
            hours: 0,
            minutes: 0,
            seconds: 0,
            centiseconds: 75,
            milliseconds: 750,
        });
    });
    it('handles seconds and minutes', () => {
        expect(splitTimeComponents(65432)).toEqual({
            hours: 0,
            minutes: 1,
            seconds: 5,
            centiseconds: 43,
            milliseconds: 432,
        });
    });
    it('handles hours rollover (> 3600000 ms)', () => {
        expect(splitTimeComponents(3661250)).toEqual({
            hours: 1,
            minutes: 1,
            seconds: 1,
            centiseconds: 25,
            milliseconds: 250,
        });
    });
    it('handles multi-day hours (> 24h)', () => {
        const ms = 25 * 3600000 + 30 * 60000 + 45 * 1000 + 999;
        expect(splitTimeComponents(ms)).toEqual({
            hours: 25,
            minutes: 30,
            seconds: 45,
            centiseconds: 99,
            milliseconds: 999,
        });
    });
});
describe('Timing Engine: formatStopwatchTime', () => {
    const timeMs = 74382; // 01m 14s 382ms (38cs)
    it('formats in seconds precision', () => {
        expect(formatStopwatchTime(timeMs, 'seconds')).toBe('01:14');
    });
    it('formats in centiseconds precision', () => {
        expect(formatStopwatchTime(timeMs, 'centiseconds')).toBe('01:14.38');
    });
    it('formats in milliseconds precision', () => {
        expect(formatStopwatchTime(timeMs, 'milliseconds')).toBe('01:14.382');
    });
    it('supports boolean legacy parameter', () => {
        expect(formatStopwatchTime(timeMs, true)).toBe('01:14.382');
        expect(formatStopwatchTime(timeMs, false)).toBe('01:14.38');
    });
    it('formats boundary at 59:59.999 to 01:00:00.000 correctly', () => {
        expect(formatStopwatchTime(3599999, 'milliseconds')).toBe('59:59.999');
        expect(formatStopwatchTime(3600000, 'milliseconds')).toBe('01:00:00.000');
        expect(formatStopwatchTime(3601500, 'centiseconds')).toBe('01:00:01.50');
    });
    it('formats extreme long durations (> 24 hours)', () => {
        const twentyFiveHours = 25 * 3600000 + 12 * 60000 + 34 * 1000 + 567;
        expect(formatStopwatchTime(twentyFiveHours, 'milliseconds')).toBe('25:12:34.567');
        expect(formatStopwatchTime(twentyFiveHours, 'seconds')).toBe('25:12:34');
    });
    it('pads single-digit values with leading zeros', () => {
        expect(formatStopwatchTime(5005, 'milliseconds')).toBe('00:05.005');
        expect(formatStopwatchTime(5050, 'centiseconds')).toBe('00:05.05');
    });
});
describe('Timing Engine: formatDeltaTime', () => {
    it('formats positive delta with leading +', () => {
        expect(formatDeltaTime(1250, 'centiseconds')).toBe('+00:01.25');
        expect(formatDeltaTime(500, 'milliseconds')).toBe('+00:00.500');
        expect(formatDeltaTime(3000, 'seconds')).toBe('+00:03');
    });
    it('formats negative delta with leading -', () => {
        expect(formatDeltaTime(-450, 'centiseconds')).toBe('-00:00.45');
        expect(formatDeltaTime(-1500, 'milliseconds')).toBe('-00:01.500');
        expect(formatDeltaTime(-2000, 'seconds')).toBe('-00:02');
    });
    it('formats zero delta with leading ±', () => {
        expect(formatDeltaTime(0, 'centiseconds')).toBe('±00:00.00');
        expect(formatDeltaTime(0, 'milliseconds')).toBe('±00:00.000');
    });
});
describe('Timing Engine: getReactionBenchmarkTier', () => {
    it('classifies top tier (<200 ms)', () => {
        const t1 = getReactionBenchmarkTier(150);
        expect(t1.tier).toBe('top-tier');
        expect(t1.badge).toBe('⚡ Top Tier');
        expect(t1.label).toContain('<200 ms');
        const t2 = getReactionBenchmarkTier(199);
        expect(t2.tier).toBe('top-tier');
    });
    it('classifies fast tier (200–260 ms)', () => {
        const t1 = getReactionBenchmarkTier(200);
        expect(t1.tier).toBe('fast');
        expect(t1.badge).toBe('🎯 Fast');
        const t2 = getReactionBenchmarkTier(260);
        expect(t2.tier).toBe('fast');
    });
    it('classifies typical tier (260–340 ms)', () => {
        const t1 = getReactionBenchmarkTier(261);
        expect(t1.tier).toBe('typical');
        expect(t1.badge).toBe('⏱️ Typical');
        const t2 = getReactionBenchmarkTier(340);
        expect(t2.tier).toBe('typical');
    });
    it('classifies slower response (>340 ms)', () => {
        const t1 = getReactionBenchmarkTier(341);
        expect(t1.tier).toBe('slow');
        expect(t1.badge).toBe('🐢 Slower');
        const t2 = getReactionBenchmarkTier(550);
        expect(t2.tier).toBe('slow');
    });
});
// ==========================================
// 2. Lap Analytics & Mathematics Tests
// ==========================================
describe('Lap Analytics: computeLapRecords', () => {
    it('returns empty array when rawLaps is empty', () => {
        expect(computeLapRecords([], 0)).toEqual([]);
        expect(computeLapRecords([], 5000)).toEqual([]);
    });
    it('handles single lap correctly', () => {
        const records = computeLapRecords([15000], 20000);
        expect(records).toHaveLength(1);
        expect(records[0]?.lapNumber).toBe(1);
        expect(records[0]?.lapTimeMs).toBe(15000);
        expect(records[0]?.splitTimeMs).toBe(15000);
        expect(records[0]?.diffFromPrevMs).toBe(0);
        expect(records[0]?.diffFromAvgMs).toBe(0);
        expect(records[0]?.isFastest).toBe(false);
        expect(records[0]?.isSlowest).toBe(false);
        expect(records[0]?.pctOfTotal).toBe(75); // 15000 / 20000
    });
    it('calculates multiple laps with split times, deltas, and fastest/slowest', () => {
        const rawLaps = [10000, 8000, 12000];
        const totalElapsed = 30000;
        const records = computeLapRecords(rawLaps, totalElapsed);
        expect(records).toHaveLength(3);
        // Lap 1
        expect(records[0]?.lapNumber).toBe(1);
        expect(records[0]?.lapTimeMs).toBe(10000);
        expect(records[0]?.splitTimeMs).toBe(10000);
        expect(records[0]?.diffFromPrevMs).toBe(0);
        expect(records[0]?.isFastest).toBe(false);
        expect(records[0]?.isSlowest).toBe(false);
        // Lap 2 (Fastest)
        expect(records[1]?.lapNumber).toBe(2);
        expect(records[1]?.lapTimeMs).toBe(8000);
        expect(records[1]?.splitTimeMs).toBe(18000);
        expect(records[1]?.diffFromPrevMs).toBe(-2000);
        expect(records[1]?.isFastest).toBe(true);
        expect(records[1]?.isSlowest).toBe(false);
        // Lap 3 (Slowest)
        expect(records[2]?.lapNumber).toBe(3);
        expect(records[2]?.lapTimeMs).toBe(12000);
        expect(records[2]?.splitTimeMs).toBe(30000);
        expect(records[2]?.diffFromPrevMs).toBe(4000);
        expect(records[2]?.isFastest).toBe(false);
        expect(records[2]?.isSlowest).toBe(true);
    });
    it('tags multiple identical fastest laps correctly', () => {
        const rawLaps = [5000, 5000, 10000];
        const records = computeLapRecords(rawLaps, 20000);
        expect(records[0]?.isFastest).toBe(true);
        expect(records[1]?.isFastest).toBe(true);
        expect(records[2]?.isSlowest).toBe(true);
    });
    it('handles identical laps without marking all as both fastest and slowest', () => {
        const rawLaps = [5000, 5000, 5000];
        const records = computeLapRecords(rawLaps, 15000);
        expect(records[0]?.isFastest).toBe(false);
        expect(records[0]?.isSlowest).toBe(false);
        expect(records[1]?.isFastest).toBe(false);
        expect(records[2]?.isSlowest).toBe(false);
    });
    it('calculates diffFromAvgMs accurately', () => {
        const rawLaps = [10000, 20000, 30000]; // avg = 20000
        const records = computeLapRecords(rawLaps, 60000);
        expect(records[0]?.diffFromAvgMs).toBe(-10000);
        expect(records[1]?.diffFromAvgMs).toBe(0);
        expect(records[2]?.diffFromAvgMs).toBe(10000);
    });
    it('calculates pctOfTotal with bounds check', () => {
        const rawLaps = [5000, 5000];
        const records = computeLapRecords(rawLaps, 10000);
        expect(records[0]?.pctOfTotal).toBe(50);
        expect(records[1]?.pctOfTotal).toBe(50);
    });
});
// ==========================================
// 3. Statistical Engine Tests
// ==========================================
describe('Statistical Engine: computeStopwatchStats', () => {
    it('handles empty dataset safely', () => {
        const stats = computeStopwatchStats([], 0);
        expect(stats.totalLaps).toBe(0);
        expect(stats.totalElapsedMs).toBe(0);
        expect(stats.fastestLapMs).toBeNull();
        expect(stats.slowestLapMs).toBeNull();
        expect(stats.avgLapMs).toBeNull();
        expect(stats.medianLapMs).toBeNull();
        expect(stats.stdDevMs).toBeNull();
        expect(stats.rangeMs).toBeNull();
        expect(stats.consistencyScore).toBeNull();
        expect(stats.currentLapElapsedMs).toBe(0);
    });
    it('calculates single lap statistics', () => {
        const stats = computeStopwatchStats([10000], 15000);
        expect(stats.totalLaps).toBe(1);
        expect(stats.totalElapsedMs).toBe(15000);
        expect(stats.fastestLapMs).toBe(10000);
        expect(stats.slowestLapMs).toBe(10000);
        expect(stats.avgLapMs).toBe(10000);
        expect(stats.medianLapMs).toBe(10000);
        expect(stats.stdDevMs).toBe(0);
        expect(stats.rangeMs).toBe(0);
        expect(stats.consistencyScore).toBe(100);
        expect(stats.currentLapElapsedMs).toBe(5000); // 15000 - 10000
    });
    it('calculates Mean, Median, Range, and Sample StdDev for odd counts', () => {
        const rawLaps = [10000, 20000, 30000];
        const stats = computeStopwatchStats(rawLaps, 60000);
        expect(stats.avgLapMs).toBe(20000);
        expect(stats.medianLapMs).toBe(20000);
        expect(stats.fastestLapMs).toBe(10000);
        expect(stats.slowestLapMs).toBe(30000);
        expect(stats.rangeMs).toBe(20000);
        expect(stats.stdDevMs).toBe(10000);
    });
    it('calculates Median correctly for even count datasets', () => {
        const rawLaps = [10000, 20000, 30000, 40000];
        const stats = computeStopwatchStats(rawLaps, 100000);
        expect(stats.avgLapMs).toBe(25000);
        expect(stats.medianLapMs).toBe(25000);
    });
    it('calculates Median correctly for unsorted inputs', () => {
        const rawLaps = [40000, 10000, 30000, 20000];
        const stats = computeStopwatchStats(rawLaps, 100000);
        expect(stats.medianLapMs).toBe(25000);
    });
    it('gives 100% consistency score for zero variance', () => {
        const rawLaps = [12000, 12000, 12000, 12000];
        const stats = computeStopwatchStats(rawLaps, 48000);
        expect(stats.stdDevMs).toBe(0);
        expect(stats.consistencyScore).toBe(100);
    });
    it('bounds consistency score strictly between 0% and 100% for high variance data', () => {
        const rawLaps = [1000, 50000, 2000, 90000];
        const stats = computeStopwatchStats(rawLaps, 143000);
        expect(stats.consistencyScore).toBeGreaterThanOrEqual(0);
        expect(stats.consistencyScore).toBeLessThanOrEqual(100);
    });
    it('calculates current active lap duration accurately', () => {
        const rawLaps = [5000, 5000];
        const stats = computeStopwatchStats(rawLaps, 14000);
        expect(stats.currentLapElapsedMs).toBe(4000);
    });
});
// ==========================================
// 4. Session Analytics & Pace Trends Tests
// ==========================================
describe('Session Analytics: computeSessionPaceTrend', () => {
    it('returns null for less than 2 laps', () => {
        expect(computeSessionPaceTrend([])).toBeNull();
        const oneLap = computeLapRecords([10000], 10000);
        expect(computeSessionPaceTrend(oneLap)).toBeNull();
    });
    it('identifies improving pace trend (speeding up)', () => {
        const rawLaps = [20000, 18000, 16000, 14000];
        const records = computeLapRecords(rawLaps, 68000);
        const pace = computeSessionPaceTrend(records);
        expect(pace).not.toBeNull();
        expect(pace?.trend).toBe('improving');
        expect(pace?.slopeMsPerLap).toBeLessThan(-50);
        expect(pace?.firstHalfAvgMs).toBe(19000);
        expect(pace?.secondHalfAvgMs).toBe(15000);
        expect(pace?.lapToLapImprovements[0]).toBe(10); // (20000 - 18000)/20000 = 10%
    });
    it('identifies slowing pace trend (fatigue)', () => {
        const rawLaps = [10000, 12000, 14000, 16000];
        const records = computeLapRecords(rawLaps, 52000);
        const pace = computeSessionPaceTrend(records);
        expect(pace).not.toBeNull();
        expect(pace?.trend).toBe('slowing');
        expect(pace?.slopeMsPerLap).toBeGreaterThan(50);
        expect(pace?.firstHalfAvgMs).toBe(11000);
        expect(pace?.secondHalfAvgMs).toBe(15000);
    });
    it('identifies consistent pace trend', () => {
        const rawLaps = [10000, 10010, 9990, 10005];
        const records = computeLapRecords(rawLaps, 40005);
        const pace = computeSessionPaceTrend(records);
        expect(pace).not.toBeNull();
        expect(pace?.trend).toBe('consistent');
    });
    it('calculates lapToLapImprovements correctly across all laps', () => {
        const rawLaps = [10000, 8000, 10000];
        const records = computeLapRecords(rawLaps, 28000);
        const pace = computeSessionPaceTrend(records);
        expect(pace?.lapToLapImprovements).toHaveLength(2);
        expect(pace?.lapToLapImprovements[0]).toBe(20); // 20% faster
        expect(pace?.lapToLapImprovements[1]).toBe(-25); // 25% slower
    });
});
describe('Session Analytics: computeLapDistribution', () => {
    it('returns empty array for empty laps', () => {
        expect(computeLapDistribution([])).toEqual([]);
    });
    it('returns single bin when all lap times are identical', () => {
        const records = computeLapRecords([10000, 10000, 10000], 30000);
        const bins = computeLapDistribution(records, 4);
        expect(bins).toHaveLength(1);
        expect(bins[0]?.count).toBe(3);
        expect(bins[0]?.pct).toBe(100);
    });
    it('generates proportional histogram distribution bins', () => {
        const rawLaps = [10000, 12000, 15000, 18000, 20000];
        const records = computeLapRecords(rawLaps, 75000);
        const bins = computeLapDistribution(records, 4);
        expect(bins).toHaveLength(4);
        const totalCount = bins.reduce((sum, b) => sum + b.count, 0);
        expect(totalCount).toBe(5);
    });
});
// ==========================================
// 5. Reaction Analytics Tests
// ==========================================
describe('Reaction Analytics: computeReactionStats', () => {
    it('handles empty attempts safely', () => {
        const stats = computeReactionStats([], 0);
        expect(stats.attemptCount).toBe(0);
        expect(stats.falseStartsCount).toBe(0);
        expect(stats.bestReactionMs).toBeNull();
        expect(stats.worstReactionMs).toBeNull();
        expect(stats.avgReactionMs).toBeNull();
        expect(stats.medianReactionMs).toBeNull();
        expect(stats.stdDevMs).toBeNull();
        expect(stats.consistencyScore).toBeNull();
        expect(stats.distribution.topTierCount).toBe(0);
    });
    it('computes single attempt reaction stats', () => {
        const stats = computeReactionStats([210], 0);
        expect(stats.attemptCount).toBe(1);
        expect(stats.bestReactionMs).toBe(210);
        expect(stats.worstReactionMs).toBe(210);
        expect(stats.avgReactionMs).toBe(210);
        expect(stats.medianReactionMs).toBe(210);
        expect(stats.stdDevMs).toBe(0);
        expect(stats.consistencyScore).toBe(100);
        expect(stats.distribution.fastCount).toBe(1);
    });
    it('computes multi-attempt reaction stats and distribution', () => {
        const attempts = [180, 220, 250, 310, 420];
        const stats = computeReactionStats(attempts, 2);
        expect(stats.attemptCount).toBe(5);
        expect(stats.falseStartsCount).toBe(2);
        expect(stats.bestReactionMs).toBe(180);
        expect(stats.worstReactionMs).toBe(420);
        expect(stats.avgReactionMs).toBe(276);
        expect(stats.medianReactionMs).toBe(250);
        expect(stats.distribution.topTierCount).toBe(1); // 180
        expect(stats.distribution.fastCount).toBe(2); // 220, 250
        expect(stats.distribution.typicalCount).toBe(1); // 310
        expect(stats.distribution.slowCount).toBe(1); // 420
    });
    it('calculates median correctly for even attempt counts', () => {
        const attempts = [200, 220, 240, 260];
        const stats = computeReactionStats(attempts, 0);
        expect(stats.medianReactionMs).toBe(230);
    });
});
// ==========================================
// 6. Session Comparison Tests
// ==========================================
describe('Session Comparison: compareStopwatchSessions', () => {
    const sessionA = {
        id: 'session-a',
        name: 'Run A',
        timestamp: 1000000,
        mode: 'standard',
        totalDurationMs: 60000,
        lapCount: 3,
        bestLapMs: 18000,
        slowestLapMs: 22000,
        avgLapMs: 20000,
        consistencyScore: 90,
        rawLaps: [20000, 18000, 22000],
    };
    const sessionB = {
        id: 'session-b',
        name: 'Run B',
        timestamp: 2000000,
        mode: 'standard',
        totalDurationMs: 54000,
        lapCount: 3,
        bestLapMs: 16000,
        slowestLapMs: 20000,
        avgLapMs: 18000,
        consistencyScore: 95,
        rawLaps: [18000, 16000, 20000],
    };
    it('calculates duration difference and improvement percentage', () => {
        const comparison = compareStopwatchSessions(sessionA, sessionB);
        expect(comparison.totalDurationDiffMs).toBe(-6000); // 6s faster
        expect(comparison.totalDurationImprovementPct).toBe(10); // 10% improvement
        expect(comparison.bestLapDiffMs).toBe(-2000); // 2s better lap
        expect(comparison.avgLapDiffMs).toBe(-2000);
        expect(comparison.consistencyDiff).toBe(5); // +5% consistency
    });
    it('handles slower session B with negative improvement percentage', () => {
        const comparison = compareStopwatchSessions(sessionB, sessionA);
        expect(comparison.totalDurationDiffMs).toBe(6000);
        expect(comparison.totalDurationImprovementPct).toBeLessThan(0);
        expect(comparison.bestLapDiffMs).toBe(2000);
    });
    it('aligns lap-by-lap comparison deltas', () => {
        const comparison = compareStopwatchSessions(sessionA, sessionB);
        expect(comparison.lapByLapDeltas).toHaveLength(3);
        expect(comparison.lapByLapDeltas[0]).toEqual({
            lapNumber: 1,
            lapTimeA: 20000,
            lapTimeB: 18000,
            deltaMs: -2000,
        });
        expect(comparison.lapByLapDeltas[1]).toEqual({
            lapNumber: 2,
            lapTimeA: 18000,
            lapTimeB: 16000,
            deltaMs: -2000,
        });
    });
    it('handles sessions with unequal lap counts gracefully', () => {
        const sessionShort = {
            ...sessionA,
            rawLaps: [20000],
        };
        const comparison = compareStopwatchSessions(sessionShort, sessionB);
        expect(comparison.lapByLapDeltas).toHaveLength(3);
        expect(comparison.lapByLapDeltas[1]?.lapTimeA).toBe(0);
        expect(comparison.lapByLapDeltas[1]?.lapTimeB).toBe(16000);
    });
});
// ==========================================
// 7. Export Utilities Tests
// ==========================================
describe('Export Utilities: JSON, CSV & Text Serializers', () => {
    const rawLaps = [10500, 9200, 11800];
    const totalElapsed = 31500;
    const records = computeLapRecords(rawLaps, totalElapsed);
    const stats = computeStopwatchStats(rawLaps, totalElapsed);
    it('exports valid, parseable JSON schema', () => {
        const jsonStr = exportStopwatchJSON(stats, records, 'milliseconds');
        const parsed = JSON.parse(jsonStr);
        expect(parsed).toBeDefined();
        expect(parsed.summary.totalLaps).toBe(3);
        expect(parsed.summary.totalElapsedMs).toBe(31500);
        expect(parsed.laps).toHaveLength(3);
        expect(parsed.laps[0].lap).toBe(1);
        expect(parsed.laps[1].isFastest).toBe(true);
    });
    it('exports RFC 4180 compliant CSV string', () => {
        const csvStr = exportStopwatchCSV(stats, records, 'centiseconds');
        const lines = csvStr.trim().split('\n');
        expect(lines).toHaveLength(4);
        expect(lines[0]).toContain('Lap Number,Lap Time (Formatted),Lap Time (ms)');
        expect(lines[2]).toContain('Fastest');
        expect(lines[3]).toContain('Slowest');
    });
    it('exports clean, human-readable plain text summary table', () => {
        const textStr = exportStopwatchText(stats, records, 'centiseconds');
        expect(textStr).toContain('KaruviLab Stopwatch Session Summary');
        expect(textStr).toContain('Total Elapsed:');
        expect(textStr).toContain('Average Lap:');
        expect(textStr).toContain('Fastest Lap:');
        expect(textStr).toContain('Lap Breakdown:');
        expect(textStr).toContain('⭐ Fastest');
        expect(textStr).toContain('🐢 Slowest');
    });
});
// ==========================================
// 8. Stress & Monotonic Integrity Tests
// ==========================================
describe('Stress & Monotonic Integrity', () => {
    it('maintains mathematical precision across 100 rapid pause/resume cycles without drift', () => {
        let accumulated = 0;
        let baseTime = 100000;
        for (let i = 0; i < 100; i++) {
            const start = baseTime;
            const now = start + 50;
            accumulated = calculateElapsed(start, now, accumulated);
            baseTime += 100;
        }
        expect(accumulated).toBe(5000);
    });
    it('processes 1000 sequential laps with sub-millisecond accuracy', () => {
        const massiveLaps = Array.from({ length: 1000 }, (_, i) => 1000 + (i % 10));
        const totalElapsed = massiveLaps.reduce((a, b) => a + b, 0);
        const records = computeLapRecords(massiveLaps, totalElapsed);
        expect(records).toHaveLength(1000);
        const stats = computeStopwatchStats(massiveLaps, totalElapsed);
        expect(stats.totalLaps).toBe(1000);
        expect(stats.fastestLapMs).toBe(1000);
        expect(stats.slowestLapMs).toBe(1009);
        expect(stats.consistencyScore).toBeGreaterThan(95);
    });
});
