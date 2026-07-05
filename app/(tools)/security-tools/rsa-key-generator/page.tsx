import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import RsaKeyGenClientWrapper from './RsaKeyGenClientWrapper';

const toolId = 'rsa-key-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="RSA Key Generator"
      description="Generate RSA Public & Private keypairs (1024, 2048, 3072, 4096-bit) in PEM format. 100% private local Web Crypto generation."
      category={cat}
      toolId={toolId}
    >
      <RsaKeyGenClientWrapper />
    </ToolShell>
  );
}
