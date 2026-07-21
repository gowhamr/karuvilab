import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import PdfEditorClientWrapper from './PdfEditorClientWrapper';

const toolId = 'pdf-editor';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="PDF Editor"
      description="View and annotate PDF documents. Add text, shapes, and black out sensitive information."
      category={cat}
      toolId={toolId}
    >
      <PdfEditorClientWrapper />
    </ToolShell>
  );
}
