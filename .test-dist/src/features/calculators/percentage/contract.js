import { calculatePercentageOf, calculateWhatPercentage, calculatePercentageChange, calculateReversePercentage } from './engine';
export const percentageContract = {
    name: 'calculate_percentage',
    description: 'A multi-purpose percentage calculator capable of finding X% of Y, what % X is of Y, percentage change from X to Y, and reverse percentages.',
    schema: {
        type: 'object',
        properties: {
            operation: {
                type: 'string',
                enum: ['percentage_of', 'what_percentage', 'percentage_change', 'reverse_percentage'],
                description: 'The type of percentage calculation to perform.'
            },
            x: { type: 'number', description: 'The first value (percentage for "percentage_of", part for "what_percentage", fromValue for "percentage_change", finalValue for "reverse_percentage")' },
            y: { type: 'number', description: 'The second value (total for "percentage_of", total for "what_percentage", toValue for "percentage_change", percentage for "reverse_percentage")' },
            reverseType: { type: 'string', enum: ['increase', 'decrease'], description: 'Only required for reverse_percentage operation.' }
        },
        required: ['operation', 'x', 'y']
    },
    execute: (input) => {
        switch (input.operation) {
            case 'percentage_of':
                return calculatePercentageOf({ percentage: input.x, total: input.y });
            case 'what_percentage':
                return calculateWhatPercentage({ part: input.x, total: input.y });
            case 'percentage_change':
                return calculatePercentageChange({ fromValue: input.x, toValue: input.y });
            case 'reverse_percentage':
                return calculateReversePercentage({ finalValue: input.x, percentage: input.y, type: input.reverseType || 'increase' });
            default:
                throw new Error(`Unknown percentage operation: ${input.operation}`);
        }
    }
};
