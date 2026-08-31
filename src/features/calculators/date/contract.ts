import { ToolContract } from '@/src/webmcp/types';
import { calculateDateDifference } from './engine';
import { DateDifferenceInput, DateDifferenceResult, DateCalculatorResponse } from './types';

export const dateDifferenceContract: ToolContract<DateDifferenceInput, DateCalculatorResponse<DateDifferenceResult>> = {
  name: 'calculate_date_difference',
  description: 'Calculates the difference between two dates, providing years, months, days, total days, and business days.',
  schema: {
    type: 'object',
    properties: {
      startDate: {
        type: 'string',
        description: 'The start date in YYYY-MM-DD format.'
      },
      endDate: {
        type: 'string',
        description: 'The end date in YYYY-MM-DD format.'
      },
      includeEndDay: {
        type: 'boolean',
        description: 'Whether to include the end date in the total count.'
      }
    },
    required: ['startDate', 'endDate']
  },
  execute: (input) => {
    return calculateDateDifference(input);
  }
};
