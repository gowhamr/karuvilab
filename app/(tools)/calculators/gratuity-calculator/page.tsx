import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import GratuityCalculatorWrapper from './GratuityCalculatorWrapper';

const toolId = 'gratuity-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Gratuity Calculator"
      description="Calculate Gratuity amount."
      category={cat}
      toolId={toolId}
    >
      <GratuityCalculatorWrapper />
    </ToolShell>
  );
}