import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import OddPagesExtractorClientWrapper from './OddPagesExtractorClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'odd-pages-extractor';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Extract Odd Pages"
      description="Automatically extract all odd pages from a PDF."
      category={cat}
      toolId={toolId}
    >
      <OddPagesExtractorClientWrapper />
    </ToolShell>
  );
}
