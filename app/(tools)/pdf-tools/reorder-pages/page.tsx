import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ReorderPagesClientWrapper from '@/src/features/reorder-pages/reorder-pagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("reorder-pages");
}

export default function Page() {
  return (
    <ToolShell toolId="reorder-pages" title="reorder-pages">
      <ReorderPagesClientWrapper />
    </ToolShell>
  );
}
