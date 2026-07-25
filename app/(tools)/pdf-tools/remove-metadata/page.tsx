import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import RemoveMetadataClientWrapper from '@/src/features/remove-metadata/remove-metadataClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = "remove-metadata";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Remove PDF Metadata"
      description="Scrub hidden information, author details, and XMP data from your PDFs."
      category={cat}
    >
      <RemoveMetadataClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-metadata"
          title="How it Works: Hidden PDF Dictionaries"
          preview="Learn where PDFs hide your personal information and how we strip it."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you create or edit a PDF, software often embeds invisible tracking and author data. This data is stored in two primary locations within the PDF structure:
            </p>
            <h3>1. The Document Information Dictionary (Info)</h3>
            <p>
              This is the legacy metadata system (from PDF 1.0). It is a simple key-value dictionary that stores fields like <code>/Author</code>, <code>/Title</code>, <code>/Creator</code> (the software used to make the file), and <code>/CreationDate</code>. This tool systematically deletes these keys from the file's root dictionary.
            </p>
            <h3>2. XMP Metadata (Extensible Metadata Platform)</h3>
            <p>
              Introduced by Adobe, XMP is a massive XML payload embedded as a binary stream inside the PDF. It can contain incredibly detailed histories, including the specific software version used, color swatches, layer names, and even the ID of the camera used to take embedded photos. Our tool locates the <code>/Metadata</code> stream pointer and safely nullifies it, completely destroying the XML payload.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-privacy"
          title="Privacy & Security Assurance"
          preview="Why metadata scrubbing must be done locally."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              If you are stripping metadata from a document, you are likely doing it for privacy reasons (e.g., whistleblowing, legal discovery, or anonymity). 
            </p>
            <p>
              <strong>It is highly insecure to upload a document to a remote server to "scrub" it.</strong> The server you upload it to could easily log the exact metadata you are trying to hide before deleting it.
            </p>
            <p>
              By using WebAssembly and Web Workers, this tool performs the memory manipulation entirely on your device. The raw binary is cleansed before it ever leaves your RAM, and absolutely zero data is transmitted over the internet.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
