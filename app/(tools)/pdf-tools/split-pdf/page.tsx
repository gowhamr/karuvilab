import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding Document Serialization">
        
        <LearningSection type="architecture" title="The Dependency Graph">
          <p>A PDF is a complex, graph-based database, not a flat sequence of images. It features a root <strong>Catalog</strong> dictionary that links to a <strong>Page Tree</strong>, which then links to individual page objects.</p>
          <p className="mt-2">When you split a PDF document into multiple smaller documents, the tool must carefully traverse this dependency graph.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Recursive Object Copying">
          <p>If you split a 100-page document into 10 separate PDFs, we can't just slice the bytes like a video file.</p>
          <p className="mt-2">Each new PDF must receive its own isolated copy of the root Catalog, the Cross-Reference (XRef) tables, and all shared resources (like embedded fonts and color profiles) required by those specific pages. This process of recursively walking the object tree and serializing a perfectly valid sub-graph ensures the split files open flawlessly in Adobe Acrobat.</p>
        </LearningSection>

        <LearningSection type="performance" title="Asynchronous ZIP Streaming">
          <p>If a user splits a massive 5,000-page manual into 5,000 separate PDFs, trying to hold all 5,000 generated documents in the browser's RAM at once would instantly cause an Out-Of-Memory (OOM) crash.</p>
          <p className="mt-2">To solve this, our background Web Worker generates the split PDFs one at a time and streams the binary output directly into a compressed <code>.zip</code> container. As soon as a split document is streamed into the ZIP, it is aggressively garbage collected from RAM, ensuring memory usage stays flat regardless of the job size.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why can't you just slice the raw bytes of a PDF file to split it?",
                options: [
                  "Because it is illegal.",
                  "Because a PDF is a graph database. Slicing it would sever the pointers to the Catalog and shared fonts, resulting in a corrupted file.",
                  "Because PDFs are encrypted by default.",
                  "Because slicing changes the file extension."
                ],
                correctIndex: 1,
                explanation: "To split a PDF, the engine must intelligently traverse the object tree and construct a new, valid root catalog for each split section."
              },
              {
                question: "How does the tool prevent the browser from crashing when splitting thousands of files?",
                options: [
                  "By uploading it to AWS.",
                  "By compressing the PDF before splitting.",
                  "By streaming the generated files one-by-one into a ZIP archive and clearing them from memory immediately.",
                  "By turning off the screen."
                ],
                correctIndex: 2,
                explanation: "Streaming and aggressive garbage collection are essential techniques for handling massive document processing in a browser environment."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
