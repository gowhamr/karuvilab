/**
 * Unix Timestamp Engine
 * Pure functional arithmetic engine for epoch calculations, timezones, unit detection, batch conversions, and code snippets.
 */

export type EpochUnit = 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds';

export interface TimestampInfo {
  epochSeconds: number;
  epochMillis: number;
  epochMicros: string;
  epochNanos: string;
  detectedUnit: EpochUnit;
  iso8601: string;
  rfc2822: string;
  utcFormatted: string;
  localFormatted: string;
  relativeTime: string;
  dayOfWeek: string;
  dayOfYear: number;
  weekNumber: number;
  isLeapYear: boolean;
  isYear2038Overflow: boolean;
  hex32: string;
}

export interface TimezoneOption {
  id: string;
  label: string;
  iana: string;
  offsetHours: number;
}

export const TIMEZONE_PRESETS: TimezoneOption[] = [
  { id: 'UTC', label: 'UTC (Coordinated Universal Time)', iana: 'UTC', offsetHours: 0 },
  { id: 'IST', label: 'IST (+05:30 India Standard Time)', iana: 'Asia/Kolkata', offsetHours: 5.5 },
  { id: 'EST', label: 'EST (-05:00 Eastern Standard Time)', iana: 'America/New_York', offsetHours: -5 },
  { id: 'PST', label: 'PST (-08:00 Pacific Standard Time)', iana: 'America/Los_Angeles', offsetHours: -8 },
  { id: 'GMT', label: 'GMT (+00:00 Greenwich Mean Time)', iana: 'Europe/London', offsetHours: 0 },
  { id: 'CET', label: 'CET (+01:00 Central European Time)', iana: 'Europe/Paris', offsetHours: 1 },
  { id: 'JST', label: 'JST (+09:00 Japan Standard Time)', iana: 'Asia/Tokyo', offsetHours: 9 },
  { id: 'AEST', label: 'AEST (+10:00 Australian Eastern Time)', iana: 'Australia/Sydney', offsetHours: 10 },
  { id: 'SGT', label: 'SGT (+08:00 Singapore Time)', iana: 'Asia/Singapore', offsetHours: 8 },
  { id: 'GST', label: 'GST (+04:00 Gulf Standard Time)', iana: 'Asia/Dubai', offsetHours: 4 }
];

export const EPOCH_PRESETS = [
  { label: 'Epoch Zero (1970-01-01)', value: '0' },
  { label: 'Y2K Millenium (2000-01-01)', value: '946684800' },
  { label: '1 Billion Seconds (2001-09-09)', value: '1000000000' },
  { label: '1.5 Billion Seconds (2017-07-14)', value: '1500000000' },
  { label: '2 Billion Seconds (2033-05-18)', value: '2000000000' },
  { label: 'Year 2038 Max 32-bit (2038-01-19)', value: '2147483647' },
];

/**
 * Detect the precision unit of a numeric epoch string
 */
export function detectEpochUnit(rawInput: string | number): EpochUnit {
  const str = String(rawInput).trim().replace(/[^\d-]/g, '');
  const digits = str.startsWith('-') ? str.length - 1 : str.length;

  if (digits <= 11) return 'seconds';
  if (digits <= 14) return 'milliseconds';
  if (digits <= 17) return 'microseconds';
  return 'nanoseconds';
}

/**
 * Normalize any epoch string/number in any unit into milliseconds
 */
export function normalizeToMilliseconds(rawInput: string | number, forcedUnit?: EpochUnit): number {
  const str = String(rawInput).trim();
  const num = Number(str);
  if (isNaN(num)) return NaN;

  const unit = forcedUnit || detectEpochUnit(str);
  switch (unit) {
    case 'seconds':
      return Math.round(num * 1000);
    case 'milliseconds':
      return Math.round(num);
    case 'microseconds':
      return Math.round(num / 1000);
    case 'nanoseconds':
      return Math.round(num / 1000000);
  }
}

