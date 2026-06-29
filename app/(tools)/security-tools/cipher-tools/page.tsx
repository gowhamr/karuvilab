import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import CipherToolsWrapper from './CipherToolsWrapper';

const toolId = 'cipher-tools';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Text Cipher Tools"
      description="Caesar, ROT13, Vigenere, XOR ciphers."
      category={cat}
      toolId={toolId}
    >
      <CipherToolsWrapper />
    </ToolShell>
  );
}
