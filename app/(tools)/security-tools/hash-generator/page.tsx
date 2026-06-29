import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import HashGeneratorClientWrapper from './HashGeneratorClientWrapper';

const toolId = 'hash-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or file input."
      category={cat}
      toolId={toolId}
    >
      <HashGeneratorClientWrapper />
    </ToolShell>
  );
}
