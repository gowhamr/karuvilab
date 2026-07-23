import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ReversePagesClientWrapper from '@/src/features/reverse-pages/reverse-pagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("reverse-pages");
}

export default function Page() {
  return (
    <ToolShell toolId="reverse-pages" title="reverse-pages">
      <ReversePagesClientWrapper />
    </ToolShell>
  );
}