/**
 * Calculate Day of Year (1 - 366)
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime() + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Calculate ISO Week Number (1 - 53)
 */
export function getIsoWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * Determine if year is leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Format relative time string ("5 minutes ago", "in 2 days")
 */
export function formatRelativeTime(date: Date, nowMs: number = Date.now()): string {
  const diffSec = (date.getTime() - nowMs) / 1000;
  const absSec = Math.abs(diffSec);

  if (absSec < 5) return 'just now';

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (absSec < 60) return rtf.format(Math.round(diffSec), 'second');
  if (absSec < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (absSec < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  if (absSec < 2592000) return rtf.format(Math.round(diffSec / 86400), 'day');
  if (absSec < 31536000) return rtf.format(Math.round(diffSec / 2592000), 'month');
  return rtf.format(Math.round(diffSec / 31536000), 'year');
}

/**
 * Parse an epoch string into comprehensive TimestampInfo
 */
export function parseEpoch(rawInput: string | number, forcedUnit?: EpochUnit, nowMs: number = Date.now()): TimestampInfo | null {
  const str = String(rawInput).trim();
  if (!str) return null;

  const millis = normalizeToMilliseconds(str, forcedUnit);
  if (isNaN(millis)) return null;

  const date = new Date(millis);
  if (isNaN(date.getTime())) return null;

  const epochSeconds = Math.floor(millis / 1000);
  const detectedUnit = forcedUnit || detectEpochUnit(str);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[date.getUTCDay()] || 'Unknown';
  const dayOfYear = getDayOfYear(date);
  const weekNumber = getIsoWeekNumber(date);
  const isLeap = isLeapYear(date.getUTCFullYear());
  const isYear2038Overflow = epochSeconds > 2147483647;

  // 32-bit hex
  const hex32 = '0x' + (epochSeconds >>> 0).toString(16).toUpperCase().padStart(8, '0');

  // Format UTC: YYYY-MM-DD HH:mm:ss UTC
  const pad = (n: number) => String(n).padStart(2, '0');
  const utcFormatted = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;

  // Local formatted
  let localFormatted = date.toLocaleString();
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    localFormatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} (${tz})`;
  } catch {
    // Fallback
  }

  // Microseconds and nanoseconds strings
  const epochMicros = String(BigInt(Math.floor(millis)) * 1000n);
  const epochNanos = String(BigInt(Math.floor(millis)) * 1000000n);

  return {
    epochSeconds,
    epochMillis: millis,
    epochMicros,
    epochNanos,
    detectedUnit,
    iso8601: date.toISOString(),
    rfc2822: date.toUTCString(),
    utcFormatted,
    localFormatted,
    relativeTime: formatRelativeTime(date, nowMs),
    dayOfWeek,
    dayOfYear,
    weekNumber,
    isLeapYear: isLeap,
    isYear2038Overflow,
    hex32
  };
}

/**
 * Convert human date string to epoch timestamps
 */
export function convertDateToEpoch(
  dateStr: string,
  timeStr: string = '00:00:00',
  timezoneId: string = 'UTC'
): TimestampInfo | null {
  if (!dateStr) return null;

  try {
    let isoCandidate = `${dateStr}T${timeStr}`;
    let date: Date;

    if (timezoneId === 'UTC') {
      if (!isoCandidate.endsWith('Z')) isoCandidate += 'Z';
      date = new Date(isoCandidate);
    } else {
      const selectedTz = TIMEZONE_PRESETS.find(t => t.id === timezoneId);
      if (selectedTz) {
        // Parse with custom offset
        const sign = selectedTz.offsetHours >= 0 ? '+' : '-';
        const absHours = Math.floor(Math.abs(selectedTz.offsetHours));
        const mins = Math.round((Math.abs(selectedTz.offsetHours) - absHours) * 60);
        const offsetStr = `${sign}${String(absHours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        date = new Date(`${isoCandidate}${offsetStr}`);
      } else {
        date = new Date(isoCandidate);
      }
    }

    if (isNaN(date.getTime())) return null;
    return parseEpoch(date.getTime(), 'milliseconds');
  } catch {
    return null;
  }
}

