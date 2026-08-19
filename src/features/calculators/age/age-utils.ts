import { AgeCalculationResult, DateDiffResult } from './types';
import { calculateDiff, isLeapYear, getNextBirthday } from './date-utils';
import { calculateEphemeris } from './astronomy-utils';
import {
  getSunZodiacSign,
  getDetailedMoonPosition,
  getChineseZodiac,
  getBirthstoneAndFlower,
} from './astrology-utils';
import { calculateLifeStatistics } from './life-stats-utils';

export function calculateFullAgeProfile(
  dob: string,
  asOf: string,
  showPrecisionTime: boolean = false,
  birthTime: string = "12:00",
  tzOffset: number = 0
): AgeCalculationResult | null {
  if (!asOf || !dob) return null;

  const d1 = new Date(dob);
  const d2 = new Date(asOf);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
  if (d1 > d2) return null;

  const diff = calculateDiff(d1, d2);
  if (!diff) return null;
  const { years, months, days } = diff;

  const totalDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  const totalMonths = years * 12 + months;
  const totalWeeks = totalDays / 7;
  const totalHours = totalDays * 24;
  const totalMinutes = totalDays * 24 * 60;
  const totalSeconds = totalDays * 24 * 60 * 60;

  // Life Statistics
  const lifeStats = calculateLifeStatistics(totalDays, totalHours, totalMinutes, d2);

  // Next Birthday
  const { nextBirthdayStr, daysUntil } = getNextBirthday(d1, new Date());

  const sunZodiac = getSunZodiacSign(d1.getMonth() + 1, d1.getDate());
  const moonDetails = getDetailedMoonPosition(
    dob,
    showPrecisionTime ? birthTime : "12:00",
    showPrecisionTime ? tzOffset : 0
  );
  const ephemeris = calculateEphemeris(
    dob,
    showPrecisionTime ? birthTime : "12:00",
    showPrecisionTime ? tzOffset : 0
  );
  const chineseZodiac = getChineseZodiac(d1.getFullYear());
  const birthstoneFlower = getBirthstoneAndFlower(d1.getMonth() + 1);

  return {
    years,
    months,
    days,
    totalMonths,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
    approxHeartbeats: lifeStats.approxHeartbeats,
    approxSleepHours: lifeStats.approxSleepHours,
    approxBreaths: lifeStats.approxBreaths,
    yearProgressPct: lifeStats.yearProgressPct,
    lifespanProgressPct: lifeStats.lifespanProgressPct,
    birthDayOfWeek: new Date(dob).toLocaleDateString('en-US', { weekday: 'long' }),
    sunSign: `${sunZodiac.emoji} ${sunZodiac.sign}`,
    sunElement: sunZodiac.element,
    sunDates: sunZodiac.dates,
    tropicalMoon: moonDetails.tropicalMoon,
    tropicalElement: moonDetails.tropicalElement,
    tropicalDeg: moonDetails.tropicalDeg,
    vedicRasi: moonDetails.vedicRasi,
    vedicElement: moonDetails.vedicElement,
    vedicDeg: moonDetails.vedicDeg,
    nakshatra: moonDetails.nakshatra,
    nakshatraPada: moonDetails.nakshatraPada,
    moonPhase: moonDetails.moonPhase,
    moonIllumination: moonDetails.illumination,
    chineseZodiac: `${chineseZodiac.emoji} ${chineseZodiac.element} ${chineseZodiac.animal}`,
    birthstone: birthstoneFlower.birthstone,
    birthFlower: birthstoneFlower.birthFlower,
    nextBirthday: nextBirthdayStr,
    daysUntilBirthday: daysUntil,
    isLeapYearBirth: isLeapYear(d1.getFullYear()),
    ephemeris,
  };
}

export function calculateAgeComparison(dob1: string, dob2: string): DateDiffResult | null {
  if (!dob1 || !dob2) return null;
  const d1 = new Date(dob1);
  const d2 = new Date(dob2);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

  const older = d1 < d2 ? d1 : d2;
  const younger = d1 < d2 ? d2 : d1;

  return calculateDiff(older, younger);
}
