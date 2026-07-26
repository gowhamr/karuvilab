import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import MovePagesClientWrapper from './MovePagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'move-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Move PDF Pages"
      description="Move selected pages to a specific position in the PDF."
      category={cat}
      toolId={toolId}
    >
      <MovePagesClientWrapper />

      <LearningHub title="Understanding the /Kids Array">
        
        <LearningSection type="architecture" title="The Document Tree">
          <p>In the PDF specification, the document structure is governed by a <strong>Pages Dictionary</strong> (the root of the page tree). This tree contains an array called <code>/Kids</code>, which holds references to every page in the document in strict sequential order.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Rearranging Pointers">
          <p>When you move Page 50 to position 2 using this tool, we don't have to copy or rewrite the heavy graphics, fonts, or images of Page 50.</p>
          <p className="mt-2">Instead, we simply pluck the object reference for Page 50 out of the <code>/Kids</code> array, and insert it at index 1 (the second position). When the file is saved, the PDF viewer reads the new array order and displays the pages accordingly. This makes moving pages an extremely fast, lightweight operation.</p>
        </LearningSection>

        <LearningSection type="performance" title="Browser-Native Processing">
          <p>Because manipulating the <code>/Kids</code> array requires only editing the document's cross-reference table and dictionary objects, we can perform this operation entirely in your browser using WebAssembly.</p>
          <p className="mt-2">There is no need to upload your sensitive document to a server, and the processing is nearly instantaneous, even for massive 1,000-page books.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What PDF structure determines the order in which pages are displayed?",
                options: [
                  "The /Order metadata tag",
                  "The /Kids array in the Pages dictionary",
                  "The file naming convention",
                  "The Table of Contents"
                ],
                correctIndex: 1,
                explanation: "The /Kids array dictates the precise sequence of pages in a PDF document."
              },
              {
                question: "Why is moving a page in a PDF so fast?",
                options: [
                  "Because it uses cloud computing.",
                  "Because it just updates a reference pointer in an array, without moving actual image/font data.",
                  "Because it compresses the page.",
                  "Because it deletes the page."
                ],
                correctIndex: 1,
                explanation: "PDFs use relational pointers. Moving a page is as simple as reordering an array of ID numbers."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
