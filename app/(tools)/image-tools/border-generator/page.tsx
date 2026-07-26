import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import BorderGeneratorClientWrapper from './BorderGeneratorClientWrapper';

const toolId = 'border-generator';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Border Generator"
      description="Add decorative borders to your images with custom styles"
      category={cat}
      toolId={toolId}
    >
      <BorderGeneratorClientWrapper />

      <LearningHub title="Understanding Canvas Borders">
        
        <LearningSection type="architecture" title="Inset vs Outset Rendering">
          <p>When applying a border, graphic software must make a fundamental decision: do we draw the border over the inner edges of the image (Inset), or do we expand the image outward to make room for it (Outset)?</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Outset Canvas Math">
          <p>This tool uses an <strong>Outset</strong> mathematical model. If you have a 1000x1000 pixel image and request a 50px border, the tool physically expands the underlying HTML5 Canvas bounding box to 1100x1100 pixels.</p>
          <p className="mt-2">It draws the solid border color across the entire new canvas, and then paints your original image exactly in the center of that larger rectangle.</p>
        </LearningSection>

        <LearningSection type="api" title="Avoiding Covered Pixels">
          <p>By expanding the canvas—rather than using the Canvas API's native <code>strokeRect</code> function to draw lines over the top of the image—we ensure that absolutely zero pixels of your original photograph are covered up by the border. The original content remains 100% visible.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you add a 10px border to a 500x500 image using the Outset method, what are the final dimensions of the exported file?",
                options: [
                  "500x500",
                  "510x510",
                  "520x520",
                  "480x480"
                ],
                correctIndex: 2,
                explanation: "The border is added to both the left and right sides (+20px) and the top and bottom sides (+20px), resulting in a 520x520 image."
              },
              {
                question: "Why might a designer prefer the Outset border method over the Inset method for a photograph?",
                options: [
                  "Because Outset compresses the image.",
                  "Because Outset prevents the border from covering up important details at the edges of the photo.",
                  "Because Outset reduces the file size.",
                  "Because Inset borders are impossible to draw."
                ],
                correctIndex: 1,
                explanation: "Inset borders draw inside the original bounding box, effectively erasing the outer pixels of the photograph. Outset preserves all original image data."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
