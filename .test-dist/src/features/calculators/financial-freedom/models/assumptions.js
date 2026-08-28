/**
 * FIRE Assumptions and Inputs
 * Supports both legacy parameters and enhanced Phase 1 capabilities (Dual-phase returns, Dynamic SWR, Healthcare inflation, Longevity, Events).
 */
export const DEFAULT_FIRE_INPUTS = {
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
