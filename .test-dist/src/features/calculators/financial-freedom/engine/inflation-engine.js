/**
 * Inflation Engine
 * Pure mathematical functions for compound inflation calculations, multi-rate compounding, and real return adjustments.
 */
/**
 * Inflate an amount over a given number of years at a specified annual rate.
 * Formula: Amount * (1 + rate)^years
 */
export function inflateAmount(baseAmount, annualRatePct, years) {
    if (years <= 0 || baseAmount <= 0)
        return baseAmount;
    const rate = annualRatePct / 100;
    return baseAmount * Math.pow(1 + rate, years);
}
/**
 * Compute the real (inflation-adjusted) rate of return using the Fisher Equation.
 * Real Rate = (1 + Nominal Rate) / (1 + Inflation Rate) - 1
 */
export function calculateRealReturnRate(nominalRatePct, inflationRatePct) {
    const r = nominalRatePct / 100;
    const i = inflationRatePct / 100;
    if (1 + i === 0)
        return 0;
    return ((1 + r) / (1 + i) - 1) * 100;
}
/**
 * Compute combined annual expenses accounting for separate general and medical inflation trajectories.
 */
export function calculateCombinedAnnualExpenses(monthlyGeneral, monthlyMedical, generalInflationPct, medicalInflationPct, years) {
    const generalAnnual = inflateAmount(monthlyGeneral * 12, generalInflationPct, years);
    const medicalAnnual = inflateAmount(monthlyMedical * 12, medicalInflationPct, years);
    return {
        totalAnnual: generalAnnual + medicalAnnual,
        generalAnnual,
        medicalAnnual
    };
}
