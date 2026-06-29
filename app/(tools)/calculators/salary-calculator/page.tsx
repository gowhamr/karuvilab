import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import SalaryCalculatorClientWrapper from './SalaryCalculatorClientWrapper';

const toolId = 'salary-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Indian Salary Calculator"
      description="Break down your CTC into take-home pay under the new tax regime (FY 2024-25)."
      category={cat}
      toolId={toolId}
    >
      <SalaryCalculatorClientWrapper />
    </ToolShell>
  );
}
