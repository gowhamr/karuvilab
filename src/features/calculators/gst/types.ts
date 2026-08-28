export type GstCalculationType = 'exclusive' | 'inclusive';

export interface GstCalculationInput {
  amount: number;
  gstRatePercent: number;
  type: GstCalculationType; // 'exclusive' (Add GST) | 'inclusive' (Remove GST)
  isInterstate?: boolean | undefined;
}

export interface GstTaxBreakdown {
  cgst: number;
  sgst: number;
  igst: number;
  formattedCgst: string;
  formattedSgst: string;
  formattedIgst: string;
}

export interface GstCalculationResult {
  amount: number;
  gstRatePercent: number;
  type: GstCalculationType;
  isInterstate: boolean;
  netBaseAmount: number;
  gstAmount: number;
  totalGrossAmount: number;
  taxBreakdown: GstTaxBreakdown;
  formula: string;
  formattedNetBaseAmount: string;
  formattedGstAmount: string;
  formattedTotalGrossAmount: string;
}

export type GstCalculatorErrorCode =
  | 'INVALID_AMOUNT'
  | 'INVALID_GST_RATE'
  | 'NEGATIVE_VALUE'
  | 'OUT_OF_BOUNDS_INPUT';

export interface GstCalculatorError {
  code: GstCalculatorErrorCode;
  message: string;
}

export type GstCalculationResponse =
  | { success: true; data: GstCalculationResult }
  | { success: false; error: GstCalculatorError };
