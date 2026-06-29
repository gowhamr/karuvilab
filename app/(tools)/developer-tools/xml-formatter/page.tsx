import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import XmlFormatterWrapper from './XmlFormatterWrapper';

const toolId = 'xml-formatter';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="XML Formatter"
      description="Format, minify, and validate XML."
      category={cat}
      toolId={toolId}
    >
      <XmlFormatterWrapper />
    </ToolShell>
  );
}
