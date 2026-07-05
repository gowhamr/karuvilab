import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import PrivateKeyClientWrapper from './PrivateKeyClientWrapper';

const toolId = 'private-key-checker';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Private Key Checker"
      description="Check PKCS#8 & PKCS#1 private key syntax, structure, bit lengths, and security parameters 100% locally."
      category={cat}
      toolId={toolId}
    >
      <PrivateKeyClientWrapper />
    </ToolShell>
  );
}
