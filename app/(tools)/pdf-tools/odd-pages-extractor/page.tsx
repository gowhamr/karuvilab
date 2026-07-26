import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import OddPagesExtractorClientWrapper from './OddPagesExtractorClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'odd-pages-extractor';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Extract Odd Pages"
      description="Automatically extract all odd pages from a PDF."
      category={cat}
      toolId={toolId}
    >
      <OddPagesExtractorClientWrapper />

      <LearningHub title="Understanding Array Mathematics">
        
        <LearningSection type="architecture" title="Zero-Indexed Arrays">
          <p>When a human looks at a book, the very first page is Page 1. But in computer science, arrays are almost always <strong>zero-indexed</strong>.</p>
          <p className="mt-2">This means the first page is located at index <code>0</code>, the second page (Page 2) is at index <code>1</code>, and the third page (Page 3) is at index <code>2</code>.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="The Modulo Operator">
          <p>To extract "Odd Pages" (Page 1, 3, 5, 7...), the algorithm must iterate over the PDF's internal <code>/Kids</code> array and select the pages located at even indices (index 0, 2, 4, 6...).</p>
          <p className="mt-2">The mathematical logic uses the <strong>modulo</strong> operator (<code>%</code>), which returns the remainder of division. We filter the array for indices where <code>index % 2 === 0</code>.</p>
        </LearningSection>

        <LearningSection type="performance" title="Practical Use: Duplex Scanning">
          <p>This tool is primarily used for reconstructing physical documents scanned by older, single-sided (simplex) scanners.</p>
          <p className="mt-2">If you have a stack of double-sided papers, you scan all the fronts (Odd pages) into one PDF, flip the physical stack over, and scan all the backs (Even pages) into another PDF. You can then use this tool in combination with our Merge/Reorder tools to interleave them back into a perfect digital replica of the physical book.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "In a zero-indexed array, what is the index of Page 5?",
                options: [
                  "5",
                  "4",
                  "6",
                  "0"
                ],
                correctIndex: 1,
                explanation: "Because counting starts at 0, the Nth item is always found at index N-1."
              },
              {
                question: "Which mathematical operator is used to determine if a number is even or odd?",
                options: [
                  "Division (/)",
                  "Multiplication (*)",
                  "Modulo (%)",
                  "Bitwise AND (&)"
                ],
                correctIndex: 2,
                explanation: "The modulo operator returns the remainder. Any number where 'n % 2 == 0' is even, and 'n % 2 != 0' is odd."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
