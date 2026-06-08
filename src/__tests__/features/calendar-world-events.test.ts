import { describe, it, expect } from 'vitest';
import { 
  resolveEventDate, 
  getEventsForDate, 
  getEventsForMonth, 
  getUpcomingEvents,
  getNthWeekdayOfMonth,
  filterByCategory,
  filterByImportance,
  searchEvents
} from '../../features/calendar/event-resolver';
import { ALL_WORLD_EVENTS } from '../../features/calendar/world-events-db';

describe('Calendar World Events & Holidays', () => {
  it('should correctly resolve fixed date events', () => {
    const christmas = ALL_WORLD_EVENTS.find(e => e.id === 'christmas')!;
    const resolved = resolveEventDate(christmas, 2026);
    expect(resolved).not.toBeNull();
    expect(resolved!.getFullYear()).toBe(2026);
    expect(resolved!.getMonth()).toBe(11); // December (0-indexed)
    expect(resolved!.getDate()).toBe(25);
  });

  it('should correctly resolve nth-weekday floating date rules (Mother\'s Day)', () => {
    const mothersDay = ALL_WORLD_EVENTS.find(e => e.id === 'mothers-day')!;
    // Mother's Day is the 2nd Sunday of May
    // 2026 May: 1st is Friday. 1st Sunday is May 3. 2nd Sunday is May 10.
    const resolved = resolveEventDate(mothersDay, 2026);
    expect(resolved).not.toBeNull();
    expect(resolved!.getFullYear()).toBe(2026);
    expect(resolved!.getMonth()).toBe(4); // May
    expect(resolved!.getDate()).toBe(10);
  });

  it('should correctly resolve lunar-lookup floating date rules (Holi & Diwali)', () => {
    const holi = ALL_WORLD_EVENTS.find(e => e.id === 'holi')!;
    const diwali = ALL_WORLD_EVENTS.find(e => e.id === 'diwali')!;

    // 2026 Holi resolves to March 4
    const resolvedHoli = resolveEventDate(holi, 2026);
    expect(resolvedHoli!.getMonth()).toBe(2); // March
    expect(resolvedHoli!.getDate()).toBe(4);

    // 2026 Diwali resolves to November 8
    const resolvedDiwali = resolveEventDate(diwali, 2026);
    expect(resolvedDiwali!.getMonth()).toBe(10); // November
    expect(resolvedDiwali!.getDate()).toBe(8);
  });

  it('should retrieve events for a specific date', () => {
    // Jan 1: New Year's Day
    const date = new Date(2026, 0, 1);
    const events = getEventsForDate(date);
    expect(events.length).toBeGreaterThan(0);
    expect(events.some(e => e.id === 'new-year')).toBe(true);
  });

  it('should retrieve events for a given month', () => {
    const monthEvents = getEventsForMonth(2026, 12); // December
    expect(monthEvents.has(25)).toBe(true); // Christmas
    expect(monthEvents.get(25)!.some(e => e.id === 'christmas')).toBe(true);
  });

  it('should calculate upcoming world events with proper sorting', () => {
    const fromDate = new Date(2026, 11, 24); // Dec 24, 2026
    const upcoming = getUpcomingEvents(fromDate, 3);
    
    expect(upcoming.length).toBe(3);
    expect(upcoming[0].event.id).toBe('christmas'); // Dec 25
    expect(upcoming[0].daysUntil).toBe(1);
    
    expect(upcoming[1].event.id).toBe('new-years-eve'); // Dec 31
    expect(upcoming[1].daysUntil).toBe(7);
  });

  it('should filter events by category', () => {
    const events = filterByCategory(ALL_WORLD_EVENTS, ['indian-national', 'indian-festival']);
    expect(events.every(e => e.category === 'indian-national' || e.category === 'indian-festival')).toBe(true);
    expect(events.some(e => e.id === 'republic-day-india')).toBe(true);
  });

  it('should filter events by importance', () => {
    const events = filterByImportance(ALL_WORLD_EVENTS, ['major']);
    expect(events.every(e => e.importance === 'major')).toBe(true);
  });

  it('should search events by matching terms', () => {
    const results = searchEvents('water');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(e => e.id === 'world-water-day')).toBe(true);
  });
});
