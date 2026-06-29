import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import StockAverageCalculatorClientWrapper from './StockAverageCalculatorClientWrapper';

const toolId = 'stock-average-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Stock Average Calculator"
      description="Calculate the weighted average buy price of your stock holdings."
      category={cat}
      toolId={toolId}
    >
      <StockAverageCalculatorClientWrapper />
    </ToolShell>
  );
}
