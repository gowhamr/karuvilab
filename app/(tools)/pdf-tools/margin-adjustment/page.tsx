import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import MarginAdjustmentClientWrapper from '@/src/features/margin-adjustment/margin-adjustmentClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'margin-adjustment';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Margin Adjustment"
      description="Add or remove margins from your PDF pages."
      category={cat}
    >
      <MarginAdjustmentClientWrapper />

      <LearningHub title="Understanding PDF Page Boundaries">
        
        <LearningSection type="architecture" title="The 5 Page Boxes">
          <p>Unlike a physical sheet of paper, a PDF page is defined mathematically by five distinct boundary boxes.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>MediaBox:</strong> The physical medium (e.g., A4 paper size).</li>
            <li><strong>CropBox:</strong> The visible region displayed or printed.</li>
            <li><strong>BleedBox:</strong> Defines the region to which the contents of the page should be clipped when output in a production environment.</li>
            <li><strong>TrimBox:</strong> The intended dimensions of the finished page after trimming.</li>
            <li><strong>ArtBox:</strong> The extent of the page's meaningful content.</li>
          </ul>
        </LearningSection>
        
        <LearningSection type="api" title="Modifying Margins">
          <p>When you add margins to a PDF using this tool, we aren't just drawing white rectangles on the edges. Instead, we are mathematically expanding the <strong>MediaBox</strong> and <strong>CropBox</strong> coordinates.</p>
          <p className="mt-2">If you want the content to stay the same size but have more whitespace around it, we translate (shift) the existing content stream and expand the bounding box dimensions.</p>
        </LearningSection>

        <LearningSection type="algorithm" title="Affine Transformations">
          <p>If you want to scale the content down to fit within new, larger margins without changing the overall page size, we apply an <strong>Affine Transformation Matrix</strong>.</p>
          <p className="mt-2">This matrix multiplies the coordinates of every path, image, and text block in the page's content stream, uniformly scaling them down and re-centering them on the canvas.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Which PDF boundary box determines the physical page size (e.g., US Letter)?",
                options: [
                  "TrimBox",
                  "MediaBox",
                  "CropBox",
                  "ArtBox"
                ],
                correctIndex: 1,
                explanation: "The MediaBox defines the boundaries of the physical medium on which the page is to be printed."
              },
              {
                question: "How does the tool shrink page content to create larger margins without changing the paper size?",
                options: [
                  "It rasterizes the page into an image and shrinks the image.",
                  "It applies an Affine Transformation Matrix to scale down the vector coordinate system.",
                  "It deletes content near the edges.",
                  "It changes the font sizes manually."
                ],
                correctIndex: 1,
                explanation: "An affine transformation allows the PDF engine to mathematically scale, rotate, and translate the entire coordinate system of the page at once without losing vector quality."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
