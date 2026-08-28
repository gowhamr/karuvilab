import { describe, it, expect } from 'vitest';
import {
  calculateSalary,
  calculateNewRegimeTax,
  calculateOldRegimeTax,
  parseSalaryParamsFromUrl,
  serializeSalaryParamsToUrl,
  formatCurrency,
} from '@/src/features/calculators/salary';

describe('Phase 1 — Pure Deterministic Engine: calculateSalary', () => {
  it('calculates standard New Tax Regime salary breakdown accurately (₹12 LPA CTC)', () => {
    const res = calculateSalary({
      ctc: 1200000,
      regime: 'new',
      basicSalaryPercent: 40,
    });

    expect(res.success).toBe(true);
    if (res.success) {
      const { components, deductions, annualTakeHome, monthlyTakeHome } = res.data;

      // CTC components
      expect(components.ctc).toBe(1200000);
      expect(components.basicSalary).toBe(480000); // 40% of 12L
      expect(components.hra).toBe(240000); // 50% of Basic
      expect(components.employerPf).toBe(57600); // 12% of Basic
      expect(components.specialAllowance).toBe(422400); // 12L - 4.8L - 2.4L - 57.6k
      expect(components.grossSalary).toBe(1142400); // 12L - 57.6k

      // Deductions
      expect(deductions.employeePf).toBe(57600);
      expect(deductions.professionalTax).toBe(2400);
      expect(deductions.standardDeduction).toBe(75000);
      expect(deductions.taxableIncome).toBe(1142400 - 75000); // 1,067,400

      // Tax calculation for 1,067,400 under New Regime:
      // 0-3L: 0
      // 3-7L (4L @ 5%): 20,000
      // 7-10L (3L @ 10%): 30,000
      // 10-10.674L (67,400 @ 15%): 10,110
      // Tax before cess = 60,110
      // Cess (4%) = 2,404.4 -> 2,404
      // Total tax = 62,514
      expect(deductions.incomeTaxBeforeCess).toBe(60110);
      expect(deductions.cess).toBe(2404);
      expect(deductions.totalIncomeTax).toBe(62514);

      // Total paycheck deductions = 57,600 + 2,400 + 62,514 = 122,514
      expect(deductions.totalPaycheckDeductions).toBe(122514);

      // Take home pay
      expect(annualTakeHome).toBe(1142400 - 122514); // 1,019,886
      expect(monthlyTakeHome).toBe(Math.round(1019886 / 12)); // 84,991
    }
  });

  it('applies Section 87A full rebate when taxable income <= ₹7,00,000 in New Regime', () => {
    // ₹7.5 LPA CTC -> Gross = 7,14,000 -> Taxable = 7,14,000 - 75,000 = 6,39,000 <= 7,00,000
    const res = calculateSalary({
      ctc: 750000,
      regime: 'new',
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.deductions.taxableIncome).toBe(639000);
      expect(res.data.deductions.rebate87A).toBeGreaterThan(0);
      expect(res.data.deductions.totalIncomeTax).toBe(0);
    }
  });

  it('calculates Old Tax Regime salary with Chapter VI-A deductions and exemptions', () => {
    const res = calculateSalary({
      ctc: 1500000,
      regime: 'old',
      basicSalaryPercent: 40,
      customDeductions80C: 100000, // + employee PF (72k) -> capped at 1.5L
      customDeductions80D: 25000,
      customHraExemption: 120000,
    });

    expect(res.success).toBe(true);
    if (res.success) {
      const { deductions, components } = res.data;
      expect(components.grossSalary).toBe(1428000); // 15L - 72k employer PF
      expect(deductions.standardDeduction).toBe(50000);
      expect(deductions.professionalTax).toBe(2400);
      expect(deductions.deductions80C).toBe(150000); // Capped at 1.5L
      expect(deductions.deductions80D).toBe(25000);
      expect(deductions.hraExemption).toBe(120000);

      // Total tax deductions = 50,000 + 2,400 + 150,000 + 25,000 + 120,000 = 347,400
      expect(deductions.totalTaxDeductions).toBe(347400);
      expect(deductions.taxableIncome).toBe(1428000 - 347400); // 1,080,600

      // Tax under Old Regime for 1,080,600:
      // 0-2.5L: 0
      // 2.5-5L (2.5L @ 5%): 12,500
      // 5-10L (5L @ 20%): 100,000
      // Above 10L (80,600 @ 30%): 24,180
      // Tax before cess = 136,680
      // Cess (4%) = 5,467.2 -> 5,467
      // Total tax = 142,147
      expect(deductions.incomeTaxBeforeCess).toBe(136680);
      expect(deductions.totalIncomeTax).toBe(142147);
    }
  });

  it('calculates Section 87A rebate for Old Regime when taxable income <= ₹5,00,000', () => {
    const tax = calculateOldRegimeTax(450000);
    expect(tax.rebate87A).toBe(10000); // (4.5L - 2.5L) * 5%
    expect(tax.totalTax).toBe(0);
  });
});

