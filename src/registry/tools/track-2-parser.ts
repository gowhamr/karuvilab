import { ToolEntry } from '../types';

export const track2Parser: ToolEntry = {
  id: 'track-2-parser',
  name: 'Track 2 Parser',
  desc: 'Parse and decode magnetic stripe Track 2 data instantly',
  href: 'banking-tools/track-2-parser/',
  category: 'banking',
  icon: 'CreditCard',
  color: '#10B981',
  featured: true,
  popular: false,
  status: 'new',
  lastAdded: '2026-07-05',
  keywords: ['track 2', 'magstripe', 'PAN', 'discretionary data', 'banking', 'parser'],
  input: 'text',
  output: 'json',
  related: ['emv-tlv-tree', 'swift-mt-mx'],
  subCategory: 'Card Data',
  requiresNetwork: false
};
