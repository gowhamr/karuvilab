/**
 * Fixed Safe Withdrawal Rate (SWR) Strategy
 * Implements the deterministic Trinity Study / Bengen rule:
 * Year 1 withdrawal = Portfolio * SWR%
 * Subsequent years = Year 1 withdrawal adjusted for inflation
 */

import { calculateRequiredCorpus, calculateInitialAnnualWithdrawal, calculateAdjustedWithdrawal } from '../engine/withdrawal-engine';

export interface WithdrawalStrategy {
  name: string;
  calculateTargetCorpus(annualExpensesAtRetirement: number, swrPct: number): number;
  calculateWithdrawal(
    startCorpus: number,
    initialAnnualWithdrawal: number,
    generalInflationPct: number,
    yearsIntoRetirement: number,
    swrPct: number
  ): number;
}

export const FixedSwrStrategy: WithdrawalStrategy = {
  name: 'Fixed SWR (Trinity Rule)',

  calculateTargetCorpus(annualExpensesAtRetirement: number, swrPct: number): number {
    return calculateRequiredCorpus(annualExpensesAtRetirement, swrPct);
  },

  calculateWithdrawal(
    _startCorpus: number,
    initialAnnualWithdrawal: number,
    generalInflationPct: number,
    yearsIntoRetirement: number,
    _swrPct: number
  ): number {
    return calculateAdjustedWithdrawal(initialAnnualWithdrawal, generalInflationPct, yearsIntoRetirement);
  }
};
