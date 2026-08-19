import { describe, it, expect } from 'vitest';
import {
  calculateElapsed,
  splitTimeComponents,
  formatStopwatchTime,
  formatDeltaTime,
} from '../../features/stopwatch/timing-engine';
import {
  computeLapRecords,
  computeStopwatchStats,
} from '../../features/stopwatch/lap-analytics';
import {
  exportStopwatchJSON,
  exportStopwatchCSV,
  exportStopwatchText,
} from '../../features/stopwatch/export-utils';

describe('Stopwatch Timing Engine & Monotonic Elapsed Calculations', () => {
  it('calculates elapsed time from start timestamp without accumulated timer interval drift', () => {
    expect(calculateElapsed(null, 5000, 0)).toBe(0);
    expect(calculateElapsed(1000, 2500, 0)).toBe(1500);
    expect(calculateElapsed(2000, 3500, 5000)).toBe(6500);
  });

  it('handles negative or invalid elapsed values safely by clamping to 0', () => {
    expect(calculateElapsed(5000, 1000, 0)).toBe(0);
    expect(calculateElapsed(null, 1000, -500)).toBe(0);
  });

  it('accurately splits milliseconds into hours, minutes, seconds, centiseconds, and milliseconds', () => {
    const split1 = splitTimeComponents(0);
    expect(split1).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
      centiseconds: 0,
      milliseconds: 0,
    });

    const split2 = splitTimeComponents(3661250); // 1h 1m 1s 250ms (25cs)
    expect(split2).toEqual({
      hours: 1,
      minutes: 1,
      seconds: 1,
      centiseconds: 25,
      milliseconds: 250,
    });
  });

  it('formats time correctly across precision modes (seconds, centiseconds, milliseconds)', () => {
    const timeMs = 74382; // 01m 14s 382ms (38cs)

    expect(formatStopwatchTime(timeMs, 'seconds')).toBe('01:14');
    expect(formatStopwatchTime(timeMs, 'centiseconds')).toBe('01:14.38');
    expect(formatStopwatchTime(timeMs, 'milliseconds')).toBe('01:14.382');
    // Legacy boolean compatibility
    expect(formatStopwatchTime(timeMs, true)).toBe('01:14.382');
    expect(formatStopwatchTime(timeMs, false)).toBe('01:14.38');
  });

  it('handles 59:59.999 to 01:00:00.000 rollover correctly', () => {
    const beforeHour = 3599999; // 59m 59s 999ms
    const atHour = 3600000; // 1h 00m 00s 000ms
    const afterHour = 3601500; // 1h 00m 01s 500ms

    expect(formatStopwatchTime(beforeHour, 'milliseconds')).toBe('59:59.999');
    expect(formatStopwatchTime(atHour, 'milliseconds')).toBe('01:00:00.000');
    expect(formatStopwatchTime(afterHour, 'centiseconds')).toBe('01:00:01.50');
  });

  it('formats lap delta times with leading + / - / ± signs correctly', () => {
    expect(formatDeltaTime(1250, 'centiseconds')).toBe('+00:01.25');
    expect(formatDeltaTime(-450, 'centiseconds')).toBe('-00:00.45');
    expect(formatDeltaTime(0, 'centiseconds')).toBe('±00:00.00');
  });
});

describe('Lap Analytics & Split Calculations', () => {
  it('handles empty lap list safely', () => {
    const records = computeLapRecords([], 0);
    expect(records).toEqual([]);

    const stats = computeStopwatchStats([], 0);
    expect(stats.totalLaps).toBe(0);
    expect(stats.fastestLapMs).toBeNull();
    expect(stats.slowestLapMs).toBeNull();
    expect(stats.avgLapMs).toBeNull();
    expect(stats.medianLapMs).toBeNull();
    expect(stats.stdDevMs).toBeNull();
  });

  it('computes single lap dataset accurately', () => {
    const rawLaps = [15000];
    const totalElapsed = 20000;

    const records = computeLapRecords(rawLaps, totalElapsed);
    expect(records).toHaveLength(1);
    expect(records[0]?.lapNumber).toBe(1);
    expect(records[0]?.lapTimeMs).toBe(15000);
    expect(records[0]?.splitTimeMs).toBe(15000);
    expect(records[0]?.diffFromPrevMs).toBe(0);
    expect(records[0]?.isFastest).toBe(false);
    expect(records[0]?.isSlowest).toBe(false);
    expect(records[0]?.pctOfTotal).toBe(75);

    const stats = computeStopwatchStats(rawLaps, totalElapsed);
    expect(stats.totalLaps).toBe(1);
    expect(stats.fastestLapMs).toBe(15000);
    expect(stats.slowestLapMs).toBe(15000);
    expect(stats.avgLapMs).toBe(15000);
    expect(stats.medianLapMs).toBe(15000);
    expect(stats.stdDevMs).toBe(0);
    expect(stats.consistencyScore).toBe(100);
    expect(stats.currentLapElapsedMs).toBe(5000);
  });

  it('calculates multiple laps with split times, deltas, and fastest/slowest tagging', () => {
    const rawLaps = [10000, 8000, 12000]; // Lap 2 is fastest (8000), Lap 3 is slowest (12000)
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
});

describe('Statistical Metrics & Consistency Engine', () => {
  it('calculates Mean, Median, Range, and Sample Standard Deviation for odd counts', () => {
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
    expect(stats.medianLapMs).toBe(25000); // (20000 + 30000) / 2
  });

  it('gives 100% consistency score for identical lap times (zero variance)', () => {
    const rawLaps = [15000, 15000, 15000, 15000];
    const stats = computeStopwatchStats(rawLaps, 60000);

    expect(stats.stdDevMs).toBe(0);
    expect(stats.consistencyScore).toBe(100);
  });

  it('bounds consistency score strictly between 0% and 100% for high variance data', () => {
    const rawLaps = [1000, 50000, 2000, 90000];
    const stats = computeStopwatchStats(rawLaps, 143000);

    expect(stats.consistencyScore).toBeGreaterThanOrEqual(0);
    expect(stats.consistencyScore).toBeLessThanOrEqual(100);
  });
});

describe('Export Serialization Fidelity (JSON, CSV, Plain Text)', () => {
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

    expect(lines).toHaveLength(4); // Header + 3 laps
    expect(lines[0]).toContain('Lap Number,Lap Time (Formatted),Lap Time (ms)');
    expect(lines[2]).toContain('Fastest'); // Lap 2
    expect(lines[3]).toContain('Slowest'); // Lap 3
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
