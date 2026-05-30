import { ToolContent } from '../../registry/types';

export const commandCheatSheetContent: ToolContent = {
  detailedDescription: '<p>Standardized content for Command Cheat Sheet.</p>',
  howTo: ['Step 1','Step 2','Step 3','Step 4'],
  faq: [{question:'Is it free?',answer:'Yes'}],
  useCases: ['Lookup Git commands'],
  examples: [{label:'Test',input:'ls',output:'list',description:'Test'}]
};
