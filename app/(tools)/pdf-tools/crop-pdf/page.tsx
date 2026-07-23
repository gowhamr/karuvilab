import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import CropPdfClientWrapper from '@/src/features/crop-pdf/crop-pdfClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("crop-pdf");
}

export default function Page() {
  return (
    <ToolShell toolId="crop-pdf" title="crop-pdf">
      <CropPdfClientWrapper />
    </ToolShell>
  );
}
