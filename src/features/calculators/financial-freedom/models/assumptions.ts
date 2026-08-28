/**
 * FIRE Assumptions and Inputs
 * Supports both legacy parameters and enhanced Phase 1 capabilities (Dual-phase returns, Dynamic SWR, Healthcare inflation, Longevity, Events).
 */

import { FinancialEvent } from './financial-event';

export type FireVariant = 'regular' | 'lean' | 'fat' | 'coast' | 'barista';

export interface FireInputs {
  /** Current chronological age (e.g. 25) */
  currentAge: number;
  /** Target age to achieve Financial Independence (e.g. 45) */
  targetAge: number;
  /** Traditional retirement age for Coast FIRE compounding (e.g. 60 or 65) */
  traditionalRetirementAge: number;
  /** Longevity / horizon age for simulation (default 85 or 90, up to 105) */
  longevityAge?: number;

  /** Current monthly earned income in today's currency */
  currentIncome: number;
  /** Current monthly living expenses in today's currency */
  currentExpenses: number;
  /** Current dedicated monthly healthcare expense (if separated from general expenses) */
  currentMedicalExpenses?: number;

  /** Total currently accumulated savings and invested corpus */
  currentCorpus: number;
  /** Current monthly SIP / investment contribution */
  monthlySip: number;

  /** Expected annual return rate during Accumulation Phase (%) (e.g. 12) */
  expectedReturnRate: number;
  /** Expected annual return rate during Retirement Phase (%) (e.g. 7 or 8). Defaults to expectedReturnRate if omitted. */
  retirementReturnRate?: number;

  /** Expected general annual CPI inflation rate (%) (e.g. 6) */
  expectedInflationRate: number;
  /** Expected medical & healthcare annual inflation rate (%) (e.g. 10 or 12). Defaults to expectedInflationRate if omitted. */
  healthcareInflationRate?: number;

  /** Expected annual income growth / hike rate (%) (e.g. 8 or 10) */
  incomeGrowthRate: number;
  /** Expected annual general expense escalation rate (%) (e.g. 6) */
  expenseGrowthRate: number;

  /** Safe Withdrawal Rate (SWR) percentage (%) (e.g. 4.0, range 2.5 to 5.0) */
  withdrawalRate: number;

  /** Selected FIRE Variant */
  fireVariant: FireVariant;

  /** Lean FIRE expense multiplier (default 0.7) */
  leanMultiplier?: number;
  /** Fat FIRE expense multiplier (default 1.5) */
  fatMultiplier?: number;
  /** Barista FIRE expected monthly part-time earnings in retirement (default 15,000) */
  baristaMonthlyIncome?: number;

  /** Tax Phase 3: Strategy to use for retirement withdrawals */
  taxStrategy?: 'none' | 'flat_on_withdrawal' | 'gains_approximation';
  /** Tax Phase 3: Applicable tax rate on withdrawals or gains (%) */
  taxRate?: number;

  /** Optional list of planned life events and cash flow adjustments */
  events?: FinancialEvent[];
}

export const DEFAULT_FIRE_INPUTS: FireInputs = {
  currentAge: 25,
  targetAge: 45,
  traditionalRetirementAge: 65,
  longevityAge: 85,
  currentIncome: 50000,
  currentExpenses: 30000,
  currentMedicalExpenses: 0,
  currentCorpus: 500000,
  monthlySip: 10000,
  expectedReturnRate: 12,
  retirementReturnRate: 8,
  expectedInflationRate: 6,
  healthcareInflationRate: 10,
  incomeGrowthRate: 10,
  expenseGrowthRate: 6,
  withdrawalRate: 4,
  fireVariant: 'regular',
  leanMultiplier: 0.7,
  fatMultiplier: 1.5,
  baristaMonthlyIncome: 15000,
  taxStrategy: 'none',
  taxRate: 12.5,
  events: []
};
