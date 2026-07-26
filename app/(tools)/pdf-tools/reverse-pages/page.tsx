import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ReversePagesClientWrapper from './ReversePagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'reverse-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Reverse PDF Pages"
      description="Reverse the order of pages in your PDF."
      category={cat}
      toolId={toolId}
    >
      <ReversePagesClientWrapper />

      <LearningHub title="Understanding PDF Array Operations">
        
        <LearningSection type="architecture" title="Relational Pointers">
          <p>A PDF document is essentially a database of objects. The pages you see on screen are determined by a specific array called the <code>/Kids</code> array inside the root Pages dictionary.</p>
          <p className="mt-2">This array holds references (pointers) to the actual page objects scattered throughout the file.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="In-Place Reversal">
          <p>To reverse an entire document, we do not need to read, decode, or rewrite the heavy graphical content of every single page.</p>
          <p className="mt-2">Instead, our WebAssembly engine simply takes the <code>/Kids</code> array (e.g., <code>[1, 2, 3, 4]</code>) and runs a standard array reversal algorithm in memory (resulting in <code>[4, 3, 2, 1]</code>). When the file is serialized and saved, any PDF viewer will follow these pointers and display the book backwards.</p>
        </LearningSection>

        <LearningSection type="performance" title="O(n) Efficiency">
          <p>Because reversing an array of integers is an <strong>O(n)</strong> time complexity operation that requires almost zero memory allocation, this tool can reverse a 10,000-page PDF in a fraction of a millisecond.</p>
          <p className="mt-2">The only computational cost is parsing the initial file structure and writing the new file bytes back to disk.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is reversing a PDF document so fast?",
                options: [
                  "Because it only flips the /Kids reference array, rather than touching the image/text data.",
                  "Because the browser uses hardware acceleration.",
                  "Because it skips blank pages.",
                  "Because it compresses the file."
                ],
                correctIndex: 0,
                explanation: "Reversing a PDF is just an array manipulation of reference pointers."
              },
              {
                question: "What time complexity describes reversing an array of pointers?",
                options: [
                  "O(1)",
                  "O(n^2)",
                  "O(n)",
                  "O(log n)"
                ],
                correctIndex: 2,
                explanation: "Reversing an array scales linearly with the number of pages (n), making it an O(n) operation."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
