/**
 * Financial Event Models
 * Represents one-time or recurring cash-flow events (inflows/outflows) in the FIRE projection timeline.
 */

export type FinancialEventType = 'inflow' | 'outflow';

export type FinancialEventCategory =
  | 'education'
  | 'property'
  | 'vehicle'
  | 'medical'
  | 'windfall'
  | 'pension'
  | 'debt_payoff'
  | 'travel'
  | 'general';

export interface FinancialEvent {
  id: string;
  title: string;
  /** Age at which the event starts/occurs */
  yearOrAge: number;
  /** Base amount in currency (e.g., in today's money or nominal if not inflation adjusted) */
  amount: number;
  /** Type of cash flow: inflow (income/windfall) or outflow (expense/goal) */
  type: FinancialEventType;
  /** Whether the event recurs for multiple consecutive years */
  isRecurring: boolean;
  /** Duration in years if recurring (default 1) */
  durationYears?: number;
  /** Whether the amount should compound with inflation up to the event year */
  inflationAdjusted: boolean;
  /** Categorization for analysis and grouping */
  category: FinancialEventCategory;
}

export interface YearEventCashFlow {
  totalInflows: number;
  totalOutflows: number;
  netEventImpact: number;
  activeEvents: Array<{
    id: string;
    title: string;
    type: FinancialEventType;
    adjustedAmount: number;
    category: FinancialEventCategory;
  }>;
}
