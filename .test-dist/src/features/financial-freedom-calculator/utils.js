import { MAX_AGE } from './constants';
export function calculateFIRE(inputs) {
    const { currentAge, retirementAge, currentSavings, monthlyIncome, monthlyExpenses, expectedAnnualReturn, safeWithdrawalRate, inflationRate, annualIncomeGrowth, postRetirementReturn, } = inputs;
    const actualMonthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const annualReturnRate = expectedAnnualReturn / 100;
    const monthlyReturnRate = annualReturnRate / 12;
    const inflation = inflationRate / 100;
    const safeWithdrawal = safeWithdrawalRate / 100;
    const incomeGrowth = annualIncomeGrowth / 100;
    const postRetirementRate = postRetirementReturn / 100;
    // Parse windfalls
    const windfalls = inputs.oneTimeWindfalls
        .split(',')
        .map(s => parseFloat(s.trim()))
        .filter(n => !isNaN(n) && n > 0);
    const totalWindfall = windfalls.reduce((sum, val) => sum + val, 0);
    // Future Expenses at retirement age (adjusted for inflation)
    const annualExpensesToday = monthlyExpenses * 12;
    const futureAnnualExpenses = annualExpensesToday * Math.pow(1 + inflation, yearsToRetirement);
    // Required Corpus based on future expenses and safe withdrawal rate
    const requiredCorpus = futureAnnualExpenses / safeWithdrawal;
    const isDeficit = monthlyExpenses > monthlyIncome;
    if (isDeficit) {
        const projections = [];
        const currentYear = new Date().getFullYear();
        const currentBalance = currentSavings + totalWindfall;
        for (let age = currentAge; age <= MAX_AGE; age++) {
            const yearIndex = age - currentAge;
            const yearlyFutureExpenses = annualExpensesToday * Math.pow(1 + inflation, yearIndex);
            const yearlyTargetCorpus = yearlyFutureExpenses / safeWithdrawal;
            projections.push({
                age,
                year: currentYear + yearIndex,
                netWorth: currentBalance, // No growth, halted calculation
                contributions: currentBalance,
                interest: 0,
                withdrawal: 0,
                targetCorpus: Math.round(yearlyTargetCorpus)
            });
        }
        return {
            requiredCorpus: Math.round(requiredCorpus),
            yearsToFI: -1,
            monthlySavingsNeeded: 0,
            monthlySavingsShortfall: 0,
            actualMonthlySavings: 0,
            projectedRetirementCorpus: currentBalance,
            isAchievable: false,
            projections
        };
    }
    let currentBalance = currentSavings + totalWindfall;
    let corpusAtRetirement = currentBalance;
    let currentMonthlyIncome = monthlyIncome;
    let currentMonthlyExpenses = monthlyExpenses;
    let accumulatedContributions = currentSavings + totalWindfall;
    const projections = [];
    const currentYear = new Date().getFullYear();
    let fiAge = -1;
    const targetCorpusAtAge = requiredCorpus; // This is the corpus needed at retirement age
    for (let age = currentAge; age <= MAX_AGE; age++) {
        const yearIndex = age - currentAge;
        const isRetired = age >= retirementAge;
        // Yearly inflation adjusted target corpus if they were to retire this year
        const yearlyFutureExpenses = annualExpensesToday * Math.pow(1 + inflation, yearIndex);
        const yearlyTargetCorpus = yearlyFutureExpenses / safeWithdrawal;
        let yearlyContribution = 0;
        let yearlyWithdrawal = 0;
        let interestEarned = 0;
        if (!isRetired) {
            // Accumulation phase
            const actualSavings = Math.max(0, currentMonthlyIncome - currentMonthlyExpenses);
            yearlyContribution = actualSavings * 12;
            // Calculate compound interest for the year with monthly contributions
            let balanceForYear = currentBalance;
            let yearlyInterest = 0;
            for (let m = 0; m < 12; m++) {
                const monthlyInterest = balanceForYear * monthlyReturnRate;
                yearlyInterest += monthlyInterest;
                balanceForYear += monthlyInterest + actualSavings;
            }
            interestEarned = yearlyInterest;
            currentBalance = balanceForYear;
            accumulatedContributions += yearlyContribution;
            corpusAtRetirement = currentBalance;
            // Apply annual growth and inflation at the end of the year
            currentMonthlyIncome *= (1 + incomeGrowth);
            currentMonthlyExpenses *= (1 + inflation);
        }
        else {
            // Drawdown phase
            // Based on withdrawal strategy, we could adjust. For now, simple constant rule adjusted for inflation
            const withdrawalAmount = yearlyFutureExpenses; // Need to withdraw enough to cover expenses
            yearlyWithdrawal = withdrawalAmount;
            // Interest earned during retirement
            interestEarned = currentBalance * postRetirementRate;
            currentBalance = currentBalance + interestEarned - yearlyWithdrawal;
            if (currentBalance < 0)
                currentBalance = 0; // Can't have negative balance
        }
        if (currentBalance >= yearlyTargetCorpus && fiAge === -1) {
            fiAge = age;
        }
        projections.push({
            age,
            year: currentYear + yearIndex,
            netWorth: Math.round(currentBalance),
            contributions: Math.round(accumulatedContributions),
            interest: Math.round(interestEarned),
            withdrawal: Math.round(yearlyWithdrawal),
            targetCorpus: Math.round(yearlyTargetCorpus)
        });
    }
    const projectedRetirementCorpus = corpusAtRetirement;
    // Calculate required monthly savings to reach requiredCorpus in yearsToRetirement
    // PMT formula: P = (r * FV) / ((1 + r)^n - 1)
    // We need to account for current savings future value first
    const currentSavingsFV = (currentSavings + totalWindfall) * Math.pow(1 + monthlyReturnRate, yearsToRetirement * 12);
    const shortfallCorpus = Math.max(0, requiredCorpus - currentSavingsFV);
    let monthlySavingsNeeded = 0;
    if (shortfallCorpus > 0 && yearsToRetirement > 0 && monthlyReturnRate > 0) {
        const months = yearsToRetirement * 12;
        monthlySavingsNeeded = (shortfallCorpus * monthlyReturnRate) / (Math.pow(1 + monthlyReturnRate, months) - 1);
    }
    else if (shortfallCorpus > 0 && yearsToRetirement > 0) {
        monthlySavingsNeeded = shortfallCorpus / (yearsToRetirement * 12);
    }
    const yearsToFI = fiAge !== -1 ? Math.max(0, fiAge - currentAge) : -1;
    return {
        requiredCorpus: Math.round(requiredCorpus),
        yearsToFI,
        monthlySavingsNeeded: Math.round(monthlySavingsNeeded),
        monthlySavingsShortfall: Math.round(monthlySavingsNeeded - actualMonthlySavings),
        actualMonthlySavings: Math.round(actualMonthlySavings),
        projectedRetirementCorpus: Math.round(projectedRetirementCorpus),
        isAchievable: projectedRetirementCorpus >= requiredCorpus,
        projections
    };
}
