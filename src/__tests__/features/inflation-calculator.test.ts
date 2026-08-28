import { describe, it, expect } from 'vitest';
import {
  calculateDeterministicInflation,
  calculateFutureCost,
  calculatePurchasingPower,
  calculatePurchasingPowerLoss,
  calculateHalvingTime,
  INFLATION_SECTOR_PRESETS,
} from '@/src/features/calculators/inflation';

describe('Phase 1 — Pure Deterministic Engine: calculateDeterministicInflation', () => {
  it('calculates standard future cost and purchasing power accurately', () => {
    // ₹100,000 at 6% inflation for 10 years
    // FV = 100000 * (1.06)^10 = 179,084.77
    // PV (Purchasing power) = 100000 / (1.06)^10 = 55,839.48
    // Loss of purchasing power = (1 - 1/1.7908477) * 100 = 44.16%
    // Halving time = 70 / 6 = 11.7 years
    const res = calculateDeterministicInflation({
      amount: 100000,
      rate: 6,
      years: 10,
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.futureCost).toBeCloseTo(179084.77, 1);
      expect(res.data.futurePurchasingPower).toBeCloseTo(55839.48, 1);
      expect(res.data.purchasingPowerLossPercent).toBeCloseTo(44.16, 1);
      expect(res.data.halvingYears).toBeCloseTo(11.7, 1);
      expect(res.data.projections.length).toBe(10);
      expect(res.data.projections[9]?.futureCost).toBeCloseTo(179084.77, 1);
      expect(res.data.projections[9]?.purchasingPower).toBeCloseTo(55839.48, 1);
      expect(res.data.projections[9]?.purchasingPowerLossPercent).toBeCloseTo(44.16, 1);
    }
  });

  it('calculates higher inflation rates (Education 10%, Healthcare 12%) accurately', () => {
    // ₹500,000 at 10% education inflation for 15 years
    // FV = 500000 * (1.10)^15 = 2,088,624.09
    const eduRes = calculateDeterministicInflation({
      amount: 500000,
      rate: 10,
      years: 15,
    });

    expect(eduRes.success).toBe(true);
    if (eduRes.success) {
      expect(eduRes.data.futureCost).toBeCloseTo(2088624.09, 0);
      expect(eduRes.data.halvingYears).toBe(7);
      expect(eduRes.data.purchasingPowerLossPercent).toBeCloseTo(76.06, 1);
    }

    // ₹1,000,000 at 12% healthcare inflation for 20 years
    // FV = 1000000 * (1.12)^20 = 9,646,293.09
    const healthRes = calculateDeterministicInflation({
      amount: 1000000,
      rate: 12,
      years: 20,
    });

    expect(healthRes.success).toBe(true);
    if (healthRes.success) {
      expect(healthRes.data.futureCost).toBeCloseTo(9646293.09, 0);
      expect(healthRes.data.halvingYears).toBeCloseTo(5.8, 1);
      expect(healthRes.data.purchasingPowerLossPercent).toBeCloseTo(89.63, 1);
    }
  });

  it('preserves purchasing power at 0% inflation', () => {
    const res = calculateDeterministicInflation({
      amount: 250000,
      rate: 0,
      years: 10,
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.futureCost).toBe(250000);
      expect(res.data.futurePurchasingPower).toBe(250000);
      expect(res.data.purchasingPowerLossPercent).toBe(0);
      expect(res.data.halvingYears).toBe(0);
    }
  });

  it('provides verified sector inflation presets', () => {
    expect(INFLATION_SECTOR_PRESETS.length).toBe(4);
    const general = INFLATION_SECTOR_PRESETS.find((p) => p.id === 'general');
    const lifestyle = INFLATION_SECTOR_PRESETS.find((p) => p.id === 'lifestyle');
    const education = INFLATION_SECTOR_PRESETS.find((p) => p.id === 'education');
    const healthcare = INFLATION_SECTOR_PRESETS.find((p) => p.id === 'healthcare');

    expect(general?.rate).toBe(6);
    expect(lifestyle?.rate).toBe(8);
    expect(education?.rate).toBe(10);
    expect(healthcare?.rate).toBe(12);
  });
});

describe('Phase 1 — Pure Deterministic Engine: Mathematical Helper Functions', () => {
  it('calculateFutureCost calculates compound escalation', () => {
    expect(calculateFutureCost(1000, 10, 2)).toBeCloseTo(1210, 2);
    expect(calculateFutureCost(5000, 0, 5)).toBe(5000);
  });

  it('calculatePurchasingPower calculates present value discount', () => {
    expect(calculatePurchasingPower(1210, 10, 2)).toBeCloseTo(1000, 2);
    expect(calculatePurchasingPower(5000, 0, 5)).toBe(5000);
  });

  it('calculatePurchasingPowerLoss calculates erosion percentage', () => {
    expect(calculatePurchasingPowerLoss(10, 1)).toBeCloseTo(9.09, 2);
    expect(calculatePurchasingPowerLoss(0, 10)).toBe(0);
  });

  it('calculateHalvingTime estimates halving periods via Rule of 70', () => {
    expect(calculateHalvingTime(7)).toBe(10);
    expect(calculateHalvingTime(10)).toBe(7);
    expect(calculateHalvingTime(0)).toBe(0);
  });
});

