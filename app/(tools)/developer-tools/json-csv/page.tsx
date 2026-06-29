import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import JSONCSVConverterClientWrapper from './JSONCSVConverterClientWrapper';

const toolId = 'json-csv';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="JSON ↔ CSV Converter"
      description="Convert between JSON arrays and CSV format instantly with precision."
      category={cat}
      toolId={toolId}
    >
      <JSONCSVConverterClientWrapper />
    </ToolShell>
  );
}
