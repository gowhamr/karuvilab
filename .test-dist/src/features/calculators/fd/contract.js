import { calculateDeterministicFd } from './engine';
export const fdContract = {
    name: 'calculate_fixed_deposit',
    description: 'Calculates Fixed Deposit (FD) maturity, interest, and TDS. Supports cumulative and non-cumulative (payout) FD types.',
    schema: {
        type: 'object',
        properties: {
            principal: { type: 'number', description: 'Initial deposit amount.' },
            annualRate: { type: 'number', description: 'Base annual interest rate (e.g. 7.5 for 7.5%).' },
            tenure: { type: 'number', description: 'Duration of the FD.' },
            tenureUnit: { type: 'string', enum: ['days', 'months', 'years'], description: 'Unit of the tenure.' },
            compoundingFrequency: { type: 'number', enum: [1, 2, 4, 12], description: 'Compounding periods per year (1=Annual, 4=Quarterly).' },
            fdType: { type: 'string', enum: ['cumulative', 'payout'], description: 'Type of FD (cumulative reinvests interest).' },
            payoutFrequency: { type: 'number', enum: [1, 2, 4, 12], description: 'Interest payout frequency (only for payout type).' },
            isSeniorCitizen: { type: 'boolean', description: 'Optional. Adds senior citizen boost if true.' },
            seniorCitizenBoost: { type: 'number', description: 'Optional. Extra interest rate for senior citizens (defaults to 0.5).' },
            applyTds: { type: 'boolean', description: 'Optional. Calculate Tax Deducted at Source (TDS).' },
            tdsRate: { type: 'number', description: 'Optional. TDS rate percentage (defaults to 10).' }
        },
        required: ['principal', 'annualRate', 'tenure']
    },
    execute: (input) => {
        return calculateDeterministicFd(input);
    }
};
