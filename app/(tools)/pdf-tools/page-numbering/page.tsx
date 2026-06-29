import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import PageNumberingClientWrapper from './PageNumberingClientWrapper';

const toolId = 'page-numbering';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Page Numbering"
      description="Add page numbers to every page of your PDF."
      category={cat}
      toolId={toolId}
    >
      <PageNumberingClientWrapper />
    </ToolShell>
  );
}
