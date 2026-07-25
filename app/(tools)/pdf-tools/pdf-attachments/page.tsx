import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import PdfAttachmentsClientWrapper from '@/src/features/pdf-attachments/pdf-attachmentsClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = "pdf-attachments";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="PDF Attachments"
      description="View, extract, or remove hidden files attached inside your PDF."
      category={cat}
    >
      <PdfAttachmentsClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-embedded"
          title="How it Works: The /EmbeddedFiles Tree"
          preview="Learn how an entire Excel spreadsheet can live inside a PDF."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A PDF can act like a ZIP archive. The PDF specification allows you to embed arbitrary files (like Word documents, Excel spreadsheets, or even other PDFs) directly into the file structure.
            </p>
            <h3>The Name Tree</h3>
            <p>
              These attached files are not stored on the pages themselves. They are stored in a specialized data structure in the root dictionary called the <strong>Name Tree</strong> (specifically, the <code>/EmbeddedFiles</code> node). 
            </p>
            <p>
              When you use this tool to extract an attachment, we parse this Name Tree, locate the binary stream associated with the file, decompress it (using algorithms like FlateDecode), and trigger a download of the raw binary data.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
