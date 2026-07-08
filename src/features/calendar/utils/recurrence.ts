import { 
  addDays, 
  addWeeks, 
  addMonths, 
  addYears, 
  parseISO, 
  isAfter, 
  differenceInMinutes
} from 'date-fns';
import { CalendarEvent } from '../types';

/**
 * Expands recurring calendar events within a given date range.
 * Properly processes exceptions (deleted/modified instances) and maps them.
 */
export function getExpandedEvents(
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  const expanded: CalendarEvent[] = [];

  // 1. Separate base series/normal events from exception events
  const normalAndSeries = events.filter(e => !e.parentId);
  const exceptions = events.filter(e => !!e.parentId);

  // 2. Add exceptions directly if they fall in the range
  exceptions.forEach(evt => {
    const start = parseISO(evt.startDate);
    const end = parseISO(evt.endDate);
    if ((start >= rangeStart && start <= rangeEnd) || (end >= rangeStart && end <= rangeEnd) || (start <= rangeStart && end >= rangeEnd)) {
      expanded.push(evt);
    }
  });

  // 3. Expand normal/series events
  normalAndSeries.forEach(event => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    const durationMin = differenceInMinutes(eventEnd, eventStart);

    if (!event.recurrence || event.recurrence.type === 'none') {
      // Normal event
      if ((eventStart >= rangeStart && eventStart <= rangeEnd) || (eventEnd >= rangeStart && eventEnd <= rangeEnd) || (eventStart <= rangeStart && eventEnd >= rangeEnd)) {
        expanded.push(event);
      }
      return;
    }

    // Series event
    const { type, endDate, count, exceptions: seriesExceptions = [] } = event.recurrence;
    const seriesEndDate = endDate ? parseISO(endDate) : null;

    let currentStart = eventStart;
    let index = 0;

    // Safety counter to prevent infinite loops
    let iterations = 0;
    const maxIterations = 730; // Max ~2 years of daily events

    while (iterations < maxIterations) {
      iterations++;
      
      // Check count limit
      if (count !== undefined && index >= count) break;

      // Check series end date limit
      if (seriesEndDate && isAfter(currentStart, seriesEndDate)) break;

      // Check if we went beyond the query range end
      if (isAfter(currentStart, rangeEnd)) break;

      const currentEndDate = new Date(currentStart.getTime() + durationMin * 60000);
      const instanceKey = currentStart.toISOString();
      const isExcepted = seriesExceptions.includes(instanceKey);

      if (!isExcepted) {
        // Check if it falls inside our query range
        const fallsInRange = 
          (currentStart >= rangeStart && currentStart <= rangeEnd) || 
          (currentEndDate >= rangeStart && currentEndDate <= rangeEnd) || 
          (currentStart <= rangeStart && currentEndDate >= rangeEnd);

        if (fallsInRange) {
          if (index === 0) {
            // Keep the original ID for the very first instance to maintain database references
            expanded.push(event);
          } else {
            expanded.push({
              ...event,
              id: `${event.id}:${instanceKey}`,
              startDate: instanceKey,
              endDate: currentEndDate.toISOString(),
            });
          }
        }
      }

      // Move to next instance
      index++;
      if (type === 'daily') {
        currentStart = addDays(currentStart, 1);
      } else if (type === 'weekly') {
        currentStart = addWeeks(currentStart, 1);
      } else if (type === 'monthly') {
        currentStart = addMonths(currentStart, 1);
      } else if (type === 'yearly') {
        currentStart = addYears(currentStart, 1);
      } else {
        break; // safety
      }
    }
  });

  return expanded;
}
