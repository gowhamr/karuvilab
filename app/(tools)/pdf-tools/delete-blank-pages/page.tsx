import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import DeleteBlankPagesClientWrapper from './DeleteBlankPagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'delete-blank-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Delete Blank Pages"
      description="Automatically detect and remove blank pages."
      category={cat}
      toolId={toolId}
    >
      <DeleteBlankPagesClientWrapper />
    </ToolShell>
  );
}
