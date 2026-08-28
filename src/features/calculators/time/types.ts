export interface TimeDiffInput {
  startTime: string; // HH:MM or HH:MM:SS
  endTime: string;   // HH:MM or HH:MM:SS
}

export interface TimeDiffResult {
  hours: number;
  minutes: number;
  seconds: number;
  totalHoursDecimal: number;
  totalMinutes: number;
  totalSeconds: number;
  formattedDuration: string; // e.g. "8h 30m 00s"
  formattedHHMMSS: string;   // e.g. "08:30:00"
  isOvernight: boolean;      // crosses midnight
}

export interface TimeSumInput {
  durations: string[]; // array of HH:MM or HH:MM:SS
}

export interface TimeSumResult {
  hours: number;
  minutes: number;
  seconds: number;
  totalHoursDecimal: number;
  totalMinutes: number;
  totalSeconds: number;
  formattedDuration: string;
  formattedHHMMSS: string;
  itemCount: number;
}

export interface TimeOffsetInput {
  baseTime: string; // HH:MM or HH:MM:SS
  hours: number;
  minutes: number;
  seconds: number;
  operation: 'add' | 'subtract';
}

export interface TimeOffsetResult {
  resultingTime: string; // HH:MM:SS
  formatted12Hour: string; // e.g. "05:30 PM"
  formatted24Hour: string; // e.g. "17:30:00"
  dayShift: number; // 0 for same day, +1 for next day, -1 for previous day
  formattedShiftText: string;
}

export type TimeCalculatorErrorCode =
  | 'MISSING_TIME'
  | 'INVALID_TIME_FORMAT'
  | 'EMPTY_DURATION_LIST'
  | 'INVALID_DURATION_VALUE';

export interface TimeCalculatorError {
  code: TimeCalculatorErrorCode;
  message: string;
}

export type TimeCalculatorResponse<T> =
  | { success: true; data: T }
  | { success: false; error: TimeCalculatorError };
