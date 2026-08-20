/**
 * Stopwatch Types & Interfaces — Phase 5 Analytics & Session History
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
  rawLaps: number[];
}

export interface StopwatchSettings {
  clockSize: 'small' | 'medium' | 'large' | 'huge';
  dashboardTheme: 'dark' | 'light' | 'amoled' | 'blue' | 'matrix';
  showLaps: boolean;
  precision: PrecisionMode;
  showMilliseconds: boolean;
  soundEnabled: boolean;
  workDurationSec: number;
  restDurationSec: number;
  totalRounds: number;
}

export type StopwatchMode = 'standard' | 'countdown' | 'interval' | 'reaction';

export interface SavedSession {
  id: string;
  name: string;
  timestamp: number; // Unix epoch ms
  mode: StopwatchMode;
  totalDurationMs: number;
  lapCount: number;
  bestLapMs: number | null;
  slowestLapMs: number | null;
  avgLapMs: number | null;
  consistencyScore: number | null;
  rawLaps: number[];
  config?: {
    workSec?: number;
    restSec?: number;
    rounds?: number;
    countdownSec?: number;
  };
}

export interface PersonalRecords {
  bestLapMs: number | null;
  bestTotalTimeMs: number | null;
  bestReactionTimeMs: number | null;
  bestConsistencyScore: number | null;
  totalSessionsCompleted: number;
  totalDurationTrackedMs: number;
}

export interface ReactionAnalyticsSummary {
  attemptCount: number;
  falseStartsCount: number;
  bestReactionMs: number | null;
  worstReactionMs: number | null;
  avgReactionMs: number | null;
  medianReactionMs: number | null;
  stdDevMs: number | null;
  consistencyScore: number | null;
  distribution: {
    topTierCount: number; // <200ms
    fastCount: number; // 200-260ms
    typicalCount: number; // 260-340ms
    slowCount: number; // >340ms
  };
}

export interface PaceTrendResult {
  trend: 'improving' | 'slowing' | 'consistent';
  slopeMsPerLap: number;
  lapToLapImprovements: number[]; // % improvement vs prior lap
  firstHalfAvgMs: number;
  secondHalfAvgMs: number;
  halfDiffPct: number;
}

export interface LapDistributionBin {
  label: string;
  minMs: number;
  maxMs: number;
  count: number;
  pct: number;
}

export interface SessionComparisonResult {
  sessionA: { id: string; name: string; totalDurationMs: number; bestLapMs: number | null; avgLapMs: number | null; consistency: number | null; laps: number };
  sessionB: { id: string; name: string; totalDurationMs: number; bestLapMs: number | null; avgLapMs: number | null; consistency: number | null; laps: number };
  totalDurationDiffMs: number;
  totalDurationImprovementPct: number; // negative means B is faster
  bestLapDiffMs: number | null;
  avgLapDiffMs: number | null;
  consistencyDiff: number | null;
  lapByLapDeltas: { lapNumber: number; lapTimeA: number; lapTimeB: number; deltaMs: number }[];
}
