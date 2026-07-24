import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import RemovePagesClientWrapper from './RemovePagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'remove-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Remove PDF Pages"
      description="Remove unnecessary pages from your PDF file securely."
      category={cat}
      toolId={toolId}
    >
      <RemovePagesClientWrapper />
    </ToolShell>
  );
}
