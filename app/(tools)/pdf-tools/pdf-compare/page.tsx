import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import PdfCompareClientWrapper from '@/src/features/pdf-compare/pdf-compareClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("pdf-compare");
}

export default function Page() {
  return (
    <ToolShell toolId="pdf-compare" title="pdf-compare">
      <PdfCompareClientWrapper />
    </ToolShell>
  );
}
