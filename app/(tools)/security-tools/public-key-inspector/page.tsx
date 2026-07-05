import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import PublicKeyClientWrapper from './PublicKeyClientWrapper';

const toolId = 'public-key-inspector';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Public Key Inspector"
      description="Inspect SPKI / RSA / EC public keys, calculate fingerprints, and verify public key parameter formats."
      category={cat}
      toolId={toolId}
    >
      <PublicKeyClientWrapper />
    </ToolShell>
  );
}
