import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import PdfBookmarksClientWrapper from '@/src/features/pdf-bookmarks/pdf-bookmarksClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("pdf-bookmarks");
}

export default function Page() {
  return (
    <ToolShell toolId="pdf-bookmarks" title="pdf-bookmarks">
      <PdfBookmarksClientWrapper />
    </ToolShell>
  );
}
