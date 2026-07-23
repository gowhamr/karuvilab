import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import DuplicatePagesClientWrapper from '@/src/features/duplicate-pages/duplicate-pagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("duplicate-pages");
}

export default function Page() {
  return (
    <ToolShell toolId="duplicate-pages" title="duplicate-pages">
      <DuplicatePagesClientWrapper />
    </ToolShell>
  );
}
