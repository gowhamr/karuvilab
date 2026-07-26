import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import PageSizeConverterClientWrapper from '@/src/features/page-size-converter/page-size-converterClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = "page-size-converter";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Page Size Converter"
      description="Change the page size of your PDF document to US Legal, US Letter, or A4."
      category={cat}
    >
      <PageSizeConverterClientWrapper />
      
      <LearningHub title="Understanding Mathematical Page Scaling">
        
        <LearningSection type="architecture" title="Not Just an Image Canvas">
          <p>Unlike JPEG or PNG images, a PDF document isn't a fixed grid of pixels. It is a mathematical canvas where every line of text, shape, and image is drawn using geometric coordinates.</p>
          <p className="mt-2">When you change the page size of a PDF, you aren't simply "stretching" an image—you are applying an <strong>Affine Transformation Matrix</strong> to the entire coordinate system.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="The Transformation Matrix">
          <p>To resize the content to fit a new page size (like converting A4 to US Legal), this tool first calculates a scaling factor based on the aspect ratio.</p>
          <p className="mt-2">It then mathematically multiplies the coordinate of every single object in the page's Content Stream by this scaling factor using a 3x3 transformation matrix (<code>[ sx 0 0 sy tx ty ]</code>).</p>
        </LearningSection>

        <LearningSection type="api" title="MediaBox vs CropBox">
          <p>A PDF dictates its physical paper size using an array called the <strong>MediaBox</strong> (e.g., <code>[0, 0, 612, 1008]</code> for US Legal format).</p>
          <p className="mt-2">If a document was previously cropped, it might also have a <strong>CropBox</strong> dictating the visible area. This tool resets the MediaBox to your chosen target dimensions and adjusts the internal object coordinates mathematically so everything fits perfectly inside it.</p>
        </LearningSection>

        <LearningSection type="performance" title="Edge Cases: Letterboxing">
          <p>Mathematical scaling is powerful, but aspect ratios are strict limits.</p>
          <p className="mt-2">If you attempt to convert a wide, panoramic landscape document into a tall portrait US Legal size, the tool will scale it until the width fits perfectly. This will inevitably leave empty white space at the top and bottom of the page (a phenomenon known as letterboxing).</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "When you resize a PDF page from A4 to US Letter, what happens to the vector graphics?",
                options: [
                  "They become pixelated because they are stretched.",
                  "Their coordinates are mathematically multiplied by a transformation matrix, so they scale flawlessly without losing quality.",
                  "They are converted to JPEGs.",
                  "They remain the exact same size, and the page is just cropped."
                ],
                correctIndex: 1,
                explanation: "PDFs are vector-first. Affine transformations scale the mathematical coordinates of the paths, ensuring infinite scalability."
              },
              {
                question: "Which PDF property defines the physical size of the paper to be printed?",
                options: [
                  "ArtBox",
                  "PageSize",
                  "MediaBox",
                  "PrintBox"
                ],
                correctIndex: 2,
                explanation: "The MediaBox array specifies the width and height of the page in points (where 72 points = 1 inch)."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
