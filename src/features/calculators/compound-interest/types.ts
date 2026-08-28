export type CompoundingFrequency = 1 | 2 | 4 | 12 | 365;

export interface CompoundInterestInput {
  principal: number;
  annualRate: number; // In percent (e.g. 10 for 10%)
  years: number;
  frequency: CompoundingFrequency;
  monthlyContribution?: number;
  inflationRate?: number; // In percent (e.g. 6 for 6%)
}

export interface YearProjection {
  year: number;
  startingBalance: number;
  contributions: number;
  interestEarned: number;
  endingBalance: number;
  realEndingBalance: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalPrincipal: number;
  totalContributions: number;
  totalInvested: number;
  totalInterest: number;
  effectiveAnnualRate: number; // APY / EAR in %
  realFutureValue: number;
  doublingYears: number;
  formula: string;
  formattedFutureValue: string;
  formattedTotalInterest: string;
  formattedTotalInvested: string;
  formattedEffectiveRate: string;
  projections: YearProjection[];
}

export type CompoundInterestErrorCode =
  | 'INVALID_PRINCIPAL'
  | 'INVALID_RATE'
  | 'INVALID_YEARS'
  | 'INVALID_FREQUENCY'
  | 'OUT_OF_BOUNDS_INPUT';

export interface CompoundInterestError {
  code: CompoundInterestErrorCode;
  message: string;
}

export type CompoundInterestResponse =
  | { success: true; data: CompoundInterestResult }
  | { success: false; error: CompoundInterestError };
