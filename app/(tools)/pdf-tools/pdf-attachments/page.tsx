import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import PdfAttachmentsClientWrapper from '@/src/features/pdf-attachments/pdf-attachmentsClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("pdf-attachments");
}

export default function Page() {
  return (
    <ToolShell toolId="pdf-attachments" title="pdf-attachments">
      <PdfAttachmentsClientWrapper />
    </ToolShell>
  );
}
