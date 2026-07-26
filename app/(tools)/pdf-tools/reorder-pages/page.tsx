import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ReorderPagesClientWrapper from './ReorderPagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'reorder-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Reorder PDF Pages"
      description="Drag and drop to reorder pages in your PDF."
      category={cat}
      toolId={toolId}
    >
      <ReorderPagesClientWrapper />

      <LearningHub title="Understanding PDF Arrays">
        
        <LearningSection type="architecture" title="The Structural Hierarchy">
          <p>In the PDF specification, the visual sequence of pages is not determined by the order of the bytes on disk. It is determined purely by an array structure.</p>
          <p className="mt-2">The root of the document contains a <strong>Pages Dictionary</strong>. Inside this dictionary is the <code>/Kids</code> array, which holds reference pointers to every single page object.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Swapping Array Pointers">
          <p>When you drag a page to a new position in this UI, we do not rewrite the heavy graphics data or images associated with that page.</p>
          <p className="mt-2">We simply update the order of the ID numbers in the <code>/Kids</code> array. For example, changing <code>[1 2 3]</code> to <code>[3 1 2]</code>. When the file is saved, the PDF viewer reads this new array and displays the pages in the new sequence. This makes reordering extremely fast and memory-efficient.</p>
        </LearningSection>

        <LearningSection type="performance" title="Zero-Copy Architecture">
          <p>Because manipulating the array requires only editing the document's cross-reference table and dictionary objects, we can perform this operation entirely in your browser using WebAssembly.</p>
          <p className="mt-2">We use zero-copy <code>ArrayBuffer</code> transfers between the UI thread and the background Web Worker, ensuring that even reordering a massive 1,000-page book takes only milliseconds without freezing the browser.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What actually happens to the PDF data when you reorder pages?",
                options: [
                  "The heavy image data is physically moved from one part of the file to another.",
                  "Only the reference pointers in the /Kids array are shuffled.",
                  "The file is converted to images and stitched back together.",
                  "The PDF is uploaded and rebuilt on a server."
                ],
                correctIndex: 1,
                explanation: "PDFs use relational pointers. Reordering pages is as simple as reordering an array of ID numbers."
              },
              {
                question: "Why does the tool use a Web Worker to save the file?",
                options: [
                  "To upload it to the cloud faster.",
                  "To prevent the heavy PDF serialization process from freezing the main UI thread.",
                  "To bypass browser security.",
                  "To compress the images."
                ],
                correctIndex: 1,
                explanation: "Web Workers allow heavy tasks (like saving a large binary file) to run in the background, keeping the drag-and-drop UI smooth."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
