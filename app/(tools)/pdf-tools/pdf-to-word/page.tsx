import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import PdfToWordClientWrapper from './PdfToWordClientWrapper';

const toolId = 'pdf-to-word';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="PDF to Word"
      description="Extract text from PDF files and convert them into editable Microsoft Word (.docx) documents completely in your browser."
      category={cat}
      toolId={toolId}
    >
      <PdfToWordClientWrapper />

      <LearningHub title="Understanding Document Reconstruction">
        
        <LearningSection type="architecture" title="Missing Paragraphs">
          <p>A PDF does not understand the concept of a "paragraph" or a "sentence." A PDF is just a list of absolute visual instructions telling a printer where to drop ink.</p>
          <p className="mt-2">For example, it simply says: <em>"Draw the letter <strong>H</strong> at coordinate (100, 500), then draw <strong>e</strong> at (110, 500)"</em>. The fact that those letters form the word "Hello" in a paragraph is completely unknown to the PDF structure itself.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Heuristic Grouping">
          <p>To convert this layout back into a fluid Word document (OOXML format), our extraction engine has to perform complex spatial heuristics.</p>
          <p className="mt-2">It looks at the exact coordinates of every single character on the page and guesses which ones are close enough together horizontally to form a "word." It then looks at the vertical spacing between words to guess what constitutes a "line," and finally groups lines to form a "paragraph." This reverse-engineering is why PDF-to-Word conversions are rarely 100% perfect, especially with complex multi-column layouts.</p>
        </LearningSection>

        <LearningSection type="api" title="Scanned Documents & OCR">
          <p>If you scan a piece of physical paper, the resulting PDF does not contain text characters at all. It only contains a single large photograph (an <code>Image XObject</code>) of the paper.</p>
          <p className="mt-2">Because this tool runs entirely offline in your browser for absolute privacy, it does not include a heavy <strong>Optical Character Recognition (OCR)</strong> machine learning engine. Therefore, if you convert a scanned PDF, the resulting Word document will simply contain that single large image, rather than editable text.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is converting a PDF to a Word document so complex for a computer?",
                options: [
                  "Because Microsoft Word uses a proprietary format that is illegal to generate.",
                  "Because PDFs don't store logical structure (like paragraphs); they only store absolute X/Y coordinates for characters.",
                  "Because PDFs are always encrypted.",
                  "Because Word documents cannot display images."
                ],
                correctIndex: 1,
                explanation: "PDFs are a finalized visual layout format. Reconstructing logical flow (paragraphs) requires guessing based on character coordinates."
              },
              {
                question: "What happens if you use this offline tool to convert a PDF that was created by a physical paper scanner?",
                options: [
                  "It will perfectly transcribe the text.",
                  "It will fail and crash.",
                  "The Word document will contain a single large image of the scanned page, because this tool does not use OCR.",
                  "It will convert the image into a spreadsheet."
                ],
                correctIndex: 2,
                explanation: "Scanned PDFs contain photographs, not text characters. Extracting text from photographs requires Optical Character Recognition (OCR)."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
