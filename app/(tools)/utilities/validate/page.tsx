import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import FileValidatorClientWrapper from './FileValidatorClientWrapper';

const toolId = 'validate';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="File Validator"
      description="Inspect file metadata, verify magic bytes against extension, and check image dimensions."
      category={cat}
      toolId={toolId}
    >
      <FileValidatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-magic-bytes"
          title="How it Works: Magic Bytes vs File Extensions"
          preview="Learn why changing a file extension from .exe to .jpg doesn't fool a security scanner."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              In Windows, a file's format is typically determined by its extension (e.g., <code>document.pdf</code>). However, an extension is just a label in the filename; it doesn't guarantee the actual contents of the file.
            </p>
            <h3>What are Magic Bytes?</h3>
            <p>
              To definitively determine what a file is, computer systems look at the very first few bytes of the file itself. These are called "Magic Bytes" or "File Signatures."
            </p>
            <ul>
              <li>A real PDF file will always start with <code>25 50 44 46</code> (which translates to <code>%PDF</code> in ASCII text).</li>
              <li>A real JPEG image will always start with <code>FF D8 FF E0</code>.</li>
              <li>A real ZIP archive will always start with <code>50 4B 03 04</code>.</li>
            </ul>
            <h3>Security Implications</h3>
            <p>
              A common tactic for malware distributors is to write a malicious Windows Executable (which starts with the magic bytes <code>4D 5A</code>) and rename it to <code>invoice.pdf</code>. 
            </p>
            <p>
              This tool reads the raw binary data of the file you upload, checks the first few bytes, and verifies that the Magic Signature actually matches the claimed file extension, helping you spot disguised files.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
