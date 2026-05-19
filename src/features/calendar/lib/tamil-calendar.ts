import { TamilDateInfo } from '../types';
import { TAMIL_MONTHS, TAMIL_WEEKDAYS } from '../constants';

/**
 * Simplified Tamil Calendar conversion logic.
 * The Tamil calendar is a solar calendar. 
 * Months start when the Sun enters a new zodiac sign (Rasi).
 */

// Approximate Julian Day calculation
function getJulianDay(date: Date): number {
  return (date.getTime() / 86400000) + 2440587.5;
}

// Simplified Solar Longitude calculation (accuracy +/- few minutes)
function getSolarLongitude(jd: number): number {
  const d = jd - 2451545.0;
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L = (q + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180)) % 360;
  return L < 0 ? L + 360 : L;
}

/**
 * Converts a Gregorian date to Tamil Date Info.
 */
export function getTamilDate(date: Date): TamilDateInfo {
  const jd = getJulianDay(date);
  const longitude = getSolarLongitude(jd);
  
  // Ayanamsa (approximate correction from Tropical to Sidereal)
  // Lahiri Ayanamsa is roughly 24 degrees in 2024
  const siderealLong = (longitude - 23.9) % 360;
  const adjustedLong = siderealLong < 0 ? siderealLong + 360 : siderealLong;
  
  // Tamil month is determined by which 30-degree segment the sun is in.
  // 0-30: Chithirai, 30-60: Vaikasi, etc.
  const monthIdx = Math.floor(adjustedLong / 30);
  
  // For the day of the month, we find the JD of the start of the Tamil month (Sankranti)
  // This is complex for a simplified script, so we use an approximation:
  // Tamil day = (current solar longitude - start of month longitude) + 1
  const startLong = monthIdx * 30;
  let day = Math.floor(adjustedLong - startLong) + 1;
  
  // Edge case: ensure day is at least 1
  if (day < 1) day = 1;
  if (day > 32) day = 31; // Practical limit

  const year = date.getFullYear(); // Simplified
  
  return {
    year,
    month: monthIdx,
    day,
    monthName: TAMIL_MONTHS[monthIdx] || 'Chithirai',
    weekday: TAMIL_WEEKDAYS[date.getDay()] || 'Gnayiru',
  };
}

/**
 * Returns Tamil numeral for a number
 */
export function toTamilNumeral(num: number): string {
  const tamilDigits = ['௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯'];
  return num.toString().split('').map(d => tamilDigits[parseInt(d)] || d).join('');
}
