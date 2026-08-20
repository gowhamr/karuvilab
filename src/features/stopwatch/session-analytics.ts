/**
 * Pure Session Analytics, Pace Trends & Distribution Calculations
 */

import { LapRecord, PaceTrendResult, LapDistributionBin } from './types';

/**
 * Computes pace progression and lap-to-lap speed improvements across a session.
 */
export function computeSessionPaceTrend(laps: LapRecord[]): PaceTrendResult | null {
  if (!laps || laps.length < 2) {
    return null;
  }

  const n = laps.length;
  const lapTimes = laps.map((l) => l.lapTimeMs);

  // Lap-to-lap improvements (% change vs preceding lap)
  const lapToLapImprovements: number[] = [];
  for (let i = 1; i < n; i++) {
    const prev = lapTimes[i - 1]!;
    const curr = lapTimes[i]!;
    if (prev > 0) {
      const imp = ((prev - curr) / prev) * 100;
      lapToLapImprovements.push(Number(imp.toFixed(2)));
    } else {
      lapToLapImprovements.push(0);
    }
  }

  // First half vs Second half analysis
  const mid = Math.floor(n / 2);
  const firstHalf = lapTimes.slice(0, mid);
  const secondHalf = lapTimes.slice(n - mid); // equal count from end

  const firstHalfAvgMs = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondHalfAvgMs = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const halfDiffPct = firstHalfAvgMs > 0 ? ((firstHalfAvgMs - secondHalfAvgMs) / firstHalfAvgMs) * 100 : 0;

  // Linear regression slope (ms per lap)
  const xMean = (n + 1) / 2;
  const yMean = lapTimes.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const x = i + 1;
    const y = lapTimes[i]!;
    numerator += (x - xMean) * (y - yMean);
    denominator += Math.pow(x - xMean, 2);
  }

  const slopeMsPerLap = denominator !== 0 ? numerator / denominator : 0;

  let trend: 'improving' | 'slowing' | 'consistent' = 'consistent';
  if (slopeMsPerLap < -50) {
    trend = 'improving'; // times are decreasing (getting faster)
  } else if (slopeMsPerLap > 50) {
    trend = 'slowing'; // times are increasing (getting slower)
  }

  return {
    trend,
    slopeMsPerLap: Number(slopeMsPerLap.toFixed(2)),
    lapToLapImprovements,
    firstHalfAvgMs: Math.round(firstHalfAvgMs),
    secondHalfAvgMs: Math.round(secondHalfAvgMs),
    halfDiffPct: Number(halfDiffPct.toFixed(2)),
  };
}

/**
 * Computes histogram distribution bins across recorded laps.
 */
export function computeLapDistribution(laps: LapRecord[], binCount: number = 4): LapDistributionBin[] {
  if (!laps || laps.length === 0) {
    return [];
  }

  const times = laps.map((l) => l.lapTimeMs);
  const min = Math.min(...times);
  const max = Math.max(...times);

  if (min === max || laps.length < binCount) {
    return [
      {
        label: `${min}ms`,
        minMs: min,
        maxMs: max,
        count: laps.length,
        pct: 100,
      },
    ];
  }

  const step = (max - min) / binCount;
  const bins: LapDistributionBin[] = [];

  for (let i = 0; i < binCount; i++) {
    const bMin = Math.round(min + i * step);
    const bMax = Math.round(i === binCount - 1 ? max : min + (i + 1) * step);
    const count = times.filter((t) => (i === binCount - 1 ? t >= bMin && t <= bMax : t >= bMin && t < bMax)).length;
    const pct = Number(((count / laps.length) * 100).toFixed(1));

    bins.push({
      label: `${bMin} - ${bMax}ms`,
      minMs: bMin,
      maxMs: bMax,
      count,
      pct,
    });
  }

  return bins;
}
