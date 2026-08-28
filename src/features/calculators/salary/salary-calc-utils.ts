import {
  SalaryCalculationInput,
  SalaryCalculationResult,
  SalaryCalculationResponse,
  TaxRegime,
  TaxSlabEntry,
} from './types';

export function formatCurrency(
  val: number,
  locale = 'en-IN',
  currency = 'INR'
): string {
  if (!isFinite(val)) return '₹0';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(val));
}

export function formatNumber(val: number, maxDecimals = 2): string {
  if (!isFinite(val)) return '0';
  return Number(val.toFixed(maxDecimals)).toLocaleString('en-US', {
    maximumFractionDigits: maxDecimals,
  });
}

export const NEW_REGIME_SLAB_DEFS = [
  { min: 0, max: 300000, rate: 0, range: '₹0 – ₹3L', rateLabel: '0%' },
  { min: 300000, max: 700000, rate: 0.05, range: '₹3L – ₹7L', rateLabel: '5%' },
  { min: 700000, max: 1000000, rate: 0.10, range: '₹7L – ₹10L', rateLabel: '10%' },
  { min: 1000000, max: 1200000, rate: 0.15, range: '₹10L – ₹12L', rateLabel: '15%' },
  { min: 1200000, max: 1500000, rate: 0.20, range: '₹12L – ₹15L', rateLabel: '20%' },
  { min: 1500000, max: Infinity, rate: 0.30, range: 'Above ₹15L', rateLabel: '30%' },
];

export const OLD_REGIME_SLAB_DEFS = [
  { min: 0, max: 250000, rate: 0, range: '₹0 – ₹2.5L', rateLabel: '0%' },
  { min: 250000, max: 500000, rate: 0.05, range: '₹2.5L – ₹5L', rateLabel: '5%' },
  { min: 500000, max: 1000000, rate: 0.20, range: '₹5L – ₹10L', rateLabel: '20%' },
  { min: 1000000, max: Infinity, rate: 0.30, range: 'Above ₹10L', rateLabel: '30%' },
];

/**
 * Calculates Income Tax under New Tax Regime (FY 2024-25 / 2025-26 Budget)
 * Standard Deduction: ₹75,000
 * Section 87A: Full rebate if taxable income <= ₹7,00,000 (up to ₹25,000)
 * Marginal relief for income between ₹7,00,000 and ₹7,27,777
 * Cess: 4% Health & Education Cess
 */
export function calculateNewRegimeTax(taxableIncome: number): {
  taxBeforeCess: number;
  rebate87A: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  slabs: TaxSlabEntry[];
} {
  const roundedTaxable = Math.max(0, Math.round(taxableIncome));
  let unrebatedTax = 0;
  const slabs: TaxSlabEntry[] = [];

  for (const slab of NEW_REGIME_SLAB_DEFS) {
    if (roundedTaxable > slab.min) {
      const taxableAmount = Math.min(roundedTaxable, slab.max) - slab.min;
      const slabTax = taxableAmount * slab.rate;
      unrebatedTax += slabTax;
      slabs.push({
        range: slab.range,
        rate: slab.rateLabel,
        ratePercent: slab.rate * 100,
        taxableAmount: Math.round(taxableAmount),
        tax: Math.round(slabTax),
      });
    } else {
      slabs.push({
        range: slab.range,
        rate: slab.rateLabel,
        ratePercent: slab.rate * 100,
        taxableAmount: 0,
        tax: 0,
      });
    }
  }

  // Section 87A Rebate
  let rebate87A = 0;
  let taxAfterRebate = unrebatedTax;

  if (roundedTaxable <= 700000) {
    rebate87A = unrebatedTax;
    taxAfterRebate = 0;
  } else if (roundedTaxable <= 727777) {
    // Marginal relief under Section 87A: tax cannot exceed taxableIncome - 700,000
    const maxTaxAllowable = roundedTaxable - 700000;
    if (unrebatedTax > maxTaxAllowable) {
      rebate87A = unrebatedTax - maxTaxAllowable;
      taxAfterRebate = maxTaxAllowable;
    }
  }

  // Surcharge (New regime caps surcharge at 25%)
  let surchargeRate = 0;
  if (roundedTaxable > 20000000) surchargeRate = 0.25; // > 2 Cr
  else if (roundedTaxable > 10000000) surchargeRate = 0.15; // > 1 Cr
  else if (roundedTaxable > 5000000) surchargeRate = 0.10; // > 50 Lakh

  const surcharge = taxAfterRebate * surchargeRate;
  const cess = (taxAfterRebate + surcharge) * 0.04;
  const totalTax = Math.round(taxAfterRebate + surcharge + cess);

  return {
    taxBeforeCess: Math.round(unrebatedTax),
    rebate87A: Math.round(rebate87A),
    taxAfterRebate: Math.round(taxAfterRebate),
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    totalTax,
    slabs,
  };
}

