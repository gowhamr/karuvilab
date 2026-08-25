export interface DateDifferenceInput {
  startDate: string;
  endDate: string;
  includeEndDay?: boolean;
}

export interface DateDifferenceResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  businessDays: number; // working days (Monday-Friday)
  weekendDays: number;  // Saturdays and Sundays
  startDateFormatted: string;
  endDateFormatted: string;
  startDayOfWeek: string;
  endDayOfWeek: string;
  isPast: boolean;
  isFuture: boolean;
  isSameDay: boolean;
}

export type DateMathUnit = 'days' | 'businessDays' | 'weeks' | 'months' | 'years';
export type DateMathOperation = 'add' | 'subtract';

export interface DateOffsetInput {
  baseDate: string;
  amount: number;
  unit: DateMathUnit;
  operation: DateMathOperation;
}

export interface DateOffsetResult {
  resultingDate: string; // YYYY-MM-DD
  dayOfWeek: string;
  isWeekend: boolean;
  totalDaysAdded: number; // actual calendar days shifted
  formattedLongDate: string;
}

export type DateCalculatorErrorCode = 
  | 'MISSING_START_DATE'
  | 'MISSING_END_DATE'
  | 'MISSING_BASE_DATE'
  | 'INVALID_START_DATE'
  | 'INVALID_END_DATE'
  | 'INVALID_BASE_DATE'
  | 'INVALID_AMOUNT'
  | 'INVALID_DATE_FORMAT';

export interface DateCalculatorError {
  code: DateCalculatorErrorCode;
  message: string;
}

export type DateCalculatorResponse<T> =
  | { success: true; data: T }
  | { success: false; error: DateCalculatorError };
