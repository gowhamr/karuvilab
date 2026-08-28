/**
 * KaruviLab — Pure Deterministic UTC ↔ IST Conversion Engine
 * IST (Indian Standard Time) is permanently fixed at UTC+5:30 (+19,800,000 ms) with no DST.
 */
export const IST_OFFSET_MINUTES = 330; // 5 hours 30 minutes
export const IST_OFFSET_MS = IST_OFFSET_MINUTES * 60 * 1000; // 19,800,000 ms
/**
 * Pad numbers with leading zeroes
 */
export function padZero(num, targetLength = 2) {
    return String(num).padStart(targetLength, '0');
}
/**
 * Parse any time representation (ISO, datetime-local, timestamp seconds/ms) into UTC Epoch Milliseconds.
 */
export function parseInputToUtcEpoch(rawInput, isIstInput = false) {
    const trimmed = rawInput.trim();
    if (!trimmed) {
        return { success: false, epochMs: 0, precision: 'sec', error: 'Input cannot be empty' };
    }
    // 1. Check for pure numeric Unix Timestamp (seconds or ms, positive or negative)
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        const num = Number(trimmed);
        if (isNaN(num)) {
            return { success: false, epochMs: 0, precision: 'sec', error: 'Invalid numeric timestamp' };
        }
        // Heuristic: absolute value > 1e11 is treated as milliseconds, otherwise seconds
        const isMs = Math.abs(num) > 1e11 || trimmed.length >= 13;
        const epochMs = isMs ? Math.round(num) : Math.round(num * 1000);
        // Bounds check (-100,000,000 days to +100,000,000 days from epoch)
        if (epochMs < -8640000000000000 || epochMs > 8640000000000000) {
            return { success: false, epochMs: 0, precision: 'sec', error: 'Timestamp is out of supported date range' };
        }
        if (isIstInput) {
            // If user provided an IST epoch representation, convert to UTC epoch
            return { success: true, epochMs: epochMs - IST_OFFSET_MS, precision: isMs ? 'ms' : 'sec' };
        }
        return { success: true, epochMs, precision: isMs ? 'ms' : 'sec' };
    }
    // 2. Normalize standard datetime-local format: YYYY-MM-DDTHH:mm[:ss[.sss]]
    // or space separator: YYYY-MM-DD HH:mm[:ss[.sss]]
    const dtMatch = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?(.*)$/i.exec(trimmed);
    if (dtMatch) {
        const [, yStr = '', mStr = '', dStr = '', hrStr = '', minStr = '', secStr, msStr, tzPart] = dtMatch;
        const year = parseInt(yStr, 10);
        const month = parseInt(mStr, 10) - 1; // 0-indexed
        const day = parseInt(dStr, 10);
        const hours = parseInt(hrStr, 10);
        const minutes = parseInt(minStr, 10);
        const seconds = secStr ? parseInt(secStr, 10) : 0;
        const ms = msStr ? parseInt(msStr.padEnd(3, '0').slice(0, 3), 10) : 0;
        let precision = 'min';
        if (msStr !== undefined)
            precision = 'ms';
        else if (secStr !== undefined)
            precision = 'sec';
        // Basic date validation
        if (month < 0 || month > 11 || day < 1 || day > 31 || hours > 23 || minutes > 59 || seconds > 59) {
            return { success: false, epochMs: 0, precision, error: 'Date or time values are out of valid calendar range' };
        }
        const tz = (tzPart || '').trim();
        if (tz) {
            // If explicit timezone suffix provided (e.g. Z, +05:30, -04:00)
            const parsed = Date.parse(trimmed);
            if (isNaN(parsed)) {
                return { success: false, epochMs: 0, precision, error: 'Invalid ISO 8601 timezone offset' };
            }
            return { success: true, epochMs: parsed, precision };
        }
        // No timezone specified in string:
        // Create UTC epoch from the civil components
        const utcCivilMs = Date.UTC(year, month, day, hours, minutes, seconds, ms);
        if (isNaN(utcCivilMs)) {
            return { success: false, epochMs: 0, precision, error: 'Invalid date construction' };
        }
        if (isIstInput) {
            // The civil components are in IST (UTC+5:30). To get UTC epoch, subtract 5.5 hours.
            return { success: true, epochMs: utcCivilMs - IST_OFFSET_MS, precision };
        }
        // The civil components are in UTC
        return { success: true, epochMs: utcCivilMs, precision };
    }
    // 3. General fallback parse
    const fallbackParsed = Date.parse(trimmed);
    if (!isNaN(fallbackParsed)) {
        if (isIstInput) {
            return { success: true, epochMs: fallbackParsed - IST_OFFSET_MS, precision: 'sec' };
        }
        return { success: true, epochMs: fallbackParsed, precision: 'sec' };
    }
    return {
        success: false,
        epochMs: 0,
        precision: 'sec',
        error: 'Unrecognized date/time format. Use YYYY-MM-DDTHH:mm:ss, ISO 8601, or Unix epoch.'
    };
}
/**
 * Format UTC Epoch Ms to standard datetime-local compatible format (YYYY-MM-DDTHH:mm:ss.sss)
 */
