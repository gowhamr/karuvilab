import { ToolContract } from '@/src/webmcp/types';
import { calculateForwardDiscount } from './engine';
import { ForwardDiscountInput, DiscountCalculatorResponse, ForwardDiscountResult } from './types';

export const discountContract: ToolContract<ForwardDiscountInput, DiscountCalculatorResponse<ForwardDiscountResult>> = {
  name: 'calculate_discount',
  description: 'Calculates the final sale price after applying a primary discount, an optional secondary stacked discount, and sales tax.',
  schema: {
    type: 'object',
    properties: {
      originalPrice: { type: 'number', description: 'The original price before any discounts.' },
      discountPercent: { type: 'number', description: 'The primary discount percentage.' },
      extraDiscountPercent: { type: 'number', description: 'Optional. A secondary discount percentage applied to the already discounted price.' },
      taxPercent: { type: 'number', description: 'Optional. Sales tax percentage applied to the final discounted amount.' }
    },
    required: ['originalPrice', 'discountPercent']
  },
  execute: (input) => {
    return calculateForwardDiscount(input);
  }
};