describe('Phase 1 — Pure Deterministic Engine: Error Handling', () => {
  it('rejects zero or negative amount', () => {
    const resZero = calculateDeterministicInflation({ amount: 0, rate: 6, years: 10 });
    expect(resZero.success).toBe(false);
    if (!resZero.success) {
      expect(resZero.error.code).toBe('INVALID_AMOUNT');
    }

    const resNeg = calculateDeterministicInflation({ amount: -50000, rate: 6, years: 10 });
    expect(resNeg.success).toBe(false);
    if (!resNeg.success) {
      expect(resNeg.error.code).toBe('INVALID_AMOUNT');
    }
  });

  it('rejects negative inflation rate', () => {
    const res = calculateDeterministicInflation({ amount: 100000, rate: -4, years: 10 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('INVALID_RATE');
    }
  });

  it('rejects zero or negative years', () => {
    const resZero = calculateDeterministicInflation({ amount: 100000, rate: 6, years: 0 });
    expect(resZero.success).toBe(false);
    if (!resZero.success) {
      expect(resZero.error.code).toBe('INVALID_YEARS');
    }

    const resNeg = calculateDeterministicInflation({ amount: 100000, rate: 6, years: -5 });
    expect(resNeg.success).toBe(false);
    if (!resNeg.success) {
      expect(resNeg.error.code).toBe('INVALID_YEARS');
    }
  });

  it('rejects out of bounds inputs exceeding safety limits', () => {
    const res = calculateDeterministicInflation({ amount: 2000000000, rate: 6, years: 10 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('OUT_OF_BOUNDS_INPUT');
    }
  });
});

describe('Phase 2 — URL Contract', () => {
  it('constructs and parses canonical inflation parameters (?amount=100000&rate=6&years=10)', () => {
    const url = 'https://karuvilab.com/calculators/inflation-calculator/?amount=100000&rate=6&years=10';
    const parsed = new URL(url);
    expect(parsed.searchParams.get('amount')).toBe('100000');
    expect(parsed.searchParams.get('rate')).toBe('6');
    expect(parsed.searchParams.get('years')).toBe('10');

    const res = calculateDeterministicInflation({
      amount: Number(parsed.searchParams.get('amount')),
      rate: Number(parsed.searchParams.get('rate')),
      years: Number(parsed.searchParams.get('years')),
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.futureCost).toBeCloseTo(179084.77, 1);
    }
  });
});

describe('Phase 3 — Semantic DOM Contract Spec', () => {
  it('defines stable semantic data attributes for Inflation Calculator', () => {
    const expected = {
      tool: 'inflation-calculator',
      inputs: ['amount', 'rate', 'years', 'preset'],
      results: [
        'future-cost',
        'purchasing-power',
        'loss-percent',
        'halving-time',
        'multiplier',
      ],
    };

    expect(expected.tool).toBe('inflation-calculator');
    expect(expected.inputs).toContain('amount');
    expect(expected.inputs).toContain('rate');
    expect(expected.inputs).toContain('years');
    expect(expected.inputs).toContain('preset');
    expect(expected.results).toContain('future-cost');
    expect(expected.results).toContain('purchasing-power');
    expect(expected.results).toContain('loss-percent');
    expect(expected.results).toContain('halving-time');
    expect(expected.results).toContain('multiplier');
  });
});

describe('Phase 5 — Schema.org & llms.txt Contract', () => {
  it('validates tool content meets E-E-A-T requirements', async () => {
    const { inflationCalculator } = await import('@/src/content/tools/inflation-calculator');
    expect(inflationCalculator.faq?.length).toBeGreaterThanOrEqual(5);
    expect(inflationCalculator.examples?.length).toBeGreaterThanOrEqual(3);
    expect(inflationCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
    expect(inflationCalculator.useCases?.length).toBeGreaterThanOrEqual(3);

    // Check detailedDescription word count > 400
    const wordCount = (inflationCalculator.detailedDescription || '')
      .replace(/<[^>]*>/g, ' ')
      .trim()
      .split(/\s+/)
      .length;
    expect(wordCount).toBeGreaterThan(400);
  });

  it('validates public/llms.txt contains canonical inflation calculator specification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');

    expect(llmsContent).toContain('[Inflation Calculator](https://karuvilab.com/calculators/inflation-calculator/)');
  });
});
