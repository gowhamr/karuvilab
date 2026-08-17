import { describe, it, expect } from 'vitest';
import { getExpandedEvents } from '../../features/calendar/utils/recurrence';
import { computeEventPositions } from '../../features/calendar/utils/layout-solver';
import { exportToICS, parseICS } from '../../features/calendar/utils/ics';
import { parseISO } from 'date-fns';
describe('Calendar Recurrence Expansion Engine', () => {
    it('should return a non-recurring event unchanged within range', () => {
        const event = {
            id: 'event-1',
            title: 'Simple Meeting',
            startDate: '2026-07-06T10:00:00.000Z',
            endDate: '2026-07-06T11:00:00.000Z',
            allDay: false,
            color: 'indigo',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        const expanded = getExpandedEvents([event], new Date('2026-07-01'), new Date('2026-07-10'));
        expect(expanded.length).toBe(1);
        expect(expanded[0].id).toBe('event-1');
    });
    it('should expand daily recurring events correctly within a range', () => {
        const recurringEvent = {
            id: 'daily-series',
            title: 'Daily Standup',
            startDate: '2026-07-06T09:00:00.000Z',
            endDate: '2026-07-06T09:30:00.000Z',
            allDay: false,
            color: 'blue',
            recurrence: {
                type: 'daily',
                count: 5
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        const expanded = getExpandedEvents([recurringEvent], new Date('2026-07-05T00:00:00Z'), new Date('2026-07-12T00:00:00Z'));
        // Should generate 5 occurrences (July 6, 7, 8, 9, 10)
        expect(expanded.length).toBe(5);
        expect(expanded[0].id).toBe('daily-series'); // original
        expect(expanded[1].id).toBe('daily-series:2026-07-07T09:00:00.000Z'); // virtual
        expect(expanded[4].id).toBe('daily-series:2026-07-10T09:00:00.000Z'); // virtual
    });
    it('should skip occurrences defined in exceptions list', () => {
        const recurringEvent = {
            id: 'weekly-series',
            title: 'Weekly Sync',
            startDate: '2026-07-06T10:00:00.000Z', // Monday
            endDate: '2026-07-06T11:00:00.000Z',
            allDay: false,
            color: 'green',
            recurrence: {
                type: 'weekly',
                exceptions: ['2026-07-13T10:00:00.000Z'] // skip next week's sync
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        // Query two weeks
        const expanded = getExpandedEvents([recurringEvent], new Date('2026-07-05T00:00:00Z'), new Date('2026-07-21T00:00:00Z'));
        // July 6 (Monday 1) should show, July 13 (Monday 2) skipped, July 20 (Monday 3) should show
        expect(expanded.length).toBe(2);
        expect(expanded[0].startDate).toBe('2026-07-06T10:00:00.000Z');
        expect(expanded[1].startDate).toBe('2026-07-20T10:00:00.000Z');
    });
});
describe('Calendar Overlapping Events Layout Solver', () => {
    it('should assign separate columns to overlapping events', () => {
        const events = [
            {
                id: 'evt-A',
                title: 'Event A',
                startDate: '2026-07-06T10:00:00.000Z',
                endDate: '2026-07-06T11:00:00.000Z',
                allDay: false,
                color: 'red',
                createdAt: Date.now(),
                updatedAt: Date.now()
            },
            {
                id: 'evt-B',
                title: 'Event B',
                startDate: '2026-07-06T10:30:00.000Z',
                endDate: '2026-07-06T11:30:00.000Z',
                allDay: false,
                color: 'yellow',
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
        ];
        const positioned = computeEventPositions(events);
        expect(positioned.length).toBe(2);
        expect(positioned[0].totalColumns).toBe(2);
        expect(positioned[1].totalColumns).toBe(2);
        expect(positioned[0].column).toBe(0);
        expect(positioned[1].column).toBe(1);
    });
    it('should stack non-overlapping events in the same column', () => {
        const events = [
            {
                id: 'evt-1',
                title: 'Event 1',
                startDate: '2026-07-06T10:00:00.000Z',
                endDate: '2026-07-06T11:00:00.000Z',
                allDay: false,
                color: 'blue',
                createdAt: Date.now(),
                updatedAt: Date.now()
            },
            {
                id: 'evt-2',
                title: 'Event 2',
                startDate: '2026-07-06T11:00:00.000Z',
                endDate: '2026-07-06T12:00:00.000Z',
                allDay: false,
                color: 'blue',
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
        ];
        const positioned = computeEventPositions(events);
        expect(positioned.length).toBe(2);
        expect(positioned[0].column).toBe(0);
        expect(positioned[1].column).toBe(0); // starts exactly when 1 ends
        expect(positioned[0].totalColumns).toBe(1);
        expect(positioned[1].totalColumns).toBe(1);
    });
});
describe('Calendar iCalendar (ICS) Integration', () => {
    it('should export and parse back events correctly', () => {
        const originalEvent = {
            id: 'my-unique-uid',
            title: 'Project Kickoff Meeting',
            description: 'Discussing the new roadmap plans.',
            startDate: '2026-07-06T14:00:00.000Z',
            endDate: '2026-07-06T15:00:00.000Z',
            allDay: false,
            location: 'Conference Room Alpha',
            color: 'indigo',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        const icsContent = exportToICS([originalEvent]);
        // Check that key iCalendar elements are outputted
        expect(icsContent).toContain('BEGIN:VCALENDAR');
        expect(icsContent).toContain('BEGIN:VEVENT');
        expect(icsContent).toContain('SUMMARY:Project Kickoff Meeting');
        expect(icsContent).toContain('LOCATION:Conference Room Alpha');
        expect(icsContent).toContain('END:VEVENT');
        // Parse it back
        const parsedEvents = parseICS(icsContent);
        expect(parsedEvents.length).toBe(1);
        const parsed = parsedEvents[0];
        expect(parsed.title).toBe(originalEvent.title);
        expect(parsed.description).toBe(originalEvent.description);
        expect(parsed.location).toBe(originalEvent.location);
        expect(parseISO(parsed.startDate).getTime()).toBe(parseISO(originalEvent.startDate).getTime());
        expect(parseISO(parsed.endDate).getTime()).toBe(parseISO(originalEvent.endDate).getTime());
    });
});
