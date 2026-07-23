import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import RemoveMetadataClientWrapper from '@/src/features/remove-metadata/remove-metadataClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("remove-metadata");
}

export default function Page() {
  return (
    <ToolShell toolId="remove-metadata" title="remove-metadata">
      <RemoveMetadataClientWrapper />
    </ToolShell>
  );
}
