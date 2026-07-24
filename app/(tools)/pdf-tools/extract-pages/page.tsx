import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ExtractPagesClientWrapper from './ExtractPagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'extract-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Extract PDF Pages"
      description="Extract selected pages into a new PDF document."
      category={cat}
      toolId={toolId}
    >
      <ExtractPagesClientWrapper />
    </ToolShell>
  );
}
