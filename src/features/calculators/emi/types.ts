export type MoratoriumType = 'interest-only' | 'full';

export interface PrepaymentEntry {
  month: number;
  amount: number;
}

export interface RecurringPrepayment {
  amount: number;
  startMonth: number;
}

export interface MoratoriumConfig {
  months: number;
  type: MoratoriumType;
}

export interface EmiCalculationInput {
  loanAmount: number;
  annualInterestRate: number; // In % (e.g. 8.5 for 8.5%)
  tenureMonths: number;
  prepayments?: PrepaymentEntry[] | undefined;
  recurringPrepayment?: RecurringPrepayment | undefined;
  moratorium?: MoratoriumConfig | undefined;
  floatingRateDelta?: number | undefined; // In % (e.g. +1.0 for +1%)
}

export interface MonthlyAmortizationEntry {
  month: number;
  year: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  prepaymentPaid: number;
  endingBalance: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
}

export interface YearlyAmortizationEntry {
  year: number;
  startingBalance: number;
  principalPaid: number;
  interestPaid: number;
  prepaymentPaid: number;
  endingBalance: number;
}

export interface EmiPrepaymentSavings {
  interestSaved: number;
  monthsSaved: number;
  formattedInterestSaved: string;
}

export interface EmiCalculationResult {
  loanAmount: number;
  effectiveRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  effectiveTenureMonths: number;
  interestRatioPercent: number;
  savings?: EmiPrepaymentSavings | undefined;
  formula: string;
  formattedMonthlyEmi: string;
  formattedTotalInterest: string;
  formattedTotalPayment: string;
  formattedTotalPrincipal: string;
  monthlySchedule: MonthlyAmortizationEntry[];
  yearlySchedule: YearlyAmortizationEntry[];
}

export type EmiCalculatorErrorCode =
  | 'INVALID_LOAN_AMOUNT'
  | 'INVALID_INTEREST_RATE'
  | 'INVALID_TENURE'
  | 'OUT_OF_BOUNDS_INPUT';

export interface EmiCalculatorError {
  code: EmiCalculatorErrorCode;
  message: string;
}

export type EmiCalculationResponse =
  | { success: true; data: EmiCalculationResult }
  | { success: false; error: EmiCalculatorError };
