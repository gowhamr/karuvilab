import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import PdfToWordClientWrapper from './PdfToWordClientWrapper';

const toolId = 'pdf-to-word';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="PDF to Word"
      description="Extract text from PDF files and convert them into editable Microsoft Word (.docx) documents completely in your browser."
      category={cat}
      toolId={toolId}
    >
      <PdfToWordClientWrapper />
    </ToolShell>
  );
}
