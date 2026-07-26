import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import CanvasResizeClientWrapper from './CanvasResizeClientWrapper';

const toolId = 'canvas-resize';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Canvas Resize"
      description="Resize the canvas workspace around your image without scaling"
      category={cat}
      toolId={toolId}
    >
      <CanvasResizeClientWrapper />

      <LearningHub title="Understanding Image Resizing vs Canvas Resizing">
        
        <LearningSection type="architecture" title="Scaling Pixels vs Expanding Bounds">
          <p>When you use an "Image Resizer", the computer actually stretches or shrinks the image pixels using interpolation algorithms (like bicubic filtering). This permanently alters the visual content.</p>
          <p className="mt-2">When you use a "Canvas Resizer", the pixels of your original image are entirely untouched. Only the bounding box (the workspace holding the image) changes size.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Global Composite Operations">
          <p>To expand a canvas securely in the browser, this tool creates a completely new, blank HTML5 <code>Canvas</code> element at your newly requested dimensions in memory. It then fills it with your chosen background color.</p>
          <p className="mt-2">Next, it uses a <code>drawImage()</code> API call to paint your original image on top of this new background. To position it correctly based on your Anchor selection (e.g., "Anchor Bottom Right"), it calculates an X/Y translation matrix representing the mathematical difference between the new canvas size and the old image size.</p>
        </LearningSection>

        <LearningSection type="algorithm" title="The Cropping Equivalent">
          <p>If the new canvas dimensions you request are mathematically <em>smaller</em> than your original image, the outer edges of your image are simply discarded during the <code>drawImage()</code> phase.</p>
          <p className="mt-2">This is mathematically identical to a standard Crop operation. However, instead of letting you manually drag a crop box across the screen, it acts as a programmatic crop that forces the image to perfectly align to a specific corner or the exact center.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you have a 500x500 image, and you set the Canvas Resize to 1000x1000 with a 'Center' anchor, what happens?",
                options: [
                  "The image is stretched to 1000x1000, losing sharpness.",
                  "The image stays exactly 500x500 pixels sharp, floating perfectly in the center of a new 1000x1000 workspace.",
                  "The image is duplicated 4 times to fill the space.",
                  "The browser throws an error."
                ],
                correctIndex: 1,
                explanation: "Canvas resizing only alters the bounding container, never the original image pixels. The original 500x500 image is painted into the center of the new bounds."
              },
              {
                question: "What is the primary technical difference between a manual Crop tool and a Canvas Resize (when making it smaller)?",
                options: [
                  "Crop tools compress the image, Canvas Resize does not.",
                  "They are mathematically identical operations, but Canvas Resize uses strict geometric anchoring (e.g. 'Top Left') rather than arbitrary manual coordinates.",
                  "Canvas Resize uses AI to find the subject.",
                  "Crop tools only work on JPEGs."
                ],
                correctIndex: 1,
                explanation: "Both operations discard pixels outside a specific bounding box. Canvas resize just relies on mathematical anchoring rather than freehand drawing."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
