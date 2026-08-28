/**
 * Input Validation and Sanitization Layer
 * Enforces deterministic financial bounds, clamping, and data integrity.
 */
import { DEFAULT_FIRE_INPUTS } from '../models/assumptions';
export function validateFireInputs(inputs) {
    const errors = [];
    const currentAge = inputs.currentAge ?? DEFAULT_FIRE_INPUTS.currentAge;
    const targetAge = inputs.targetAge ?? DEFAULT_FIRE_INPUTS.targetAge;
    const traditionalRetirementAge = inputs.traditionalRetirementAge ?? DEFAULT_FIRE_INPUTS.traditionalRetirementAge;
    const longevityAge = inputs.longevityAge ?? DEFAULT_FIRE_INPUTS.longevityAge;
    if (currentAge < 10 || currentAge > 100) {
        errors.push('Current age must be between 10 and 100.');
    }
    if (targetAge < currentAge) {
        errors.push('Target FIRE age cannot be earlier than current age.');
    }
    if (targetAge > 100) {
        errors.push('Target FIRE age must be 100 or younger.');
    }
    if (traditionalRetirementAge < targetAge) {
        errors.push('Traditional retirement age must be greater than or equal to target age.');
    }
    if (longevityAge <= targetAge) {
        errors.push('Longevity age must be greater than target retirement age.');
    }
    if (longevityAge > 110) {
        errors.push('Longevity age cannot exceed 110.');
    }
    if ((inputs.currentExpenses ?? 0) < 0) {
        errors.push('Current expenses cannot be negative.');
    }
    if ((inputs.currentIncome ?? 0) < 0) {
        errors.push('Current income cannot be negative.');
    }
    if ((inputs.currentCorpus ?? 0) < 0) {
        errors.push('Current savings corpus cannot be negative.');
    }
    if ((inputs.monthlySip ?? 0) < 0) {
        errors.push('Monthly SIP cannot be negative.');
    }
    const swr = inputs.withdrawalRate ?? DEFAULT_FIRE_INPUTS.withdrawalRate;
    if (swr < 0.5 || swr > 20) {
        errors.push('Withdrawal rate must be between 0.5% and 20%.');
    }
    const expReturn = inputs.expectedReturnRate ?? DEFAULT_FIRE_INPUTS.expectedReturnRate;
    if (expReturn < -20 || expReturn > 60) {
        errors.push('Expected return rate must be between -20% and 60%.');
    }
    const inflation = inputs.expectedInflationRate ?? DEFAULT_FIRE_INPUTS.expectedInflationRate;
    if (inflation < -10 || inflation > 40) {
        errors.push('Inflation rate must be between -10% and 40%.');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
export function sanitizeFireInputs(inputs) {
    const currentAge = Math.max(10, Math.min(95, inputs.currentAge ?? DEFAULT_FIRE_INPUTS.currentAge));
    const targetAge = Math.max(currentAge, Math.min(100, inputs.targetAge ?? DEFAULT_FIRE_INPUTS.targetAge));
    const traditionalRetirementAge = Math.max(targetAge, Math.min(105, inputs.traditionalRetirementAge ?? DEFAULT_FIRE_INPUTS.traditionalRetirementAge));
    const longevityAge = Math.max(targetAge + 1, Math.min(110, inputs.longevityAge ?? DEFAULT_FIRE_INPUTS.longevityAge ?? 85));
    const currentExpenses = Math.max(0, inputs.currentExpenses ?? DEFAULT_FIRE_INPUTS.currentExpenses);
    const currentIncome = Math.max(0, inputs.currentIncome ?? DEFAULT_FIRE_INPUTS.currentIncome);
    const currentMedicalExpenses = Math.max(0, inputs.currentMedicalExpenses ?? DEFAULT_FIRE_INPUTS.currentMedicalExpenses ?? 0);
    const currentCorpus = Math.max(0, inputs.currentCorpus ?? DEFAULT_FIRE_INPUTS.currentCorpus);
    const monthlySip = Math.max(0, inputs.monthlySip ?? DEFAULT_FIRE_INPUTS.monthlySip);
    const expectedReturnRate = inputs.expectedReturnRate ?? DEFAULT_FIRE_INPUTS.expectedReturnRate;
    // If retirementReturnRate is not explicitly provided, default to expectedReturnRate
    const retirementReturnRate = inputs.retirementReturnRate ?? expectedReturnRate;
    const expectedInflationRate = inputs.expectedInflationRate ?? DEFAULT_FIRE_INPUTS.expectedInflationRate;
    // If healthcareInflationRate is not explicitly provided, default to expectedInflationRate
    const healthcareInflationRate = inputs.healthcareInflationRate ?? expectedInflationRate;
    const incomeGrowthRate = inputs.incomeGrowthRate ?? DEFAULT_FIRE_INPUTS.incomeGrowthRate;
    const expenseGrowthRate = inputs.expenseGrowthRate ?? DEFAULT_FIRE_INPUTS.expenseGrowthRate;
    const withdrawalRate = Math.max(0.5, Math.min(15, inputs.withdrawalRate ?? DEFAULT_FIRE_INPUTS.withdrawalRate));
    const fireVariant = inputs.fireVariant ?? DEFAULT_FIRE_INPUTS.fireVariant;
    const leanMultiplier = Math.max(0.1, Math.min(1.0, inputs.leanMultiplier ?? DEFAULT_FIRE_INPUTS.leanMultiplier ?? 0.7));
    const fatMultiplier = Math.max(1.0, Math.min(5.0, inputs.fatMultiplier ?? DEFAULT_FIRE_INPUTS.fatMultiplier ?? 1.5));
    const baristaMonthlyIncome = Math.max(0, inputs.baristaMonthlyIncome ?? DEFAULT_FIRE_INPUTS.baristaMonthlyIncome ?? 15000);
    const events = (inputs.events || []).map(evt => ({
        ...evt,
        amount: Math.max(0, evt.amount),
        durationYears: evt.isRecurring ? Math.max(1, evt.durationYears || 1) : 1
    }));
    return {
        currentAge,
        targetAge,
        traditionalRetirementAge,
        longevityAge,
        currentIncome,
        currentExpenses,
        currentMedicalExpenses,
        currentCorpus,
        monthlySip,
        expectedReturnRate,
        retirementReturnRate,
        expectedInflationRate,
        healthcareInflationRate,
        incomeGrowthRate,
        expenseGrowthRate,
        withdrawalRate,
        fireVariant,
        leanMultiplier,
        fatMultiplier,
        baristaMonthlyIncome,
        events
    };
}
