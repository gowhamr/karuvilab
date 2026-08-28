/**
 * Fixed Safe Withdrawal Rate (SWR) Strategy
 * Implements the deterministic Trinity Study / Bengen rule:
 * Year 1 withdrawal = Portfolio * SWR%
 * Subsequent years = Year 1 withdrawal adjusted for inflation
 */
import { calculateRequiredCorpus, calculateAdjustedWithdrawal } from '../engine/withdrawal-engine';
export const FixedSwrStrategy = {
    name: 'Fixed SWR (Trinity Rule)',
    calculateTargetCorpus(annualExpensesAtRetirement, swrPct) {
        return calculateRequiredCorpus(annualExpensesAtRetirement, swrPct);
    },
    calculateWithdrawal(_startCorpus, initialAnnualWithdrawal, generalInflationPct, yearsIntoRetirement, _swrPct) {
        return calculateAdjustedWithdrawal(initialAnnualWithdrawal, generalInflationPct, yearsIntoRetirement);
    }
};
