import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageCompressorClientWrapper from '../image-compressor/ImageCompressorClientWrapper';

const toolId = 'compress';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Compressor"
      description="Professional image optimization tool. 100% private, browser-based compression."
      category={cat}
      toolId={toolId}
    >
      <ImageCompressorClientWrapper />
    </ToolShell>
  );
}
