import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import BulkImageResizerClientWrapper from './BulkImageResizerClientWrapper';

const toolId = 'bulk-resizer';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Bulk Image Resizer"
      description="Resize multiple images at once with shared dimension settings."
      category={cat}
      toolId={toolId}
    >
      <BulkImageResizerClientWrapper />
    </ToolShell>
  );
}
