import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  format, 
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
  getMonth,
  getDate
} from 'date-fns';
import { CalendarEvent } from './types';
import { GLOBAL_FESTIVALS, GLOBAL_OBSERVANCES } from './data/static-data';

export const getMonthDays = (date: Date) => {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  return eachDayOfInterval({ start, end });
};

export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date);
  const end = endOfWeek(date);
  return eachDayOfInterval({ start, end });
};

export const isToday = (date: Date) => isSameDay(date, new Date());

export const formatEventTime = (dateStr: string, allDay: boolean) => {
  if (allDay) return 'All day';
  return format(parseISO(dateStr), 'h:mm a');
};

export const getEventsForDay = (date: Date, events: CalendarEvent[]) => {
  return events.filter(event => {
    const start = parseISO(event.startDate);
    return isSameDay(start, date);
  });
};

export const getFestivalsForDay = (date: Date) => {
  const m = getMonth(date) + 1;
  const d = getDate(date);
  return GLOBAL_FESTIVALS.filter(f => f.month === m && f.day === d);
};

export const getObservancesForDay = (date: Date) => {
  const m = getMonth(date) + 1;
  const d = getDate(date);
  return GLOBAL_OBSERVANCES.filter(o => o.month === m && o.day === d);
};

export const getEventsInInterval = (start: Date, end: Date, events: CalendarEvent[]) => {
  return events.filter(event => {
    const eventStart = parseISO(event.startDate);
    return isWithinInterval(eventStart, { start, end });
  });
};

export const generateId = () => Math.random().toString(36).substring(2, 11);
