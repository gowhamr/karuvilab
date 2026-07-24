import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import RotateSelectedPagesClientWrapper from './RotateSelectedPagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'rotate-selected-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Rotate Specific Pages"
      description="Rotate only the pages you select."
      category={cat}
      toolId={toolId}
    >
      <RotateSelectedPagesClientWrapper />
    </ToolShell>
  );
}
