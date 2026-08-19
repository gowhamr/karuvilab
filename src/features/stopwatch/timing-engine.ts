/**
 * Pure Deterministic Timing Engine for Stopwatch
 * Zero external dependencies. Uses monotonic timestamp math to eliminate drift.
 */

import { PrecisionMode } from './types';

export interface TimeComponents {
  hours: number;
  minutes: number;
  seconds: number;
  centiseconds: number;
  milliseconds: number;
}

/**
 * Calculates current elapsed time from monotonic timestamps without accumulated timer interval drift.
 */
export function calculateElapsed(
  startTimestamp: number | null,
  now: number,
  accumulatedMs: number
): number {
  if (startTimestamp === null) {
    return Math.max(0, accumulatedMs);
  }
  return Math.max(0, now - startTimestamp + accumulatedMs);
}

/**
 * Splits total milliseconds into constituent calendar/clock components.
 */
export function splitTimeComponents(totalMs: number): TimeComponents {
  const safeMs = Math.max(0, Math.floor(totalMs));
  const hours = Math.floor(safeMs / 3600000);
  const remAfterHours = safeMs % 3600000;
  const minutes = Math.floor(remAfterHours / 60000);
  const remAfterMins = remAfterHours % 60000;
  const seconds = Math.floor(remAfterMins / 1000);
  const milliseconds = remAfterMins % 1000;
  const centiseconds = Math.floor(milliseconds / 10);

  return {
    hours,
    minutes,
    seconds,
    centiseconds,
    milliseconds,
  };
}

/**
 * Formats milliseconds into a display string according to precision mode.
 * Supports boolean for legacy compatibility (`true` -> milliseconds, `false` -> centiseconds / no ms).
 */
export function formatStopwatchTime(
  totalMs: number,
  precision: PrecisionMode | boolean = 'milliseconds'
): string {
  const { hours, minutes, seconds, centiseconds, milliseconds } = splitTimeComponents(totalMs);

  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');
  const hStr = String(hours).padStart(2, '0');

  let mode: PrecisionMode;
  if (typeof precision === 'boolean') {
    mode = precision ? 'milliseconds' : 'centiseconds';
  } else {
    mode = precision;
  }

  let fracStr = '';
  if (mode === 'milliseconds') {
    fracStr = `.${String(milliseconds).padStart(3, '0')}`;
  } else if (mode === 'centiseconds') {
    fracStr = `.${String(centiseconds).padStart(2, '0')}`;
  }

  if (hours > 0) {
    return `${hStr}:${mStr}:${sStr}${fracStr}`;
  }

  return `${mStr}:${sStr}${fracStr}`;
}

/**
 * Formats a delta in milliseconds with leading + / - symbol.
 */
export function formatDeltaTime(deltaMs: number, precision: PrecisionMode = 'centiseconds'): string {
  const sign = deltaMs > 0 ? '+' : deltaMs < 0 ? '-' : '±';
  const absFormatted = formatStopwatchTime(Math.abs(deltaMs), precision);
  return `${sign}${absFormatted}`;
}
