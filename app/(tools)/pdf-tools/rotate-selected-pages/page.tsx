import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import RotateSelectedPagesClientWrapper from './RotateSelectedPagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'rotate-selected-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Rotate Specific Pages"
      description="Rotate only the pages you select."
      category={cat}
      toolId={toolId}
    >
      <RotateSelectedPagesClientWrapper />

      <LearningHub title="Understanding Metadata-Driven Rotation">
        
        <LearningSection type="architecture" title="The /Rotate Attribute">
          <p>Every page in a PDF is defined by a dictionary object. This dictionary contains an attribute called <code>/Rotate</code>, which can hold values like 90, 180, or 270.</p>
          <p className="mt-2">When you rotate a page, the underlying text and vectors remain completely untouched. We simply update the <code>/Rotate</code> integer flag in that specific page's dictionary.</p>
        </LearningSection>
        
        <LearningSection type="performance" title="O(1) Operation">
          <p>Because the tool only needs to flip an integer value inside the document's structure rather than decoding graphics data, rotation is incredibly lightweight.</p>
          <p className="mt-2">Rotating a single page inside a massive 1,000-page book takes only milliseconds, and because it runs natively in your browser using WebAssembly, it requires no internet connection.</p>
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
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
