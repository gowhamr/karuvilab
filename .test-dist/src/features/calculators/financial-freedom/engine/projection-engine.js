/**
 * Deterministic FIRE Projection Engine
 * Pure mathematical core for multi-phase compounding, life events, dual return rates, and retirement cash flows.
 */
import { sanitizeFireInputs } from '../validation/input-validation';
import { inflateAmount } from './inflation-engine';
import { evaluateEventsForYear } from './event-engine';
export function calculateProjection(rawInputs, returnsOverride) {
    const inputs = sanitizeFireInputs(rawInputs);
    const yearsToTarget = Math.max(0, inputs.targetAge - inputs.currentAge);
    const generalInflation = inputs.expectedInflationRate / 100;
    const healthcareInflation = (inputs.healthcareInflationRate ?? inputs.expectedInflationRate) / 100;
    const accumulationReturn = inputs.expectedReturnRate / 100;
    const retirementReturn = (inputs.retirementReturnRate ?? inputs.expectedReturnRate) / 100;
    const expenseGrowth = inputs.expenseGrowthRate / 100;
    const incomeGrowth = inputs.incomeGrowthRate / 100;
    const withdrawalRateFraction = Math.max(0.005, inputs.withdrawalRate / 100);
    // 1. Calculate base living expenses at current age according to FIRE variant
    let baseGeneralExpense = inputs.currentExpenses;
    const baseMedicalExpense = inputs.currentMedicalExpenses ?? 0;
    if (inputs.fireVariant === 'lean') {
        baseGeneralExpense *= (inputs.leanMultiplier ?? 0.7);
    }
    else if (inputs.fireVariant === 'fat') {
        baseGeneralExpense *= (inputs.fatMultiplier ?? 1.5);
    }
    else if (inputs.fireVariant === 'barista') {
        baseGeneralExpense = Math.max(0, baseGeneralExpense - (inputs.baristaMonthlyIncome ?? 15000));
    }
    // Coast FIRE involves a different timeline for expense calculation
    const retirementAge = inputs.fireVariant === 'coast' ? inputs.traditionalRetirementAge : inputs.targetAge;
    const yearsToRetirement = Math.max(0, retirementAge - inputs.currentAge);
    const targetMonthlyGeneral = inflateAmount(baseGeneralExpense, inputs.expenseGrowthRate, yearsToRetirement);
    const targetMonthlyMedical = inflateAmount(baseMedicalExpense, inputs.healthcareInflationRate ?? inputs.expectedInflationRate, yearsToRetirement);
    const targetMonthlyExpenseAtRetirement = targetMonthlyGeneral + targetMonthlyMedical;
    const annualExpenseAtRetirement = targetMonthlyExpenseAtRetirement * 12;
    // 2. Final Required Corpus at Actual Retirement Age
    const corpusNeededAtRetirement = annualExpenseAtRetirement / withdrawalRateFraction;
    // 3. Target Corpus at Target Age (Discounted back for Coast FIRE)
    let targetCorpus = corpusNeededAtRetirement;
    if (inputs.fireVariant === 'coast' && inputs.traditionalRetirementAge > inputs.targetAge) {
        const coastingYears = inputs.traditionalRetirementAge - inputs.targetAge;
        // Compounded growth during coasting phase with accumulation return
        targetCorpus = corpusNeededAtRetirement / Math.pow(1 + accumulationReturn, coastingYears);
    }
    // 4. Calculate Required Monthly SIP to hit Target Corpus
    let requiredMonthlySip = 0;
    if (yearsToTarget > 0) {
        const monthlyAccRate = accumulationReturn / 12;
        const totalMonths = yearsToTarget * 12;
        const fvExistingCorpus = inputs.currentCorpus * Math.pow(1 + monthlyAccRate, totalMonths);
        const shortfall = targetCorpus - fvExistingCorpus;
        if (shortfall > 0) {
            if (monthlyAccRate > 0) {
                requiredMonthlySip = (shortfall * monthlyAccRate) / (Math.pow(1 + monthlyAccRate, totalMonths) - 1);
            }
            else {
                requiredMonthlySip = shortfall / totalMonths;
            }
        }
    }
    else if (inputs.currentCorpus < targetCorpus) {
        requiredMonthlySip = targetCorpus - inputs.currentCorpus;
    }
    // 5. Build Year-by-Year Projections up to Longevity Age
    const projections = [];
    const currentCalendarYear = new Date().getFullYear();
    const totalProjectionYears = Math.max(1, (inputs.longevityAge ?? 85) - inputs.currentAge);
    let currentCorpus = inputs.currentCorpus;
    let runningTotalInvested = inputs.currentCorpus;
    let estimatedFreedomAge = -1;
    let depletionAge = null;
    let corpusAtTargetAge = inputs.currentCorpus;
    let corpusAtRetirement = inputs.currentCorpus;
    let totalEventsApplied = 0;
    // Initial retirement withdrawal baseline
    let initialAnnualWithdrawal = 0;
    for (let year = 1; year <= totalProjectionYears; year++) {
        const age = inputs.currentAge + year;
        const isAccumulation = age <= inputs.targetAge;
        const phase = isAccumulation ? 'accumulation' : 'retirement';
        let activeReturnRate = isAccumulation ? accumulationReturn : retirementReturn;
        if (returnsOverride && returnsOverride.length >= year && returnsOverride[year - 1] !== undefined) {
            activeReturnRate = returnsOverride[year - 1];
        }
        const monthlyReturnRate = activeReturnRate / 12;
        const startCorpus = Math.max(0, currentCorpus);
        // Evaluate life events for this year
        const eventCashFlow = evaluateEventsForYear(inputs.events, inputs.currentAge, age, year, inputs.expectedInflationRate);
        if (eventCashFlow.activeEvents.length > 0) {
            totalEventsApplied += eventCashFlow.activeEvents.length;
        }
        // Determine annual income and living expenses
        const annualIncome = isAccumulation
            ? inputs.currentIncome * 12 * Math.pow(1 + incomeGrowth, year - 1)
            : (inputs.fireVariant === 'barista' ? (inputs.baristaMonthlyIncome ?? 0) * 12 : 0);
        const generalExpenses = inflateAmount(inputs.currentExpenses * 12, inputs.expenseGrowthRate, year - 1);
        const medicalExpenses = inflateAmount((inputs.currentMedicalExpenses ?? 0) * 12, inputs.healthcareInflationRate ?? inputs.expectedInflationRate, year - 1);
        const totalAnnualExpenses = generalExpenses + medicalExpenses;
        // Investment contributions
        let annualInvestment = 0;
        let endCorpusFromSip = 0;
        if (isAccumulation) {
            // Normal accumulation SIP contribution
            annualInvestment = inputs.monthlySip * 12;
            if (monthlyReturnRate > 0) {
                endCorpusFromSip = inputs.monthlySip * ((Math.pow(1 + monthlyReturnRate, 12) - 1) / monthlyReturnRate);
            }
            else {
                endCorpusFromSip = annualInvestment;
            }
        }
        else if (inputs.fireVariant === 'coast' && age <= inputs.traditionalRetirementAge) {
            // Coast FIRE: stop investing after target age, let corpus compound
            annualInvestment = 0;
            endCorpusFromSip = 0;
        }
        runningTotalInvested += annualInvestment;
        // Determine annual withdrawal in retirement
        let annualWithdrawal = 0;
        let taxPaid = 0;
        if (!isAccumulation) {
            if (initialAnnualWithdrawal === 0) {
                initialAnnualWithdrawal = startCorpus * withdrawalRateFraction;
            }
            const yearsIntoRetirement = age - inputs.targetAge;
            // Withdraw inflation-adjusted living expenses / initial withdrawal
            const desiredNetWithdrawal = inflateAmount(initialAnnualWithdrawal, inputs.expectedInflationRate, yearsIntoRetirement - 1);
            const taxRate = (inputs.taxRate ?? 0) / 100;
            if (inputs.taxStrategy === 'flat_on_withdrawal' && taxRate > 0) {
                annualWithdrawal = desiredNetWithdrawal / Math.max(0.01, (1 - taxRate));
                taxPaid = annualWithdrawal - desiredNetWithdrawal;
            }
            else if (inputs.taxStrategy === 'gains_approximation' && taxRate > 0 && startCorpus > 0) {
                const gainsRatio = startCorpus > runningTotalInvested ? (startCorpus - runningTotalInvested) / startCorpus : 0;
                const effectiveTaxRate = gainsRatio * taxRate;
                annualWithdrawal = desiredNetWithdrawal / Math.max(0.01, (1 - effectiveTaxRate));
                taxPaid = annualWithdrawal - desiredNetWithdrawal;
            }
            else {
                annualWithdrawal = desiredNetWithdrawal;
            }
        }
        if (annualWithdrawal > 0 && startCorpus > 0) {
            const reductionRatio = Math.min(1, annualWithdrawal / startCorpus);
            runningTotalInvested -= (runningTotalInvested * reductionRatio);
        }
        // Compound start corpus over 12 months
        const endCorpusFromStart = startCorpus * Math.pow(1 + monthlyReturnRate, 12);
        // Net cash flow from events and withdrawals
        const netEventAdjustment = eventCashFlow.totalInflows - eventCashFlow.totalOutflows;
        const netCashFlow = annualInvestment + eventCashFlow.totalInflows - eventCashFlow.totalOutflows - annualWithdrawal;
        let endCorpus = endCorpusFromStart + endCorpusFromSip + netEventAdjustment - annualWithdrawal;
        if (endCorpus < 0) {
            endCorpus = 0;
        }
        const returnsEarned = Math.max(0, endCorpus - startCorpus - netCashFlow);
        // Target corpus required at this specific age
        let targetGeneralAtAge = inputs.currentExpenses;
        if (inputs.fireVariant === 'lean')
            targetGeneralAtAge *= (inputs.leanMultiplier ?? 0.7);
        else if (inputs.fireVariant === 'fat')
            targetGeneralAtAge *= (inputs.fatMultiplier ?? 1.5);
        else if (inputs.fireVariant === 'barista')
            targetGeneralAtAge = Math.max(0, targetGeneralAtAge - (inputs.baristaMonthlyIncome ?? 0));
        const totalExpenseAtAge = inflateAmount(targetGeneralAtAge * 12, inputs.expenseGrowthRate, year) +
            inflateAmount((inputs.currentMedicalExpenses ?? 0) * 12, inputs.healthcareInflationRate ?? inputs.expectedInflationRate, year);
        let targetAtAge = totalExpenseAtAge / withdrawalRateFraction;
        if (inputs.fireVariant === 'coast' && age < inputs.traditionalRetirementAge) {
            const coastYearsRemaining = inputs.traditionalRetirementAge - age;
            const expenseAtTraditional = (inflateAmount(targetGeneralAtAge * 12, inputs.expenseGrowthRate, yearsToRetirement) +
                inflateAmount((inputs.currentMedicalExpenses ?? 0) * 12, inputs.healthcareInflationRate ?? inputs.expectedInflationRate, yearsToRetirement));
            const corpusAtTraditional = expenseAtTraditional / withdrawalRateFraction;
            targetAtAge = corpusAtTraditional / Math.pow(1 + accumulationReturn, coastYearsRemaining);
        }
        const isFinanciallyFree = endCorpus >= targetAtAge;
        if (isFinanciallyFree && estimatedFreedomAge === -1) {
            estimatedFreedomAge = age;
        }
        if (endCorpus === 0 && startCorpus > 0 && depletionAge === null && !isAccumulation) {
            depletionAge = age;
        }
        if (age === inputs.targetAge) {
            corpusAtTargetAge = endCorpus;
        }
        if (age === inputs.traditionalRetirementAge) {
            corpusAtRetirement = endCorpus;
        }
        projections.push({
            age,
            year,
            calendarYear: currentCalendarYear + year,
            phase,
            annualIncome,
            annualExpenses: totalAnnualExpenses,
            generalExpenses,
            medicalExpenses,
            startCorpus,
            totalInvested: runningTotalInvested,
            annualInvestment,
            returnsEarned,
            interestEarned: returnsEarned,
            effectiveReturnRate: Math.round(activeReturnRate * 10000) / 100,
            annualWithdrawal,
            taxPaid,
            eventInflows: eventCashFlow.totalInflows,
            eventOutflows: eventCashFlow.totalOutflows,
            netCashFlow,
            endCorpus,
            targetCorpusNeeded: targetAtAge,
            isFinanciallyFree,
            hasDepleted: endCorpus === 0
        });
        currentCorpus = endCorpus;
    }
    const projectedCorpus = corpusAtTargetAge;
    const shortfallOrSurplus = projectedCorpus - targetCorpus;
    const freedomRatio = targetCorpus > 0 ? (projectedCorpus / targetCorpus) * 100 : 100;
    const isAchievable = projectedCorpus >= targetCorpus || (estimatedFreedomAge !== -1 && estimatedFreedomAge <= inputs.targetAge);
    const yearsToFreedom = estimatedFreedomAge !== -1 ? Math.max(0, estimatedFreedomAge - inputs.currentAge) : -1;
    return {
        targetCorpus,
        projectedCorpus,
        shortfallOrSurplus,
        requiredMonthlySip: Math.max(0, requiredMonthlySip),
        estimatedFreedomAge,
        yearsToFreedom,
        targetMonthlyExpense: targetMonthlyExpenseAtRetirement,
        initialAnnualWithdrawal: initialAnnualWithdrawal || (targetCorpus * withdrawalRateFraction),
        corpusAtTargetAge,
        corpusAtRetirement,
        freedomRatio: Math.min(999, freedomRatio),
        isAchievable,
        depletionAge,
        projections,
        eventsApplied: totalEventsApplied
    };
}
