import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ConvertToLetterClientWrapper from '@/src/features/convert-to-letter/convert-to-letterClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("convert-to-letter");
}

export default function Page() {
  return (
    <ToolShell toolId="convert-to-letter" title="convert-to-letter">
      <ConvertToLetterClientWrapper />
    </ToolShell>
  );
}
