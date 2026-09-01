import { calculateAge } from './engine';
export const ageCalculatorContract = {
    name: 'calculate_age',
    description: 'Calculates precise age, total days, and next birthday details given a date of birth and an optional "as of" date.',
    schema: {
        type: 'object',
        properties: {
            dob: {
                type: 'string',
                description: 'Date of birth in YYYY-MM-DD format (e.g. 2001-04-30)'
            },
            as_of: {
                type: 'string',
                description: 'Optional. The target date for calculation in YYYY-MM-DD format. Defaults to today.'
            }
        },
        required: ['dob']
    },
    execute: (input) => {
        const ageInput = {
            dateOfBirth: input.dob,
            ...(input.as_of ? { asOfDate: input.as_of } : {})
        };
        return calculateAge(ageInput);
    }
};
