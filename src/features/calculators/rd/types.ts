export type RdCompoundingFrequency = 1 | 2 | 4 | 12;

export interface RdCalculationInput {
  monthlyDeposit: number;
  annualInterestRate: number; // In % (e.g. 7.0 for 7%)
  tenureYears: number; // In years (e.g. 5)
  tenureMonths?: number | undefined; // Optional direct months or partial years
  compoundingFrequency?: RdCompoundingFrequency | number | undefined; // Default 4 (Quarterly)
  isSeniorCitizen?: boolean | undefined; // Default false
  seniorCitizenRateBoost?: number | undefined; // Default 0.50 (%)
  applyTds?: boolean | undefined; // Default false
  tdsRate?: number | undefined; // Default 10 (%)
  customTdsThreshold?: number | undefined; // Default 40,000 (regular) or 50,000 (senior)
}

export interface RdYearlyProjection {
  year: number;
  monthsCompleted: number;
  openingBalance: number;
  annualDeposit: number;
  cumulativeInvested: number;
  interestEarnedThisYear: number;
  cumulativeInterest: number;
  maturityValue: number;
  estimatedTds: number;
  netMaturityValue: number;
}

export interface RdCalculationResult {
  monthlyDeposit: number;
  baseInterestRate: number;
  seniorCitizenRateBoost: number;
  effectiveInterestRate: number;
  isSeniorCitizen: boolean;
  tenureYears: number;
  totalMonths: number;
  compoundingFrequency: RdCompoundingFrequency;
  effectiveApy: number;
  totalInvested: number;
  totalInterest: number;
  maturityAmount: number;
  isTdsApplicable: boolean;
  tdsThreshold: number;
  tdsAmount: number;
  netTotalInterest: number;
  netMaturityAmount: number;
  formula: string;
  formattedMonthlyDeposit: string;
  formattedTotalInvested: string;
  formattedTotalInterest: string;
  formattedMaturityAmount: string;
  formattedEffectiveApy: string;
  formattedTdsAmount: string;
  formattedNetMaturityAmount: string;
  projections: RdYearlyProjection[];
}

export type RdCalculatorErrorCode =
  | 'INVALID_MONTHLY_DEPOSIT'
  | 'INVALID_INTEREST_RATE'
  | 'INVALID_TENURE'
  | 'INVALID_COMPOUNDING_FREQUENCY'
  | 'INVALID_TDS_RATE'
  | 'OUT_OF_BOUNDS_INPUT';

export interface RdCalculatorError {
  code: RdCalculatorErrorCode;
  message: string;
}

export type RdCalculationResponse =
  | { success: true; data: RdCalculationResult }
  | { success: false; error: RdCalculatorError };
