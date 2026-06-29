import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import TdsCalculatorWrapper from './TdsCalculatorWrapper';

const toolId = 'tds-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="TDS Calculator"
      description="Calculate Tax Deducted at Source."
      category={cat}
      toolId={toolId}
    >
      <TdsCalculatorWrapper />
    </ToolShell>
  );
}
