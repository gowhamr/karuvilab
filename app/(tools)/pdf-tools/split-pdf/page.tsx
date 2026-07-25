import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import SplitPdfClientWrapper from './SplitPdfClientWrapper';

const toolId = 'split-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Split PDF"
      description="Extract specific page ranges from a PDF file."
      category={cat}
      toolId={toolId}
    >
      <SplitPdfClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-splitting"
          title="How it Works: Document Serialization"
          preview="Learn why splitting a PDF is more complex than slicing a video."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A PDF is a graph-based database, not a flat sequence of pages. It features a root <strong>Catalog</strong> dictionary that links to a <strong>Page Tree</strong>, which then links to individual page objects.
            </p>
            <h3>Dependency Resolution</h3>
            <p>
              When you split a PDF document into multiple smaller documents, the tool must traverse this dependency graph. If you split a 100-page document into 10 separate PDFs, each new PDF must receive its own isolated copy of the Catalog, XRef tables, and shared resources (like fonts and color profiles) required by those specific pages.
            </p>
            <p>
              This process of recursively walking the object tree and serializing a perfectly valid sub-graph is what allows the split files to open flawlessly in Adobe Acrobat without corruption errors.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-architecture"
          title="Performance & Asynchronous Streaming"
          preview="How we output a ZIP file containing thousands of pages without crashing."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              If a user splits a 5,000-page manual into 5,000 separate PDFs, holding all 5,000 generated documents in memory would crash the browser instantly.
            </p>
            <ul>
              <li><strong>Streaming ZIP Archive:</strong> Our Web Worker generates the split PDFs one at a time and streams the binary output directly into a highly compressed `.zip` container via <code>fflate</code>.</li>
              <li><strong>Garbage Collection:</strong> As soon as a split document is streamed into the ZIP, it is aggressively garbage collected from RAM, ensuring memory usage stays flat regardless of the document size.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
