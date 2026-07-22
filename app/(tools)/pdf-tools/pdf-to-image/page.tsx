import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import PdfToImageClientWrapper from './PdfToImageClientWrapper';

const toolId = 'pdf-to-image';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="PDF to Image"
      description="Convert PDF pages to JPG or PNG images"
      category={cat}
      toolId={toolId}
    >
      <PdfToImageClientWrapper />
    </ToolShell>
  );
}
