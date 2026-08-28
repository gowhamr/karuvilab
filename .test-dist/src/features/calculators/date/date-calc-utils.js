export function isValidDateString(y, m, d) { return d > 0 && d <= getDaysInMonth(y, m); }
import { daysFromCivil, civilFromDays, getDayOfWeek, getDaysInMonth, parseISODateParts, calculateCalendarDiff, formatDateParts, } from '../age/date-utils';
const MONTH_NAMES = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
export function formatLongDate(year, month, day) {
    const mName = MONTH_NAMES[month] || '';
    return `${mName} ${day}, ${year}`;
}
/**
 * Counts business days (Monday to Friday) and weekend days (Saturday & Sunday)
 * in the day interval [fromEpochDay, toEpochDay).
 */
export function countBusinessAndWeekendDays(fromEpochDay, toEpochDay) {
    if (fromEpochDay >= toEpochDay) {
        return { businessDays: 0, weekendDays: 0 };
    }
    const totalDays = toEpochDay - fromEpochDay;
    const fullWeeks = Math.floor(totalDays / 7);
    let businessDays = fullWeeks * 5;
    let weekendDays = fullWeeks * 2;
    const remainder = totalDays % 7;
    // Day of week index for epoch day: (epochDay + 4) % 7 where 0=Sunday, 1=Monday, ..., 6=Saturday
    // 1970-01-01 was Thursday (index 4)
    for (let i = 0; i < remainder; i++) {
        const dayOfWeek = (((fromEpochDay + fullWeeks * 7 + i + 4) % 7) + 7) % 7;
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekendDays++;
        }
        else {
            businessDays++;
        }
    }
    return { businessDays, weekendDays };
}
/**
 * Pure deterministic date difference calculator.
 */
export function calculateDateDifference(input) {
    const { startDate, endDate, includeEndDay = false } = input;
    if (!startDate || startDate.trim() === '') {
        return {
            success: false,
            error: { code: 'MISSING_START_DATE', message: 'Start date is required.' },
        };
    }
    if (!endDate || endDate.trim() === '') {
        return {
            success: false,
            error: { code: 'MISSING_END_DATE', message: 'End date is required.' },
        };
    }
    const startParts = parseISODateParts(startDate);
    if (!startParts) {
        return {
            success: false,
            error: {
                code: 'INVALID_START_DATE',
                message: 'Invalid start date format. Please use YYYY-MM-DD or select a valid date.',
            },
        };
    }
    const endParts = parseISODateParts(endDate);
    if (!endParts) {
        return {
            success: false,
            error: {
                code: 'INVALID_END_DATE',
                message: 'Invalid end date format. Please use YYYY-MM-DD or select a valid date.',
            },
        };
    }
    const startEpochDays = daysFromCivil(startParts.year, startParts.month, startParts.day);
    const endEpochDays = daysFromCivil(endParts.year, endParts.month, endParts.day);
    const rawDayDiff = endEpochDays - startEpochDays;
    const isPast = rawDayDiff < 0;
    const isFuture = rawDayDiff > 0;
    const isSameDay = rawDayDiff === 0;
    const earlierParts = rawDayDiff >= 0 ? startParts : endParts;
    const laterParts = rawDayDiff >= 0 ? endParts : startParts;
    const minEpochDay = Math.min(startEpochDays, endEpochDays);
    const maxEpochDay = Math.max(startEpochDays, endEpochDays);
    const calDiff = calculateCalendarDiff(earlierParts, laterParts);
    let totalDays = Math.abs(rawDayDiff);
    if (includeEndDay) {
        totalDays += 1;
    }
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    // Calculate working days & weekend days
    const effectiveEndEpochDay = includeEndDay ? maxEpochDay + 1 : maxEpochDay;
    const { businessDays, weekendDays } = countBusinessAndWeekendDays(minEpochDay, effectiveEndEpochDay);
    return {
        success: true,
        data: {
            years: calDiff?.years || 0,
            months: calDiff?.months || 0,
            days: includeEndDay ? (calDiff?.days || 0) + 1 : (calDiff?.days || 0),
            totalDays,
            totalWeeks,
            totalHours,
            totalMinutes,
            totalSeconds,
            businessDays,
            weekendDays,
            startDateFormatted: formatLongDate(startParts.year, startParts.month, startParts.day),
            endDateFormatted: formatLongDate(endParts.year, endParts.month, endParts.day),
            startDayOfWeek: getDayOfWeek(startParts.year, startParts.month, startParts.day),
            endDayOfWeek: getDayOfWeek(endParts.year, endParts.month, endParts.day),
            isPast,
            isFuture,
            isSameDay,
        },
    };
}
/**
 * Pure deterministic date addition and subtraction.
 */
