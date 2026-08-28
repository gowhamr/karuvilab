import { describe, it, expect } from 'vitest';
import { evaluateEventsForYear } from '../engine/event-engine';
describe('Event Engine', () => {
    const sampleEvents = [
        {
            id: 'event-1',
            title: 'Inheritance Windfall',
            yearOrAge: 35,
            amount: 2000000,
            type: 'inflow',
            isRecurring: false,
            inflationAdjusted: false,
            category: 'windfall'
        },
        {
            id: 'event-2',
            title: 'House Down Payment',
            yearOrAge: 30,
            amount: 1500000,
            type: 'outflow',
            isRecurring: false,
            inflationAdjusted: true,
            category: 'property'
        },
        {
            id: 'event-3',
            title: 'Child Higher Education',
            yearOrAge: 45,
            amount: 500000,
            type: 'outflow',
            isRecurring: true,
            durationYears: 4,
            inflationAdjusted: true,
            category: 'education'
        }
    ];
    it('evaluates one-time nominal windfall event correctly at target age', () => {
        // Current age 25, evaluating at age 35 (year 10)
        const result = evaluateEventsForYear(sampleEvents, 25, 35, 10, 6);
        expect(result.totalInflows).toBe(2000000);
        expect(result.totalOutflows).toBe(0);
        expect(result.netEventImpact).toBe(2000000);
        expect(result.activeEvents.length).toBe(1);
        expect(result.activeEvents[0]?.title).toBe('Inheritance Windfall');
    });
    it('evaluates inflation-adjusted one-time outflow correctly', () => {
        // Current age 25, evaluating at age 30 (5 years of inflation at 6%)
        // 1,500,000 * 1.06^5 ≈ 2,007,338.37
        const result = evaluateEventsForYear(sampleEvents, 25, 30, 5, 6);
        expect(result.totalInflows).toBe(0);
        expect(result.totalOutflows).toBeCloseTo(2007338.37, 0);
        expect(result.netEventImpact).toBeCloseTo(-2007338.37, 0);
    });
    it('evaluates multi-year recurring events across active years and ends thereafter', () => {
        // Child education active at ages 45, 46, 47, 48 (4 years)
        const resultAge45 = evaluateEventsForYear(sampleEvents, 25, 45, 20, 6);
        expect(resultAge45.activeEvents.some(e => e.id === 'event-3')).toBe(true);
        const resultAge48 = evaluateEventsForYear(sampleEvents, 25, 48, 23, 6);
        expect(resultAge48.activeEvents.some(e => e.id === 'event-3')).toBe(true);
        const resultAge49 = evaluateEventsForYear(sampleEvents, 25, 49, 24, 6);
        expect(resultAge49.activeEvents.some(e => e.id === 'event-3')).toBe(false);
    });
    it('returns zero impact when no events are active in the target year', () => {
        const result = evaluateEventsForYear(sampleEvents, 25, 27, 2, 6);
        expect(result.totalInflows).toBe(0);
        expect(result.totalOutflows).toBe(0);
        expect(result.netEventImpact).toBe(0);
        expect(result.activeEvents.length).toBe(0);
    });
});
