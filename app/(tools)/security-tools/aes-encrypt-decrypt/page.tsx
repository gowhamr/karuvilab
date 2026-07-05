import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import AesClientWrapper from './AesClientWrapper';

const toolId = 'aes-encrypt-decrypt';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="AES Encrypt / Decrypt"
      description="Encrypt and decrypt text using AES-256-GCM or AES-256-CBC with PBKDF2 key derivation. 100% browser-native & private."
      category={cat}
      toolId={toolId}
    >
      <AesClientWrapper />
    </ToolShell>
  );
}
