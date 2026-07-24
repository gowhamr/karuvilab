import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import EvenPagesExtractorClientWrapper from './EvenPagesExtractorClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'even-pages-extractor';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Extract Even Pages"
      description="Automatically extract all even pages from a PDF."
      category={cat}
      toolId={toolId}
    >
      <EvenPagesExtractorClientWrapper />
    </ToolShell>
  );
}
