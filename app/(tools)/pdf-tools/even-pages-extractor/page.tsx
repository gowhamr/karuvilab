import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import EvenPagesExtractorClientWrapper from '@/src/features/even-pages-extractor/even-pages-extractorClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("even-pages-extractor");
}

export default function Page() {
  return (
    <ToolShell toolId="even-pages-extractor" title="even-pages-extractor">
      <EvenPagesExtractorClientWrapper />
    </ToolShell>
  );
}