export function calculateDateOffset(input) {
    const { baseDate, amount, unit, operation } = input;
    if (!baseDate || baseDate.trim() === '') {
        return {
            success: false,
            error: { code: 'MISSING_BASE_DATE', message: 'Base date is required.' },
        };
    }
    const baseParts = parseISODateParts(baseDate);
    if (!baseParts) {
        return {
            success: false,
            error: {
                code: 'INVALID_BASE_DATE',
                message: 'Invalid base date format. Please use YYYY-MM-DD or select a valid date.',
            },
        };
    }
    const numericAmount = Math.floor(Math.abs(amount));
    if (isNaN(numericAmount)) {
        return {
            success: false,
            error: { code: 'INVALID_AMOUNT', message: 'Amount must be a valid integer number.' },
        };
    }
    const sign = operation === 'add' ? 1 : -1;
    let targetParts;
    let actualDaysShifted = 0;
    const baseEpochDays = daysFromCivil(baseParts.year, baseParts.month, baseParts.day);
    if (unit === 'days') {
        actualDaysShifted = sign * numericAmount;
        targetParts = civilFromDays(baseEpochDays + actualDaysShifted);
    }
    else if (unit === 'weeks') {
        actualDaysShifted = sign * numericAmount * 7;
        targetParts = civilFromDays(baseEpochDays + actualDaysShifted);
    }
    else if (unit === 'businessDays') {
        let currentEpoch = baseEpochDays;
        let counted = 0;
        while (counted < numericAmount) {
            currentEpoch += sign;
            const dow = (((currentEpoch + 4) % 7) + 7) % 7;
            if (dow !== 0 && dow !== 6) {
                counted++;
            }
        }
        actualDaysShifted = currentEpoch - baseEpochDays;
        targetParts = civilFromDays(currentEpoch);
    }
    else if (unit === 'months') {
        const totalMonths = baseParts.year * 12 + (baseParts.month - 1) + sign * numericAmount;
        const targetYear = Math.floor(totalMonths / 12);
        const targetMonth = ((totalMonths % 12) + 12) % 12 + 1;
        const maxDays = getDaysInMonth(targetYear, targetMonth);
        const targetDay = Math.min(baseParts.day, maxDays);
        targetParts = { year: targetYear, month: targetMonth, day: targetDay };
        actualDaysShifted = daysFromCivil(targetParts.year, targetParts.month, targetParts.day) - baseEpochDays;
    }
    else if (unit === 'years') {
        const targetYear = baseParts.year + sign * numericAmount;
        const targetMonth = baseParts.month;
        const maxDays = getDaysInMonth(targetYear, targetMonth);
        const targetDay = Math.min(baseParts.day, maxDays);
        targetParts = { year: targetYear, month: targetMonth, day: targetDay };
        actualDaysShifted = daysFromCivil(targetParts.year, targetParts.month, targetParts.day) - baseEpochDays;
    }
    else {
        return {
            success: false,
            error: { code: 'INVALID_DATE_FORMAT', message: `Unsupported time unit: ${unit}` },
        };
    }
    const resultingDate = formatDateParts(targetParts);
    const dayOfWeek = getDayOfWeek(targetParts.year, targetParts.month, targetParts.day);
    const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
    return {
        success: true,
        data: {
            resultingDate,
            dayOfWeek,
            isWeekend,
            totalDaysAdded: actualDaysShifted,
            formattedLongDate: formatLongDate(targetParts.year, targetParts.month, targetParts.day),
        },
    };
}
