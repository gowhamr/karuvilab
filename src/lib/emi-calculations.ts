/**
 * Pure functions for EMI and financial calculations.
 * All calculations are local and private.
 */

export interface EmiInputs {
  loanAmount: number;
  interestRate: number; // Annual percentage
  tenureMonths: number;
  prepayments?: Array<{ month: number; amount: number }> | undefined;
  recurringPrepayment?: { amount: number; startMonth: number } | undefined;
  moratorium?: { months: number; type: 'interest-only' | 'full' } | undefined;
  floatingRateDelta?: number | undefined; // ±%
}

export interface AmortizationEntry {
  month: number;
  year: number;
  emi: number;
  principal: number;
  interest: number;
  prepayment: number;
  balance: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
}

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  effectiveTenure: number; // Months until balance is 0
  savings?: {
    interest: number;
    months: number;
  } | undefined;
  schedule: AmortizationEntry[];
}

/**
 * Standard EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateEmi(p: number, r: number, n: number): number {
  if (isNaN(p) || isNaN(r) || isNaN(n) || n <= 0) return 0;
  if (r === 0) return p / n;
  const monthlyRate = r / 12 / 100;
  return (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
}

/**
 * Generates full amortization schedule with support for prepayments and moratoriums.
 */
export function generateSchedule(inputs: EmiInputs): EmiResult {
  const { 
    loanAmount = 0, 
    interestRate = 0, 
    tenureMonths = 0, 
    prepayments = [], 
    recurringPrepayment,
    moratorium,
    floatingRateDelta = 0
  } = inputs;

  const actualRate = (interestRate || 0) + (floatingRateDelta || 0);
  const monthlyRate = actualRate / 12 / 100;
  const baseEmi = calculateEmi(loanAmount, actualRate, tenureMonths);
  
  let balance = loanAmount || 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  const schedule: AmortizationEntry[] = [];
  
  let currentMonth = 1;
  const maxMonths = (tenureMonths || 0) * 2 || 360; // Safety cap

  while (balance > 0.01 && currentMonth <= maxMonths) {
    let interestPaid = balance * monthlyRate;
    let principalPaid = 0;
    let prepaymentAmount = 0;
    let emiPaid = baseEmi;

    // Handle Moratorium
    if (moratorium && currentMonth <= moratorium.months) {
      if (moratorium.type === 'interest-only') {
        emiPaid = interestPaid;
        principalPaid = 0;
      } else {
        // Full moratorium: interest is accrued/capitalized
        emiPaid = 0;
        principalPaid = 0;
        balance += interestPaid;
        interestPaid = 0; // Accrued, not "paid" this month
      }
    } else {
      // Normal payment
      principalPaid = emiPaid - interestPaid;
      
      // Handle Prepayments
      const oneTime = prepayments.find(p => p.month === currentMonth)?.amount || 0;
      const recurring = (recurringPrepayment && currentMonth >= recurringPrepayment.startMonth) 
        ? recurringPrepayment.amount 
        : 0;
      
      prepaymentAmount = oneTime + recurring;
      
      // Cap payment to remaining balance
      if (principalPaid + prepaymentAmount > balance) {
        prepaymentAmount = Math.max(0, balance - principalPaid);
        if (principalPaid > balance) {
          principalPaid = balance;
          prepaymentAmount = 0;
          emiPaid = principalPaid + interestPaid;
        }
      }
    }

    balance -= (principalPaid + prepaymentAmount);
    totalInterest += interestPaid;
    totalPrincipal += (principalPaid + prepaymentAmount);

    schedule.push({
      month: currentMonth,
      year: Math.ceil(currentMonth / 12),
      emi: emiPaid,
      principal: principalPaid,
      interest: interestPaid,
      prepayment: prepaymentAmount,
      balance: Math.max(0, balance),
      totalInterestPaid: totalInterest,
      totalPrincipalPaid: totalPrincipal
    });

    currentMonth++;
  }

  // Calculate savings if prepayments were made
  let savings;
  const hasActivePrepayments = (prepayments && prepayments.length > 0 && prepayments.some(p => p.amount > 0)) || (recurringPrepayment && recurringPrepayment.amount > 0);
  if (hasActivePrepayments) {
    const standard = generateSchedule({ ...inputs, prepayments: [], recurringPrepayment: undefined });
    savings = {
      interest: Math.max(0, standard.totalInterest - totalInterest),
      months: Math.max(0, standard.effectiveTenure - schedule.length)
    };
  }

  return {
    monthlyEmi: baseEmi,
    totalInterest,
    totalPayment: loanAmount + totalInterest,
    effectiveTenure: schedule.length,
    savings,
    schedule
  };
}

/**
 * Affordability Check
 */
export interface AffordabilityInputs {
  monthlyIncome: number;
  existingEmis: number;
  monthlyExpenses: number;
}

export interface AffordabilityResult {
  disposableIncome: number;
  emiPercentOfDisposable: number;
  riskLevel: 'low' | 'medium' | 'high';
  message: string;
}

export function checkAffordability(emi: number, inputs: AffordabilityInputs): AffordabilityResult {
  const disposableIncome = inputs.monthlyIncome - inputs.existingEmis - inputs.monthlyExpenses;
  
  if (disposableIncome <= 0) {
    return {
      disposableIncome,
      emiPercentOfDisposable: 100,
      riskLevel: 'high',
      message: 'Critical: No disposable income available for this EMI.'
    };
  }

  const percent = (emi / disposableIncome) * 100;
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let message = '';

  if (percent > 50) {
    riskLevel = 'high';
    message = `Warning: EMI exceeds 50% of your disposable income (${percent.toFixed(1)}%). Highly risky.`;
  } else if (percent > 35) {
    riskLevel = 'medium';
    message = `Caution: EMI is ${percent.toFixed(1)}% of your disposable income. Monitor your budget closely.`;
  } else {
    riskLevel = 'low';
    message = `Safe: EMI is ${percent.toFixed(1)}% of your disposable income. Manageable.`;
  }

  return {
    disposableIncome,
    emiPercentOfDisposable: percent,
    riskLevel,
    message
  };
}
