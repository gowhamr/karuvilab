import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import DuplicatePagesClientWrapper from './DuplicatePagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'duplicate-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Duplicate PDF Pages"
      description="Duplicate specific pages within your PDF."
      category={cat}
      toolId={toolId}
    >
      <DuplicatePagesClientWrapper />
    </ToolShell>
  );
}
