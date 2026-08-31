import { ToolContract } from '@/src/webmcp/types';
import { calculateDeterministicEmi } from './engine';
import { EmiCalculationInput, EmiCalculationResponse } from './types';

export const emiContract: ToolContract<EmiCalculationInput, EmiCalculationResponse> = {
  name: 'calculate_emi',
  description: 'Calculates EMI (Equated Monthly Installment) for loans, supporting prepayments, moratoriums, and amortization schedules.',
  schema: {
    type: 'object',
    properties: {
      loanAmount: { type: 'number', description: 'Total principal loan amount.' },
      annualInterestRate: { type: 'number', description: 'Annual interest rate (e.g. 8.5 for 8.5%).' },
      tenureMonths: { type: 'number', description: 'Total loan tenure in months.' },
      floatingRateDelta: { type: 'number', description: 'Optional. Rate change applied.' }
    },
    required: ['loanAmount', 'annualInterestRate', 'tenureMonths']
  },
  execute: (input) => {
    return calculateDeterministicEmi(input);
  }
};
