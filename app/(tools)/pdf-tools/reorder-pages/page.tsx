import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ReorderPagesClientWrapper from './ReorderPagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'reorder-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Reorder PDF Pages"
      description="Drag and drop to reorder pages in your PDF."
      category={cat}
      toolId={toolId}
    >
      <ReorderPagesClientWrapper />
    </ToolShell>
  );
}
