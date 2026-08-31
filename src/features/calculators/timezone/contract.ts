import { ToolContract } from '@/src/webmcp/types';
import { convertTimezone, TimezoneConversionInput, TimezoneConversionResult } from './engine';

export const timezoneContract: ToolContract<TimezoneConversionInput, TimezoneConversionResult> = {
  name: 'convert_timezone',
  description: 'Converts a given date/time from one IANA timezone to another (e.g. America/New_York to Europe/London).',
  schema: {
    type: 'object',
    properties: {
      datetime: {
        type: 'string',
        description: 'The ISO 8601 datetime string to convert (e.g. 2026-08-30T12:00:00Z).'
      },
      fromTz: {
        type: 'string',
        description: 'The original IANA timezone (e.g. America/New_York). Defaults to UTC.'
      },
      toTz: {
        type: 'string',
        description: 'The target IANA timezone (e.g. Asia/Kolkata).'
      }
    },
    required: ['datetime', 'toTz']
  },
  execute: (input) => {
    return convertTimezone(input);
  }
};
