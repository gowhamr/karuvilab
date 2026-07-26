import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import PageNumberingClientWrapper from './PageNumberingClientWrapper';

const toolId = 'page-numbering';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Page Numbering"
      description="Add page numbers to every page of your PDF."
      category={cat}
      toolId={toolId}
    >
      <PageNumberingClientWrapper />

      <LearningHub title="Understanding PDF Text Drawing">
        
        <LearningSection type="architecture" title="No Native 'Page Number' Property">
          <p>Unlike Microsoft Word, PDFs do not have a magical "Page Number" setting that you can just toggle on.</p>
          <p className="mt-2">A PDF is a finalized layout format. A page number is just a piece of text that happens to be drawn at the exact same coordinate on every page. To add page numbers, we have to explicitly draw text onto each page's canvas.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Modifying the Content Stream">
          <p>Every page in a PDF has a <strong>Content Stream</strong>—a sequence of instructions telling the renderer how to draw paths, images, and text.</p>
          <p className="mt-2">When you use this tool, our WebAssembly engine loops through every page in the document. For each page, it calculates the desired X and Y coordinates (e.g., bottom-center), and appends a new set of text-drawing instructions to the end of that page's Content Stream.</p>
        </LearningSection>

        <LearningSection type="performance" title="Font Embedding">
          <p>To draw text, the PDF must have access to the font. If we used a custom font for the page numbers, we would have to embed that entire font file into the PDF, inflating the file size.</p>
          <p className="mt-2">Instead, this tool uses standard base fonts (like Helvetica) that are guaranteed to be supported by all PDF viewers, ensuring the file size remains small and the text renders perfectly everywhere.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How does this tool add page numbers to the document?",
                options: [
                  "By turning on the /PageNumber metadata flag.",
                  "By appending text-drawing instructions to each page's Content Stream.",
                  "By rasterizing each page into an image.",
                  "By adding a watermark layer."
                ],
                correctIndex: 1,
                explanation: "PDFs lack dynamic pagination features. Page numbers are literally just text strings drawn at specific X/Y coordinates on each page."
              },
              {
                question: "Why does the tool use standard base fonts like Helvetica?",
                options: [
                  "Because they look the best.",
                  "To avoid embedding a new font file, which would increase the PDF file size.",
                  "Because custom fonts are illegal.",
                  "To prevent the PDF from being edited."
                ],
                correctIndex: 1,
                explanation: "Standard base fonts (the Standard 14) do not need to be embedded in the PDF, keeping the file size compact."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
