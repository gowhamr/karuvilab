/**
 * Stopwatch Types & Interfaces
 */

export type PrecisionMode = 'seconds' | 'centiseconds' | 'milliseconds';

export interface LapRecord {
  id: string;
  lapNumber: number;
  lapTimeMs: number;
  splitTimeMs: number;
  diffFromPrevMs: number;
  diffFromAvgMs: number;
  isFastest: boolean;
  isSlowest: boolean;
  pctOfTotal: number;
}

export interface StopwatchStats {
  totalLaps: number;
  totalElapsedMs: number;
  fastestLapMs: number | null;
  slowestLapMs: number | null;
  avgLapMs: number | null;
  medianLapMs: number | null;
  stdDevMs: number | null;
  rangeMs: number | null;
  consistencyScore: number | null; // 0 to 100%
  currentLapElapsedMs: number;
}

export interface StopwatchSnapshot {
  isRunning: boolean;
  accumulatedMs: number;
  startTimestamp: number | null;
  elapsedMs: number;
  rawLaps: number[]; // stored as individual lap durations in ms
}

export interface StopwatchSettings {
  clockSize: 'small' | 'medium' | 'large' | 'huge';
  dashboardTheme: 'dark' | 'light' | 'amoled' | 'blue' | 'matrix';
  showLaps: boolean;
  precision: PrecisionMode;
  showMilliseconds: boolean; // legacy compatibility
}
