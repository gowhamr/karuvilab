import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ExtractPagesClientWrapper from '@/src/features/extract-pages/extract-pagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("extract-pages");
}

export default function Page() {
  return (
    <ToolShell toolId="extract-pages" title="extract-pages">
      <ExtractPagesClientWrapper />
    </ToolShell>
  );
}
