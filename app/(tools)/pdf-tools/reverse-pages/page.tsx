import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ReversePagesClientWrapper from './ReversePagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'reverse-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Reverse PDF Pages"
      description="Reverse the order of pages in your PDF."
      category={cat}
      toolId={toolId}
    >
      <ReversePagesClientWrapper />
    </ToolShell>
  );
}