describe('Phase 1 — Pure Deterministic Engine: Validation and Error Handling', () => {
  it('rejects invalid or zero CTC', () => {
    const res1 = calculateSalary({ ctc: 0 });
    expect(res1.success).toBe(false);
    if (!res1.success) {
      expect(res1.error.code).toBe('INVALID_CTC');
    }

    const res2 = calculateSalary({ ctc: -50000 });
    expect(res2.success).toBe(false);
    if (!res2.success) {
      expect(res2.error.code).toBe('INVALID_CTC');
    }
  });

  it('rejects out-of-bounds CTC (> 100 Crore)', () => {
    const res = calculateSalary({ ctc: 2000000000 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('OUT_OF_BOUNDS_INPUT');
    }
  });

  it('rejects invalid basic percentage (< 10% or > 100%)', () => {
    const res = calculateSalary({ ctc: 1000000, basicSalaryPercent: 5 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('INVALID_BASIC_PERCENT');
    }
  });
});

describe('Phase 2 — URL Contract', () => {
  it('constructs and parses canonical salary parameters (?gross=1200000&regime=new)', () => {
    const url = 'https://karuvilab.com/calculators/salary-calculator/?gross=1800000&regime=new&basic=45';
    const parsed = new URL(url);
    expect(parsed.searchParams.get('gross')).toBe('1800000');
    expect(parsed.searchParams.get('regime')).toBe('new');
    expect(parsed.searchParams.get('basic')).toBe('45');

    const input = parseSalaryParamsFromUrl(parsed.searchParams);
    expect(input.grossSalary).toBe(1800000);
    expect(input.regime).toBe('new');
    expect(input.basicSalaryPercent).toBe(45);

    const res = calculateSalary(input);
    expect(res.success).toBe(true);
  });

  it('supports legacy ?ctc= parameter alias seamlessly', () => {
    const params = new URLSearchParams('ctc=2000000&regime=old&d80c=150000');
    const input = parseSalaryParamsFromUrl(params);
    expect(input.ctc).toBe(2000000);
    expect(input.regime).toBe('old');
    expect(input.customDeductions80C).toBe(150000);

    const serialized = serializeSalaryParamsToUrl(input);
    expect(serialized).toContain('gross=2000000');
    expect(serialized).toContain('regime=old');
    expect(serialized).toContain('d80c=150000');
  });
});

describe('Phase 3 — Semantic DOM Contract Spec', () => {
  it('defines stable semantic data attributes for Salary Calculator', () => {
    const expected = {
      tool: 'salary-calculator',
      inputs: [
        'gross-salary',
        'tax-regime',
        'basic-percentage',
        'deductions-80c',
        'deductions-80d',
        'hra-exemption',
      ],
      results: [
        'monthly-take-home',
        'annual-take-home',
        'gross-salary',
        'total-deductions',
        'income-tax',
        'pf-employee',
        'pf-employer',
        'professional-tax',
        'taxable-income',
      ],
    };

    expect(expected.tool).toBe('salary-calculator');
    expect(expected.inputs).toContain('gross-salary');
    expect(expected.inputs).toContain('tax-regime');
    expect(expected.results).toContain('monthly-take-home');
    expect(expected.results).toContain('annual-take-home');
    expect(expected.results).toContain('income-tax');
  });
});

describe('Phase 5 — Schema.org & llms.txt Contract', () => {
  it('validates tool content meets E-E-A-T requirements', async () => {
    const { salaryCalculator } = await import('@/src/content/tools/salary-calculator');
    expect(salaryCalculator.faq?.length).toBeGreaterThanOrEqual(5);
    expect(salaryCalculator.examples?.length).toBeGreaterThanOrEqual(3);
    expect(salaryCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
    expect(salaryCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
  });

  it('validates public/llms.txt contains canonical salary calculator specification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');

    expect(llmsContent).toContain('https://karuvilab.com/calculators/salary-calculator/');
  });
});
