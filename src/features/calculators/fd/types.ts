export type CompoundingFrequency = 1 | 2 | 4 | 12;
export type PayoutFrequency = 1 | 2 | 4 | 12;
export type TenureUnit = 'days' | 'months' | 'years';
export type FdType = 'cumulative' | 'non-cumulative';

export interface FdCalculationInput {
  principal: number;
  annualRate: number; // In % (e.g. 6.5 for 6.5%)
  tenure: number;
  tenureUnit?: TenureUnit | undefined;
  compoundingFrequency?: CompoundingFrequency | number | undefined;
  fdType?: FdType | undefined;
  payoutFrequency?: PayoutFrequency | number | undefined;
  isSeniorCitizen?: boolean | undefined;
  seniorCitizenBoost?: number | undefined; // In % (default 0.50%)
  applyTds?: boolean | undefined;
  tdsRate?: number | undefined; // In % (default 10%)
  customTdsThreshold?: number | undefined; // Threshold in INR (default 40,000 for regular, 50,000 for senior)
}

export interface FdYearlyScheduleEntry {
  year: number;
  openingBalance: number;
  interestEarned: number;
  tdsDeducted: number;
  netInterest: number;
  payoutAmount: number;
  closingBalance: number;
  cumulativeInterest: number;
  cumulativeTds: number;
}

export interface FdCalculationResult {
  principal: number;
  baseRate: number;
  effectiveRate: number;
  tenureYears: number;
  tenureMonths: number;
  tenureDays: number;
  tenureDisplay: string;
  compoundingFrequency: number;
  compoundingLabel: string;
  fdType: FdType;
  isSeniorCitizen: boolean;
  maturityValue: number;
  totalInterest: number;
  netInterest: number;
  totalTds: number;
  isTdsApplicable: boolean;
  tdsThreshold: number;
  periodicPayout: number;
  totalPayouts: number;
  effectiveAnnualYield: number; // APY in %
  formula: string;
  formattedPrincipal: string;
  formattedMaturityValue: string;
  formattedTotalInterest: string;
  formattedNetInterest: string;
  formattedTotalTds: string;
  formattedPeriodicPayout: string;
  formattedApy: string;
  yearlySchedule: FdYearlyScheduleEntry[];
}

export type FdCalculatorErrorCode =
  | 'INVALID_PRINCIPAL'
  | 'INVALID_RATE'
  | 'INVALID_TENURE'
  | 'OUT_OF_BOUNDS_INPUT';

export interface FdCalculatorError {
  code: FdCalculatorErrorCode;
  message: string;
}

export type FdCalculationResponse =
  | { success: true; data: FdCalculationResult }
  | { success: false; error: FdCalculatorError };
