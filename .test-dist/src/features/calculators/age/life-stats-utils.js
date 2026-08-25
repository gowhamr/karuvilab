import { daysFromCivil, isLeapYear } from './date-utils';
export function calculateYearProgress(asOf) {
    const totalDaysInYear = isLeapYear(asOf.year) ? 366 : 365;
    const dayOfYear = daysFromCivil(asOf.year, asOf.month, asOf.day) - daysFromCivil(asOf.year, 1, 1) + 1;
    return Math.min(100, Math.max(0, (dayOfYear / totalDaysInYear) * 100));
}
export function calculateLifespanProgress(totalDays, expectedLifespanYears = 80) {
    return Math.min(100, (totalDays / (expectedLifespanYears * 365.2425)) * 100);
}
export function calculateLifeStatistics(totalDays, totalHours, totalMinutes, asOf) {
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
