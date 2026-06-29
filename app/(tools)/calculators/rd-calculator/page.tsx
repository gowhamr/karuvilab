import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import RDCalculatorClientWrapper from './RDCalculatorClientWrapper';

const toolId = 'rd-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="RD Calculator"
      description="Calculate maturity amount and interest earned on your Recurring Deposit (RD)."
      category={cat}
      toolId={toolId}
    >
      <RDCalculatorClientWrapper />
    </ToolShell>
  );
}
