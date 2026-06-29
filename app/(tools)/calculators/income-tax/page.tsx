import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import IncomeTaxWrapper from './IncomeTaxWrapper';

const toolId = 'income-tax';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Income Tax Calculator"
      description="Calculate income tax for FY 2025-26."
      category={cat}
      toolId={toolId}
    >
      <IncomeTaxWrapper />
    </ToolShell>
  );
}
