import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-reconstruction"
          title="How it Works: Text Flow Reconstruction"
          preview="Why converting PDF to Word is incredibly difficult for a computer."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A PDF does not understand the concept of a "paragraph" or a "sentence." A PDF is just a list of instructions telling a printer where to drop ink. For example, it says: <em>"Draw the letter <strong>H</strong> at coordinate (100, 500), then draw <strong>e</strong> at (110, 500)"</em>.
            </p>
            <h3>Heuristic Grouping</h3>
            <p>
              To convert this back into a fluid Word document (OOXML), our extraction engine has to use spatial heuristics. It looks at the coordinates of every single character on the page and guesses which ones are close enough together to form a "word." It then looks at the vertical spacing between words to guess what constitutes a "line," and grouping lines to form a "paragraph."
            </p>
            <p>
              This complex reverse-engineering is why PDF-to-Word conversions are rarely 100% perfect, especially if the document has complex column layouts or tables.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-ocr"
          title="Limitations: Scanned Documents (OCR)"
          preview="Why scanned PDFs convert into a single massive image."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              If you scan a piece of paper using a physical scanner, the resulting PDF does not contain text characters. It only contains a single large photograph (an XObject) of the paper.
            </p>
            <p>
              Because this tool runs entirely offline in your browser for privacy, it currently does not include a heavy <strong>Optical Character Recognition (OCR)</strong> engine (which uses machine learning to "read" images). If you try to convert a scanned PDF, the resulting Word document will just contain that single large image.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
