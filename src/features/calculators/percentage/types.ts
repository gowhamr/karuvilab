export type PercentageCalculatorMode = 'pct_of' | 'what_pct' | 'change' | 'reverse';

export interface PercentageOfInput {
  percentage: number;
  total: number;
}

export interface PercentageOfResult {
  result: number;
  percentage: number;
  total: number;
  fraction: number;
  formula: string;
  formattedResult: string;
}

export interface WhatPercentageInput {
  part: number;
  total: number;
}

export interface WhatPercentageResult {
  percentage: number;
  part: number;
  total: number;
  fraction: number;
  formula: string;
  formattedPercentage: string;
}

export interface PercentageChangeInput {
  fromValue: number;
  toValue: number;
}

export interface PercentageChangeResult {
  percentageChange: number;
  absoluteChange: number;
  fromValue: number;
  toValue: number;
  changeType: 'increase' | 'decrease' | 'no-change';
  multiplier: number;
  formula: string;
  formattedPercentage: string;
}

export interface ReversePercentageInput {
  finalValue: number;
  percentage: number;
  type: 'increase' | 'decrease';
}

export interface ReversePercentageResult {
  originalValue: number;
  finalValue: number;
  percentage: number;
  type: 'increase' | 'decrease';
  difference: number;
  formula: string;
  formattedOriginalValue: string;
}

export type PercentageCalculatorErrorCode =
  | 'MISSING_INPUT'
  | 'INVALID_NUMBER'
  | 'DIVISION_BY_ZERO'
  | 'INVALID_PERCENTAGE_DECREASE';

export interface PercentageCalculatorError {
  code: PercentageCalculatorErrorCode;
  message: string;
}

export type PercentageCalculatorResponse<T> =
  | { success: true; data: T }
  | { success: false; error: PercentageCalculatorError };
