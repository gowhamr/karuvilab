import { ToolContract } from '@/src/webmcp/types';
import { calculateAge } from './engine';
import { AgeCalculatorInput, AgeCalculatorEngineResponse } from './types';

export const ageCalculatorContract: ToolContract<{ dob: string; as_of?: string }, AgeCalculatorEngineResponse> = {
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
    const ageInput: AgeCalculatorInput = {
      dateOfBirth: input.dob,
      ...(input.as_of ? { asOfDate: input.as_of } : {})
    };
    return calculateAge(ageInput);
  }
};
