import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import DeleteBlankPagesClientWrapper from './DeleteBlankPagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'delete-blank-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Delete Blank Pages"
      description="Automatically detect and remove blank pages."
      category={cat}
      toolId={toolId}
    >
      <DeleteBlankPagesClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-detection"
          title="How it Works: Blank Page Detection"
          preview="Learn the algorithms used to mathematically prove a PDF page is blank."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Detecting a blank page in a PDF is surprisingly difficult. Unlike a raster image where you can just check if every pixel is white, a PDF page is a stream of rendering instructions.
            </p>
            <h3>The Detection Heuristics</h3>
            <p>This tool uses a multi-layered heuristic approach to scan the PDF object stream:</p>
            <ul>
              <li><strong>Operator Counting:</strong> We parse the page's contents and count the rendering operators. If the only operators present are structural (like <code>q</code> and <code>Q</code> for saving/restoring graphics states) but no text drawing (<code>Tj</code>) or path painting (<code>S</code>, <code>f</code>) operators exist, the page is mathematically blank.</li>
              <li><strong>Invisible Text:</strong> Sometimes software generates "blank" pages containing invisible spaces or white text on a white background. We extract text streams and strip out whitespace to calculate meaningful content length.</li>
              <li><strong>Annotation Checks:</strong> A page might have no text or paths, but contain a visible Sticky Note annotation or a Form Field. The algorithm scans the <code>/Annots</code> dictionary to ensure no interactive elements exist before declaring it blank.</li>
            </ul>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-architecture"
          title="Architecture & Privacy"
          preview="Why client-side processing is critical for this task."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Parsing the raw instruction stream of every page in a 1,000-page document requires significant CPU cycles. 
            </p>
            <ul>
              <li><strong>WebAssembly & Web Workers:</strong> We offload the heavy parsing logic to a Web Worker running compiled WebAssembly. This allows the UI to stay perfectly smooth while crunching through hundreds of pages per second.</li>
              <li><strong>Zero Upload Privacy:</strong> Because this happens entirely in your browser's memory, your PDF is never uploaded to a server. Your data stays on your device.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
