import { calculateDeterministicInflation } from './engine';
export const inflationContract = {
    name: 'calculate_inflation',
    description: 'Calculates the future cost of goods and the erosion of purchasing power over time due to inflation.',
    schema: {
        type: 'object',
        properties: {
            amount: { type: 'number', description: 'The present value or initial amount.' },
            rate: { type: 'number', description: 'The expected annual inflation rate (e.g. 6 for 6%).' },
            years: { type: 'number', description: 'The time duration in years.' }
        },
        required: ['amount', 'rate', 'years']
    },
    execute: (input) => {
        return calculateDeterministicInflation(input);
    }
};
