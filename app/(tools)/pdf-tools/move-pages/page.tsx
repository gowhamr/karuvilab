import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import MovePagesClientWrapper from '@/src/features/move-pages/move-pagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("move-pages");
}

export default function Page() {
  return (
    <ToolShell toolId="move-pages" title="move-pages">
      <MovePagesClientWrapper />
    </ToolShell>
  );
}
