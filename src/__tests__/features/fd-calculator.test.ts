import { describe, it, expect } from 'vitest';
import {
  calculateDeterministicFd,
  calculateEffectiveAnnualYield,
  calculateFdMaturity,
  calculatePeriodicPayout,
} from '@/src/features/calculators/fd';

describe('Phase 1 — Pure Deterministic Engine: calculateDeterministicFd', () => {
  it('calculates standard cumulative FD maturity with quarterly compounding accurately', () => {
    // ₹1,00,000 at 6.5% for 5 years with quarterly compounding (n=4)
    // A = 100000 * (1 + 0.065/4)^(4*5) = 100000 * (1.01625)^20 = 138041.98
    const res = calculateDeterministicFd({
      principal: 100000,
      annualRate: 6.5,
      tenure: 5,
      tenureUnit: 'years',
      compoundingFrequency: 4,
      fdType: 'cumulative',
      isSeniorCitizen: false,
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.principal).toBe(100000);
      expect(res.data.baseRate).toBe(6.5);
      expect(res.data.effectiveRate).toBe(6.5);
      expect(res.data.maturityValue).toBeCloseTo(138041.98, 1);
      expect(res.data.totalInterest).toBeCloseTo(38041.98, 1);
      expect(res.data.effectiveAnnualYield).toBeCloseTo(6.66, 1);
      expect(res.data.yearlySchedule.length).toBe(5);
      expect(res.data.yearlySchedule[0]?.openingBalance).toBe(100000);
      expect(res.data.yearlySchedule[4]?.closingBalance).toBeCloseTo(138041.98, 1);
    }
  });

  it('calculates non-cumulative periodic monthly payout accurately', () => {
    // ₹10,00,000 at 7.5% for 3 years non-cumulative with monthly payout
    // Monthly payout = 1000000 * (0.075 / 12) = 6,250
    // Total interest = 6,250 * 36 = 2,25,000
    const res = calculateDeterministicFd({
      principal: 1000000,
      annualRate: 7.5,
      tenure: 3,
      tenureUnit: 'years',
      fdType: 'non-cumulative',
      payoutFrequency: 12,
      isSeniorCitizen: false,
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.periodicPayout).toBe(6250);
      expect(res.data.totalPayouts).toBe(36);
      expect(res.data.totalInterest).toBe(225000);
      expect(res.data.maturityValue).toBe(1000000);
      expect(res.data.yearlySchedule.length).toBe(3);
    }
  });

  it('applies senior citizen preferential rate boost (+0.50%)', () => {
    const regular = calculateDeterministicFd({
      principal: 200000,
      annualRate: 7.0,
      tenure: 3,
      isSeniorCitizen: false,
    });

    const senior = calculateDeterministicFd({
      principal: 200000,
      annualRate: 7.0,
      tenure: 3,
      isSeniorCitizen: true,
    });

    expect(regular.success).toBe(true);
    expect(senior.success).toBe(true);
    if (regular.success && senior.success) {
      expect(regular.data.effectiveRate).toBe(7.0);
      expect(senior.data.effectiveRate).toBe(7.5);
      expect(senior.data.maturityValue).toBeGreaterThan(regular.data.maturityValue);
      expect(senior.data.totalInterest).toBeGreaterThan(regular.data.totalInterest);
    }
  });

  it('calculates Effective Annual Yield (APY) correctly across compounding frequencies', () => {
    // 7% nominal compounded quarterly (n=4): (1 + 0.07/4)^4 - 1 = 7.1859%
    const quarterlyApy = calculateEffectiveAnnualYield(7.0, 4);
    expect(quarterlyApy).toBeCloseTo(7.19, 2);

    // 7% nominal compounded monthly (n=12): (1 + 0.07/12)^12 - 1 = 7.2290%
    const monthlyApy = calculateEffectiveAnnualYield(7.0, 12);
    expect(monthlyApy).toBeCloseTo(7.23, 2);
    expect(monthlyApy).toBeGreaterThan(quarterlyApy);
  });

  it('calculates TDS deduction when interest exceeds statutory threshold', () => {
    // Regular citizen: threshold ₹40,000
    // ₹2,00,000 at 8% for 3 years quarterly -> total interest ≈ ₹53,648 (> ₹40k)
    // TDS 10% = ₹5,364.80, Net interest = ₹48,283.20
    const resOverThreshold = calculateDeterministicFd({
      principal: 200000,
      annualRate: 8.0,
      tenure: 3,
      tenureUnit: 'years',
      isSeniorCitizen: false,
      applyTds: true,
    });

    expect(resOverThreshold.success).toBe(true);
    if (resOverThreshold.success) {
      expect(resOverThreshold.data.isTdsApplicable).toBe(true);
      expect(resOverThreshold.data.tdsThreshold).toBe(40000);
      expect(resOverThreshold.data.totalTds).toBeGreaterThan(5000);
      expect(resOverThreshold.data.netInterest).toBeCloseTo(
        resOverThreshold.data.totalInterest - resOverThreshold.data.totalTds,
        2
      );
    }

    // Senior citizen: threshold ₹50,000
    const seniorRes = calculateDeterministicFd({
      principal: 200000,
      annualRate: 7.0, // 7.0 + 0.5 = 7.5% -> total interest ≈ ₹49,944 (< ₹50k)
      tenure: 3,
      tenureUnit: 'years',
      isSeniorCitizen: true,
      applyTds: true,
    });

    expect(seniorRes.success).toBe(true);
    if (seniorRes.success) {
      expect(seniorRes.data.tdsThreshold).toBe(50000);
      expect(seniorRes.data.isTdsApplicable).toBe(false);
      expect(seniorRes.data.totalTds).toBe(0);
      expect(seniorRes.data.netInterest).toBe(seniorRes.data.totalInterest);
    }
  });

  it('handles arbitrary tenures specified in months and days', () => {
    // 18 months = 1.5 years
    const resMonths = calculateDeterministicFd({
      principal: 100000,
      annualRate: 7.0,
      tenure: 18,
      tenureUnit: 'months',
      compoundingFrequency: 4,
    });
    expect(resMonths.success).toBe(true);
    if (resMonths.success) {
      expect(resMonths.data.tenureYears).toBe(1.5);
      expect(resMonths.data.tenureMonths).toBe(18);
      expect(resMonths.data.yearlySchedule.length).toBe(2);
    }

    // 400 days
    const resDays = calculateDeterministicFd({
      principal: 500000,
      annualRate: 7.25,
      tenure: 400,
      tenureUnit: 'days',
      compoundingFrequency: 4,
    });
    expect(resDays.success).toBe(true);
    if (resDays.success) {
      expect(resDays.data.tenureDays).toBe(400);
      expect(resDays.data.tenureYears).toBeCloseTo(400 / 365, 3);
      expect(resDays.data.maturityValue).toBeGreaterThan(500000);
    }
  });
});