export function formatToDateTimeLocal(epochMs, offsetMs = 0, precision = 'min') {
    const d = new Date(epochMs + offsetMs);
    const year = d.getUTCFullYear();
    const month = padZero(d.getUTCMonth() + 1);
    const day = padZero(d.getUTCDate());
    const hours = padZero(d.getUTCHours());
    const minutes = padZero(d.getUTCMinutes());
    const seconds = padZero(d.getUTCSeconds());
    const ms = padZero(d.getUTCMilliseconds(), 3);
    if (precision === 'ms') {
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}`;
    }
    if (precision === 'sec') {
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
/**
 * Format to standard UTC ISO 8601 string (e.g. 2026-08-25T18:28:33.000Z)
 */
export function formatUtcIso(epochMs, precision = 'sec') {
    const d = new Date(epochMs);
    const year = d.getUTCFullYear();
    const month = padZero(d.getUTCMonth() + 1);
    const day = padZero(d.getUTCDate());
    const hours = padZero(d.getUTCHours());
    const minutes = padZero(d.getUTCMinutes());
    const seconds = padZero(d.getUTCSeconds());
    const ms = padZero(d.getUTCMilliseconds(), 3);
    if (precision === 'ms') {
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}Z`;
    }
    if (precision === 'sec') {
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    }
    return `${year}-${month}-${day}T${hours}:${minutes}Z`;
}
/**
 * Format to standard IST ISO 8601 string (e.g. 2026-08-25T23:58:33.000+05:30)
 */
