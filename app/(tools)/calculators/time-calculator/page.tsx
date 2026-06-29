import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import TimeCalculatorClientWrapper from './TimeCalculatorClientWrapper';

const toolId = 'time-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Time Calculator"
      description="Add multiple time durations or find the difference between two times."
      category={cat}
      toolId={toolId}
    >
      <TimeCalculatorClientWrapper />
    </ToolShell>
  );
}
