import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import DirectoryManifestClientWrapper from './DirectoryManifestClientWrapper';

const toolId = 'directory-manifest';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Directory Hash Manifest"
      description="Compute cryptographic hashes (MD5, SHA-256, SHA-512) for all files in a folder and generate a verification manifest."
      category={cat}
      toolId={toolId}
    >
      <DirectoryManifestClientWrapper />
    </ToolShell>
  );
}
