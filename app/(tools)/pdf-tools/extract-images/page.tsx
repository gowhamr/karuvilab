import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ExtractImagesClientWrapper from './ExtractImagesClientWrapper';

const toolId = 'extract-images';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Extract Images"
      description="Extract all embedded images from a PDF file."
      category={cat}
      toolId={toolId}
    >
      <ExtractImagesClientWrapper />
    </ToolShell>
  );
}
