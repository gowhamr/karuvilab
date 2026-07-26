import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import WatermarkPdfClientWrapper from './WatermarkPdfClientWrapper';

const toolId = 'watermark-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Watermark PDF"
      description="Add a text watermark to every page of a PDF."
      category={cat}
      toolId={toolId}
    >
      <WatermarkPdfClientWrapper />

      <LearningHub title="Understanding PDF Z-Indexing">
        
        <LearningSection type="architecture" title="No Explicit Z-Index">
          <p>Unlike HTML and CSS, which use explicit <code>z-index</code> properties to determine what renders on top of what, a PDF engine renders objects purely based on the chronological order they appear in the page's Content Stream.</p>
          <p className="mt-2">The first object in the stream is drawn on the very bottom layer. The last object in the stream is drawn on the very top layer, overlapping everything underneath it.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Appending vs Prepending">
          <p>When you add a watermark, this tool injects new rendering instructions (like <code>Tj</code> for text and <code>rg</code> for color) into the PDF's content stream.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Foreground Watermarks:</strong> We append the instructions to the very end of the stream. This guarantees the watermark renders over everything else.</li>
            <li><strong>Background Watermarks:</strong> We prepend the instructions to the very beginning of the stream. The watermark is drawn first, and the original document text is drawn over it.</li>
          </ul>
        </LearningSection>

        <LearningSection type="security" title="Limitations of Watermarks">
          <p>Many users think a watermark provides cryptographic security. <strong>It does not.</strong></p>
          <p className="mt-2">Because a PDF is a collection of distinct vector objects, a watermark is simply an additional text object floating above your document. Anyone with a dedicated PDF editor (like Adobe Acrobat Pro) can simply click the watermark text and press delete.</p>
          <p className="mt-2">To truly prevent unauthorized modification, you must apply an owner password that explicitly disables the "Modify Contents" permission flag (which you can do with our Lock PDF tool).</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How does a PDF determine which object is drawn on top (foreground)?",
                options: [
                  "By using the z-index CSS property.",
                  "By checking the order of instructions in the Content Stream; the last instruction drawn is on top.",
                  "By looking at the object's transparency.",
                  "Foreground objects are always stored in a separate layer."
                ],
                correctIndex: 1,
                explanation: "PDF rendering is chronological. It simply paints the canvas instruction by instruction. Later instructions paint over earlier ones."
              },
              {
                question: "Does a watermark prevent a determined user from stealing or editing your PDF?",
                options: [
                  "Yes, it encrypts the document.",
                  "Yes, it permanently burns the text into the image data.",
                  "No, a watermark is just another text object that can be selected and deleted in a PDF Editor.",
                  "No, but it tracks their IP address."
                ],
                correctIndex: 2,
                explanation: "A watermark is a visual deterrent, not a security mechanism. To prevent editing, the document must be encrypted with permissions flags."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