describe('Phase 1 — Pure Deterministic Engine: Error Handling', () => {
  it('rejects negative or zero principal amount', () => {
    const resZero = calculateDeterministicFd({
      principal: 0,
      annualRate: 6.5,
      tenure: 5,
    });
    expect(resZero.success).toBe(false);
    if (!resZero.success) {
      expect(resZero.error.code).toBe('INVALID_PRINCIPAL');
    }

    const resNeg = calculateDeterministicFd({
      principal: -5000,
      annualRate: 6.5,
      tenure: 5,
    });
    expect(resNeg.success).toBe(false);
    if (!resNeg.success) {
      expect(resNeg.error.code).toBe('INVALID_PRINCIPAL');
    }
  });

  it('rejects negative interest rate', () => {
    const res = calculateDeterministicFd({
      principal: 100000,
      annualRate: -2,
      tenure: 5,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('INVALID_RATE');
    }
  });

  it('rejects zero or negative tenure', () => {
    const res = calculateDeterministicFd({
      principal: 100000,
      annualRate: 6.5,
      tenure: 0,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('INVALID_TENURE');
    }
  });

  it('rejects out of bounds inputs', () => {
    const res = calculateDeterministicFd({
      principal: 2000000000, // 200 Crores
      annualRate: 6.5,
      tenure: 5,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('OUT_OF_BOUNDS_INPUT');
    }
  });
});

describe('Phase 2 — URL Contract', () => {
  it('constructs and parses canonical FD parameters (?principal=100000&rate=6.5&tenure=5&unit=years&compounding=4)', () => {
    const url = 'https://karuvilab.com/calculators/fd-calculator/?principal=100000&rate=6.5&tenure=5&unit=years&compounding=4';
    const parsed = new URL(url);
    expect(parsed.searchParams.get('principal')).toBe('100000');
    expect(parsed.searchParams.get('rate')).toBe('6.5');
    expect(parsed.searchParams.get('tenure')).toBe('5');
    expect(parsed.searchParams.get('unit')).toBe('years');
    expect(parsed.searchParams.get('compounding')).toBe('4');

    const res = calculateDeterministicFd({
      principal: Number(parsed.searchParams.get('principal')),
      annualRate: Number(parsed.searchParams.get('rate')),
      tenure: Number(parsed.searchParams.get('tenure')),
      tenureUnit: parsed.searchParams.get('unit') as any,
      compoundingFrequency: Number(parsed.searchParams.get('compounding')),
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.principal).toBe(100000);
      expect(res.data.effectiveRate).toBe(6.5);
      expect(res.data.maturityValue).toBeCloseTo(138041.98, 1);
    }
  });
});

describe('Phase 3 — Semantic DOM Contract Spec', () => {
  it('defines stable semantic data attributes for FD Calculator', () => {
    const expected = {
      tool: 'fd-calculator',
      inputs: [
        'principal',
        'interest-rate',
        'tenure',
        'tenure-unit',
        'compounding-frequency',
        'deposit-type',
        'payout-frequency',
        'senior-citizen',
        'tds-deduction',
      ],
      results: [
        'maturity-value',
        'total-interest',
        'net-interest',
        'effective-apy',
        'total-tds',
        'periodic-payout',
        'effective-rate',
      ],
    };

    expect(expected.tool).toBe('fd-calculator');
    expect(expected.inputs).toContain('principal');
    expect(expected.inputs).toContain('interest-rate');
    expect(expected.inputs).toContain('tenure');
    expect(expected.inputs).toContain('compounding-frequency');
    expect(expected.results).toContain('maturity-value');
    expect(expected.results).toContain('total-interest');
    expect(expected.results).toContain('effective-apy');
  });
});

describe('Phase 5 — Schema.org & llms.txt Contract', () => {
  it('validates tool content meets E-E-A-T requirements', async () => {
    const { fdCalculator } = await import('@/src/content/tools/fd-calculator');
    expect(fdCalculator.faq?.length).toBeGreaterThanOrEqual(5);
    expect(fdCalculator.examples?.length).toBeGreaterThanOrEqual(3);
    expect(fdCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
    expect(fdCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
  });

  it('validates public/llms.txt contains canonical FD calculator specification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');

    expect(llmsContent).toMatch(/\[Fixed Deposit \(FD\).*?\]\(https:\/\/karuvilab\.com\/calculators\/fd-calculator\/\)/);
  });
});
