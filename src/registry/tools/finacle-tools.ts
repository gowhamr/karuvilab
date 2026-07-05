import { ToolEntry } from '../types';

export const finacleTools: ToolEntry = {
  id: 'finacle-tools',
  name: 'Finacle Log Parser',
  desc: 'Parse and format Infosys Finacle trace logs and ISO 8583 messages',
  href: 'banking-tools/finacle-tools/',
  category: 'banking',
  icon: 'FileCode',
  color: '#8B5CF6',
  featured: false,
  popular: false,
  status: 'new',
  lastAdded: '2026-07-05',
  keywords: ['finacle', 'iso 8583', 'banking', 'core banking', 'log parser'],
  input: 'text',
  output: 'json',
  related: ['swift-mt-mx'],
  subCategory: 'Core Banking',
  requiresNetwork: false
};
