/**
 * Stopwatch Export Serialization Utilities
 * Supports JSON, CSV, and Plain Text formats with special character escaping.
 */

import { LapRecord, PrecisionMode, StopwatchStats } from './types';
import { formatDeltaTime, formatStopwatchTime } from './timing-engine';

/**
 * Serializes stopwatch session to structured JSON string.
 */
export function exportStopwatchJSON(
  stats: StopwatchStats,
  laps: LapRecord[],
  precision: PrecisionMode = 'milliseconds'
): string {
  const data = {
    summary: {
      totalElapsedMs: stats.totalElapsedMs,
      totalElapsedFormatted: formatStopwatchTime(stats.totalElapsedMs, precision),
      totalLaps: stats.totalLaps,
      fastestLapMs: stats.fastestLapMs,
      slowestLapMs: stats.slowestLapMs,
      avgLapMs: stats.avgLapMs,
      medianLapMs: stats.medianLapMs,
      stdDevMs: stats.stdDevMs,
      rangeMs: stats.rangeMs,
      consistencyScore: stats.consistencyScore !== null ? Number(stats.consistencyScore.toFixed(1)) : null,
    },
    laps: laps.map((lap) => ({
      lap: lap.lapNumber,
      lapTimeMs: lap.lapTimeMs,
      lapTimeFormatted: formatStopwatchTime(lap.lapTimeMs, precision),
      splitTimeMs: lap.splitTimeMs,
      splitTimeFormatted: formatStopwatchTime(lap.splitTimeMs, precision),
      diffFromPrevMs: lap.diffFromPrevMs,
      diffFromAvgMs: lap.diffFromAvgMs,
      pctOfTotal: Number(lap.pctOfTotal.toFixed(2)),
      isFastest: lap.isFastest,
      isSlowest: lap.isSlowest,
    })),
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Escapes a cell value for safe RFC 4180 CSV compliance.
 */
function escapeCSVCell(val: string | number | boolean): string {
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Serializes stopwatch laps to RFC 4180 compliant CSV string.
 */
export function exportStopwatchCSV(
  stats: StopwatchStats,
  laps: LapRecord[],
  precision: PrecisionMode = 'milliseconds'
): string {
  const headers = [
    'Lap Number',
    'Lap Time (Formatted)',
    'Lap Time (ms)',
    'Split Time (Formatted)',
    'Split Time (ms)',
    'Diff vs Prev',
    'Diff vs Avg',
    '% of Total',
    'Tag',
  ];

  const rows = laps.map((lap) => {
    const tag = lap.isFastest ? 'Fastest' : lap.isSlowest ? 'Slowest' : '';
    return [
      lap.lapNumber,
      formatStopwatchTime(lap.lapTimeMs, precision),
      lap.lapTimeMs,
      formatStopwatchTime(lap.splitTimeMs, precision),
      lap.splitTimeMs,
      formatDeltaTime(lap.diffFromPrevMs, precision),
      formatDeltaTime(lap.diffFromAvgMs, precision),
      `${lap.pctOfTotal.toFixed(1)}%`,
      tag,
    ].map(escapeCSVCell).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Generates human-readable plain text report for clipboard or txt download.
 */
export function exportStopwatchText(
  stats: StopwatchStats,
  laps: LapRecord[],
  precision: PrecisionMode = 'milliseconds'
): string {
  const lines: string[] = [];
  lines.push('⏱️ KaruviLab Stopwatch Session Summary');
  lines.push('======================================');
  lines.push(`Total Elapsed: ${formatStopwatchTime(stats.totalElapsedMs, precision)}`);
  lines.push(`Total Laps:    ${stats.totalLaps}`);

  if (stats.avgLapMs !== null) {
    lines.push(`Average Lap:   ${formatStopwatchTime(stats.avgLapMs, precision)}`);
  }
  if (stats.fastestLapMs !== null) {
    lines.push(`Fastest Lap:   ${formatStopwatchTime(stats.fastestLapMs, precision)}`);
  }
  if (stats.slowestLapMs !== null) {
    lines.push(`Slowest Lap:   ${formatStopwatchTime(stats.slowestLapMs, precision)}`);
  }
  if (stats.consistencyScore !== null) {
    lines.push(`Consistency:   ${stats.consistencyScore.toFixed(1)}%`);
  }

  if (laps.length > 0) {
    lines.push('\nLap Breakdown:');
    lines.push('--------------------------------------');
    lines.push('Lap   Lap Time       Split Time     Tag');

    for (const lap of laps) {
      const numStr = String(lap.lapNumber).padStart(3, ' ');
      const lapStr = formatStopwatchTime(lap.lapTimeMs, precision).padEnd(14, ' ');
      const splitStr = formatStopwatchTime(lap.splitTimeMs, precision).padEnd(14, ' ');
      const tag = lap.isFastest ? '⭐ Fastest' : lap.isSlowest ? '🐢 Slowest' : '';
      lines.push(`${numStr}   ${lapStr} ${splitStr} ${tag}`);
    }
  }

  return lines.join('\n');
}
