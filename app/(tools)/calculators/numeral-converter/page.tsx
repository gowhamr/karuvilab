import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import NumeralConverterClientWrapper from './NumeralConverterClientWrapper';

const toolId = 'numeral-converter';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Numeral & Encoding Converter"
      description="Universal encoding converter. Paste hex, binary, Base64, URL-encoded, HTML entities, Unicode escapes, or plain text. Auto-detect format and convert to all others instantly."
      category={cat}
      toolId={toolId}
    >
      <NumeralConverterClientWrapper />
    </ToolShell>
  );
}
