import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import DuplicatePagesClientWrapper from './DuplicatePagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'duplicate-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Duplicate PDF Pages"
      description="Duplicate specific pages within your PDF."
      category={cat}
      toolId={toolId}
    >
      <DuplicatePagesClientWrapper />

      <LearningHub title="Understanding PDF Object Pointers">
        
        <LearningSection type="architecture" title="The Size Mystery">
          <p>If you copy a 10MB photograph on your hard drive, it takes up 20MB of space. But PDFs are designed as relational databases. If you duplicate a 10MB page in a PDF, the final file size will barely increase at all. Why?</p>
        </LearningSection>
        
        <LearningSection type="api" title="Reference Duplication">
          <p>Every page in a PDF is defined by an Object ID (for example, <code>4 0 R</code>).</p>
          <p className="mt-2">When this tool "duplicates" a page, it does not physically copy the heavy graphics, vectors, or text streams embedded inside that page object. Instead, it simply takes the Object ID of the original page and inserts it a second time into the document's central <code>/Kids</code> array (which lists the page order).</p>
        </LearningSection>

        <LearningSection type="performance" title="Efficiency in Action">
          <p>When a PDF viewer opens the file, it reads the array of instructions: <em>"Show Object 4, then show Object 5, then show Object 4 again."</em></p>
          <p className="mt-2">The viewer renders the exact same binary data twice on screen without needing to store that data twice on disk. This makes duplicating pages inside a PDF a nearly instantaneous, zero-cost operation.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you duplicate a 5MB page inside a PDF, how much will the overall file size increase?",
                options: [
                  "Exactly 5MB.",
                  "Almost nothing (just a few bytes).",
                  "10MB because of caching.",
                  "It depends on the operating system."
                ],
                correctIndex: 1,
                explanation: "The PDF just adds a new reference pointer to the existing 5MB object. It does not copy the 5MB of data."
              },
              {
                question: "Where does the PDF store the order of pages?",
                options: [
                  "In the file name.",
                  "In the /Kids array of the Page Tree.",
                  "In the XMP metadata.",
                  "It infers it from the file size."
                ],
                correctIndex: 1,
                explanation: "The Page Tree defines the structure of the document, and the /Kids array holds the ordered list of page references."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
