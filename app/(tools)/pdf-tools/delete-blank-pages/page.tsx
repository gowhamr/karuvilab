import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import DeleteBlankPagesClientWrapper from './DeleteBlankPagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'delete-blank-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Delete Blank Pages"
      description="Automatically detect and remove blank pages."
      category={cat}
      toolId={toolId}
    >
      <DeleteBlankPagesClientWrapper />

      <LearningHub title="Understanding Blank Page Detection">
        
        <LearningSection type="architecture" title="Not Just White Pixels">
          <p>Detecting a blank page in a PDF is surprisingly difficult. Unlike a raster image where you can just check if every pixel is white, a PDF page is a complex stream of rendering instructions.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="The Detection Heuristics">
          <p>This tool uses a multi-layered heuristic approach to scan the PDF object stream:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Operator Counting:</strong> We parse the page's contents and count the rendering operators. If the only operators present are structural (like <code>q</code> and <code>Q</code> for saving/restoring graphics states) but no text drawing (<code>Tj</code>) or path painting (<code>S</code>, <code>f</code>) operators exist, the page is likely blank.</li>
            <li><strong>Invisible Text:</strong> Sometimes software generates "blank" pages containing invisible spaces or white text on a white background. We extract text streams and strip out whitespace to calculate meaningful content length.</li>
            <li><strong>Annotation Checks:</strong> A page might have no text or paths, but contain a visible Sticky Note annotation or a Form Field. The algorithm scans the <code>/Annots</code> dictionary to ensure no interactive elements exist before declaring it blank.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Processing at Scale">
          <p>Parsing the raw instruction stream of every page in a 1,000-page document requires massive CPU cycles. We offload this heavy parsing logic to a Web Worker running compiled WebAssembly, keeping the UI perfectly smooth.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is detecting a blank PDF page more complicated than detecting a blank JPEG?",
                options: [
                  "Because PDFs are encrypted by default.",
                  "Because a PDF page is a list of rendering instructions (text, paths, vectors) rather than a simple grid of colored pixels.",
                  "Because PDFs use CMYK color space.",
                  "Because blank PDF pages are explicitly tagged as '/Blank' in the metadata."
                ],
                correctIndex: 1,
                explanation: "You have to parse the instruction stream to see if any instructions actually result in visible ink being put on the page."
              },
              {
                question: "Which of the following could cause a page to appear blank to a human, but not be detected as blank by a basic script?",
                options: [
                  "The page has zero operators.",
                  "The page contains a paragraph of text where the font color is exactly the same as the background color.",
                  "The page is physically smaller than A4.",
                  "The page contains a digital signature."
                ],
                correctIndex: 1,
                explanation: "White text on a white background puts rendering instructions in the file stream, fooling simple detectors, even though a human sees nothing."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
