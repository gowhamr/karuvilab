import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import CompressPdfClientWrapper from './CompressPdfClientWrapper';

const toolId = 'compress-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Compress PDF"
      description="Reduce PDF file size by re-encoding with pdf-lib's object stream compression."
      category={cat}
      toolId={toolId}
    >
      <CompressPdfClientWrapper />
    </ToolShell>
  );
}
