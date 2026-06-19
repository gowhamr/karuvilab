import { ToolEntry } from '../types';
import { Home } from 'lucide-react';

export const hra_calculator: ToolEntry = {
  id: 'hra-calculator',
  name: 'HRA Exemption Calculator',
  desc: 'Calculate your House Rent Allowance (HRA) tax exemption limit based on Metro/Non-Metro rules.',
  href: 'calculators/hra-calculator/',
  category: 'calculators',
  keywords: ['hra calculator', 'house rent allowance', 'tax exemption', 'rent tax benefit', 'income tax'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.8,
  searchIntent: 'action',
  related: ['income-tax', 'salary-calculator'],
  seoContent: {
    detailedDescription: `HRA Exemption Calculator helps salaried professionals in India determine the exact tax-exempt portion of their House Rent Allowance (HRA). The tool strictly follows the Income Tax Act rules, calculating the minimum of three conditions to find your eligible exemption, all securely within your browser.`,
    howTo: [
      'Enter your Monthly Basic Salary and Dearness Allowance (DA).',
      'Input the actual HRA received from your employer.',
      'Enter the actual monthly rent you pay.',
      'Select whether you live in a Metro city (Delhi, Mumbai, Chennai, Kolkata) or Non-Metro city.',
      'The tool will instantly display the exempt HRA and the taxable HRA amount.'
    ],
    faq: [
      { question: 'What are the three conditions for HRA exemption?', answer: 'The exemption is the minimum of: 1) Actual HRA received, 2) 50% of Basic+DA (Metro) or 40% (Non-Metro), 3) Actual rent paid minus 10% of Basic+DA.' },
      { question: 'Which cities are considered Metro for HRA?', answer: 'Under the Income Tax Act, only four cities are considered Metro for HRA: Delhi, Mumbai, Chennai, and Kolkata (50% rule). All other cities are Non-Metro (40% rule).' },
      { question: 'Can I claim HRA if I live with my parents?', answer: 'Yes, you can claim HRA by paying rent to your parents, provided they own the property and declare the rent as their income.' },
      { question: 'Is HRA exemption available in the New Tax Regime?', answer: 'No. HRA exemption is only available if you opt for the Old Tax Regime.' },
      { question: 'What is DA in salary?', answer: 'Dearness Allowance (DA) is an inflation-linked allowance primarily given to government employees. If you are a private sector employee and do not have DA, leave it as 0.' }
    ]
  }
};
