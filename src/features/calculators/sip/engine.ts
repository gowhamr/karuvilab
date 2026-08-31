import {
  SipCalculationInput,
  SipCalculationResult,
  SipCalculationResponse,
  SipYearlyProjection,
} from './types';

export function formatCurrency(
  val: number,
  locale = 'en-IN',
  currency = 'INR'
): string {
  if (!isFinite(val)) return '₹0';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(val));
}

export function formatNumber(val: number, maxDecimals = 2): string {
  if (!isFinite(val)) return '0';
  return Number(val.toFixed(maxDecimals)).toLocaleString('en-US', {
    maximumFractionDigits: maxDecimals,
  });
}

/**
 * Standard SIP Annuity Due Future Value calculation:
 * FV = P * [((1 + i)^n - 1) / i] * (1 + i)
 */
export function calculateSipFutureValue(
  monthlyAmount: number,
  annualRatePercent: number,
  months: number
): number {
  if (months <= 0 || monthlyAmount <= 0) return 0;
  if (annualRatePercent === 0) return monthlyAmount * months;

  const monthlyRate = annualRatePercent / 12 / 100;
  const growthFactor = Math.pow(1 + monthlyRate, months);
  return monthlyAmount * ((growthFactor - 1) / monthlyRate) * (1 + monthlyRate);
}

/**
 * Pure Deterministic SIP Engine with step-up compounding, lumpsum support,
 * inflation adjustment, expense ratio adjustment, and yearly projections.
 */
export function calculateDeterministicSip(
  input: SipCalculationInput
): SipCalculationResponse {
  const {
    monthlyInvestment,
    expectedAnnualReturn,
    timeHorizonYears,
    annualStepUpPercent = 0,
    lumpsumAmount = 0,
    annualInflationRate = 0,
    capitalGainsTaxRate = 0,
    expenseRatio = 0,
  } = input;

  if (isNaN(monthlyInvestment) || monthlyInvestment < 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_MONTHLY_INVESTMENT',
        message: 'Monthly investment must be greater than or equal to 0.',
      },
    };
  }

  if (isNaN(lumpsumAmount) || lumpsumAmount < 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_LUMPSUM',
        message: 'Lumpsum amount cannot be negative.',
      },
    };
  }

  if (monthlyInvestment === 0 && lumpsumAmount === 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_MONTHLY_INVESTMENT',
        message: 'At least one of monthly investment or lumpsum amount must be greater than 0.',
      },
    };
  }

  if (isNaN(expectedAnnualReturn) || expectedAnnualReturn < 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_RETURN_RATE',
        message: 'Expected annual return rate cannot be negative.',
      },
    };
  }

  if (isNaN(timeHorizonYears) || timeHorizonYears <= 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_TIME_HORIZON',
        message: 'Investment duration must be at least 1 year.',
      },
    };
  }

  if (isNaN(annualStepUpPercent) || annualStepUpPercent < 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_STEP_UP',
        message: 'Annual step-up rate cannot be negative.',
      },
    };
  }

  if (
    monthlyInvestment > 100000000 ||
    lumpsumAmount > 10000000000 ||
    expectedAnnualReturn > 100 ||
    timeHorizonYears > 60
  ) {
    return {
      success: false,
      error: {
        code: 'OUT_OF_BOUNDS_INPUT',
        message: 'Inputs exceed standard maximum bounds (Monthly SIP ≤ 10Cr, Lumpsum ≤ 1000Cr, Rate ≤ 100%, Tenure ≤ 60 years).',
      },
    };
  }

  const effectiveAnnualReturn = Math.max(0, expectedAnnualReturn - expenseRatio);
  const monthlyRate = effectiveAnnualReturn / 12 / 100;
  const growthMultiplier = 1 + monthlyRate;

  let balance = lumpsumAmount;
  let cumulativeInvested = lumpsumAmount;
  let cumulativeInterest = 0;
  let currentMonthly = monthlyInvestment;

  const projections: SipYearlyProjection[] = [];

  for (let year = 1; year <= timeHorizonYears; year++) {
    const openingBalance = balance;
    let annualContribution = 0;

    for (let month = 0; month < 12; month++) {
      if (monthlyRate > 0) {
        balance = (balance + currentMonthly) * growthMultiplier;
      } else {
        balance += currentMonthly;
      }
      annualContribution += currentMonthly;
    }

    cumulativeInvested += annualContribution;
    const interestEarnedThisYear = balance - openingBalance - annualContribution;
    cumulativeInterest += interestEarnedThisYear;

    const inflationFactor = Math.pow(1 + annualInflationRate / 100, year);
    const inflationAdjustedBalance = inflationFactor > 0 ? balance / inflationFactor : balance;

    projections.push({
      year,
      openingBalance: Math.round(openingBalance * 100) / 100,
      monthlyAmount: Math.round(currentMonthly * 100) / 100,
      annualContribution: Math.round(annualContribution * 100) / 100,
      cumulativeInvested: Math.round(cumulativeInvested * 100) / 100,
      interestEarnedThisYear: Math.round(interestEarnedThisYear * 100) / 100,
      cumulativeInterest: Math.round(cumulativeInterest * 100) / 100,
      endingBalance: Math.round(balance * 100) / 100,
      inflationAdjustedBalance: Math.round(inflationAdjustedBalance * 100) / 100,
    });

    if (annualStepUpPercent > 0) {
      currentMonthly = currentMonthly * (1 + annualStepUpPercent / 100);
    }
  }

  const totalInvested = Math.round(cumulativeInvested * 100) / 100;
  const futureValue = Math.round(balance * 100) / 100;
  const totalGains = Math.max(0, Math.round((futureValue - totalInvested) * 100) / 100);
  const netGains = Math.round(totalGains * (1 - Math.min(100, Math.max(0, capitalGainsTaxRate)) / 100) * 100) / 100;
  const netFutureValue = Math.round((totalInvested + netGains) * 100) / 100;

  const totalInflationFactor = Math.pow(1 + annualInflationRate / 100, timeHorizonYears);
  const realFutureValue = totalInflationFactor > 0
    ? Math.round((netFutureValue / totalInflationFactor) * 100) / 100
    : netFutureValue;

  const wealthMultiplier = totalInvested > 0
    ? Math.round((futureValue / totalInvested) * 100) / 100
    : 0;

  const formula = annualStepUpPercent > 0
    ? `FV = Σ [ P × (1 + ${annualStepUpPercent}%)^(y-1) × ((1 + r)^12 - 1)/r × (1+r) ] + Lumpsum × (1 + r)^${timeHorizonYears * 12}`
    : `FV = P × [((1 + r)^${timeHorizonYears * 12} - 1) / r] × (1 + r) = ${formatCurrency(futureValue)}`;

  return {
    success: true,
    data: {
      monthlyInvestment,
      expectedAnnualReturn,
      timeHorizonYears,
      annualStepUpPercent,
      lumpsumAmount,
      annualInflationRate,
      capitalGainsTaxRate,
      expenseRatio,
      effectiveAnnualReturn,
      totalInvested,
      totalGains,
      futureValue,
      netGains,
      netFutureValue,
      realFutureValue,
      wealthMultiplier,
      formula,
      formattedMonthlyInvestment: formatCurrency(monthlyInvestment),
      formattedTotalInvested: formatCurrency(totalInvested),
      formattedTotalGains: formatCurrency(totalGains),
      formattedFutureValue: formatCurrency(futureValue),
      formattedNetFutureValue: formatCurrency(netFutureValue),
      formattedRealFutureValue: formatCurrency(realFutureValue),
      projections,
    },
  };
}
