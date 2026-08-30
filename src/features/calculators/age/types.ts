export type AgeCalculatorErrorCode =
  | 'MISSING_DOB'
  | 'INVALID_DOB'
  | 'INVALID_AS_OF_DATE'
  | 'DOB_AFTER_AS_OF_DATE';

export interface AgeCalculatorInput {
  dateOfBirth: string; // ISO format: YYYY-MM-DD
  asOfDate?: string | undefined;   // ISO format: YYYY-MM-DD (defaults to today in UI)
}

export interface AgeCalculatorCoreResult {
  dateOfBirth: string;
  asOfDate: string;
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthday: string;
  daysUntilNextBirthday: number;
  isLeapYearBirth: boolean;
  birthDayOfWeek: string;
}

export type AgeCalculatorEngineResponse =
  | { success: true; data: AgeCalculatorCoreResult }
  | { success: false; error: { code: AgeCalculatorErrorCode; message: string } };

export interface DateDiffResult {
  years: number;
  months: number;
  days: number;
}

export interface PlanetInfo {
  name: string;
  symbol: string;
  trop: string;
  tropElement: string;
  ved: string;
  vedElement: string;
}

export interface EphemerisResult {
  ayanamsa: string;
  planets: PlanetInfo[];
}

export interface MoonPositionResult {
  tropicalMoon: string;
  tropicalElement: string;
  tropicalDeg: string;
  vedicRasi: string;
  vedicElement: string;
  vedicDeg: string;
  nakshatra: string;
  nakshatraPada: string;
  moonPhase: string;
  illumination: string;
  ayanamsa: string;
}

export interface SunSignInfo {
  sign: string;
  emoji: string;
  element: string;
  dates: string;
}

export interface ChineseZodiacInfo {
  animal: string;
  element: string;
  emoji: string;
}

export interface BirthGemsInfo {
  birthstone: string;
  birthFlower: string;
}

export interface TimezonePreset {
  label: string;
  offset: number;
  id: string;
}

export interface AgeCalculationResult extends AgeCalculatorCoreResult {
  sunSign: string;
  sunElement: string;
  sunDates: string;
  tropicalMoon: string;
  tropicalElement: string;
  tropicalDeg: string;
  vedicRasi: string;
  vedicElement: string;
  vedicDeg: string;
  nakshatra: string;
  nakshatraPada: string;
  moonPhase: string;
  moonIllumination: string;
  chineseZodiac: string;
  birthstone: string;
  birthFlower: string;
  approxHeartbeats: number;
  approxSleepHours: number;
  approxBreaths: number;
  yearProgressPct: number;
  lifespanProgressPct: number;
  ephemeris: EphemerisResult;
}
