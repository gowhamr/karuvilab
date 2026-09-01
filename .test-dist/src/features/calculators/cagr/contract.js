import { calculateCagr } from './engine';
export const cagrContract = {
    name: 'calculate_cagr',
    description: 'Calculates the Compound Annual Growth Rate (CAGR) and absolute return of an investment over a specific duration.',
    schema: {
        type: 'object',
        properties: {
            initialValue: { type: 'number', description: 'The initial investment value or beginning value (BV).' },
            finalValue: { type: 'number', description: 'The final value or ending value (EV).' },
            years: { type: 'number', description: 'The duration of the investment in years.' }
        },
        required: ['initialValue', 'finalValue', 'years']
    },
    execute: (input) => {
        return calculateCagr(input);
    }
};
