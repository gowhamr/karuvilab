import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import RsaSignClientWrapper from './RsaSignClientWrapper';

const toolId = 'rsa-sign-verify';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="RSA Sign / Verify"
      description="Create RSASSA-PKCS1-v1_5 digital signatures with a private key and verify them with a public key."
      category={cat}
      toolId={toolId}
    >
      <RsaSignClientWrapper />
    </ToolShell>
  );
}
