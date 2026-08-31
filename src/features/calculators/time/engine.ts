import {
  TimeDiffInput,
  TimeDiffResult,
  TimeSumInput,
  TimeSumResult,
  TimeOffsetInput,
  TimeOffsetResult,
  TimeCalculatorResponse,
} from './types';

/**
 * Parses time string (HH:MM or HH:MM:SS) into seconds from midnight.
 */
export function parseTimeToSeconds(timeStr: string): {
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const trimmed = timeStr.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const hours = parseInt(match[1]!, 10);
  const minutes = parseInt(match[2]!, 10);
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    return null;
  }

  return {
    totalSeconds: hours * 3600 + minutes * 60 + seconds,
    hours,
    minutes,
    seconds,
  };
}

/**
 * Parses arbitrary duration string (HH:MM or HH:MM:SS) into total seconds.
 */
export function parseDurationToSeconds(durationStr: string): number | null {
  if (!durationStr || typeof durationStr !== 'string') return null;
  const trimmed = durationStr.trim();
  const match = trimmed.match(/^(\d+):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const hours = parseInt(match[1]!, 10);
  const minutes = parseInt(match[2]!, 10);
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  if (hours < 0 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    return null;
  }

  return hours * 3600 + minutes * 60 + seconds;
}

export function formatHMS(totalSeconds: number): {
  hours: number;
  minutes: number;
  seconds: number;
  formattedDuration: string;
  formattedHHMMSS: string;
  totalHoursDecimal: number;
} {
  const absSecs = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(absSecs / 3600);
  const minutes = Math.floor((absSecs % 3600) / 60);
  const seconds = absSecs % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return {
    hours,
    minutes,
    seconds,
    formattedDuration: `${hours}h ${minutes}m ${seconds}s`,
    formattedHHMMSS: `${hh}:${mm}:${ss}`,
    totalHoursDecimal: Number((absSecs / 3600).toFixed(4)),
  };
}

export function format12Hour(hours: number, minutes: number, seconds: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${String(h12).padStart(2, '0')}:${mm}:${ss} ${period}`;
}

/**
 * Calculates the difference between two clock times.
 * Automatically handles overnight shift crossing (e.g. 22:00 to 06:00 = 8h).
 */
export function calculateTimeDifference(input: TimeDiffInput): TimeCalculatorResponse<TimeDiffResult> {
  const { startTime, endTime } = input;

  if (!startTime || startTime.trim() === '') {
    return {
      success: false,
      error: { code: 'MISSING_TIME', message: 'Start time is required.' },
    };
  }

  if (!endTime || endTime.trim() === '') {
    return {
      success: false,
      error: { code: 'MISSING_TIME', message: 'End time is required.' },
    };
  }

  const start = parseTimeToSeconds(startTime);
  if (!start) {
    return {
      success: false,
      error: { code: 'INVALID_TIME_FORMAT', message: 'Invalid start time format. Use HH:MM or HH:MM:SS.' },
    };
  }

  const end = parseTimeToSeconds(endTime);
  if (!end) {
    return {
      success: false,
      error: { code: 'INVALID_TIME_FORMAT', message: 'Invalid end time format. Use HH:MM or HH:MM:SS.' },
    };
  }

  let diffSeconds = end.totalSeconds - start.totalSeconds;
  let isOvernight = false;

  if (diffSeconds < 0) {
    diffSeconds += 24 * 3600; // crosses midnight
    isOvernight = true;
  }

  const hms = formatHMS(diffSeconds);

  return {
    success: true,
    data: {
      hours: hms.hours,
      minutes: hms.minutes,
      seconds: hms.seconds,
      totalHoursDecimal: hms.totalHoursDecimal,
      totalMinutes: Math.floor(diffSeconds / 60),
      totalSeconds: diffSeconds,
      formattedDuration: hms.formattedDuration,
      formattedHHMMSS: hms.formattedHHMMSS,
      isOvernight,
    },
  };
}

/**
 * Sums an array of duration strings (e.g. ['01:30', '02:45']).
 */
export function calculateDurationSum(input: TimeSumInput): TimeCalculatorResponse<TimeSumResult> {
  const { durations } = input;

  if (!durations || durations.length === 0) {
    return {
      success: false,
      error: { code: 'EMPTY_DURATION_LIST', message: 'At least one duration entry is required.' },
    };
  }

  let totalSecs = 0;
  for (let i = 0; i < durations.length; i++) {
    const raw = durations[i];
    if (!raw || raw.trim() === '') continue;
    const s = parseDurationToSeconds(raw);
    if (s === null) {
      return {
        success: false,
        error: {
          code: 'INVALID_DURATION_VALUE',
          message: `Invalid duration value at row ${i + 1}: "${raw}". Use HH:MM or HH:MM:SS.`,
        },
      };
    }
    totalSecs += s;
  }

  const hms = formatHMS(totalSecs);

  return {
    success: true,
    data: {
      hours: hms.hours,
      minutes: hms.minutes,
      seconds: hms.seconds,
      totalHoursDecimal: hms.totalHoursDecimal,
      totalMinutes: Math.floor(totalSecs / 60),
      totalSeconds: totalSecs,
      formattedDuration: hms.formattedDuration,
      formattedHHMMSS: hms.formattedHHMMSS,
      itemCount: durations.length,
    },
  };
}

/**
 * Adds or subtracts duration to a base clock time with 24-hour rollover.
 */
export function calculateTimeOffset(input: TimeOffsetInput): TimeCalculatorResponse<TimeOffsetResult> {
  const { baseTime, hours, minutes, seconds, operation } = input;

  if (!baseTime || baseTime.trim() === '') {
    return {
      success: false,
      error: { code: 'MISSING_TIME', message: 'Base time is required.' },
    };
  }

  const base = parseTimeToSeconds(baseTime);
  if (!base) {
    return {
      success: false,
      error: { code: 'INVALID_TIME_FORMAT', message: 'Invalid base time format. Use HH:MM or HH:MM:SS.' },
    };
  }

  const offsetSeconds = (Math.abs(hours) * 3600 + Math.abs(minutes) * 60 + Math.abs(seconds)) * (operation === 'add' ? 1 : -1);
  const rawTargetSeconds = base.totalSeconds + offsetSeconds;

  const SECONDS_IN_DAY = 24 * 3600;
  const dayShift = Math.floor(rawTargetSeconds / SECONDS_IN_DAY);
  const normalizedSeconds = ((rawTargetSeconds % SECONDS_IN_DAY) + SECONDS_IN_DAY) % SECONDS_IN_DAY;

  const targetHours = Math.floor(normalizedSeconds / 3600);
  const targetMinutes = Math.floor((normalizedSeconds % 3600) / 60);
  const targetSecs = normalizedSeconds % 60;

  const hh = String(targetHours).padStart(2, '0');
  const mm = String(targetMinutes).padStart(2, '0');
  const ss = String(targetSecs).padStart(2, '0');
  const resultingTime = `${hh}:${mm}:${ss}`;

  let formattedShiftText = 'Same day';
  if (dayShift > 0) {
    formattedShiftText = `+${dayShift} day${dayShift > 1 ? 's' : ''} (Next Day)`;
  } else if (dayShift < 0) {
    formattedShiftText = `${dayShift} day${Math.abs(dayShift) > 1 ? 's' : ''} (Previous Day)`;
  }

  return {
    success: true,
    data: {
      resultingTime,
      formatted12Hour: format12Hour(targetHours, targetMinutes, targetSecs),
      formatted24Hour: resultingTime,
      dayShift,
      formattedShiftText,
    },
  };
}
