import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import PageSizeConverterClientWrapper from '@/src/features/page-size-converter/page-size-converterClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("page-size-converter");
}

export default function Page() {
  return (
    <ToolShell toolId="page-size-converter" title="page-size-converter">
      <PageSizeConverterClientWrapper />
    </ToolShell>
  );
}