/**
 * Calculates Income Tax under Old Tax Regime
 * Standard Deduction: ₹50,000
 * Section 87A: Full rebate if taxable income <= ₹5,00,000 (up to ₹12,500)
 * Cess: 4% Health & Education Cess
 */
export function calculateOldRegimeTax(taxableIncome: number): {
  taxBeforeCess: number;
  rebate87A: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  slabs: TaxSlabEntry[];
} {
  const roundedTaxable = Math.max(0, Math.round(taxableIncome));
  let unrebatedTax = 0;
  const slabs: TaxSlabEntry[] = [];

  for (const slab of OLD_REGIME_SLAB_DEFS) {
    if (roundedTaxable > slab.min) {
      const taxableAmount = Math.min(roundedTaxable, slab.max) - slab.min;
      const slabTax = taxableAmount * slab.rate;
      unrebatedTax += slabTax;
      slabs.push({
        range: slab.range,
        rate: slab.rateLabel,
        ratePercent: slab.rate * 100,
        taxableAmount: Math.round(taxableAmount),
        tax: Math.round(slabTax),
      });
    } else {
      slabs.push({
        range: slab.range,
        rate: slab.rateLabel,
        ratePercent: slab.rate * 100,
        taxableAmount: 0,
        tax: 0,
      });
    }
  }

  // Section 87A Rebate for Old Regime
  let rebate87A = 0;
  let taxAfterRebate = unrebatedTax;

  if (roundedTaxable <= 500000) {
    rebate87A = unrebatedTax;
    taxAfterRebate = 0;
  }

  // Surcharge (Old regime)
  let surchargeRate = 0;
  if (roundedTaxable > 50000000) surchargeRate = 0.37; // > 5 Cr
  else if (roundedTaxable > 20000000) surchargeRate = 0.25; // > 2 Cr
  else if (roundedTaxable > 10000000) surchargeRate = 0.15; // > 1 Cr
  else if (roundedTaxable > 5000000) surchargeRate = 0.10; // > 50 Lakh

  const surcharge = taxAfterRebate * surchargeRate;
  const cess = (taxAfterRebate + surcharge) * 0.04;
  const totalTax = Math.round(taxAfterRebate + surcharge + cess);

  return {
    taxBeforeCess: Math.round(unrebatedTax),
    rebate87A: Math.round(rebate87A),
    taxAfterRebate: Math.round(taxAfterRebate),
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    totalTax,
    slabs,
  };
}

/**
 * Pure Deterministic Indian Salary & Take-Home Pay Calculation Engine
 */
