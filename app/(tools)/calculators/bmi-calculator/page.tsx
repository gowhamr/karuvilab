import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import BmiCalculatorWrapper from './BmiCalculatorWrapper';

const toolId = 'bmi-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators')!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function BmiCalculatorPage() {
  return (
    <ToolShell 
      title="BMI Calculator"
      description="Calculate your Body Mass Index with visual healthy range indicator. Supports metric and imperial units with Indian body type context."
      category={cat}
      toolId={toolId}
    >
      <BmiCalculatorWrapper />
    </ToolShell>
  );
}
