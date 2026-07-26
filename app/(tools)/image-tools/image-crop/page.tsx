import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import ImageCropClientWrapper from './ImageCropClientWrapper';

const toolId = 'image-crop';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Crop"
      description="Crop images to exact dimensions or preset aspect ratios."
      category={cat}
      toolId={toolId}
    >
      <ImageCropClientWrapper />

      <LearningHub title="Understanding Image Cropping and Canvas APIs">
        
        <LearningSection type="architecture" title="Non-Destructive UI vs Destructive Export">
          <p>Cropping an image in the browser doesn't actually delete data from the original file you uploaded. The UI you see is just a visual overlay.</p>
          <p className="mt-2">When you click Download, the engine paints a specific rectangular section of your original image onto a brand new, smaller HTML5 Canvas in memory, and exports that new canvas.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The 9-Parameter Canvas API">
          <p>To execute the crop, the tool uses the complex 9-parameter version of the HTML5 Canvas <code>drawImage</code> API:</p>
          <pre className="text-xs sm:text-sm mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded"><code>ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)</code></pre>
          <p className="mt-2">When you drag the crop box on the screen, you are defining the <strong>Source Coordinates</strong> (<code>sx, sy, sWidth, sHeight</code>). This tells the browser exactly which rectangle of pixels to "cut out" of the original massive image array.</p>
        </LearningSection>

        <LearningSection type="algorithm" title="Destination Painting">
          <p>It then paints those selected source pixels onto the new canvas at the <strong>Destination Coordinates</strong> (which for a standard crop is always <code>dx=0, dy=0</code>, the top-left corner).</p>
          <p className="mt-2">The resulting canvas now only contains the cropped pixels, and is passed to the browser's encoder to generate a new JPG or PNG file.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What does the 'Source X' (sx) parameter in the drawImage API represent during a crop?",
                options: [
                  "The width of the final image.",
                  "The X-coordinate (horizontal position) on the ORIGINAL image where the crop box begins.",
                  "The rotation angle of the crop.",
                  "The file size of the image."
                ],
                correctIndex: 1,
                explanation: "sx and sy define the starting coordinates on the source image, telling the browser where to begin reading pixels to cut out."
              },
              {
                question: "Why are the Destination Coordinates (dx, dy) usually set to 0, 0 when cropping?",
                options: [
                  "Because we want the cropped pixels to be painted starting at the very top-left corner of the new, smaller canvas.",
                  "Because it tells the browser to delete the image.",
                  "Because 0, 0 means transparent.",
                  "Because negative numbers are not allowed."
                ],
                correctIndex: 0,
                explanation: "We are cutting a piece out of a large image (the source) and pasting it into a new, smaller canvas (the destination) so it fits perfectly starting from the top-left origin (0,0)."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
