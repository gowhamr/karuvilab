import { ToolEntry } from '../types';

export const emvTlvTree: ToolEntry = {
  id: 'emv-tlv-tree',
  name: 'EMV TLV Tree',
  desc: 'Parse and visualize EMV Tag-Length-Value data',
  href: 'banking-tools/emv-tlv-tree/',
  category: 'banking',
  icon: 'Nfc',
  color: '#3B82F6',
  featured: false,
  popular: false,
  status: 'new',
  lastAdded: '2026-07-05',
  keywords: ['emv', 'tlv', 'tag length value', 'smart card', 'nfc', 'banking'],
  input: 'text',
  output: 'json',
  related: ['track-2-parser', 'swift-mt-mx'],
  subCategory: 'Card Data',
  requiresNetwork: false
};
