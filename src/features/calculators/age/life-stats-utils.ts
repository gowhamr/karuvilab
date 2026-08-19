export function calculateYearProgress(asOfDate: Date): number {
  const startOfYear = new Date(asOfDate.getFullYear(), 0, 1);
  const endOfYear = new Date(asOfDate.getFullYear() + 1, 0, 1);
  return Math.min(
    100,
    Math.max(
      0,
      ((asOfDate.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime())) * 100
    )
  );
}

export function calculateLifespanProgress(totalDays: number, expectedLifespanYears: number = 80): number {
  return Math.min(
    100,
    (totalDays / (expectedLifespanYears * 365.2425)) * 100
  );
}

export function calculateLifeStatistics(
  totalDays: number,
  totalHours: number,
  totalMinutes: number,
  asOfDate: Date
): {
  approxHeartbeats: number;
  approxSleepHours: number;
  approxBreaths: number;
  yearProgressPct: number;
  lifespanProgressPct: number;
} {
  const approxHeartbeats = Math.round(totalMinutes * 75); // ~75 bpm average resting heart rate
  const approxSleepHours = Math.round(totalHours / 3); // ~8 hours/day (1/3 of life)
  const approxBreaths = Math.round(totalMinutes * 16); // ~16 breaths per minute
  const yearProgressPct = calculateYearProgress(asOfDate);
  const lifespanProgressPct = calculateLifespanProgress(totalDays, 80);

  return {
    approxHeartbeats,
    approxSleepHours,
    approxBreaths,
    yearProgressPct,
    lifespanProgressPct,
  };
}