export function formatIstIso(epochMs, precision = 'sec') {
    const d = new Date(epochMs + IST_OFFSET_MS);
    const year = d.getUTCFullYear();
    const month = padZero(d.getUTCMonth() + 1);
    const day = padZero(d.getUTCDate());
    const hours = padZero(d.getUTCHours());
    const minutes = padZero(d.getUTCMinutes());
    const seconds = padZero(d.getUTCSeconds());
    const ms = padZero(d.getUTCMilliseconds(), 3);
    if (precision === 'ms') {
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}+05:30`;
    }
    if (precision === 'sec') {
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;
    }
    return `${year}-${month}-${day}T${hours}:${minutes}+05:30`;
}
const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
/**
 * Human-readable friendly display with full date, day of week, and optional 12/24 hour format.
 */
export function formatFriendlyDisplay(epochMs, offsetMs, format24h = false, precision = 'sec') {
    const d = new Date(epochMs + offsetMs);
    const dayName = DAY_NAMES[d.getUTCDay()];
    const monthName = MONTH_NAMES[d.getUTCMonth()];
    const dateNum = d.getUTCDate();
    const year = d.getUTCFullYear();
    const rawHours = d.getUTCHours();
    const minutes = padZero(d.getUTCMinutes());
    const seconds = padZero(d.getUTCSeconds());
    const ms = padZero(d.getUTCMilliseconds(), 3);
    let timePart = '';
    if (format24h) {
        const hours = padZero(rawHours);
        if (precision === 'ms') {
            timePart = `${hours}:${minutes}:${seconds}.${ms}`;
        }
        else if (precision === 'sec') {
            timePart = `${hours}:${minutes}:${seconds}`;
        }
        else {
            timePart = `${hours}:${minutes}`;
        }
    }
    else {
        const period = rawHours >= 12 ? 'PM' : 'AM';
        const hours12 = rawHours % 12 === 0 ? 12 : rawHours % 12;
        if (precision === 'ms') {
            timePart = `${hours12}:${minutes}:${seconds}.${ms} ${period}`;
        }
        else if (precision === 'sec') {
            timePart = `${hours12}:${minutes}:${seconds} ${period}`;
        }
        else {
            timePart = `${hours12}:${minutes} ${period}`;
        }
    }
    return `${dayName}, ${dateNum} ${monthName} ${year} • ${timePart}`;
}
/**
 * Detect date / midnight rollover between UTC calendar day and IST calendar day.
 */
export function detectDateRollover(epochMs) {
    const utcDate = new Date(epochMs);
    const istDate = new Date(epochMs + IST_OFFSET_MS);
    const utcDateStr = `${utcDate.getUTCFullYear()}-${padZero(utcDate.getUTCMonth() + 1)}-${padZero(utcDate.getUTCDate())}`;
    const istDateStr = `${istDate.getUTCFullYear()}-${padZero(istDate.getUTCMonth() + 1)}-${padZero(istDate.getUTCDate())}`;
    // Determine difference by calendar date comparison
    const utcDayNum = Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate()) / 86400000;
    const istDayNum = Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate()) / 86400000;
    const daysDiff = istDayNum - utcDayNum;
    let label = 'Same Calendar Day';
    let isNextDay = false;
    let isPrevDay = false;
    if (daysDiff > 0) {
        label = '+1 Day (Next Day in IST)';
        isNextDay = true;
    }
    else if (daysDiff < 0) {
        label = '-1 Day (Previous Day in UTC)';
        isPrevDay = true;
    }
    return {
        daysDiff,
        label,
        isNextDay,
        isPrevDay,
        isSameDay: daysDiff === 0,
        utcDateStr,
        istDateStr
    };
}
/**
 * Round-trip conversion verification: UTC → IST → UTC parity check.
 */
export function verifyRoundTrip(epochMs) {
    // Convert UTC ms to IST civil components, then back to UTC ms
    const istCivilMs = epochMs + IST_OFFSET_MS;
    const backToUtcMs = istCivilMs - IST_OFFSET_MS;
    const driftMs = Math.abs(backToUtcMs - epochMs);
    return {
        isVerified: driftMs === 0,
        driftMs
    };
}
/**
 * Generate full machine-readable output object
 */
export function generateMachineOutput(epochMs, precision = 'sec') {
    const d = new Date(epochMs);
    const rollover = detectDateRollover(epochMs);
    const roundTrip = verifyRoundTrip(epochMs);
    return {
        epochSeconds: Math.floor(epochMs / 1000),
        epochMs,
        utcIso: formatUtcIso(epochMs, precision),
        istIso: formatIstIso(epochMs, precision),
        utcFormatted24: formatFriendlyDisplay(epochMs, 0, true, precision),
        utcFormatted12: formatFriendlyDisplay(epochMs, 0, false, precision),
        istFormatted24: formatFriendlyDisplay(epochMs, IST_OFFSET_MS, true, precision),
        istFormatted12: formatFriendlyDisplay(epochMs, IST_OFFSET_MS, false, precision),
        rfc2822Utc: d.toUTCString(),
        offsetString: '+05:30 (IST)',
        rollover,
        roundTripVerified: roundTrip.isVerified
    };
}
/**
 * Process a batch of lines containing timestamps or date strings
 */
export function processBatchLines(linesText, mode = 'auto', format24h = false) {
    const lines = linesText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const results = [];
    let validCount = 0;
    let errorCount = 0;
    lines.forEach((line, index) => {
        let isIst = mode === 'ist';
        let parseRes;
        if (mode === 'epoch') {
            const num = Number(line);
            if (isNaN(num)) {
                results.push({
                    index: index + 1,
                    raw: line,
                    valid: false,
                    error: 'Invalid epoch number'
                });
                errorCount++;
                return;
            }
            parseRes = parseInputToUtcEpoch(line, false);
        }
        else {
            parseRes = parseInputToUtcEpoch(line, isIst);
        }
        if (!parseRes.success) {
            results.push({
                index: index + 1,
                raw: line,
                valid: false,
                error: parseRes.error || 'Parsing error'
            });
            errorCount++;
        }
        else {
            const epochMs = parseRes.epochMs;
            const rollover = detectDateRollover(epochMs);
            results.push({
                index: index + 1,
                raw: line,
                valid: true,
                epochMs,
                utcIso: formatUtcIso(epochMs, parseRes.precision),
                istIso: formatIstIso(epochMs, parseRes.precision),
                utcFormatted: formatFriendlyDisplay(epochMs, 0, format24h, parseRes.precision),
                istFormatted: formatFriendlyDisplay(epochMs, IST_OFFSET_MS, format24h, parseRes.precision),
                rollover: rollover.isSameDay ? 'Same Day' : rollover.isNextDay ? '+1 Day (IST)' : '-1 Day (UTC)'
            });
            validCount++;
        }
    });
    return {
        total: lines.length,
        validCount,
        errorCount,
        results
    };
}
/**
 * Export batch results to CSV string
 */
export function exportBatchToCsv(batch) {
    const headers = ['Index', 'Input', 'Status', 'UTC (ISO 8601)', 'IST (ISO 8601)', 'Epoch (Seconds)', 'Epoch (ms)', 'Rollover', 'Error'];
    const rows = batch.results.map(r => {
        if (!r.valid) {
            return [r.index, `"${(r.raw || '').replace(/"/g, '""')}"`, 'ERROR', '', '', '', '', '', `"${(r.error || '').replace(/"/g, '""')}"`];
        }
        return [
            r.index,
            `"${(r.raw || '').replace(/"/g, '""')}"`,
            'OK',
            r.utcIso || '',
            r.istIso || '',
            r.epochMs !== undefined ? Math.floor(r.epochMs / 1000) : '',
            r.epochMs !== undefined ? r.epochMs : '',
            r.rollover || '',
            ''
        ];
    });
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
}
/**
 * Export batch results to formatted JSON string
 */
export function exportBatchToJson(batch) {
    return JSON.stringify(batch.results, null, 2);
}
