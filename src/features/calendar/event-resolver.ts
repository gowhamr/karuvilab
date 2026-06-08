import { 
  WorldEvent, 
  EventCategory, 
  EventImportance, 
  ALL_WORLD_EVENTS, 
  HOLI_LUNAR_LOOKUP, 
  DIWALI_LUNAR_LOOKUP 
} from './world-events-db';
import { 
  startOfDay, 
  differenceInCalendarDays, 
  addDays,
  getMonth,
  getDate,
  getYear
} from 'date-fns';

// Calculate nth weekday of month (for floating events)
export function getNthWeekdayOfMonth(
  year: number,
  month: number, // 1-12
  weekday: number, // 0=Sun, 1=Mon, ..., 6=Sat
  n: number // 1=first, 2=second, ..., -1=last, -2=second to last
): Date {
  const monthIdx = month - 1;
  
  if (n > 0) {
    // Start at the 1st of the month
    const date = new Date(year, monthIdx, 1);
    const firstDay = date.getDay();
    let daysOffset = weekday - firstDay;
    if (daysOffset < 0) {
      daysOffset += 7;
    }
    const targetDay = 1 + daysOffset + (n - 1) * 7;
    return new Date(year, monthIdx, targetDay);
  } else {
    // Start at the last day of the month
    const date = new Date(year, month, 0); // last day
    const lastDay = date.getDay();
    let daysOffset = lastDay - weekday;
    if (daysOffset < 0) {
      daysOffset += 7;
    }
    const targetDay = date.getDate() - daysOffset - (Math.abs(n) - 1) * 7;
    return new Date(year, monthIdx, targetDay);
  }
}

// Resolve floating date rules to actual dates for a given year
export function resolveEventDate(
  event: WorldEvent,
  year: number
): Date | null {
  const { rule } = event;
  const { month, day } = event.date;

  if (!rule) {
    return new Date(year, month - 1, day);
  }

  if (rule.type === 'nth-weekday') {
    return getNthWeekdayOfMonth(year, rule.month, rule.weekday, rule.n);
  }

  if (rule.type === 'lunar-lookup') {
    if (rule.id === 'holi') {
      const lookup = HOLI_LUNAR_LOOKUP[year];
      if (lookup) {
        return new Date(year, lookup.month - 1, lookup.day);
      }
      // Fallback
      return new Date(year, 2, 14); // March 14
    }
    if (rule.id === 'diwali') {
      const lookup = DIWALI_LUNAR_LOOKUP[year];
      if (lookup) {
        return new Date(year, lookup.month - 1, lookup.day);
      }
      // Fallback
      return new Date(year, 9, 20); // October 20
    }
  }

  return null;
}

// Get all events for a specific date
export function getEventsForDate(
  date: Date
): WorldEvent[] {
  const targetYear = getYear(date);
  const targetMonth = getMonth(date); // 0-11
  const targetDay = getDate(date);    // 1-31

  return ALL_WORLD_EVENTS.filter(event => {
    const resolved = resolveEventDate(event, targetYear);
    if (!resolved) return false;
    return getMonth(resolved) === targetMonth && getDate(resolved) === targetDay;
  });
}

// Get all events for a month
export function getEventsForMonth(
  year: number,
  month: number // 1-12
): Map<number, WorldEvent[]> {
  const result = new Map<number, WorldEvent[]>();
  
  ALL_WORLD_EVENTS.forEach(event => {
    const resolved = resolveEventDate(event, year);
    if (resolved && getMonth(resolved) + 1 === month) {
      const day = getDate(resolved);
      if (!result.has(day)) {
        result.set(day, []);
      }
      result.get(day)!.push(event);
    }
  });

  return result;
}

// Get upcoming events from today
export function getUpcomingEvents(
  fromDate: Date,
  count: number
): { event: WorldEvent; date: Date; daysUntil: number }[] {
  const todayStart = startOfDay(fromDate);
  const currentYear = getYear(fromDate);
  const candidates: { event: WorldEvent; date: Date; daysUntil: number }[] = [];

  // Look at current year and next year to handle year-end crossovers
  [currentYear, currentYear + 1].forEach(year => {
    ALL_WORLD_EVENTS.forEach(event => {
      const resolved = resolveEventDate(event, year);
      if (resolved) {
        const resolvedStart = startOfDay(resolved);
        const diff = differenceInCalendarDays(resolvedStart, todayStart);
        if (diff >= 0) {
          candidates.push({
            event,
            date: resolved,
            daysUntil: diff
          });
        }
      }
    });
  });

  // Sort by date ascending, then filter duplicate events (keep earliest)
  candidates.sort((a, b) => a.daysUntil - b.daysUntil);
  
  // Dedup in case we have the same event twice across boundaries, though they are usually different dates
  const seenIds = new Set<string>();
  const uniqueCandidates: typeof candidates = [];
  for (const c of candidates) {
    const key = `${c.event.id}-${getYear(c.date)}`;
    if (!seenIds.has(key)) {
      seenIds.add(key);
      uniqueCandidates.push(c);
    }
  }

  return uniqueCandidates.slice(0, count);
}

// Filter events by category
export function filterByCategory(
  events: WorldEvent[],
  categories: EventCategory[]
): WorldEvent[] {
  if (categories.length === 0) return events;
  return events.filter(e => categories.includes(e.category));
}

// Filter events by importance
export function filterByImportance(
  events: WorldEvent[],
  importance: EventImportance[]
): WorldEvent[] {
  if (importance.length === 0) return events;
  return events.filter(e => importance.includes(e.importance));
}

// Search events by text
export function searchEvents(
  query: string
): WorldEvent[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return ALL_WORLD_EVENTS;
  
  return ALL_WORLD_EVENTS.filter(e => {
    return (
      e.name.toLowerCase().includes(normalizedQuery) ||
      e.description.short.toLowerCase().includes(normalizedQuery) ||
      e.description.full.toLowerCase().includes(normalizedQuery) ||
      e.tags.some(t => t.toLowerCase().includes(normalizedQuery))
    );
  });
}
