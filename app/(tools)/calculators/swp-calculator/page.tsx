import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import SWPCalculatorClientWrapper from './SWPCalculatorClientWrapper';

const toolId = 'swp-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="SWP Calculator"
      description="Plan your Systematic Withdrawal Plan (SWP) from your mutual fund investments."
      category={cat}
      toolId={toolId}
    >
      <SWPCalculatorClientWrapper />
    </ToolShell>
  );
}
