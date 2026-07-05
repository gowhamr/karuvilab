import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import X509ClientWrapper from './X509ClientWrapper';

const toolId = 'x509-viewer';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="X.509 Certificate Viewer & Decoder"
      description="Inspect SSL/TLS X.509 certificates, view Subject, Issuer, Validity periods, Extensions, and calculate Fingerprints."
      category={cat}
      toolId={toolId}
    >
      <X509ClientWrapper />
    </ToolShell>
  );
}