export function calculateSalary(input: SalaryCalculationInput): SalaryCalculationResponse {
  const ctc = input.ctc !== undefined ? input.ctc : input.grossSalary;

  if (ctc === undefined || isNaN(ctc)) {
    return {
      success: false,
      error: {
        code: 'INVALID_CTC',
        message: 'Please provide a valid annual CTC or Gross Salary amount.',
      },
    };
  }

  if (ctc <= 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_CTC',
        message: 'Annual CTC must be greater than zero.',
      },
    };
  }

  if (ctc > 1000000000) {
    return {
      success: false,
      error: {
        code: 'OUT_OF_BOUNDS_INPUT',
        message: 'Annual salary exceeds maximum allowable threshold (₹100 Crore).',
      },
    };
  }

  const basicSalaryPercent = input.basicSalaryPercent ?? 40;
  if (isNaN(basicSalaryPercent) || basicSalaryPercent < 10 || basicSalaryPercent > 100) {
    return {
      success: false,
      error: {
        code: 'INVALID_BASIC_PERCENT',
        message: 'Basic salary percentage must be between 10% and 100% of CTC.',
      },
    };
  }

  const regime: TaxRegime = input.regime === 'old' ? 'old' : 'new';
  const hraPercent = input.hraPercent ?? 50;
  const includePf = input.includePf ?? true;
  const includeProfessionalTax = input.includeProfessionalTax ?? true;
  const professionalTaxAmount = includeProfessionalTax
    ? Math.max(0, input.professionalTaxAmount ?? 2400)
    : 0;

  const customDeductions80C = Math.max(0, input.customDeductions80C ?? 0);
  const customDeductions80D = Math.max(0, input.customDeductions80D ?? 0);
  const customHraExemption = Math.max(0, input.customHraExemption ?? 0);
  const otherDeductions = Math.max(0, input.otherDeductions ?? 0);

  if (
    customDeductions80C < 0 ||
    customDeductions80D < 0 ||
    customHraExemption < 0 ||
    otherDeductions < 0
  ) {
    return {
      success: false,
      error: {
        code: 'NEGATIVE_VALUE',
        message: 'Deduction and exemption values cannot be negative.',
      },
    };
  }

  // Calculate Salary Components
  const basicSalary = Math.round(ctc * (basicSalaryPercent / 100));
  const hra = Math.round(basicSalary * (hraPercent / 100));
  const employerPf = includePf ? Math.round(basicSalary * 0.12) : 0;
  const employeePf = includePf ? Math.round(basicSalary * 0.12) : 0;
  const professionalTax = professionalTaxAmount;

  // Balancing figure for allowances so Basic + HRA + Special Allowance + Employer PF = CTC
  const specialAllowance = Math.max(0, Math.round(ctc - basicSalary - hra - employerPf));
  const grossSalary = basicSalary + hra + specialAllowance; // equals ctc - employerPf

  // Calculate Tax Deductions based on chosen regime
  let standardDeduction = 0;
  let effective80C = 0;
  let effective80D = 0;
  let effectiveHraExemption = 0;
  let effectiveOtherDeductions = 0;
  let totalTaxDeductions = 0;
  let taxableIncome = 0;
  let taxDetails;

  if (regime === 'new') {
    standardDeduction = 75000;
    effectiveOtherDeductions = otherDeductions; // e.g. 80CCD(2) employer NPS if provided
    totalTaxDeductions = standardDeduction + effectiveOtherDeductions;
    taxableIncome = Math.max(0, grossSalary - totalTaxDeductions);
    taxDetails = calculateNewRegimeTax(taxableIncome);
  } else {
    standardDeduction = 50000;
    // Section 80C limit: ₹1,50,000 (includes employee PF contribution)
    effective80C = Math.min(150000, employeePf + customDeductions80C);
    effective80D = Math.min(100000, customDeductions80D);
    effectiveHraExemption = Math.min(hra, customHraExemption);
    effectiveOtherDeductions = otherDeductions;
    totalTaxDeductions =
      standardDeduction +
      professionalTax +
      effective80C +
      effective80D +
      effectiveHraExemption +
      effectiveOtherDeductions;
    taxableIncome = Math.max(0, grossSalary - totalTaxDeductions);
    taxDetails = calculateOldRegimeTax(taxableIncome);
  }

  // Paycheck Deductions = Employee PF + Professional Tax + Total Income Tax
  const totalPaycheckDeductions = employeePf + professionalTax + taxDetails.totalTax;
  const annualTakeHome = Math.max(0, grossSalary - totalPaycheckDeductions);
  const monthlyTakeHome = Math.round(annualTakeHome / 12);
  const monthlyGrossSalary = Math.round(grossSalary / 12);
  const monthlyTotalDeductions = Math.round(totalPaycheckDeductions / 12);
  const monthlyIncomeTax = Math.round(taxDetails.totalTax / 12);
  const monthlyPf = Math.round(employeePf / 12);
  const monthlyProfessionalTax = Math.round(professionalTax / 12);

  const effectiveTaxRate = grossSalary > 0 ? (taxDetails.totalTax / grossSalary) * 100 : 0;

  const formula = `Gross (${formatCurrency(grossSalary)}) - [PF (${formatCurrency(employeePf)}) + PT (${formatCurrency(professionalTax)}) + Tax (${formatCurrency(taxDetails.totalTax)})] = In-Hand ${formatCurrency(annualTakeHome)}/yr (${formatCurrency(monthlyTakeHome)}/mo)`;

  return {
    success: true,
    data: {
      ctc,
      grossSalary,
      regime,
      components: {
        ctc,
        basicSalary,
        hra,
        specialAllowance,
        employerPf,
        grossSalary,
      },
      deductions: {
        employeePf,
        employerPf,
        professionalTax,
        standardDeduction,
        deductions80C: effective80C,
        deductions80D: effective80D,
        hraExemption: effectiveHraExemption,
        otherDeductions: effectiveOtherDeductions,
        totalTaxDeductions,
        taxableIncome,
        incomeTaxBeforeCess: taxDetails.taxBeforeCess,
        rebate87A: taxDetails.rebate87A,
        surcharge: taxDetails.surcharge,
        cess: taxDetails.cess,
        totalIncomeTax: taxDetails.totalTax,
        totalPaycheckDeductions,
      },
      annualTakeHome,
      monthlyTakeHome,
      monthlyGrossSalary,
      monthlyTotalDeductions,
      monthlyIncomeTax,
      monthlyPf,
      monthlyProfessionalTax,
      effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
      slabs: taxDetails.slabs,
      formula,
      formattedAnnualTakeHome: formatCurrency(annualTakeHome),
      formattedMonthlyTakeHome: formatCurrency(monthlyTakeHome),
      formattedGrossSalary: formatCurrency(grossSalary),
      formattedTotalDeductions: formatCurrency(totalPaycheckDeductions),
      formattedTotalTax: formatCurrency(taxDetails.totalTax),
      formattedTaxableIncome: formatCurrency(taxableIncome),
      formattedBasicSalary: formatCurrency(basicSalary),
      formattedHra: formatCurrency(hra),
      formattedSpecialAllowance: formatCurrency(specialAllowance),
      formattedPfEmployee: formatCurrency(employeePf),
      formattedPfEmployer: formatCurrency(employerPf),
      formattedProfessionalTax: formatCurrency(professionalTax),
    },
  };
}

