import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import MovePagesClientWrapper from './MovePagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'move-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Move PDF Pages"
      description="Move selected pages to a specific position in the PDF."
      category={cat}
      toolId={toolId}
    >
      <MovePagesClientWrapper />
    </ToolShell>
  );
}
