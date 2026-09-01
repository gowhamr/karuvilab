import { calculateDeterministicEmi } from './engine';
export const emiContract = {
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
