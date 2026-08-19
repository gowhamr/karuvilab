import { DateDiffResult } from './types';

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]!;
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function calculateDiff(d1: Date, d2: Date): DateDiffResult | null {
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
  if (d1 > d2) return null;

  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  let days = d2.getDate() - d1.getDate();

  if (days < 0) {
    months--;
    const prev = new Date(d2.getFullYear(), d2.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
}

export function getNextBirthday(birthDate: Date, asOfDate: Date = new Date()): { nextBirthdayStr: string; daysUntil: number } {
  if (isNaN(birthDate.getTime())) {
    return { nextBirthdayStr: '', daysUntil: 0 };
  }
  
  let nextBDay = new Date(asOfDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBDay <= asOfDate) {
    nextBDay = new Date(asOfDate.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }

  const nextBirthdayStr = nextBDay.toISOString().split('T')[0]!;
  const daysUntil = Math.ceil((nextBDay.getTime() - asOfDate.getTime()) / (1000 * 60 * 60 * 24));

  return { nextBirthdayStr, daysUntil };
}
