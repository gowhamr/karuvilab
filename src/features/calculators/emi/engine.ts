import {
  EmiCalculationInput,
  EmiCalculationResult,
  EmiCalculationResponse,
  MonthlyAmortizationEntry,
  YearlyAmortizationEntry,
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
 * Standard Reducing Balance EMI formula:
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateEmi(principal: number, annualRatePercent: number, tenureMonths: number): number {
  if (isNaN(principal) || isNaN(annualRatePercent) || isNaN(tenureMonths) || tenureMonths <= 0) return 0;
  if (annualRatePercent === 0) return principal / tenureMonths;

  const monthlyRate = annualRatePercent / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Pure Deterministic EMI Engine with complete month-by-month and year-by-year amortization schedules.
 */
export function calculateDeterministicEmi(
  input: EmiCalculationInput
): EmiCalculationResponse {
  const {
    loanAmount,
    annualInterestRate,
    tenureMonths,
    prepayments = [],
    recurringPrepayment,
    moratorium,
    floatingRateDelta = 0,
  } = input;

  if (isNaN(loanAmount) || loanAmount <= 0) {
    return {
      success: false,
      error: { code: 'INVALID_LOAN_AMOUNT', message: 'Loan amount must be greater than zero.' },
    };
  }

  if (isNaN(annualInterestRate) || annualInterestRate < 0) {
    return {
      success: false,
      error: { code: 'INVALID_INTEREST_RATE', message: 'Interest rate cannot be negative.' },
    };
  }

  if (isNaN(tenureMonths) || tenureMonths <= 0) {
    return {
      success: false,
      error: { code: 'INVALID_TENURE', message: 'Tenure must be at least 1 month.' },
    };
  }

  if (loanAmount > 1000000000 || annualInterestRate > 50 || tenureMonths > 600) {
    return {
      success: false,
      error: {
        code: 'OUT_OF_BOUNDS_INPUT',
        message: 'Inputs exceed standard maximum bounds (Loan ≤ 100Cr, Rate ≤ 50%, Tenure ≤ 50 years).',
      },
    };
  }

  const effectiveRate = Math.max(0, annualInterestRate + floatingRateDelta);
  const monthlyRate = effectiveRate / 12 / 100;
  const baseMonthlyEmi = calculateEmi(loanAmount, effectiveRate, tenureMonths);

  let balance = loanAmount;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;
  const monthlySchedule: MonthlyAmortizationEntry[] = [];
  
  let currentMonth = 1;
  const maxSafetyMonths = tenureMonths * 2 + 120; // Bound loop execution safely

  while (balance > 0.01 && currentMonth <= maxSafetyMonths) {
    let interestThisMonth = balance * monthlyRate;
    let principalThisMonth = 0;
    let prepaymentThisMonth = 0;
    let emiThisMonth = baseMonthlyEmi;

    // Handle Moratorium
    if (moratorium && currentMonth <= moratorium.months) {
      if (moratorium.type === 'interest-only') {
        emiThisMonth = interestThisMonth;
        principalThisMonth = 0;
      } else {
        // Full moratorium: interest is capitalized into balance
        emiThisMonth = 0;
        principalThisMonth = 0;
        balance += interestThisMonth;
        interestThisMonth = 0;
      }
    } else {
      principalThisMonth = emiThisMonth - interestThisMonth;

      // Handle Prepayments
      const oneTimePrep = prepayments.find(p => p.month === currentMonth)?.amount || 0;
      const recPrep = (recurringPrepayment && currentMonth >= recurringPrepayment.startMonth)
        ? recurringPrepayment.amount
        : 0;

      prepaymentThisMonth = oneTimePrep + recPrep;

      // Bound payments to remaining balance
      if (principalThisMonth + prepaymentThisMonth > balance) {
        prepaymentThisMonth = Math.max(0, balance - principalThisMonth);
        if (principalThisMonth > balance) {
          principalThisMonth = balance;
          prepaymentThisMonth = 0;
          emiThisMonth = principalThisMonth + interestThisMonth;
        }
      }
    }

    balance -= (principalThisMonth + prepaymentThisMonth);
    totalInterestPaid += interestThisMonth;
    totalPrincipalPaid += (principalThisMonth + prepaymentThisMonth);

    monthlySchedule.push({
      month: currentMonth,
      year: Math.ceil(currentMonth / 12),
      emi: Math.round(emiThisMonth * 100) / 100,
      principalPaid: Math.round(principalThisMonth * 100) / 100,
      interestPaid: Math.round(interestThisMonth * 100) / 100,
      prepaymentPaid: Math.round(prepaymentThisMonth * 100) / 100,
      endingBalance: Math.max(0, Math.round(balance * 100) / 100),
      totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
      totalPrincipalPaid: Math.round(totalPrincipalPaid * 100) / 100,
    });

    currentMonth++;
  }

  // Aggregate into yearly schedule
  const yearlySchedule: YearlyAmortizationEntry[] = [];
  const totalYears = Math.ceil(monthlySchedule.length / 12);

  for (let y = 1; y <= totalYears; y++) {
    const yearMonths = monthlySchedule.filter(m => m.year === y);
    if (yearMonths.length === 0) continue;

    const firstMonthOfYear = yearMonths[0];
    const lastMonthOfYear = yearMonths[yearMonths.length - 1];
    if (!firstMonthOfYear || !lastMonthOfYear) continue;

    const startingBalance = firstMonthOfYear.endingBalance + firstMonthOfYear.principalPaid + firstMonthOfYear.prepaymentPaid;
    const yearPrincipal = yearMonths.reduce((acc, curr) => acc + curr.principalPaid, 0);
    const yearInterest = yearMonths.reduce((acc, curr) => acc + curr.interestPaid, 0);
    const yearPrepayment = yearMonths.reduce((acc, curr) => acc + curr.prepaymentPaid, 0);

    yearlySchedule.push({
      year: y,
      startingBalance: Math.round(startingBalance * 100) / 100,
      principalPaid: Math.round(yearPrincipal * 100) / 100,
      interestPaid: Math.round(yearInterest * 100) / 100,
      prepaymentPaid: Math.round(yearPrepayment * 100) / 100,
      endingBalance: Math.round(lastMonthOfYear.endingBalance * 100) / 100,
    });
  }

  // Calculate Prepayment Savings against baseline standard schedule
  let savings;
  const hasPrepayments =
    (prepayments && prepayments.length > 0 && prepayments.some(p => p.amount > 0)) ||
    (recurringPrepayment && recurringPrepayment.amount > 0);

  if (hasPrepayments) {
    const baseline = calculateDeterministicEmi({
      loanAmount,
      annualInterestRate,
      tenureMonths,
      floatingRateDelta,
    });
    if (baseline.success) {
      const interestSaved = Math.max(0, baseline.data.totalInterest - totalInterestPaid);
      const monthsSaved = Math.max(0, baseline.data.effectiveTenureMonths - monthlySchedule.length);
      savings = {
        interestSaved: Math.round(interestSaved * 100) / 100,
        monthsSaved,
        formattedInterestSaved: formatCurrency(interestSaved),
      };
    }
  }

  const roundedEmi = Math.round(baseMonthlyEmi * 100) / 100;
  const roundedTotalInterest = Math.round(totalInterestPaid * 100) / 100;
  const totalPayment = loanAmount + roundedTotalInterest;
  const interestRatioPercent = totalPayment > 0 ? (roundedTotalInterest / totalPayment) * 100 : 0;

  const formula = `E = ${formatCurrency(loanAmount)} × (${effectiveRate}%/12) × [1 + (${effectiveRate}%/12)]^${tenureMonths} / [1 + (${effectiveRate}%/12)]^${tenureMonths} - 1 = ${formatCurrency(roundedEmi)}/mo`;

  return {
    success: true,
    data: {
      loanAmount,
      effectiveRate,
      tenureMonths,
      monthlyEmi: roundedEmi,
      totalInterest: roundedTotalInterest,
      totalPayment: Math.round(totalPayment * 100) / 100,
      effectiveTenureMonths: monthlySchedule.length,
      interestRatioPercent: Math.round(interestRatioPercent * 10) / 10,
      savings,
      formula,
      formattedMonthlyEmi: formatCurrency(roundedEmi),
      formattedTotalInterest: formatCurrency(roundedTotalInterest),
      formattedTotalPayment: formatCurrency(totalPayment),
      formattedTotalPrincipal: formatCurrency(loanAmount),
      monthlySchedule,
      yearlySchedule,
    },
  };
}
