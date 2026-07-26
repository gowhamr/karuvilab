import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import RotatePdfClientWrapper from './RotatePdfClientWrapper';

const toolId = 'rotate-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Rotate PDF"
      description="Rotate one or all pages of a PDF by 90°, 180°, or 270°."
      category={cat}
      toolId={toolId}
    >
      <RotatePdfClientWrapper />

      <LearningHub title="Understanding PDF Rotation Attributes">
        
        <LearningSection type="architecture" title="No Recalculation Required">
          <p>If you rotate a JPEG image, the software has to recalculate the position of every single pixel and save a completely new file. When you rotate a PDF, <strong>nothing is actually recalculated or moved</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The /Rotate Attribute">
          <p>Every page in a PDF is defined by a <strong>Page Dictionary</strong> object. This dictionary contains a specific metadata attribute called <code>/Rotate</code>, which can hold values like 90, 180, or 270.</p>
          <p className="mt-2">When you use this tool to rotate a page, all it does is update that single integer in the dictionary. The underlying text, vectors, and image payloads remain completely untouched. When you open the file in Adobe Acrobat or Chrome, the viewer software sees the <code>/Rotate 90</code> flag and handles the visual rotation dynamically on your screen.</p>
        </LearningSection>

        <LearningSection type="performance" title="O(1) Operation">
          <p>Because the tool only needs to flip a few integer values inside the document's structure rather than decoding and re-encoding gigabytes of graphics data, rotation is incredibly lightweight.</p>
          <p className="mt-2">Rotating a massive 5,000-page engineering schematic takes exactly the same amount of CPU effort as rotating a 1-page receipt. It takes only milliseconds, and because it runs natively in your browser using WebAssembly, zero data is sent to a server.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What actually happens to the image data when you rotate a PDF page?",
                options: [
                  "The image data is decoded, rotated pixel by pixel, and re-encoded.",
                  "Absolutely nothing. Only a /Rotate flag is updated in the page's dictionary.",
                  "The file is converted to a Word document and rotated.",
                  "The page is cropped to fit the new rotation."
                ],
                correctIndex: 1,
                explanation: "PDF rotation is non-destructive. The underlying content stream is untouched; only the metadata instructing the viewer how to display the page is changed."
              },
              {
                question: "Why is rotating a PDF so much faster than rotating a JPEG?",
                options: [
                  "Because PDFs use the cloud.",
                  "Because rotating a JPEG requires recalculating every pixel, while a PDF just updates a single integer flag.",
                  "Because PDFs are always smaller files.",
                  "Because PDFs do not support high-resolution images."
                ],
                correctIndex: 1,
                explanation: "Updating the /Rotate attribute is a simple O(1) metadata change, making it lightning fast regardless of how complex the page graphics are."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
