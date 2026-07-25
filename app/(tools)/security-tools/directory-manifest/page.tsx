import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-manifest"
          title="How it Works: Checksums & Manifests"
          preview="Learn how developers prove that a massive software download hasn't been tampered with."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you download a 4GB operating system ISO or a large dataset, how do you know the file wasn't corrupted in transit or maliciously altered by a hacker intercepting the connection?
            </p>
            <h3>Cryptographic Hashes</h3>
            <p>
              A hashing algorithm (like SHA-256) takes an input of any size and produces a fixed-length string of characters (a "hash" or "checksum"). Crucially, if even a single bit in the 4GB file is changed, the resulting hash will be completely different.
            </p>
            <h3>Manifest Files</h3>
            <p>
              To secure a large folder of files, developers generate a <strong>Manifest</strong>. This is a simple text file listing every file and its exact hash. They publish this manifest in a secure location (like a signed GitHub release). After you download the files, you can run a tool like this one to independently calculate the hashes on your machine and compare them to the manifest. If they match perfectly, you have mathematical proof that the files are intact.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
