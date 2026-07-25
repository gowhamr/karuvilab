import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import OrganizePdfClientWrapper from '@/src/features/organize-pdf/organize-pdfClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = "organize-pdf";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Organize PDF Pages"
      description="Reorder, delete, or rotate individual pages in a PDF document visually."
      category={cat}
    >
      <OrganizePdfClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-organize"
          title="How it Works: The /Kids Array"
          preview="Learn how dragging and dropping a page actually alters the PDF database."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you drag a page to a new position using this tool, the visual change is immediate. But behind the scenes, we are actually modifying the structural hierarchy of the PDF document.
            </p>
            <h3>The Pages Dictionary</h3>
            <p>
              In the PDF specification, the document structure is governed by a <strong>Pages Dictionary</strong>. This dictionary contains an array called <code>/Kids</code>, which holds references to every single page in the document in strict sequential order.
            </p>
            <p>
              If you move Page 5 to position 2, we don't have to rewrite the heavy graphics data of Page 5. We simply take the reference to Page 5 and insert it into the 2nd slot of the <code>/Kids</code> array. When we save the file, the PDF viewer reads the new array order and displays the pages accordingly.
            </p>
            <h3>Garbage Collection</h3>
            <p>
              If you delete a page from the UI, we remove its reference from the <code>/Kids</code> array. However, to ensure the final file size actually shrinks, our engine traverses the entire object tree before saving, identifying any orphaned fonts, images, or vectors that belonged exclusively to that deleted page, and permanently scrubs them from the file.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-architecture"
          title="Performance & Canvas Rendering"
          preview="How we generate thumbnails without crashing your browser."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              To show you a visual drag-and-drop interface, we have to render every page of the PDF into a thumbnail. For a 100-page document, doing this synchronously would freeze the browser for several seconds.
            </p>
            <ul>
              <li><strong>Lazy Rendering:</strong> We use the <code>IntersectionObserver</code> API to only render thumbnails when they are about to scroll into view.</li>
              <li><strong>WebAssembly Core:</strong> The actual reordering and garbage collection of the PDF structure is executed in a background Web Worker using <code>pdf-lib</code>, ensuring your UI remains perfectly smooth.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
