/**
 * Stopwatch Constants & Benchmarks
 */

export const STOPWATCH_SETTINGS_KEY = 'karuvi-stopwatch-settings-v2';
export const STOPWATCH_SESSIONS_KEY = 'karuvi-stopwatch-sessions-v1';

export const REACTION_BENCHMARKS = {
  TOP_TIER_MAX_MS: 200,
  FAST_MAX_MS: 260,
  TYPICAL_MAX_MS: 340,
} as const;

export const DEFAULT_INTERVAL_CONFIG = {
  WORK_DURATION_SEC: 30,
  REST_DURATION_SEC: 10,
  TOTAL_ROUNDS: 8,
  PREP_DELAY_SEC: 3,
} as const;
