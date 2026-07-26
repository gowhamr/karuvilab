import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ImageMirrorClientWrapper from './ImageMirrorClientWrapper';

const toolId = 'image-mirror';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Mirror"
      description="Mirror images with a horizontal reflection"
      category={cat}
      toolId={toolId}
    >
      <ImageMirrorClientWrapper />

      <LearningHub title="Understanding Symmetrical Canvas Rendering">
        
        <LearningSection type="architecture" title="Flipping vs Mirroring">
          <p>While "Flipping" an image just reverses its direction, "Mirroring" involves keeping the original image intact and attaching a newly reversed copy directly next to it to create symmetry.</p>
          <p className="mt-2">This means the resulting output image has to be exactly <strong>twice as large</strong> along the chosen mirrored axis.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Double Canvas Rendering">
          <p>If you upload a 1000px wide image and select "Mirror Right", the tool must first create a new HTML5 Canvas that is exactly 2000px wide to hold the result.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>First, it uses <code>drawImage()</code> to paint your original image on the left side (spanning from pixel 0 to 1000).</li>
            <li>Then, it applies a <code>scale(-1, 1)</code> geometric transformation to the canvas context, which tells it to draw everything backwards.</li>
            <li>Finally, it uses <code>drawImage()</code> again to paint the image on the right side (spanning from pixel 1000 to 2000).</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Memory Considerations">
          <p>Because Mirroring mathematically doubles the surface area (and pixel count) of an image, it requires significantly more RAM to execute than a standard crop or flip.</p>
          <p className="mt-2">If you mirror a 4K photo, the resulting canvas becomes 8K wide. This is executed using Web Workers to ensure the heavy memory allocation doesn't freeze your browser.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you upload a 800x600 photo and choose 'Mirror Bottom', what are the dimensions of the final exported image?",
                options: [
                  "800x600",
                  "1600x600",
                  "800x1200",
                  "1600x1200"
                ],
                correctIndex: 2,
                explanation: "Mirroring bottom attaches a duplicated, upside-down copy below the original, doubling the height (600 + 600) while keeping the width the same."
              },
              {
                question: "How does the canvas draw the second (mirrored) half of the image?",
                options: [
                  "By applying a negative scale() transformation before drawing the image a second time.",
                  "By asking a server to reverse the pixels.",
                  "By using a CSS filter.",
                  "By copying and pasting the pixels manually."
                ],
                correctIndex: 0,
                explanation: "The browser's Canvas API handles mirroring by mathematically scaling the rendering matrix into negative space before issuing the draw command."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
