import { calculateDeterministicRd } from './engine';
export const rdContract = {
    name: 'calculate_recurring_deposit',
    description: 'Calculates Recurring Deposit (RD) maturity, interest, and TDS with year-by-year schedule.',
    schema: {
        type: 'object',
        properties: {
            monthlyDeposit: { type: 'number', description: 'Monthly deposit amount.' },
            annualRate: { type: 'number', description: 'Base annual interest rate (e.g. 7.5 for 7.5%).' },
            tenure: { type: 'number', description: 'Duration of the RD.' },
            tenureUnit: { type: 'string', enum: ['months', 'years'], description: 'Unit of the tenure.' },
            compoundingFrequency: { type: 'number', enum: [1, 2, 4, 12], description: 'Compounding periods per year (typically 4 for Quarterly in India).' },
            isSeniorCitizen: { type: 'boolean', description: 'Optional. Adds senior citizen boost if true.' },
            seniorCitizenBoost: { type: 'number', description: 'Optional. Extra interest rate for senior citizens (defaults to 0.5).' },
            applyTds: { type: 'boolean', description: 'Optional. Calculate Tax Deducted at Source (TDS).' },
            tdsRate: { type: 'number', description: 'Optional. TDS rate percentage (defaults to 10).' },
            customTdsThreshold: { type: 'number', description: 'Optional. Override default TDS threshold (40k/50k).' }
        },
        required: ['monthlyDeposit', 'annualRate', 'tenure']
    },
    execute: (input) => {
        return calculateDeterministicRd(input);
    }
};
