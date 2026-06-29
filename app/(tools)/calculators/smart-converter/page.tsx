import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import SmartConverterClientWrapper from './SmartConverterClientWrapper';

const toolId = 'smart-converter';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Smart Unit Converter"
      description="Type a natural language conversion query like '5 kg to lbs' or '100 USD to EUR'."
      category={cat}
      toolId={toolId}
    >
      <SmartConverterClientWrapper />
    </ToolShell>
  );
}
