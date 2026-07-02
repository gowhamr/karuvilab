import { ToolEntry } from '../types';
import { TrendingUp } from 'lucide-react';

export const nps_calculator: ToolEntry = {
  id: 'nps-calculator',
  name: 'Nps Calculator',
  desc: 'Plan your retirement with the National Pension System. Estimate your corpus, monthly pension, and tax benefits',
  href: 'calculators/nps-calculator/',
  category: 'calculators',
  keywords: ['nps calculator', 'national pension system', 'retirement planning', 'pension calculator', '80ccd'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.9,
  searchIntent: 'action',
  related: ['retirement-calculator', 'sip-calculator', 'income-tax'],
  seoContent: {
    detailedDescription: `The NPS (National Pension System) Calculator is a secure, browser-based financial planning tool designed to help you project your retirement corpus. It calculates the compounded growth of your contributions, estimates the mandatory annuity purchase, projects your monthly pension, and breaks down your tax benefits under sections 80CCD(1B) and 80CCD(2).`,
    howTo: [
      'Enter your current age and expected retirement age (usually 60).',
      'Input your monthly NPS contribution.',
      'Adjust the expected return rate (historically 8-12% for NPS).',
      'Set the percentage of corpus you wish to use for purchasing an annuity (minimum 40%).',
      'The tool will instantly visualize your total invested amount, estimated corpus, tax-free lumpsum, and monthly pension.'
    ],
    faq: [
      { question: 'What is the National Pension System (NPS)?', answer: 'NPS is a voluntary, long-term retirement savings scheme initiated by the Government of India. It offers market-linked returns and significant tax benefits.' },
      { question: 'How much of the NPS corpus is tax-free on retirement?', answer: 'At retirement (age 60), you can withdraw up to 60% of your total corpus as a tax-free lumpsum. The remaining 40% must be used to purchase an annuity to provide a regular monthly pension.' },
      { question: 'What are the tax benefits of NPS?', answer: 'You can claim up to ₹1.5 Lakhs under Sec 80C. Additionally, Sec 80CCD(1B) allows an exclusive deduction of ₹50,000. Employer contributions (up to 10% of Basic+DA) are also exempt under Sec 80CCD(2).' },
      { question: 'Can I withdraw more than 60% as a lumpsum?', answer: 'No. As per current PFRDA rules, a minimum of 40% of the accumulated wealth must be utilized to purchase an annuity from a life insurance company. If the total corpus is less than ₹5 Lakhs, 100% withdrawal is permitted.' },
      { question: 'Are the returns guaranteed?', answer: 'No, NPS returns are market-linked and depend on the performance of the underlying asset classes (Equity, Corporate Bonds, Government Securities) chosen by the subscriber.' }
    ]
  }
};
