import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import EditMetadataClientWrapper from '@/src/features/edit-metadata/edit-metadataClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("edit-metadata");
}

export default function Page() {
  return (
    <ToolShell toolId="edit-metadata" title="edit-metadata">
      <EditMetadataClientWrapper />
    </ToolShell>
  );
}
