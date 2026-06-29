import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageToPdfClientWrapper from './ImageToPdfClientWrapper';

const toolId = 'image-to-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image to PDF"
      description="Convert JPG, PNG, or WebP images into a single PDF file."
      category={cat}
      toolId={toolId}
    >
      <ImageToPdfClientWrapper />
    </ToolShell>
  );
}
