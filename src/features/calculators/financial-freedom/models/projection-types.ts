/**
 * FIRE Projection and Result Types
 * Fully compatible with legacy fields while introducing Phase 1 capabilities.
 */

export interface YearlyProjection {
  /** Age at this projection year */
  age: number;
  /** Relative year offset from start (1, 2, 3...) */
  year: number;
  /** Calendar year (e.g. 2026, 2027...) */
  calendarYear: number;
  /** Current life phase */
  phase: 'accumulation' | 'retirement';

  /** Projected annual earned income */
  annualIncome: number;
  /** Projected total annual living expenses */
  annualExpenses: number;
  /** Breakdown: general living expenses */
  generalExpenses: number;
  /** Breakdown: medical & healthcare expenses */
  medicalExpenses: number;

  /** Starting portfolio corpus balance at beginning of year */
  startCorpus: number;
  /** Cumulative invested capital (Principal) */
  totalInvested: number;
  /** Total new contributions added during the year */
  annualInvestment: number;
  /** Investment returns/interest generated during the year */
  returnsEarned: number;
  /** Alias for backward compatibility */
  interestEarned: number;
  /** Effective rate of return applied in this year (%) */
  effectiveReturnRate: number;
  /** Annual withdrawal taken from portfolio (if in retirement) */
  annualWithdrawal: number;
  /** Estimated tax paid on withdrawal based on Tax Phase 3 Strategy */
  taxPaid?: number;

  /** Inflow from one-time or recurring financial events */
  eventInflows: number;
  /** Outflow from one-time or recurring financial events */
  eventOutflows: number;
  /** Net cash flow for the year */
  netCashFlow: number;

  /** Ending portfolio corpus balance at end of year */
  endCorpus: number;
  /** Target corpus needed at this age to be fully financially independent */
  targetCorpusNeeded: number;

  /** Whether the portfolio was sufficient to sustain freedom at this age */
  isFinanciallyFree: boolean;
  /** Whether the portfolio has completely depleted to zero */
  hasDepleted: boolean;
}

export interface FireResults {
  /** Target required corpus in currency at retirement/target age */
  targetCorpus: number;
  /** Estimated projected corpus accumulated at target age */
  projectedCorpus: number;
  /** Surplus (+) or Shortfall (-) at target age compared to target corpus */
  shortfallOrSurplus: number;
  /** Required monthly SIP to reach target corpus by target age */
  requiredMonthlySip: number;
  /** Earliest age at which portfolio sustains financial independence (-1 if unreachable) */
  estimatedFreedomAge: number;
  /** Number of years from current age to freedom age (-1 if unreachable) */
  yearsToFreedom: number;

  /** Inflation-adjusted monthly expense at retirement */
  targetMonthlyExpense: number;
  /** Initial annual withdrawal amount in first retirement year */
  initialAnnualWithdrawal: number;

  /** Projected corpus balance at target age */
  corpusAtTargetAge: number;
  /** Projected corpus balance at traditional retirement age */
  corpusAtRetirement: number;

  /** Percentage of target corpus already funded (0-100%+) */
  freedomRatio: number;
  /** Whether the goal is achievable under current contributions */
  isAchievable: boolean;
  /** Age at which corpus depletes to zero (null if survives whole horizon) */
  depletionAge: number | null;

  /** Complete year-by-year cash flow projections */
  projections: YearlyProjection[];
  /** Total number of life events applied across the timeline */
  eventsApplied: number;
}
