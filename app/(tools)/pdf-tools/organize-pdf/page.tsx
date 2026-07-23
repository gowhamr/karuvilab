import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import OrganizePdfClientWrapper from '@/src/features/organize-pdf/organize-pdfClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("organize-pdf");
}

export default function Page() {
  return (
    <ToolShell toolId="organize-pdf" title="organize-pdf">
      <OrganizePdfClientWrapper />
    </ToolShell>
  );
}
