import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import UnitConverterClientWrapper from './UnitConverterClientWrapper';

const toolId = 'unit-converter';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Unit Converter"
      description="Convert between Length, Weight, Volume, Temperature, Area, and Speed units."
      category={cat}
      toolId={toolId}
    >
      <UnitConverterClientWrapper />
    </ToolShell>
  );
}
