export interface SipCalculationInput {
  monthlyInvestment: number;
  expectedAnnualReturn: number; // In % (e.g. 12 for 12%)
  timeHorizonYears: number; // In years (e.g. 15)
  annualStepUpPercent?: number | undefined; // In % (e.g. 10 for 10% annual step-up)
  lumpsumAmount?: number | undefined; // Initial one-time lumpsum investment
  annualInflationRate?: number | undefined; // In % (e.g. 6 for 6%)
  capitalGainsTaxRate?: number | undefined; // In % (e.g. 12.5 for LTCG)
  expenseRatio?: number | undefined; // In % (e.g. 0.5 for mutual fund expense ratio)
}

export interface SipYearlyProjection {
  year: number;
  openingBalance: number;
  monthlyAmount: number;
  annualContribution: number;
  cumulativeInvested: number;
  interestEarnedThisYear: number;
  cumulativeInterest: number;
  endingBalance: number;
  inflationAdjustedBalance: number;
}

export interface SipCalculationResult {
  monthlyInvestment: number;
  expectedAnnualReturn: number;
  timeHorizonYears: number;
  annualStepUpPercent: number;
  lumpsumAmount: number;
  annualInflationRate: number;
  capitalGainsTaxRate: number;
  expenseRatio: number;
  effectiveAnnualReturn: number;
  totalInvested: number;
  totalGains: number;
  futureValue: number;
  netGains: number;
  netFutureValue: number;
  realFutureValue: number;
  wealthMultiplier: number;
  formula: string;
  formattedMonthlyInvestment: string;
  formattedTotalInvested: string;
  formattedTotalGains: string;
  formattedFutureValue: string;
  formattedNetFutureValue: string;
  formattedRealFutureValue: string;
  projections: SipYearlyProjection[];
}

export type SipCalculatorErrorCode =
  | 'INVALID_MONTHLY_INVESTMENT'
  | 'INVALID_RETURN_RATE'
  | 'INVALID_TIME_HORIZON'
  | 'INVALID_STEP_UP'
  | 'INVALID_LUMPSUM'
  | 'OUT_OF_BOUNDS_INPUT';

export interface SipCalculatorError {
  code: SipCalculatorErrorCode;
  message: string;
}

export type SipCalculationResponse =
  | { success: true; data: SipCalculationResult }
  | { success: false; error: SipCalculatorError };
