import { ToolEntry } from '../types';

export const swiftMtMx: ToolEntry = {
  id: 'swift-mt-mx',
  name: 'SWIFT MT/MX Visualizer',
  desc: 'Visualize and validate SWIFT MT and MX (ISO 20022) financial messages',
  href: 'banking-tools/swift-mt-mx/',
  category: 'banking',
  icon: 'Building',
  color: '#6366F1',
  featured: false,
  popular: false,
  status: 'new',
  lastAdded: '2026-07-05',
  keywords: ['swift', 'mt', 'mx', 'iso 20022', 'banking', 'financial message', 'parser'],
  input: 'text',
  output: 'json',
  related: ['emv-tlv-tree', 'finacle-tools'],
  subCategory: 'Messaging',
  requiresNetwork: false
};
