import { 
  AgeCalculatorInput, 
  AgeCalculatorEngineResponse, 
  AgeCalculatorCoreResult, 
  AgeCalculationResult, 
  DateDiffResult 
} from './types';
import { 
  parseISODateParts, 
  calculateCalendarDiff, 
  getNextBirthdayPure, 
  isLeapYear, 
  daysFromCivil,
  getDayOfWeek,
  todayISO 
} from './date-utils';
import { calculateEphemeris } from './astronomy-utils';
import {
  getSunZodiacSign,
  getDetailedMoonPosition,
  getChineseZodiac,
  getBirthstoneAndFlower,
} from './astrology-utils';
import { calculateLifeStatistics } from './life-stats-utils';

/**
 * Pure, deterministic core calculation engine for Age Calculator.
 * Free from browser runtime side-effects, ambient date state, and Date object allocations.
 */
export function calculateAge(input: AgeCalculatorInput): AgeCalculatorEngineResponse {
  if (!input || !input.dateOfBirth || typeof input.dateOfBirth !== 'string' || !input.dateOfBirth.trim()) {
    return {
      success: false,
      error: {
        code: 'MISSING_DOB',
        message: 'Date of birth is required.',
      },
    };
  }

  const dobParts = parseISODateParts(input.dateOfBirth);
  if (!dobParts) {
    return {
      success: false,
      error: {
        code: 'INVALID_DOB',
        message: 'Invalid Date of Birth format. Please provide a valid calendar date in YYYY-MM-DD format.',
      },
    };
  }

  const asOfStr = input.asOfDate?.trim() || todayISO();
  const asOfParts = parseISODateParts(asOfStr);
  if (!asOfParts) {
    return {
      success: false,
      error: {
        code: 'INVALID_AS_OF_DATE',
        message: 'Invalid calculation date format. Please provide a valid calendar date in YYYY-MM-DD format.',
      },
    };
  }

  const diff = calculateCalendarDiff(dobParts, asOfParts);
  if (!diff) {
    return {
      success: false,
      error: {
        code: 'DOB_AFTER_AS_OF_DATE',
        message: 'Date of birth cannot be after the calculation date.',
      },
    };
  }

  const totalDays = daysFromCivil(asOfParts.year, asOfParts.month, asOfParts.day) - daysFromCivil(dobParts.year, dobParts.month, dobParts.day);
  const totalMonths = diff.years * 12 + diff.months;
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;

  const { nextBirthdayStr, daysUntil } = getNextBirthdayPure(dobParts, asOfParts);
  const birthDayOfWeek = getDayOfWeek(dobParts.year, dobParts.month, dobParts.day);
  const isLeapYearBirth = isLeapYear(dobParts.year);

  const result: AgeCalculatorCoreResult = {
    dateOfBirth: `${dobParts.year}-${String(dobParts.month).padStart(2, '0')}-${String(dobParts.day).padStart(2, '0')}`,
    asOfDate: `${asOfParts.year}-${String(asOfParts.month).padStart(2, '0')}-${String(asOfParts.day).padStart(2, '0')}`,
    years: diff.years,
    months: diff.months,
    days: diff.days,
    totalMonths,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
    nextBirthday: nextBirthdayStr,
    daysUntilNextBirthday: daysUntil,
    isLeapYearBirth,
    birthDayOfWeek,
  };

  return {
    success: true,
    data: result,
  };
}

export function calculateFullAgeProfile(
  dob: string,
  asOf: string,
  showPrecisionTime: boolean = false,
  birthTime: string = "12:00",
  tzOffset: number = 0
): AgeCalculationResult | null {
  const coreResponse = calculateAge({ dateOfBirth: dob, asOfDate: asOf });
  if (!coreResponse.success) return null;

  const core = coreResponse.data;
  const dobParts = parseISODateParts(core.dateOfBirth)!;
  const asOfParts = parseISODateParts(core.asOfDate)!;

  // Life Statistics
  const lifeStats = calculateLifeStatistics(core.totalDays, core.totalHours, core.totalMinutes, asOfParts);

  const sunZodiac = getSunZodiacSign(dobParts.month, dobParts.day);
  const moonDetails = getDetailedMoonPosition(
    core.dateOfBirth,
    showPrecisionTime ? birthTime : "12:00",
    showPrecisionTime ? tzOffset : 0
  );
  const ephemeris = calculateEphemeris(
    core.dateOfBirth,
    showPrecisionTime ? birthTime : "12:00",
    showPrecisionTime ? tzOffset : 0
  );
  const chineseZodiac = getChineseZodiac(dobParts.year);
  const birthstoneFlower = getBirthstoneAndFlower(dobParts.month);

  return {
    ...core,
    approxHeartbeats: lifeStats.approxHeartbeats,
    approxSleepHours: lifeStats.approxSleepHours,
    approxBreaths: lifeStats.approxBreaths,
    yearProgressPct: lifeStats.yearProgressPct,
    lifespanProgressPct: lifeStats.lifespanProgressPct,
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
    ephemeris,
  };
}

export function calculateAgeComparison(dob1: string, dob2: string): DateDiffResult | null {
  if (!dob1 || !dob2) return null;
  const p1 = parseISODateParts(dob1);
  const p2 = parseISODateParts(dob2);
  if (!p1 || !p2) return null;

  const isD1Older =
    p1.year < p2.year ||
    (p1.year === p2.year && (p1.month < p2.month || (p1.month === p2.month && p1.day < p2.day)));
  const older = isD1Older ? p1 : p2;
  const younger = isD1Older ? p2 : p1;

  return calculateCalendarDiff(older, younger);
}

