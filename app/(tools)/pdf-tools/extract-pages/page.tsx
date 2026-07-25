import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import ExtractPagesClientWrapper from './ExtractPagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'extract-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Extract PDF Pages"
      description="Extract selected pages into a new PDF document."
      category={cat}
      toolId={toolId}
    >
      <ExtractPagesClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-extraction"
          title="How it Works: The PDF Page Tree"
          preview="Learn how pages are extracted without duplicating massive font files."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you extract a page from a PDF, we don't just "cut out" a visual image. A PDF is a relational database organized as a <strong>Page Tree</strong>. Every page is a dictionary node that points to shared resources like Fonts, Images, and Color Spaces.
            </p>
            <h3>Shared Object Tables</h3>
            <p>
              If a 100-page PDF uses the same 5MB font on every page, the font is only embedded once in the file. When you extract 10 pages, our tool traces the dependency graph for each page. It identifies which shared resources are actually used by the selected pages and copies them into the new file.
            </p>
            <p>
              This is why extracting 10 pages from a 100-page document might not perfectly divide the file size by 10. The new file must still include the heavy fonts and shared metadata required to render those 10 pages perfectly.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-architecture"
          title="Privacy & Memory Management"
          preview="How we extract pages locally without uploading to a server."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Splitting and extracting PDFs usually requires heavy server-side tools like Ghostscript or Adobe Acrobat. We do it directly in your browser.
            </p>
            <ul>
              <li><strong>Zero Data Exfiltration:</strong> By using WebAssembly to process the Page Tree locally, your sensitive documents never leave your computer.</li>
              <li><strong>Streamlined Memory:</strong> We utilize the <code>pdf-lib</code> engine in a Web Worker, ensuring that even extracting pages from gigabyte-sized PDFs won't crash your browser tab.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
