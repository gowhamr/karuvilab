const DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export function todayISO() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
export function getDaysInMonth(year, month) {
    if (month === 2) {
        return isLeapYear(year) ? 29 : 28;
    }
    return DAYS_IN_MONTH[month] ?? 31;
}
/**
 * Converts a civil date (Gregorian) to days since Unix epoch (1970-01-01).
 * Algorithm by Howard Hinnant (std::chrono). Pure integer arithmetic.
 */
export function daysFromCivil(year, month, day) {
    let y = year;
    const m = month;
    const d = day;
    y -= m <= 2 ? 1 : 0;
    const era = Math.floor((y >= 0 ? y : y - 399) / 400);
    const yoe = y - era * 400;
    const doy = Math.floor((153 * (m > 2 ? m - 3 : m + 9) + 2) / 5) + d - 1;
    const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
    return era * 146097 + doe - 719468;
}
/**
 * Calculates day of the week for a given civil date using Sakamoto's algorithm.
 * Returns the day name (e.g. 'Monday').
 */
export function getDayOfWeek(year, month, day) {
    const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    let y = year;
    if (month < 3)
        y -= 1;
    const dayIndex = (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + t[month - 1] + day) % 7;
    const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return WEEKDAYS[dayIndex] ?? 'Sunday';
}
export function parseISODateParts(dateStr) {
    if (!dateStr || typeof dateStr !== 'string')
        return null;
    const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match)
        return null;
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    if (month < 1 || month > 12 || day < 1 || day > 31)
        return null;
    const maxDays = getDaysInMonth(year, month);
    if (day > maxDays)
        return null;
    return { year, month, day };
}
function isBeforeOrEqual(y1, m1, d1, y2, m2, d2) {
    if (y1 < y2)
        return true;
    if (y1 > y2)
        return false;
    if (m1 < m2)
        return true;
    if (m1 > m2)
        return false;
    return d1 <= d2;
}
export function calculateCalendarDiff(dob, asOf) {
    // Check if dob is after asOf
    if (!isBeforeOrEqual(dob.year, dob.month, dob.day, asOf.year, asOf.month, asOf.day)) {
        return null;
    }
    // 1. Determine completed full years
    let years = asOf.year - dob.year;
    // Leap day DOB handling: In a non-leap asOf year, the anniversary is March 1
    let annMonth = dob.month;
    let annDay = dob.day;
    if (dob.month === 2 && dob.day === 29 && !isLeapYear(asOf.year)) {
        annMonth = 3;
        annDay = 1;
    }
    if (!isBeforeOrEqual(asOf.year, annMonth, annDay, asOf.year, asOf.month, asOf.day)) {
        years -= 1;
    }
    const refYear = dob.year + years;
    const refMonth = dob.month;
    // 2. Determine completed whole months from (refYear, refMonth)
    // Whole months within the current age year are bounded between 0 and 11
    const mDiff = Math.min(11, (asOf.year - refYear) * 12 + (asOf.month - refMonth));
    let months = 0;
    let milestoneYear = refYear;
    let milestoneMonth = refMonth;
    let milestoneDay = dob.day;
    if (dob.month === 2 && dob.day === 29 && !isLeapYear(refYear)) {
        milestoneMonth = 3;
        milestoneDay = 1;
    }
    else {
        milestoneDay = Math.min(dob.day, getDaysInMonth(milestoneYear, milestoneMonth));
    }
    for (let m = mDiff; m >= 0; m--) {
        const tYear = refYear + Math.floor((refMonth + m - 1) / 12);
        const tMonth = ((refMonth + m - 1) % 12) + 1;
        let tCheckMonth = tMonth;
        let tCheckDay = dob.day;
        if (dob.month === 2 && dob.day === 29 && tMonth === 2 && !isLeapYear(tYear)) {
            tCheckMonth = 3;
            tCheckDay = 1;
        }
        else {
            tCheckDay = Math.min(dob.day, getDaysInMonth(tYear, tMonth));
        }
        if (isBeforeOrEqual(tYear, tCheckMonth, tCheckDay, asOf.year, asOf.month, asOf.day)) {
            months = m;
            milestoneYear = tYear;
            milestoneMonth = tCheckMonth;
            milestoneDay = tCheckDay;
            break;
        }
    }
    // 3. Determine remaining days from milestone date to asOf date
    const milestoneDays = daysFromCivil(milestoneYear, milestoneMonth, milestoneDay);
    const asOfDays = daysFromCivil(asOf.year, asOf.month, asOf.day);
    const days = asOfDays - milestoneDays;
    return { years, months, days };
}
export function getNextBirthdayPure(dob, asOf) {
    // Birthday in asOf year
    let bDayYear = asOf.year;
    let bDayMonth = dob.month;
    let bDayDay = dob.day;
    if (dob.month === 2 && dob.day === 29 && !isLeapYear(bDayYear)) {
        bDayDay = 28;
    }
    const isPassed = !isBeforeOrEqual(asOf.year, asOf.month, asOf.day, bDayYear, bDayMonth, bDayDay);
    if (isPassed) {
        bDayYear += 1;
        bDayDay = (dob.month === 2 && dob.day === 29 && !isLeapYear(bDayYear)) ? 28 : dob.day;
    }
    const nextBirthdayStr = `${bDayYear}-${String(bDayMonth).padStart(2, '0')}-${String(bDayDay).padStart(2, '0')}`;
    const asOfDays = daysFromCivil(asOf.year, asOf.month, asOf.day);
    const nextDays = daysFromCivil(bDayYear, bDayMonth, bDayDay);
    const daysUntil = nextDays - asOfDays;
    return { nextBirthdayStr, daysUntil };
}