/**
 * Epoch Arithmetic
 */
export type ArithmeticUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';

export function calculateEpochOffset(
  baseEpochSeconds: number,
  operation: 'add' | 'subtract',
  amount: number,
  unit: ArithmeticUnit
): TimestampInfo | null {
  const factor = operation === 'add' ? 1 : -1;
  const baseDate = new Date(baseEpochSeconds * 1000);
  if (isNaN(baseDate.getTime())) return null;

  const resultDate = new Date(baseDate.getTime());

  switch (unit) {
    case 'seconds':
      resultDate.setUTCSeconds(resultDate.getUTCSeconds() + factor * amount);
      break;
    case 'minutes':
      resultDate.setUTCMinutes(resultDate.getUTCMinutes() + factor * amount);
      break;
    case 'hours':
      resultDate.setUTCHours(resultDate.getUTCHours() + factor * amount);
      break;
    case 'days':
      resultDate.setUTCDate(resultDate.getUTCDate() + factor * amount);
      break;
    case 'weeks':
      resultDate.setUTCDate(resultDate.getUTCDate() + factor * amount * 7);
      break;
    case 'months':
      resultDate.setUTCMonth(resultDate.getUTCMonth() + factor * amount);
      break;
    case 'years':
      resultDate.setUTCFullYear(resultDate.getUTCFullYear() + factor * amount);
      break;
  }

  return parseEpoch(resultDate.getTime(), 'milliseconds');
}

/**
 * Batch Converter
 */
export interface BatchConversionRow {
  id: number;
  input: string;
  epochSeconds: number | null;
  iso8601: string | null;
  utcString: string | null;
  relative: string | null;
  status: 'valid' | 'invalid';
}

export function parseBatchTimestamps(rawText: string): BatchConversionRow[] {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const results: BatchConversionRow[] = [];

  lines.forEach((line, idx) => {
    // Check if line contains CSV delimiters
    const parts = line.split(/[,\t;]/).map(p => p.trim());
    const target = parts[0] || line;

    const parsed = parseEpoch(target);
    if (parsed) {
      results.push({
        id: idx + 1,
        input: target,
        epochSeconds: parsed.epochSeconds,
        iso8601: parsed.iso8601,
        utcString: parsed.utcFormatted,
        relative: parsed.relativeTime,
        status: 'valid'
      });
    } else {
      // Try parsing as ISO date
      const dateParsed = new Date(target);
      if (!isNaN(dateParsed.getTime())) {
        const info = parseEpoch(dateParsed.getTime(), 'milliseconds');
        results.push({
          id: idx + 1,
          input: target,
          epochSeconds: info?.epochSeconds ?? null,
          iso8601: info?.iso8601 ?? null,
          utcString: info?.utcFormatted ?? null,
          relative: info?.relativeTime ?? null,
          status: info ? 'valid' : 'invalid'
        });
      } else {
        results.push({
          id: idx + 1,
          input: target,
          epochSeconds: null,
          iso8601: null,
          utcString: null,
          relative: null,
          status: 'invalid'
        });
      }
    }
  });

  return results;
}

/**
 * Export Batch to CSV
 */
export function exportBatchToCsv(rows: BatchConversionRow[]): string {
  const headers = ['#', 'Input', 'Epoch Seconds', 'ISO 8601', 'UTC Formatted', 'Relative Time', 'Status'];
  const lines = rows.map(r => [
    r.id,
    `"${r.input.replace(/"/g, '""')}"`,
    r.epochSeconds ?? '',
    r.iso8601 ?? '',
    `"${(r.utcString ?? '').replace(/"/g, '""')}"`,
    `"${(r.relative ?? '').replace(/"/g, '""')}"`,
    r.status
  ].join(','));

  return [headers.join(','), ...lines].join('\n');
}

