import { ToolEntry } from '../types';
import { Percent } from 'lucide-react';

export const tds_calculator: ToolEntry = {
  id: 'tds-calculator',
  name: 'Tds Calculator',
  desc: 'Calculate Tax Deducted at Source (TDS) for salary, rent, professional fees, and interest (194J, 194I, 194A, etc.)',
  href: 'calculators/tds-calculator/',
  category: 'calculators',
  keywords: ['tds calculator', 'tax deducted at source', '194J', '194A', '194I', 'tds rate'],
  status: 'new',
  popular: false,
  difficulty: 'intermediate',
  priority: 0.8,
  searchIntent: 'action',
  related: ['income-tax', 'gst-calculator', 'invoice-generator'],
  seoContent: {
    detailedDescription: `The TDS (Tax Deducted at Source) Calculator simplifies Indian tax compliance by calculating the exact TDS amount based on the payment nature. It covers major sections like 194J (Professional Fees), 194I (Rent), and 194A (Interest), automatically applying thresholds and differentiating rates for Individuals vs. Companies.`,
    howTo: [
      'Select the nature of payment (e.g., Professional Fees - 194J) from the dropdown list.',
      'Enter the payment amount.',
      'Indicate whether the payee is an Individual/HUF or a Company.',
      'Toggle whether the payee has provided a valid PAN (rates jump to 20% if absent).',
      'View the total TDS to be deducted and the net payable amount instantly.'
    ],
    faq: [
      { question: 'What happens if PAN is not provided?', answer: 'Under Section 206AA, if the deductee fails to provide a valid PAN, the deductor must deduct TDS at a higher rate, usually 20%, or the rate in force, whichever is higher.' },
      { question: 'What is the TDS rate for Professional Fees (194J)?', answer: 'The standard rate is 10% for professional services. However, for technical services, royalty, or call center operations, a reduced rate of 2% applies.' },
      { question: 'What is the TDS threshold for Rent (194I)?', answer: 'TDS on rent must be deducted if the total rent paid during the financial year exceeds ₹2,40,000. The rate is 10% for land/building and 2% for plant/machinery.' },
      { question: 'Is surcharge applicable on TDS?', answer: 'Surcharge and Health & Education Cess (4%) are generally NOT added to TDS for resident payments (except Salary u/s 192). They are mandatory for non-resident payments.' },
      { question: 'Does this tool store my financial data?', answer: 'No. All TDS calculations are performed entirely in your browser. We do not store or track your inputs.' }
    ]
  }
};
