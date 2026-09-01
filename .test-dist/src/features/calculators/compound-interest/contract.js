import { calculateCompoundInterest } from './engine';
export const compoundInterestContract = {
    name: 'calculate_compound_interest',
    description: 'Calculates compound interest with optional recurring monthly contributions and inflation adjustment.',
    schema: {
        type: 'object',
        properties: {
            principal: { type: 'number', description: 'Initial investment amount.' },
            annualRate: { type: 'number', description: 'Annual interest rate (e.g. 10 for 10%).' },
            years: { type: 'number', description: 'Investment duration in years.' },
            frequency: {
                type: 'number',
                enum: [1, 2, 4, 12, 365],
                description: 'Compounding frequency per year (1=Annually, 12=Monthly).'
            },
            monthlyContribution: { type: 'number', description: 'Optional. Recurring monthly deposit.' },
            inflationRate: { type: 'number', description: 'Optional. Expected annual inflation rate for real value projection.' }
        },
        required: ['principal', 'annualRate', 'years', 'frequency']
    },
    execute: (input) => {
        return calculateCompoundInterest(input);
    }
};
