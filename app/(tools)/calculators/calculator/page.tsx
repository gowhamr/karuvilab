import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import CalculatorClientWrapper from '@/src/features/calculator/calculatorClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("calculator");
}

export default function Page() {
  return (
    <ToolShell toolId="calculator" title="calculator">
      <CalculatorClientWrapper />
    </ToolShell>
  );
}
