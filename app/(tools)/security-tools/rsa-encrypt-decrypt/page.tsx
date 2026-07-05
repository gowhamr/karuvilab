import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import RsaCryptClientWrapper from './RsaCryptClientWrapper';

const toolId = 'rsa-encrypt-decrypt';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="RSA Encrypt / Decrypt"
      description="Encrypt text using an RSA Public Key (OAEP padding) and decrypt using an RSA Private Key. 100% browser execution."
      category={cat}
      toolId={toolId}
    >
      <RsaCryptClientWrapper />
    </ToolShell>
  );
}