export function parseSalaryParamsFromUrl(
  searchParams: URLSearchParams | Record<string, string | null | undefined>
): SalaryCalculationInput {
  const getParam = (key: string): string | null => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key);
    }
    return searchParams[key] ?? null;
  };

  const grossRaw = getParam('gross') ?? getParam('ctc');
  const regimeRaw = getParam('regime');
  const basicRaw = getParam('basic');
  const ded80cRaw = getParam('d80c');
  const ded80dRaw = getParam('d80d');
  const hraExemptRaw = getParam('hraExempt');

  const grossSalary = grossRaw ? parseFloat(grossRaw) : 1200000;
  const regime: TaxRegime = regimeRaw === 'old' ? 'old' : 'new';
  const basicSalaryPercent = basicRaw ? parseFloat(basicRaw) : 40;
  const customDeductions80C = ded80cRaw ? parseFloat(ded80cRaw) : 0;
  const customDeductions80D = ded80dRaw ? parseFloat(ded80dRaw) : 0;
  const customHraExemption = hraExemptRaw ? parseFloat(hraExemptRaw) : 0;

  return {
    grossSalary: isNaN(grossSalary) ? 1200000 : grossSalary,
    ctc: isNaN(grossSalary) ? 1200000 : grossSalary,
    regime,
    basicSalaryPercent: isNaN(basicSalaryPercent) ? 40 : basicSalaryPercent,
    customDeductions80C: isNaN(customDeductions80C) ? 0 : customDeductions80C,
    customDeductions80D: isNaN(customDeductions80D) ? 0 : customDeductions80D,
    customHraExemption: isNaN(customHraExemption) ? 0 : customHraExemption,
  };
}

export function serializeSalaryParamsToUrl(input: SalaryCalculationInput): string {
  const params = new URLSearchParams();
  const ctc = input.ctc ?? input.grossSalary ?? 1200000;
  params.set('gross', String(ctc));
  if (input.regime && input.regime !== 'new') {
    params.set('regime', input.regime);
  }
  if (input.basicSalaryPercent && input.basicSalaryPercent !== 40) {
    params.set('basic', String(input.basicSalaryPercent));
  }
  if (input.customDeductions80C && input.customDeductions80C > 0) {
    params.set('d80c', String(input.customDeductions80C));
  }
  if (input.customDeductions80D && input.customDeductions80D > 0) {
    params.set('d80d', String(input.customDeductions80D));
  }
  if (input.customHraExemption && input.customHraExemption > 0) {
    params.set('hraExempt', String(input.customHraExemption));
  }
  return params.toString();
}
