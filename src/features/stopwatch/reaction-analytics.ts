/**
 * Pure Reaction Time Analytics & Benchmark Distribution Calculations
 */

import { ReactionAnalyticsSummary } from './types';
import { REACTION_BENCHMARKS } from './constants';

/**
 * Computes statistical analytics and tier distribution across reaction test attempts.
 */
export function computeReactionStats(
  attempts: number[],
  falseStartsCount: number = 0
): ReactionAnalyticsSummary {
  const attemptCount = attempts.length;

  if (attemptCount === 0) {
    return {
      attemptCount: 0,
      falseStartsCount,
      bestReactionMs: null,
      worstReactionMs: null,
      avgReactionMs: null,
      medianReactionMs: null,
      stdDevMs: null,
      consistencyScore: null,
      distribution: {
        topTierCount: 0,
        fastCount: 0,
        typicalCount: 0,
        slowCount: 0,
      },
    };
  }

  const bestReactionMs = Math.min(...attempts);
  const worstReactionMs = Math.max(...attempts);
  const sum = attempts.reduce((a, b) => a + b, 0);
  const avgReactionMs = Math.round(sum / attemptCount);

  // Median
  const sorted = [...attempts].sort((a, b) => a - b);
  const mid = Math.floor(attemptCount / 2);
  const medianReactionMs =
    attemptCount % 2 === 1 ? sorted[mid]! : Math.round((sorted[mid - 1]! + sorted[mid]!) / 2);

  // Standard deviation & Consistency
  let stdDevMs = 0;
  let consistencyScore = 100;

  if (attemptCount >= 2) {
    const variance =
      attempts.reduce((acc, score) => acc + Math.pow(score - avgReactionMs, 2), 0) /
      (attemptCount - 1);
    stdDevMs = Math.round(Math.sqrt(variance));

    if (avgReactionMs > 0) {
      const cv = stdDevMs / avgReactionMs;
      consistencyScore = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
    }
  }

  // Distribution bins
  const topTierCount = attempts.filter((s) => s < REACTION_BENCHMARKS.TOP_TIER_MAX_MS).length;
  const fastCount = attempts.filter(
    (s) => s >= REACTION_BENCHMARKS.TOP_TIER_MAX_MS && s <= REACTION_BENCHMARKS.FAST_MAX_MS
  ).length;
  const typicalCount = attempts.filter(
    (s) => s > REACTION_BENCHMARKS.FAST_MAX_MS && s <= REACTION_BENCHMARKS.TYPICAL_MAX_MS
  ).length;
  const slowCount = attempts.filter((s) => s > REACTION_BENCHMARKS.TYPICAL_MAX_MS).length;

  return {
    attemptCount,
    falseStartsCount,
    bestReactionMs,
    worstReactionMs,
    avgReactionMs,
    medianReactionMs,
    stdDevMs,
    consistencyScore,
    distribution: {
      topTierCount,
      fastCount,
      typicalCount,
      slowCount,
    },
  };
}
