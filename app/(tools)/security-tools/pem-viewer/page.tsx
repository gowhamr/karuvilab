import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import PemViewerClientWrapper from './PemViewerClientWrapper';

const toolId = 'pem-viewer';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="PEM Viewer & Inspector"
      description="Inspect PEM blocks, decode Base64 payloads, analyze ASN.1 structure, and format raw DER keys."
      category={cat}
      toolId={toolId}
    >
      <PemViewerClientWrapper />
    </ToolShell>
  );
}
