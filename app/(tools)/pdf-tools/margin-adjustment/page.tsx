import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import MarginAdjustmentClientWrapper from '@/src/features/margin-adjustment/margin-adjustmentClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("margin-adjustment");
}

export default function Page() {
  return (
    <ToolShell toolId="margin-adjustment" title="margin-adjustment">
      <MarginAdjustmentClientWrapper />
    </ToolShell>
  );
}
