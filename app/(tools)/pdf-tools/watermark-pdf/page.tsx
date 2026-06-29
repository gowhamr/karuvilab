import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import WatermarkPdfClientWrapper from './WatermarkPdfClientWrapper';

const toolId = 'watermark-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Watermark PDF"
      description="Add a text watermark to every page of a PDF."
      category={cat}
      toolId={toolId}
    >
      <WatermarkPdfClientWrapper />
    </ToolShell>
  );
}
