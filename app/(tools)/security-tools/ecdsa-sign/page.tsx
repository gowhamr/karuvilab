import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import EcdsaClientWrapper from './EcdsaClientWrapper';

const toolId = 'ecdsa-sign';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="ECDSA Sign & Verify"
      description="Generate Elliptic Curve keypairs (P-256, P-384, P-521), create ECDSA signatures, and verify messages natively."
      category={cat}
      toolId={toolId}
    >
      <EcdsaClientWrapper />
    </ToolShell>
  );
}
