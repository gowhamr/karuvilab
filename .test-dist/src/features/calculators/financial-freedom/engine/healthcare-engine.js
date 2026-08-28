/**
 * Healthcare Engine
 * Models medical inflation escalation and segregated healthcare cost buffers over retirement timelines.
 */
import { inflateAmount } from './inflation-engine';
/**
 * Projects medical costs independently over a given horizon.
 */
export function projectMedicalExpense(baseMonthlyMedical, medicalInflationPct, years) {
    const annualAtTarget = inflateAmount(baseMonthlyMedical * 12, medicalInflationPct, years);
    return {
        monthlyAtTarget: annualAtTarget / 12,
        annualAtTarget
    };
}
/**
 * Computes a standalone emergency medical buffer needed at retirement
 * to withstand critical illness or accelerated medical inflation.
 */
export function calculateMedicalBuffer(baseMonthlyMedical, medicalInflationPct, yearsToRetirement, bufferMultiplierYears = 3) {
    if (baseMonthlyMedical <= 0)
        return 0;
    const annualAtRetirement = inflateAmount(baseMonthlyMedical * 12, medicalInflationPct, yearsToRetirement);
    return annualAtRetirement * bufferMultiplierYears;
}
