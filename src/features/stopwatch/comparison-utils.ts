/**
 * Pure Session Comparison Utilities
 */

import { SavedSession, SessionComparisonResult } from './types';

/**
 * Compares two recorded stopwatch sessions side-by-side and returns metric deltas.
 */
export function compareStopwatchSessions(
  sessionA: SavedSession,
  sessionB: SavedSession
): SessionComparisonResult {
  const totalDurationDiffMs = sessionB.totalDurationMs - sessionA.totalDurationMs;
  const totalDurationImprovementPct =
    sessionA.totalDurationMs > 0
      ? Number((((sessionA.totalDurationMs - sessionB.totalDurationMs) / sessionA.totalDurationMs) * 100).toFixed(2))
      : 0;

  const bestLapDiffMs =
    sessionA.bestLapMs !== null && sessionB.bestLapMs !== null
      ? sessionB.bestLapMs - sessionA.bestLapMs
      : null;

  const avgLapDiffMs =
    sessionA.avgLapMs !== null && sessionB.avgLapMs !== null
      ? sessionB.avgLapMs - sessionA.avgLapMs
      : null;

  const consistencyDiff =
    sessionA.consistencyScore !== null && sessionB.consistencyScore !== null
      ? Number((sessionB.consistencyScore - sessionA.consistencyScore).toFixed(1))
      : null;

  // Lap-by-lap comparison
  const maxLaps = Math.max(sessionA.rawLaps.length, sessionB.rawLaps.length);
  const lapByLapDeltas: { lapNumber: number; lapTimeA: number; lapTimeB: number; deltaMs: number }[] = [];

  for (let i = 0; i < maxLaps; i++) {
    const timeA = sessionA.rawLaps[i] ?? 0;
    const timeB = sessionB.rawLaps[i] ?? 0;
    lapByLapDeltas.push({
      lapNumber: i + 1,
      lapTimeA: timeA,
      lapTimeB: timeB,
      deltaMs: timeB - timeA,
    });
  }

  return {
    sessionA: {
      id: sessionA.id,
      name: sessionA.name,
      totalDurationMs: sessionA.totalDurationMs,
      bestLapMs: sessionA.bestLapMs,
      avgLapMs: sessionA.avgLapMs,
      consistency: sessionA.consistencyScore,
      laps: sessionA.lapCount,
    },
    sessionB: {
      id: sessionB.id,
      name: sessionB.name,
      totalDurationMs: sessionB.totalDurationMs,
      bestLapMs: sessionB.bestLapMs,
      avgLapMs: sessionB.avgLapMs,
      consistency: sessionB.consistencyScore,
      laps: sessionB.lapCount,
    },
    totalDurationDiffMs,
    totalDurationImprovementPct,
    bestLapDiffMs,
    avgLapDiffMs,
    consistencyDiff,
    lapByLapDeltas,
  };
}
