import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import RetirementCalculatorClientWrapper from './RetirementCalculatorClientWrapper';

const toolId = 'retirement-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Retirement Planner"
      description="Estimate the corpus required to maintain your lifestyle after retirement."
      category={cat}
      toolId={toolId}
    >
      <RetirementCalculatorClientWrapper />
    </ToolShell>
  );
}
