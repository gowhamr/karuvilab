import { parseInputToUtcEpoch, generateMachineOutput } from './engine';
export const utcIstContract = {
    name: 'convert_utc_ist',
    description: 'Converts time between UTC and IST (Indian Standard Time). IST is UTC+5:30 with no DST.',
    schema: {
        type: 'object',
        properties: {
            time: {
                type: 'string',
                description: 'The time to convert. Can be ISO 8601, YYYY-MM-DDTHH:mm:ss, or Unix Epoch (ms or seconds).'
            },
            is_ist_input: {
                type: 'boolean',
                description: 'Set to true if the input time string represents local IST time rather than UTC.'
            }
        },
        required: ['time']
    },
    execute: (input) => {
        const parseRes = parseInputToUtcEpoch(input.time, input.is_ist_input ?? false);
        if (!parseRes.success) {
            throw new Error(`Invalid time input: ${parseRes.error}`);
        }
        return generateMachineOutput(parseRes.epochMs, parseRes.precision);
    }
};
