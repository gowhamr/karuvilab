import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import PdfCompareClientWrapper from '@/src/features/pdf-compare/pdf-compareClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = "pdf-compare";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Compare PDFs"
      description="Visually highlight the differences between two PDF documents."
      category={cat}
    >
      <PdfCompareClientWrapper />

      <LearningHub title="Understanding PDF Diffing Algorithms">
        
        <LearningSection type="architecture" title="Why Comparing PDFs is Hard">
          <p>When a programmer compares two source code files, the computer simply runs a string comparison algorithm (like Myers Diff) on the text. PDFs, however, are complex visual layout documents.</p>
          <p className="mt-2">If a lawyer changes the font size of a contract by 1pt, the actual text strings inside the file remain identical, but the visual layout has shifted. A simple text diff would miss this entirely.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Visual Pixel Comparison">
          <p>The most reliable way to compare two PDFs is to rasterize them into images and mathematically compare the exact pixel values at every coordinate.</p>
          <p className="mt-2">This tool uses a <strong>Pixel Matching algorithm</strong> (similar to <code>pixelmatch</code>) that analyzes the RGB values of both documents. When it detects a mismatch between Pixel A and Pixel B, it paints that coordinate bright red, ensuring no sneaky visual changes slip by.</p>
        </LearningSection>

        <LearningSection type="performance" title="Web Worker Execution">
          <p>Comparing high-resolution images pixel-by-pixel requires looping over millions of data points per page.</p>
          <p className="mt-2">If we ran this loop on the main browser thread, the entire webpage would freeze. By running this intensive pixel matching algorithm in a background Web Worker, we keep the UI thread unblocked even when you are comparing dozens of pages.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is a visual pixel diff more secure than a text diff for legal documents?",
                options: [
                  "Because it is faster.",
                  "Because a text diff might miss a change in font size, color, or image replacement that alters the document's meaning.",
                  "Because text diffs require passwords.",
                  "Because pixels take up less memory."
                ],
                correctIndex: 1,
                explanation: "In a PDF, an attacker could hide a clause by making the text white or changing the layout. A visual diff catches exactly what the human eye would (or wouldn't) see."
              },
              {
                question: "How does the tool prevent the browser from freezing during the comparison?",
                options: [
                  "It uploads the files to a server.",
                  "It only compares the first paragraph.",
                  "It offloads the heavy pixel-looping mathematics to a background Web Worker thread.",
                  "It compresses the PDFs first."
                ],
                correctIndex: 2,
                explanation: "Web Workers allow browsers to run heavy CPU tasks in the background without interrupting the user interface."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
