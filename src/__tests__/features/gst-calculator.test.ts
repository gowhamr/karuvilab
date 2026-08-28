import { describe, it, expect } from 'vitest';
import {
  calculateGst,
  formatCurrency,
  formatPercent,
  GST_RATE_SLABS,
} from '@/src/features/calculators/gst';

describe('Phase 1 — Pure Deterministic Engine: Exclusive (Add GST)', () => {
  it('calculates standard 18% exclusive GST addition accurately', () => {
    const res = calculateGst({
      amount: 10000,
      gstRatePercent: 18,
      type: 'exclusive',
      isInterstate: false,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.netBaseAmount).toBe(10000);
      expect(res.data.gstAmount).toBe(1800);
      expect(res.data.totalGrossAmount).toBe(11800);
      expect(res.data.taxBreakdown.cgst).toBe(900);
      expect(res.data.taxBreakdown.sgst).toBe(900);
      expect(res.data.taxBreakdown.igst).toBe(0);
      expect(res.data.formattedNetBaseAmount).toContain('10,000');
      expect(res.data.formattedGstAmount).toContain('1,800');
      expect(res.data.formattedTotalGrossAmount).toContain('11,800');
    }
  });

  it('calculates all standard GST slabs correctly (0%, 3%, 5%, 12%, 28%)', () => {
    // 0%
    const res0 = calculateGst({ amount: 1000, gstRatePercent: 0, type: 'exclusive' });
    expect(res0.success).toBe(true);
    if (res0.success) {
      expect(res0.data.gstAmount).toBe(0);
      expect(res0.data.totalGrossAmount).toBe(1000);
    }

    // 3% (Gold/Silver)
    const res3 = calculateGst({ amount: 50000, gstRatePercent: 3, type: 'exclusive' });
    expect(res3.success).toBe(true);
    if (res3.success) {
      expect(res3.data.gstAmount).toBe(1500);
      expect(res3.data.totalGrossAmount).toBe(51500);
    }

    // 5% (Essentials)
    const res5 = calculateGst({ amount: 500, gstRatePercent: 5, type: 'exclusive' });
    expect(res5.success).toBe(true);
    if (res5.success) {
      expect(res5.data.gstAmount).toBe(25);
      expect(res5.data.totalGrossAmount).toBe(525);
    }

    // 12% (Standard Low)
    const res12 = calculateGst({ amount: 2000, gstRatePercent: 12, type: 'exclusive' });
    expect(res12.success).toBe(true);
    if (res12.success) {
      expect(res12.data.gstAmount).toBe(240);
      expect(res12.data.totalGrossAmount).toBe(2240);
    }

    // 28% (Luxury / Sin)
    const res28 = calculateGst({ amount: 100000, gstRatePercent: 28, type: 'exclusive' });
    expect(res28.success).toBe(true);
    if (res28.success) {
      expect(res28.data.gstAmount).toBe(28000);
      expect(res28.data.totalGrossAmount).toBe(128000);
    }
  });

  it('handles fractional amounts and custom decimal rates with precise rounding', () => {
    const res = calculateGst({
      amount: 1234.56,
      gstRatePercent: 7.5,
      type: 'exclusive',
      isInterstate: false,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      // 1234.56 * 0.075 = 92.592 -> 92.59
      expect(res.data.gstAmount).toBe(92.59);
      // 1234.56 + 92.592 = 1327.152 -> 1327.15
      expect(res.data.totalGrossAmount).toBe(1327.15);
      expect(res.data.taxBreakdown.cgst + res.data.taxBreakdown.sgst).toBe(92.59);
    }
  });
});

describe('Phase 1 — Pure Deterministic Engine: Inclusive (Remove GST)', () => {
  it('extracts net base price from a 18% GST inclusive total', () => {
    const res = calculateGst({
      amount: 11800,
      gstRatePercent: 18,
      type: 'inclusive',
      isInterstate: false,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.netBaseAmount).toBe(10000);
      expect(res.data.gstAmount).toBe(1800);
      expect(res.data.totalGrossAmount).toBe(11800);
      expect(res.data.taxBreakdown.cgst).toBe(900);
      expect(res.data.taxBreakdown.sgst).toBe(900);
    }
  });

  it('correctly extracts base amounts for 5%, 12%, and 28% inclusive receipts', () => {
    // 5% of 1050 -> 1000 base + 50 gst
    const res5 = calculateGst({ amount: 1050, gstRatePercent: 5, type: 'inclusive' });
    expect(res5.success).toBe(true);
    if (res5.success) {
      expect(res5.data.netBaseAmount).toBe(1000);
      expect(res5.data.gstAmount).toBe(50);
    }

    // 12% of 1120 -> 1000 base + 120 gst
    const res12 = calculateGst({ amount: 1120, gstRatePercent: 12, type: 'inclusive' });
    expect(res12.success).toBe(true);
    if (res12.success) {
      expect(res12.data.netBaseAmount).toBe(1000);
      expect(res12.data.gstAmount).toBe(120);
    }

    // 28% of 12800 -> 10000 base + 2800 gst
    const res28 = calculateGst({ amount: 12800, gstRatePercent: 28, type: 'inclusive' });
    expect(res28.success).toBe(true);
    if (res28.success) {
      expect(res28.data.netBaseAmount).toBe(10000);
      expect(res28.data.gstAmount).toBe(2800);
    }
  });
});

describe('Phase 1 — Pure Deterministic Engine: Tax Breakdown (CGST/SGST vs IGST)', () => {
  it('splits tax equally into CGST and SGST for intrastate transactions', () => {
    const res = calculateGst({
      amount: 20000,
      gstRatePercent: 18,
      type: 'exclusive',
      isInterstate: false,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.gstAmount).toBe(3600);
      expect(res.data.taxBreakdown.cgst).toBe(1800);
      expect(res.data.taxBreakdown.sgst).toBe(1800);
      expect(res.data.taxBreakdown.igst).toBe(0);
    }
  });

  it('allocates 100% of tax to IGST for interstate transactions', () => {
    const res = calculateGst({
      amount: 20000,
      gstRatePercent: 18,
      type: 'exclusive',
      isInterstate: true,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.gstAmount).toBe(3600);
      expect(res.data.taxBreakdown.igst).toBe(3600);
      expect(res.data.taxBreakdown.cgst).toBe(0);
      expect(res.data.taxBreakdown.sgst).toBe(0);
      expect(res.data.taxBreakdown.formattedIgst).toContain('3,600');
    }
  });

  it('preserves exact penny rounding balance for odd GST amounts', () => {
    // GST = 0.05 on amount = 1 at 5%
    const res = calculateGst({
      amount: 1,
      gstRatePercent: 5,
      type: 'exclusive',
      isInterstate: false,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.gstAmount).toBe(0.05);
      expect(res.data.taxBreakdown.cgst + res.data.taxBreakdown.sgst).toBe(0.05);
    }
  });
});

describe('Phase 1 — Pure Deterministic Engine: Error Handling & Boundaries', () => {
  it('rejects negative amount with NEGATIVE_VALUE error', () => {
    const res = calculateGst({
      amount: -500,
      gstRatePercent: 18,
      type: 'exclusive',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('NEGATIVE_VALUE');
    }
  });

  it('rejects negative GST rate with NEGATIVE_VALUE error', () => {
    const res = calculateGst({
      amount: 1000,
      gstRatePercent: -5,
      type: 'exclusive',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('NEGATIVE_VALUE');
    }
  });

  it('rejects NaN amount with INVALID_AMOUNT error', () => {
    const res = calculateGst({
      amount: NaN,
      gstRatePercent: 18,
      type: 'exclusive',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('INVALID_AMOUNT');
    }
  });

  it('rejects NaN rate with INVALID_GST_RATE error', () => {
    const res = calculateGst({
      amount: 1000,
      gstRatePercent: NaN,
      type: 'exclusive',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('INVALID_GST_RATE');
    }
  });

  it('rejects out of bounds inputs exceeding limits (> 10^12 or rate > 100%)', () => {
    const resAmount = calculateGst({
      amount: 2000000000000,
      gstRatePercent: 18,
      type: 'exclusive',
    });
    expect(resAmount.success).toBe(false);
    if (!resAmount.success) {
      expect(resAmount.error.code).toBe('OUT_OF_BOUNDS_INPUT');
    }

    const resRate = calculateGst({
      amount: 1000,
      gstRatePercent: 105,
      type: 'exclusive',
    });
    expect(resRate.success).toBe(false);
    if (!resRate.success) {
      expect(resRate.error.code).toBe('OUT_OF_BOUNDS_INPUT');
    }
  });
});

describe('Phase 2 — URL Contract', () => {
  it('constructs and parses canonical GST parameters: ?amount=10000&rate=18&type=exclusive&interstate=false', () => {
    const url = 'https://karuvilab.com/calculators/gst-calculator/?amount=10000&rate=18&type=exclusive&interstate=false';
    const parsed = new URL(url);
    expect(parsed.searchParams.get('amount')).toBe('10000');
    expect(parsed.searchParams.get('rate')).toBe('18');
    expect(parsed.searchParams.get('type')).toBe('exclusive');
    expect(parsed.searchParams.get('interstate')).toBe('false');

    const res = calculateGst({
      amount: Number(parsed.searchParams.get('amount')),
      gstRatePercent: Number(parsed.searchParams.get('rate')),
      type: (parsed.searchParams.get('type') as 'exclusive' | 'inclusive'),
      isInterstate: parsed.searchParams.get('interstate') === 'true',
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.netBaseAmount).toBe(10000);
      expect(res.data.gstAmount).toBe(1800);
      expect(res.data.totalGrossAmount).toBe(11800);
      expect(res.data.taxBreakdown.cgst).toBe(900);
      expect(res.data.taxBreakdown.sgst).toBe(900);
    }
  });

  it('constructs and parses inclusive interstate parameters: ?amount=23600&rate=18&type=inclusive&interstate=true', () => {
    const url = 'https://karuvilab.com/calculators/gst-calculator/?amount=23600&rate=18&type=inclusive&interstate=true';
    const parsed = new URL(url);
    expect(parsed.searchParams.get('amount')).toBe('23600');
    expect(parsed.searchParams.get('rate')).toBe('18');
    expect(parsed.searchParams.get('type')).toBe('inclusive');
    expect(parsed.searchParams.get('interstate')).toBe('true');

    const res = calculateGst({
      amount: Number(parsed.searchParams.get('amount')),
      gstRatePercent: Number(parsed.searchParams.get('rate')),
      type: (parsed.searchParams.get('type') as 'exclusive' | 'inclusive'),
      isInterstate: parsed.searchParams.get('interstate') === 'true',
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.netBaseAmount).toBe(20000);
      expect(res.data.gstAmount).toBe(3600);
      expect(res.data.taxBreakdown.igst).toBe(3600);
    }
  });
});

describe('Phase 3 — Semantic DOM Contract Spec', () => {
  it('defines stable semantic data attributes for GST Calculator', () => {
    const expected = {
      tool: 'gst-calculator',
      inputs: [
        'amount',
        'rate',
        'type',
        'interstate',
      ],
      results: [
        'net-amount',
        'gst-amount',
        'total-amount',
        'cgst-amount',
        'sgst-amount',
        'igst-amount',
      ],
    };

    expect(expected.tool).toBe('gst-calculator');
    expect(expected.inputs).toContain('amount');
    expect(expected.inputs).toContain('rate');
    expect(expected.inputs).toContain('interstate');
    expect(expected.results).toContain('net-amount');
    expect(expected.results).toContain('gst-amount');
    expect(expected.results).toContain('total-amount');
    expect(expected.results).toContain('cgst-amount');
    expect(expected.results).toContain('sgst-amount');
    expect(expected.results).toContain('igst-amount');
  });
});

describe('Phase 4 — Utilities & Formatters', () => {
  it('formats currency correctly into Indian Rupee locale', () => {
    expect(formatCurrency(10000)).toContain('10,000');
    expect(formatCurrency(0)).toContain('0.00');
    expect(formatCurrency(NaN)).toBe('₹0.00');
  });

  it('formats percentage strings accurately', () => {
    expect(formatPercent(18)).toBe('18%');
    expect(formatPercent(2.5)).toBe('2.5%');
    expect(formatPercent(0.25)).toBe('0.25%');
  });

  it('contains valid standard GST rate slabs constant', () => {
    expect(GST_RATE_SLABS).toEqual([3, 5, 12, 18, 28]);
  });
});

describe('Phase 5 — Schema.org & llms.txt Contract', () => {
  it('validates tool content meets E-E-A-T requirements', async () => {
    const { gstCalculator } = await import('@/src/content/tools/gst-calculator');
    expect(gstCalculator.faq?.length).toBeGreaterThanOrEqual(5);
    expect(gstCalculator.examples?.length).toBeGreaterThanOrEqual(3);
    expect(gstCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
    expect(gstCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
  });

  it('validates tool registry entry has complete metadata', async () => {
    const { gstCalculator } = await import('@/src/registry/tools/gst-calculator');
    expect(gstCalculator.id).toBe('gst-calculator');
    expect(gstCalculator.href).toBe('/calculators/gst-calculator/');
    expect(gstCalculator.category).toBe('calculators');
    expect(gstCalculator.schemaType).toBe('WebApplication');
    expect(gstCalculator.status).toBe('stable');
  });

  it('validates public/llms.txt contains canonical GST calculator specification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');
    
    expect(llmsContent).toContain('[GST Calculator](https://karuvilab.com/calculators/gst-calculator/)');
  });
});
