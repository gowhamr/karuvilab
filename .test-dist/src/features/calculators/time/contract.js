import { calculateTimeDifference } from './engine';
export const timeDifferenceContract = {
    name: 'calculate_time_difference',
    description: 'Calculates the difference between two specific times (e.g. 09:00 AM and 05:30 PM).',
    schema: {
        type: 'object',
        properties: {
            startTime: { type: 'string', description: 'Start time in HH:mm format (24-hour).' },
            endTime: { type: 'string', description: 'End time in HH:mm format (24-hour).' }
        },
        required: ['startTime', 'endTime']
    },
    execute: (input) => {
        return calculateTimeDifference(input);
    }
};
