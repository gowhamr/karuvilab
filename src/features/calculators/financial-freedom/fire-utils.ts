import { FireInputs, FireResults, YearlyProjection } from './types';

export function calculateFire(inputs: FireInputs): FireResults {
  const years = Math.max(0, inputs.targetAge - inputs.currentAge);
  const inflation = inputs.expectedInflationRate / 100;
  const returnRate = inputs.expectedReturnRate / 100;
  const expenseGrowth = inputs.expenseGrowthRate / 100;
  const incomeGrowth = inputs.incomeGrowthRate / 100;
  const withdrawal = inputs.withdrawalRate / 100 || 0.04;

  // Calculate Target Corpus
  // Monthly expense at target age
  const targetMonthlyExpense = inputs.currentExpenses * Math.pow(1 + expenseGrowth, years);
  const annualExpenseAtRetirement = targetMonthlyExpense * 12;
  const targetCorpus = annualExpenseAtRetirement / withdrawal;

  const projections: YearlyProjection[] = [];
  let currentCorpus = inputs.currentCorpus;
  let currentAnnualIncome = inputs.currentIncome * 12;
  let currentAnnualExpense = inputs.currentExpenses * 12;
  let currentMonthlySip = inputs.monthlySip;
  let totalInvested = inputs.currentCorpus;
  let estimatedFreedomAge = -1;

  for (let year = 1; year <= 60; year++) {
    const age = inputs.currentAge + year;
    const startCorpus = currentCorpus;
    
    // Annual investment
    const annualInvestment = currentMonthlySip * 12;
    totalInvested += annualInvestment;
    
    // Calculate interest (simplified compounding yearly for the corpus + half-year for the SIP)
    // A more precise way: monthly compounding
    const monthlyRate = returnRate / 12;
    // FV of start corpus
    const endCorpusFromStart = startCorpus * Math.pow(1 + monthlyRate, 12);
    // FV of SIPs made during the year
    const endCorpusFromSip = currentMonthlySip * ((Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate);
    
    const endCorpus = endCorpusFromStart + endCorpusFromSip;
    const interestEarned = endCorpus - startCorpus - annualInvestment;

    const fireTargetForThisYear = (currentAnnualExpense * Math.pow(1 + expenseGrowth, year)) / withdrawal;
    const isFinanciallyFree = endCorpus >= fireTargetForThisYear;

    if (isFinanciallyFree && estimatedFreedomAge === -1) {
      estimatedFreedomAge = age;
    }

    projections.push({
      age,
      year,
      annualIncome: currentAnnualIncome,
      annualExpenses: currentAnnualExpense * Math.pow(1 + expenseGrowth, year - 1),
      startCorpus,
      totalInvested,
      interestEarned,
      endCorpus,
      isFinanciallyFree
    });

    currentCorpus = endCorpus;
    currentAnnualIncome *= (1 + incomeGrowth);
    
    // Note: this assumes SIP doesn't step up unless specified. 
    // We didn't include SIP step up in V1 types, so it's constant.
  }

  const projectedCorpus = (years > 0 ? projections[years - 1]?.endCorpus : undefined) ?? inputs.currentCorpus;
  const shortfallOrSurplus = projectedCorpus - targetCorpus;
  const yearsToFreedom = estimatedFreedomAge !== -1 ? estimatedFreedomAge - inputs.currentAge : -1;

  // Calculate required SIP (PMT formula)
  // We need to find the PMT such that FV(corpus) + FV(PMT) = targetCorpus
  const monthlyRate = returnRate / 12;
  const totalMonths = years * 12;
  let requiredMonthlySip = 0;

  if (years > 0 && monthlyRate > 0) {
    const fvCorpus = inputs.currentCorpus * Math.pow(1 + monthlyRate, totalMonths);
    const requiredFvFromSip = targetCorpus - fvCorpus;
    
    if (requiredFvFromSip > 0) {
      requiredMonthlySip = requiredFvFromSip * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }
  } else if (years > 0 && monthlyRate === 0) {
    requiredMonthlySip = Math.max(0, (targetCorpus - inputs.currentCorpus) / totalMonths);
  } else if (years === 0) {
    requiredMonthlySip = 0;
  }

  return {
    targetCorpus,
    targetMonthlyExpense,
    projectedCorpus,
    shortfallOrSurplus,
    requiredMonthlySip,
    estimatedFreedomAge,
    yearsToFreedom,
    projections
  };
}
