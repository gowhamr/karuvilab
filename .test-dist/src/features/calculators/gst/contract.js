import { calculateGst } from './engine';
export const gstContract = {
    name: 'calculate_gst',
    description: 'Calculates Indian Goods and Services Tax (GST). Can add GST to a base amount (exclusive) or extract GST from a total amount (inclusive).',
    schema: {
        type: 'object',
        properties: {
            amount: { type: 'number', description: 'The monetary amount to calculate GST on or extract from.' },
            gstRatePercent: { type: 'number', description: 'The GST percentage rate (e.g. 5, 12, 18, 28).' },
            type: {
                type: 'string',
                enum: ['exclusive', 'inclusive'],
                description: 'exclusive: Add GST to the amount. inclusive: The amount already contains GST.'
            },
            isInterstate: {
                type: 'boolean',
                description: 'Optional. If true, outputs IGST. If false, splits into CGST & SGST. Defaults to false.'
            }
        },
        required: ['amount', 'gstRatePercent', 'type']
    },
    execute: (input) => {
        return calculateGst(input);
    }
};
