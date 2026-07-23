import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import OddPagesExtractorClientWrapper from '@/src/features/odd-pages-extractor/odd-pages-extractorClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("odd-pages-extractor");
}

export default function Page() {
  return (
    <ToolShell toolId="odd-pages-extractor" title="odd-pages-extractor">
      <OddPagesExtractorClientWrapper />
    </ToolShell>
  );
}
