import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import EcdhClientWrapper from './EcdhClientWrapper';

const toolId = 'ecdh-key-exchange';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="ECDH Key Exchange Demo"
      description="Simulate Elliptic Curve Diffie-Hellman (ECDH) key exchange between Party A and Party B to derive a matching shared secret."
      category={cat}
      toolId={toolId}
    >
      <EcdhClientWrapper />
    </ToolShell>
  );
}
