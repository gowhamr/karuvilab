import {
  GstCalculationInput,
  GstCalculationResult,
  GstCalculationResponse,
  GstTaxBreakdown,
} from './types';

export const GST_RATE_SLABS = [3, 5, 12, 18, 28] as const;

export function formatCurrency(
  val: number,
  locale = 'en-IN',
  currency = 'INR'
): string {
  if (!isFinite(val)) return '₹0.00';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatPercent(val: number, maxDecimals = 2): string {
  if (!isFinite(val)) return '0%';
  return `${Number(val.toFixed(maxDecimals)).toLocaleString('en-US', {
    maximumFractionDigits: maxDecimals,
  })}%`;
}

/**
 * Pure Deterministic GST Engine for Exclusive (Add GST) and Inclusive (Remove GST) scenarios.
 */
export function calculateGst(input: GstCalculationInput): GstCalculationResponse {
  const { amount, gstRatePercent, type, isInterstate = false } = input;

  if (isNaN(amount)) {
    return {
      success: false,
      error: { code: 'INVALID_AMOUNT', message: 'Please enter a valid monetary amount.' },
    };
  }

  if (isNaN(gstRatePercent)) {
    return {
      success: false,
      error: { code: 'INVALID_GST_RATE', message: 'Please select or enter a valid GST percentage rate.' },
    };
  }

  if (amount < 0 || gstRatePercent < 0) {
    return {
      success: false,
      error: { code: 'NEGATIVE_VALUE', message: 'Amount and GST rate cannot be negative.' },
    };
  }

  if (amount > 1000000000000 || gstRatePercent > 100) {
    return {
      success: false,
      error: {
        code: 'OUT_OF_BOUNDS_INPUT',
        message: 'Amount exceeds maximum allowable threshold (₹10,000 Crore) or rate exceeds 100%.',
      },
    };
  }

  let netBaseAmount = 0;
  let gstAmount = 0;
  let totalGrossAmount = 0;

  if (type === 'exclusive') {
    // Add GST to base amount: GST = Base * Rate / 100; Total = Base + GST
    netBaseAmount = amount;
    gstAmount = (amount * gstRatePercent) / 100;
    totalGrossAmount = amount + gstAmount;
  } else {
    // Remove GST from gross amount: Base = Gross / (1 + Rate / 100); GST = Gross - Base
    netBaseAmount = amount / (1 + gstRatePercent / 100);
    gstAmount = amount - netBaseAmount;
    totalGrossAmount = amount;
  }

  const roundedNet = Math.round(netBaseAmount * 100) / 100;
  const roundedGst = Math.round(gstAmount * 100) / 100;
  const roundedTotal = Math.round(totalGrossAmount * 100) / 100;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isInterstate) {
    igst = roundedGst;
  } else {
    cgst = Math.round((roundedGst / 2) * 100) / 100;
    sgst = Math.round((roundedGst - cgst) * 100) / 100; // Account for any penny rounding discrepancies
  }

  const taxBreakdown: GstTaxBreakdown = {
    cgst,
    sgst,
    igst,
    formattedCgst: formatCurrency(cgst),
    formattedSgst: formatCurrency(sgst),
    formattedIgst: formatCurrency(igst),
  };

  const formula = type === 'exclusive'
    ? `${formatCurrency(roundedNet)} + (${gstRatePercent}% GST: ${formatCurrency(roundedGst)}) = ${formatCurrency(roundedTotal)}`
    : `${formatCurrency(roundedTotal)} / (1 + ${gstRatePercent}%) = Net ${formatCurrency(roundedNet)} (GST: ${formatCurrency(roundedGst)})`;

  return {
    success: true,
    data: {
      amount,
      gstRatePercent,
      type,
      isInterstate,
      netBaseAmount: roundedNet,
      gstAmount: roundedGst,
      totalGrossAmount: roundedTotal,
      taxBreakdown,
      formula,
      formattedNetBaseAmount: formatCurrency(roundedNet),
      formattedGstAmount: formatCurrency(roundedGst),
      formattedTotalGrossAmount: formatCurrency(roundedTotal),
    },
  };
}
