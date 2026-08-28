/**
 * Financial Event Engine
 * Handles one-time and recurring life events, windfalls, asset liquidations, major milestones, and debt payoffs.
 */

import { FinancialEvent, YearEventCashFlow } from '../models/financial-event';
import { inflateAmount } from './inflation-engine';

/**
 * Evaluates all financial events active for a specific year in the timeline.
 * 
 * @param events List of user-configured financial events
 * @param currentAge Starting age of the timeline
 * @param targetAge Current evaluation age
 * @param yearIndex Year offset from the start (1, 2, 3...)
 * @param generalInflationPct Annual inflation rate to apply to inflation-linked events
 */
export function evaluateEventsForYear(
  events: FinancialEvent[] | undefined,
  currentAge: number,
  targetAge: number,
  yearIndex: number,
  generalInflationPct: number
): YearEventCashFlow {
  if (!events || events.length === 0) {
    return {
      totalInflows: 0,
      totalOutflows: 0,
      netEventImpact: 0,
      activeEvents: []
    };
  }

  let totalInflows = 0;
  let totalOutflows = 0;
  const activeEvents: YearEventCashFlow['activeEvents'] = [];

  for (const event of events) {
    const eventStartAge = event.yearOrAge;
    const duration = event.isRecurring ? Math.max(1, event.durationYears || 1) : 1;
    const eventEndAge = eventStartAge + duration - 1;

    // Check if this event is active at the current projection age
    if (targetAge >= eventStartAge && targetAge <= eventEndAge) {
      const yearsFromStart = Math.max(0, targetAge - currentAge);
      
      // If inflation-adjusted, compound the base amount up to this year
      const adjustedAmount = event.inflationAdjusted
        ? inflateAmount(event.amount, generalInflationPct, yearsFromStart)
        : event.amount;

      if (event.type === 'inflow') {
        totalInflows += adjustedAmount;
      } else {
        totalOutflows += adjustedAmount;
      }

      activeEvents.push({
        id: event.id,
        title: event.title,
        type: event.type,
        adjustedAmount,
        category: event.category
      });
    }
  }

  return {
    totalInflows,
    totalOutflows,
    netEventImpact: totalInflows - totalOutflows,
    activeEvents
  };
}
