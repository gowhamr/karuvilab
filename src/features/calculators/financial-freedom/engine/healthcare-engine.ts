/**
 * Healthcare Engine
 * Models medical inflation escalation and segregated healthcare cost buffers over retirement timelines.
 */

import { inflateAmount } from './inflation-engine';

/**
 * Projects medical costs independently over a given horizon.
 */
export function projectMedicalExpense(
  baseMonthlyMedical: number,
  medicalInflationPct: number,
  years: number
): {
  monthlyAtTarget: number;
  annualAtTarget: number;
} {
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
export function calculateMedicalBuffer(
  baseMonthlyMedical: number,
  medicalInflationPct: number,
  yearsToRetirement: number,
  bufferMultiplierYears: number = 3
): number {
  if (baseMonthlyMedical <= 0) return 0;
  const annualAtRetirement = inflateAmount(baseMonthlyMedical * 12, medicalInflationPct, yearsToRetirement);
  return annualAtRetirement * bufferMultiplierYears;
}
