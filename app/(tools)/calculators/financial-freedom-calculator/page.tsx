import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import FinancialFreedomClientWrapper from './FinancialFreedomClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { financialFreedomCalculator } from '@/src/registry/tools/financial-freedom-calculator';

const toolId = 'financial-freedom-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators')!;

export const metadata: Metadata = generateToolMetadata('financial-freedom-calculator');

export default function FinancialFreedomCalculatorPage() {
  return (
    <ToolShell
      title={financialFreedomCalculator.name}
      description={financialFreedomCalculator.desc}
      category={cat}
      toolId="financial-freedom-calculator"
    >
      <FinancialFreedomClientWrapper />
    </ToolShell>
  );
}
