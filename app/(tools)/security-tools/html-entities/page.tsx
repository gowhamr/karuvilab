import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import HTMLEntitiesClientWrapper from './HTMLEntitiesClientWrapper';

const toolId = 'html-entities';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="HTML Entities Converter"
      description="Encode special characters to HTML entities or decode HTML entities back to text."
      category={cat}
      toolId={toolId}
    >
      <HTMLEntitiesClientWrapper />
    </ToolShell>
  );
}
