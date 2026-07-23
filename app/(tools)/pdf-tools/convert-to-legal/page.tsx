import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ConvertToLegalClientWrapper from '@/src/features/convert-to-legal/convert-to-legalClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("convert-to-legal");
}

export default function Page() {
  return (
    <ToolShell toolId="convert-to-legal" title="convert-to-legal">
      <ConvertToLegalClientWrapper />
    </ToolShell>
  );
}
