import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import HkdfClientWrapper from './HkdfClientWrapper';

const toolId = 'hkdf-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="HKDF Key Derivation Generator"
      description="Derive keys using HMAC-based Extract-and-Expand Key Derivation Function (HKDF, RFC 5869)."
      category={cat}
      toolId={toolId}
    >
      <HkdfClientWrapper />
    </ToolShell>
  );
}
