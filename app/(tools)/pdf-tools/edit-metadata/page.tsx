import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import EditMetadataClientWrapper from '@/src/features/edit-metadata/edit-metadataClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = "edit-metadata";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Edit PDF Metadata"
      description="View and modify the hidden properties, author, and title of your PDF."
      category={cat}
    >
      <EditMetadataClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-metadata"
          title="How it Works: The Information Dictionary"
          preview="Learn how metadata is stored and modified inside a PDF."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Metadata isn't written on the pages of your PDF; it is stored in a hidden structure called the <strong>Document Information Dictionary</strong>. 
            </p>
            <p>
              This dictionary contains standard keys like <code>/Title</code>, <code>/Author</code>, <code>/Subject</code>, and <code>/Keywords</code>. When you edit the metadata using this tool, you are directly manipulating these raw dictionary entries.
            </p>
            <h3>Strings and Encoding</h3>
            <p>
              In a PDF, metadata strings can be tricky because they often use special text encodings (like UTF-16BE) to support international characters. Our WebAssembly engine handles this complex encoding translation automatically so you can safely enter emojis or foreign characters without corrupting the file.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
