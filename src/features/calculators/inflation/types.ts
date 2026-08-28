export type InflationPresetId = 'general' | 'education' | 'healthcare' | 'lifestyle' | 'custom';

export interface InflationPreset {
  id: InflationPresetId;
  name: string;
  rate: number;
  description: string;
  category: string;
}

export interface InflationCalculationInput {
  amount: number;
  rate: number; // Annual inflation rate in % (e.g. 6 for 6%)
  years: number; // Time period in years (e.g. 10)
  preset?: InflationPresetId | undefined;
}

export interface InflationYearlyProjection {
  year: number;
  futureCost: number;
  purchasingPower: number;
  purchasingPowerLossPercent: number;
  cumulativeInflationMultiplier: number;
}

export interface InflationCalculationResult {
  amount: number;
  rate: number;
  years: number;
  futureCost: number;
  futurePurchasingPower: number;
  purchasingPowerLossPercent: number;
  halvingYears: number;
  inflationMultiplier: number;
  formula: string;
  formattedAmount: string;
  formattedFutureCost: string;
  formattedPurchasingPower: string;
  formattedLossPercent: string;
  formattedHalvingYears: string;
  projections: InflationYearlyProjection[];
}

export type InflationCalculatorErrorCode =
  | 'INVALID_AMOUNT'
  | 'INVALID_RATE'
  | 'INVALID_YEARS'
  | 'OUT_OF_BOUNDS_INPUT';

export interface InflationCalculatorError {
  code: InflationCalculatorErrorCode;
  message: string;
}

export type InflationCalculationResponse =
  | { success: true; data: InflationCalculationResult }
  | { success: false; error: InflationCalculatorError };
