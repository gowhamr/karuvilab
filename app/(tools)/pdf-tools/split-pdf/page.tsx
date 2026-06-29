import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import SplitPdfClientWrapper from './SplitPdfClientWrapper';

const toolId = 'split-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Split PDF"
      description="Extract specific page ranges from a PDF file."
      category={cat}
      toolId={toolId}
    >
      <SplitPdfClientWrapper />
    </ToolShell>
  );
}
