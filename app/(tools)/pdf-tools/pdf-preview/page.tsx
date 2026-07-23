import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import PdfPreviewClientWrapper from '@/src/features/pdf-preview/pdf-previewClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("pdf-preview");
}

export default function Page() {
  return (
    <ToolShell toolId="pdf-preview" title="pdf-preview">
      <PdfPreviewClientWrapper />
    </ToolShell>
  );
}
