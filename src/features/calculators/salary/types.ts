export type TaxRegime = 'new' | 'old';

export interface SalaryCalculationInput {
  grossSalary?: number | undefined; // Gross CTC / Annual Package
  ctc?: number | undefined; // Alias for grossSalary / Cost to Company
  regime?: TaxRegime | undefined; // 'new' (default) or 'old'
  basicSalaryPercent?: number | undefined; // % of CTC (default 40%)
  hraPercent?: number | undefined; // % of Basic (default 50%)
  includePf?: boolean | undefined; // Include 12% Employee & Employer EPF (default true)
  includeProfessionalTax?: boolean | undefined; // Include Professional Tax ₹2,400/yr (default true)
  professionalTaxAmount?: number | undefined; // Custom annual PT (default 2400)
  customDeductions80C?: number | undefined; // 80C deductions (PPF, ELSS, Life Insurance etc., default 0)
  customDeductions80D?: number | undefined; // 80D medical insurance deduction (default 0)
  customHraExemption?: number | undefined; // Section 10(13A) HRA exemption under Old Regime (default 0)
  otherDeductions?: number | undefined; // Other deductions (Section 24b home loan interest, 80CCD, etc.)
}

export interface SalaryComponentBreakdown {
  ctc: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  employerPf: number;
  grossSalary: number;
}

export interface SalaryDeductionsBreakdown {
  employeePf: number;
  employerPf: number;
  professionalTax: number;
  standardDeduction: number;
  deductions80C: number;
  deductions80D: number;
  hraExemption: number;
  otherDeductions: number;
  totalTaxDeductions: number;
  taxableIncome: number;
  incomeTaxBeforeCess: number;
  rebate87A: number;
  surcharge: number;
  cess: number;
  totalIncomeTax: number;
  totalPaycheckDeductions: number;
}

export interface TaxSlabEntry {
  range: string;
  rate: string;
  ratePercent: number;
  taxableAmount: number;
  tax: number;
}

export interface SalaryCalculationResult {
  ctc: number;
  grossSalary: number;
  regime: TaxRegime;
  components: SalaryComponentBreakdown;
  deductions: SalaryDeductionsBreakdown;
  annualTakeHome: number;
  monthlyTakeHome: number;
  monthlyGrossSalary: number;
  monthlyTotalDeductions: number;
  monthlyIncomeTax: number;
  monthlyPf: number;
  monthlyProfessionalTax: number;
  effectiveTaxRate: number;
  slabs: TaxSlabEntry[];
  formula: string;
  formattedAnnualTakeHome: string;
  formattedMonthlyTakeHome: string;
  formattedGrossSalary: string;
  formattedTotalDeductions: string;
  formattedTotalTax: string;
  formattedTaxableIncome: string;
  formattedBasicSalary: string;
  formattedHra: string;
  formattedSpecialAllowance: string;
  formattedPfEmployee: string;
  formattedPfEmployer: string;
  formattedProfessionalTax: string;
}

export type SalaryCalculatorErrorCode =
  | 'INVALID_CTC'
  | 'INVALID_BASIC_PERCENT'
  | 'INVALID_REGIME'
  | 'NEGATIVE_VALUE'
  | 'OUT_OF_BOUNDS_INPUT';

export interface SalaryCalculatorError {
  code: SalaryCalculatorErrorCode;
  message: string;
}

export type SalaryCalculationResponse =
  | { success: true; data: SalaryCalculationResult }
  | { success: false; error: SalaryCalculatorError };
