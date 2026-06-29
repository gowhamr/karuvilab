import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import JSONFormatterClientWrapper from './JSONFormatterClientWrapper';

const toolId = 'json-formatter';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="JSON Formatter"
      description="Beautify, minify, validate JSON and explore it as a tree."
      category={cat}
      toolId={toolId}
    >
      <JSONFormatterClientWrapper />
    </ToolShell>
  );
}
