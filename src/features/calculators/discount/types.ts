export type DiscountCalculatorMode = 'forward' | 'find_discount' | 'find_original';

export interface ForwardDiscountInput {
  originalPrice: number;
  discountPercent: number;
  extraDiscountPercent?: number;
  taxPercent?: number;
}

export interface ForwardDiscountResult {
  originalPrice: number;
  discountPercent: number;
  extraDiscountPercent: number;
  taxPercent: number;
  firstDiscountSavings: number;
  extraDiscountSavings: number;
  totalSavings: number;
  preTaxPrice: number;
  taxAmount: number;
  finalPayable: number;
  effectiveDiscountPercent: number;
  formula: string;
  formattedOriginalPrice: string;
  formattedFinalPayable: string;
  formattedTotalSavings: string;
  formattedEffectiveDiscount: string;
}

export interface FindDiscountInput {
  originalPrice: number;
  targetPrice: number;
}

export interface FindDiscountResult {
  originalPrice: number;
  targetPrice: number;
  requiredDiscountPercent: number;
  totalSavings: number;
  formula: string;
  formattedRequiredDiscount: string;
  formattedTotalSavings: string;
}

export interface FindOriginalInput {
  finalPrice: number;
  discountPercent: number;
}

export interface FindOriginalResult {
  finalPrice: number;
  discountPercent: number;
  originalPrice: number;
  totalSavings: number;
  formula: string;
  formattedOriginalPrice: string;
  formattedTotalSavings: string;
}

export type DiscountCalculatorErrorCode =
  | 'INVALID_PRICE'
  | 'INVALID_DISCOUNT'
  | 'DISCOUNT_100_OR_MORE'
  | 'TARGET_EXCEEDS_ORIGINAL'
  | 'NEGATIVE_VALUE';

export interface DiscountCalculatorError {
  code: DiscountCalculatorErrorCode;
  message: string;
}

export type DiscountCalculatorResponse<T> =
  | { success: true; data: T }
  | { success: false; error: DiscountCalculatorError };
