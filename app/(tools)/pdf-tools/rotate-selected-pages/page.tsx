import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import RotateSelectedPagesClientWrapper from '@/src/features/rotate-selected-pages/rotate-selected-pagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("rotate-selected-pages");
}

export default function Page() {
  return (
    <ToolShell toolId="rotate-selected-pages" title="rotate-selected-pages">
      <RotateSelectedPagesClientWrapper />
    </ToolShell>
  );
}
