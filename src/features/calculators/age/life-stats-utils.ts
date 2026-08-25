import { daysFromCivil, isLeapYear } from './date-utils';

export function calculateYearProgress(asOf: { year: number; month: number; day: number }): number {
  const totalDaysInYear = isLeapYear(asOf.year) ? 366 : 365;
  const dayOfYear = daysFromCivil(asOf.year, asOf.month, asOf.day) - daysFromCivil(asOf.year, 1, 1) + 1;
  return Math.min(100, Math.max(0, (dayOfYear / totalDaysInYear) * 100));
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
  asOf: { year: number; month: number; day: number }
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
  const yearProgressPct = calculateYearProgress(asOf);
  const lifespanProgressPct = calculateLifespanProgress(totalDays, 80);

  return {
    approxHeartbeats,
    approxSleepHours,
    approxBreaths,
    yearProgressPct,
    lifespanProgressPct,
  };
}

