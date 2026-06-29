import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import PercentageCalculatorClientWrapper from './PercentageCalculatorClientWrapper';

const toolId = 'percentage-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Percentage Calculator"
      description="Three modes: find a percentage, find what percent X is of Y, and calculate percentage change."
      category={cat}
      toolId={toolId}
    >
      <PercentageCalculatorClientWrapper />
    </ToolShell>
  );
}
