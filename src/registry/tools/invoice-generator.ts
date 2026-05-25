import { ToolEntry } from '../types';

export const invoice_generator: ToolEntry = {
  id: 'invoice-generator',
  name: 'Invoice Generator',
  desc: 'Create professional branded invoices with custom logos, multiple templates, and automated tax calculations. 100% private and local.',
  href: 'calculators/invoice-generator/',
  category: 'calculators',
  subCategory: 'Financial',
  input: 'none',
  output: 'pdf',
  keywords: [
    'invoice generator',
    'pro invoice maker',
    'free branded invoice',
    'gst invoice creator',
    'private invoice generator',
    'offline invoice maker',
    'custom logo invoice',
    'professional pdf invoice'
  ],
  popular: true,
  featured: true,
  difficulty: 'beginner',
  searchIntent: 'informational',
  status: 'stable',
  priority: 0.9,
  lastUpdated: '2024-05-25'
};
