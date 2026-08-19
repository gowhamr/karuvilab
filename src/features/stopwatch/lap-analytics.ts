/**
 * Pure Lap Analytics & Statistics Calculations
 */

import { LapRecord, StopwatchStats } from './types';

/**
 * Calculates full LapRecord array from a list of raw lap durations (in ms).
 * Lap 1 is the first recorded lap, Lap N is the latest recorded lap.
 */
export function computeLapRecords(rawLaps: number[], totalElapsedMs: number): LapRecord[] {
  if (!rawLaps || rawLaps.length === 0) {
    return [];
  }

  const n = rawLaps.length;
  const minTime = Math.min(...rawLaps);
  const maxTime = Math.max(...rawLaps);
  const totalLapsTime = rawLaps.reduce((acc, t) => acc + t, 0);
  const avgTime = totalLapsTime / n;

  let runningSplit = 0;
  const records: LapRecord[] = [];

  for (let i = 0; i < n; i++) {
    const lapTime = rawLaps[i]!;
    runningSplit += lapTime;
    const prevLapTime = i > 0 ? rawLaps[i - 1]! : lapTime;
    const diffFromPrev = i > 0 ? lapTime - prevLapTime : 0;
    const diffFromAvg = lapTime - avgTime;
    const isFastest = n >= 2 && lapTime === minTime;
    const isSlowest = n >= 2 && lapTime === maxTime;
    const pctOfTotal = totalElapsedMs > 0 ? (lapTime / totalElapsedMs) * 100 : 0;

    records.push({
      id: `lap-${i + 1}-${lapTime}`,
      lapNumber: i + 1,
      lapTimeMs: lapTime,
      splitTimeMs: runningSplit,
      diffFromPrevMs: diffFromPrev,
      diffFromAvgMs: diffFromAvg,
      isFastest,
      isSlowest,
      pctOfTotal: Math.min(100, Math.max(0, pctOfTotal)),
    });
  }

  return records;
}

/**
 * Computes statistical metrics across all recorded laps.
 */
export function computeStopwatchStats(rawLaps: number[], totalElapsedMs: number): StopwatchStats {
  const totalLaps = rawLaps.length;
  const totalLapsTime = rawLaps.reduce((acc, t) => acc + t, 0);
  const currentLapElapsedMs = Math.max(0, totalElapsedMs - totalLapsTime);

  if (totalLaps === 0) {
    return {
      totalLaps: 0,
      totalElapsedMs,
      fastestLapMs: null,
      slowestLapMs: null,
      avgLapMs: null,
      medianLapMs: null,
      stdDevMs: null,
      rangeMs: null,
      consistencyScore: null,
      currentLapElapsedMs,
    };
  }

  const fastestLapMs = Math.min(...rawLaps);
  const slowestLapMs = Math.max(...rawLaps);
  const avgLapMs = totalLapsTime / totalLaps;
  const rangeMs = slowestLapMs - fastestLapMs;

  // Median
  const sorted = [...rawLaps].sort((a, b) => a - b);
  let medianLapMs: number;
  const mid = Math.floor(totalLaps / 2);
  if (totalLaps % 2 === 1) {
    medianLapMs = sorted[mid]!;
  } else {
    medianLapMs = (sorted[mid - 1]! + sorted[mid]!) / 2;
  }

  // Sample Standard Deviation & Consistency Score
  let stdDevMs: number | null = null;
  let consistencyScore: number | null = null;

  if (totalLaps >= 2) {
    const variance = rawLaps.reduce((acc, t) => acc + Math.pow(t - avgLapMs, 2), 0) / (totalLaps - 1);
    stdDevMs = Math.sqrt(variance);

    // Consistency score (0% to 100%): 100% - coefficient of variation
    if (avgLapMs > 0) {
      const cv = stdDevMs / avgLapMs;
      consistencyScore = Math.max(0, Math.min(100, (1 - cv) * 100));
    } else {
      consistencyScore = 100;
    }
  } else {
    stdDevMs = 0;
    consistencyScore = 100;
  }

  return {
    totalLaps,
    totalElapsedMs,
    fastestLapMs,
    slowestLapMs,
    avgLapMs,
    medianLapMs,
    stdDevMs,
    rangeMs,
    consistencyScore,
    currentLapElapsedMs,
  };
}