/**
 * Code Snippets for Programming Languages
 */
export interface CodeSnippet {
  language: string;
  getEpoch: string;
  convertEpochToDate: string;
}

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    language: 'JavaScript / TypeScript',
    getEpoch: `// Get current Unix timestamp in seconds\nconst epochSeconds = Math.floor(Date.now() / 1000);\n\n// Get in milliseconds\nconst epochMillis = Date.now();`,
    convertEpochToDate: `// Convert seconds to Date\nconst date = new Date(1771987200 * 1000);\nconsole.log(date.toISOString());`
  },
  {
    language: 'Python',
    getEpoch: `import time\n\n# Current epoch seconds\nepoch_seconds = int(time.time())\n\n# In milliseconds\nepoch_millis = int(time.time() * 1000)`,
    convertEpochToDate: `from datetime import datetime, timezone\n\n# Convert seconds to UTC datetime\ndt = datetime.fromtimestamp(1771987200, tz=timezone.utc)\nprint(dt.isoformat())`
  },
  {
    language: 'Go',
    getEpoch: `package main\nimport ("fmt"; "time")\n\nfunc main() {\n    // Current epoch seconds\n    sec := time.Now().Unix()\n    // Milliseconds\n    ms := time.Now().UnixMilli()\n    fmt.Println(sec, ms)\n}`,
    convertEpochToDate: `// Convert epoch seconds to time.Time\nt := time.Unix(1771987200, 0).UTC()\nfmt.Println(t.Format(time.RFC3339))`
  },
  {
    language: 'Rust',
    getEpoch: `use std::time::{SystemTime, UNIX_EPOCH};\n\nlet sec = SystemTime::now()\n    .duration_since(UNIX_EPOCH)\n    .expect("Time went backwards")\n    .as_secs();`,
    convertEpochToDate: `// Using chrono crate\nuse chrono::{DateTime, Utc};\n\nlet dt = DateTime::from_timestamp(1771987200, 0).unwrap();\nprintln!("{}", dt.to_rfc3339());`
  },
  {
    language: 'Java',
    getEpoch: `import java.time.Instant;\n\n// Current epoch seconds\nlong epochSec = Instant.now().getEpochSecond();\n\n// Milliseconds\nlong epochMs = System.currentTimeMillis();`,
    convertEpochToDate: `import java.time.Instant;\n\nInstant instant = Instant.ofEpochSecond(1771987200L);\nSystem.out.println(instant.toString());`
  },
  {
    language: 'C# / .NET',
    getEpoch: `using System;\n\n// Current epoch seconds\nlong epochSec = DateTimeOffset.UtcNow.ToUnixTimeSeconds();\n\n// Milliseconds\nlong epochMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();`,
    convertEpochToDate: `DateTimeOffset dt = DateTimeOffset.FromUnixTimeSeconds(1771987200);\nConsole.WriteLine(dt.ToString("o"));`
  },
  {
    language: 'PHP',
    getEpoch: `// Current epoch seconds\n$epoch = time();\n\n// Milliseconds\n$epochMs = (int)(microtime(true) * 1000);`,
    convertEpochToDate: `$date = gmdate("Y-m-d H:i:s", 1771987200);\necho $date;`
  },
  {
    language: 'SQL (Postgres / MySQL / SQLite)',
    getEpoch: `-- PostgreSQL\nSELECT extract(epoch from now());\n\n-- MySQL\nSELECT UNIX_TIMESTAMP();\n\n-- SQLite\nSELECT unixepoch();`,
    convertEpochToDate: `-- PostgreSQL\nSELECT to_timestamp(1771987200);\n\n-- MySQL\nSELECT FROM_UNIXTIME(1771987200);\n\n-- SQLite\nSELECT datetime(1771987200, 'unixepoch');`
  }
];
