import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { getEventsForDate } from './event-resolver';
import { getExpandedEvents } from './utils/recurrence';
export const getMonthDays = (date) => {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    return eachDayOfInterval({ start, end });
};
export const getWeekDays = (date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return eachDayOfInterval({ start, end });
};
export const isToday = (date) => isSameDay(date, new Date());
export const formatEventTime = (dateStr, allDay) => {
    if (allDay)
        return 'All day';
    return format(parseISO(dateStr), 'h:mm a');
};
export const getEventsForDay = (date, events) => {
    return getExpandedEvents(events, startOfDay(date), endOfDay(date));
};
export const getFestivalsForDay = (date) => {
    const events = getEventsForDate(date);
    return events.filter(e => e.category === 'indian-festival' ||
        e.category === 'cultural' ||
        e.category === 'global-holiday' ||
        e.category === 'indian-national');
};
export const getObservancesForDay = (date) => {
    const events = getEventsForDate(date);
    return events.filter(e => e.category !== 'indian-festival' &&
        e.category !== 'cultural' &&
        e.category !== 'global-holiday' &&
        e.category !== 'indian-national');
};
export const getEventsInInterval = (start, end, events) => {
    return getExpandedEvents(events, start, end);
};
export const generateId = () => Math.random().toString(36).substring(2, 11);
