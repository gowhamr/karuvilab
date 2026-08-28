/**
 * Withdrawal Engine
 * Pure mathematical functions for Safe Withdrawal Rate (SWR), initial and ongoing retirement drawdown calculations.
 */
/**
 * Calculate the required FIRE corpus using the Safe Withdrawal Rate (SWR).
 * Formula: Required Corpus = Annual Expenses / (SWR% / 100)
 */
export function calculateRequiredCorpus(annualExpenses, swrPct) {
    if (annualExpenses <= 0)
        return 0;
    const swrFraction = Math.max(0.005, swrPct / 100);
    return annualExpenses / swrFraction;
}
/**
 * Calculate initial annual withdrawal amount from a given corpus and SWR.
 */
export function calculateInitialAnnualWithdrawal(corpus, swrPct) {
    if (corpus <= 0)
        return 0;
    return corpus * (swrPct / 100);
}
/**
 * Adjust an ongoing retirement withdrawal for general inflation.
 */
export function calculateAdjustedWithdrawal(initialAnnualWithdrawal, generalInflationPct, yearsIntoRetirement) {
    if (yearsIntoRetirement <= 0)
        return initialAnnualWithdrawal;
    const rate = generalInflationPct / 100;
    return initialAnnualWithdrawal * Math.pow(1 + rate, yearsIntoRetirement);
}
