import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import AdvancedRotateClientWrapper from './AdvancedRotateClientWrapper';

const toolId = 'advanced-rotate';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Advanced Rotate"
      description="Rotate images to any angle with precise degree control"
      category={cat}
      toolId={toolId}
    >
      <AdvancedRotateClientWrapper />

      <LearningHub title="Understanding Bounding Boxes and Trigonometry">
        
        <LearningSection type="architecture" title="Why 45 Degrees Makes the Image Bigger">
          <p>When you rotate a 1000x1000 pixel image by 45 degrees, the resulting image is no longer 1000x1000. Because the corners of the square stick out diagonally, the overall physical bounding box expands.</p>
          <p className="mt-2">If the canvas didn't expand, the corners of your rotated image would be permanently cut off (clipped) by the original bounds.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Calculating the New Canvas">
          <p>To ensure no corners are clipped, the browser calculates the new bounding box using sine and cosine trigonometry.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><code>New Width = (Width * |cos(θ)|) + (Height * |sin(θ)|)</code></li>
            <li><code>New Height = (Width * |sin(θ)|) + (Height * |cos(θ)|)</code></li>
          </ul>
          <p className="mt-2">At 45 degrees, a 1000x1000 image actually requires a 1414x1414 pixel canvas to hold it! Our tool dynamically recalculates this math on the fly, resizes the underlying HTML5 Canvas, and translates the drawing origin to the center before rendering the image.</p>
        </LearningSection>

        <LearningSection type="api" title="Sub-pixel Interpolation">
          <p>Unlike a 90-degree rotation where pixels are just transposed, rotating an image by an arbitrary angle (like 12.5 degrees) means the original square pixels no longer map 1:1 to the monitor's square pixels.</p>
          <p className="mt-2">The browser's graphics engine uses anti-aliasing interpolation (like bilinear or bicubic filtering) to blend the colors of neighboring pixels. This prevents the image from looking jagged (stair-stepped) along sharp edges, though it can introduce very minor softening.</p>
        </LearningSection>

        <LearningSection type="security" title="Client-Side Processing">
          <p>Advanced image manipulation normally requires uploading your photo to a cloud server running ImageMagick or Photoshop. This tool performs the complex trigonometry and interpolation entirely offline using your device's GPU and HTML5 Canvas API, ensuring total privacy.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you rotate a 100x100 square image by 45 degrees without clipping, what happens to the dimensions of the final exported image file?",
                options: [
                  "It stays exactly 100x100.",
                  "It becomes 141x141 to accommodate the corners.",
                  "It becomes smaller (70x70) because the corners are cropped.",
                  "The file size doubles but the dimensions remain the same."
                ],
                correctIndex: 1,
                explanation: "The bounding box expands to fit the diagonal width of the square (which is roughly 141 pixels for a 100x100 square) so no pixels are lost."
              },
              {
                question: "Why might an image look very slightly softer after being rotated by 15 degrees?",
                options: [
                  "Because the browser applies a blur filter to hide the background.",
                  "Because sub-pixel interpolation is required to map the rotated pixels onto the straight grid of your screen.",
                  "Because it compresses the file to JPEG.",
                  "Because the image loses color depth."
                ],
                correctIndex: 1,
                explanation: "Rotating off-axis forces the rendering engine to average adjacent pixels to prevent jagged edges, resulting in a microscopic softening effect."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
