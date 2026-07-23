import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import DeleteBlankPagesClientWrapper from '@/src/features/delete-blank-pages/delete-blank-pagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("delete-blank-pages");
}

export default function Page() {
  return (
    <ToolShell toolId="delete-blank-pages" title="delete-blank-pages">
      <DeleteBlankPagesClientWrapper />
    </ToolShell>
  );
}
