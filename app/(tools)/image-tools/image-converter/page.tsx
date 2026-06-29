import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageConverterClientWrapper from './ImageConverterClientWrapper';

const toolId = 'image-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Converter"
      description="Convert images between JPG, PNG, WebP, and BMP formats in your browser."
      category={cat}
      toolId={toolId}
    >
      <ImageConverterClientWrapper />
    </ToolShell>
  );
}
