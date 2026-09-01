import { convertUnit, CATEGORIES_DATA } from './engine';
export const unitConverterContract = {
    name: 'convert_units',
    description: 'Converts a value from one unit to another within a specific category (length, weight, volume, temperature, area, speed).',
    schema: {
        type: 'object',
        properties: {
            category: {
                type: 'string',
                enum: Object.keys(CATEGORIES_DATA),
                description: 'The category of the units (e.g. length, weight, volume).'
            },
            fromUnit: {
                type: 'string',
                description: 'The unit key to convert from (e.g. m, km, kg, lb, C, F).'
            },
            toUnit: {
                type: 'string',
                description: 'The unit key to convert to.'
            },
            value: {
                type: 'number',
                description: 'The numerical value to convert.'
            }
        },
        required: ['category', 'fromUnit', 'toUnit', 'value']
    },
    execute: (input) => {
        const result = convertUnit(input.category, input.fromUnit, input.toUnit, input.value);
        return {
            result,
            formula: `${input.value} ${input.fromUnit} = ${result} ${input.toUnit}`
        };
    }
};
