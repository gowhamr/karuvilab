/**
 * Financial Freedom Calculation Utilities
 * Backward-compatible entry point delegating directly to the pure projection engine.
 */

import { calculateProjection } from './engine/projection-engine';
import { FireInputs } from './models/assumptions';
import { FireResults } from './models/projection-types';

/**
 * Main calculation entry point for FIRE projections.
 */
export function calculateFire(inputs: Partial<FireInputs>, returnsOverride?: number[]): FireResults {
  return calculateProjection(inputs, returnsOverride);
}

export { calculateProjection } from './engine/projection-engine';
export { inflateAmount, calculateRealReturnRate, calculateCombinedAnnualExpenses } from './engine/inflation-engine';
export { projectMedicalExpense, calculateMedicalBuffer } from './engine/healthcare-engine';
export { calculateRequiredCorpus, calculateInitialAnnualWithdrawal, calculateAdjustedWithdrawal } from './engine/withdrawal-engine';
export { evaluateEventsForYear } from './engine/event-engine';
export { validateFireInputs, sanitizeFireInputs } from './validation/input-validation';
export { FixedSwrStrategy } from './strategies/fixed-swr';
