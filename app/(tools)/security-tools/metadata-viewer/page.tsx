import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import MetadataViewerClientWrapper from '@/src/features/metadata-viewer/metadata-viewerClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("metadata-viewer");
}

export default function Page() {
  return (
    <ToolShell toolId="metadata-viewer" title="Metadata Viewer">
      <MetadataViewerClientWrapper />
    </ToolShell>
  );
}
