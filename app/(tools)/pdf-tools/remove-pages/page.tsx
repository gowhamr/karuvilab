import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import RemovePagesClientWrapper from '@/src/features/remove-pages/remove-pagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("remove-pages");
}

export default function Page() {
  return (
    <ToolShell toolId="remove-pages" title="remove-pages">
      <RemovePagesClientWrapper />
    </ToolShell>
  );
}
