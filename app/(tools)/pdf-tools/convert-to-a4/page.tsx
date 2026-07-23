import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ConvertToA4ClientWrapper from '@/src/features/convert-to-a4/convert-to-a4ClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("convert-to-a4");
}

export default function Page() {
  return (
    <ToolShell toolId="convert-to-a4" title="convert-to-a4">
      <ConvertToA4ClientWrapper />
    </ToolShell>
  );
}
