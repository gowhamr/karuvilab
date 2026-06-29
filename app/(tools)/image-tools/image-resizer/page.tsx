import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageResizerClientWrapper from './ImageResizerClientWrapper';

const toolId = 'image-resizer';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Resizer"
      description="Resize images to exact dimensions with aspect ratio lock."
      category={cat}
      toolId={toolId}
    >
      <ImageResizerClientWrapper />
    </ToolShell>
  );
}
