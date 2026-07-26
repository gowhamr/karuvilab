import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import ImageResizerClientWrapper from './ImageResizerClientWrapper';

const toolId = 'image-resizer';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Resizer"
      description="Resize images to exact dimensions with aspect ratio lock."
      category={cat}
      toolId={toolId}
    >
      <ImageResizerClientWrapper />

      <LearningHub title="Understanding Image Interpolation">
        
        <LearningSection type="architecture" title="Inventing New Pixels">
          <p>When you take a 100x100 pixel image and resize it to 200x200, the surface area quadruples. The computer physically has to invent 30,000 brand new pixels that didn't exist in the original file.</p>
          <p className="mt-2">It does this using complex mathematical algorithms collectively known as <strong>Interpolation</strong>.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Bicubic Interpolation">
          <p>By default, modern browsers use high-quality algorithms like <em>Bicubic</em> or <em>Lanczos</em> interpolation when resizing photos.</p>
          <p className="mt-2">To guess what color a newly invented pixel should be, the algorithm looks at the 16 surrounding pixels (a 4x4 grid) from the original image and calculates a weighted mathematical average. This is why photos resized upwards often look smooth but can appear slightly blurry or "soft".</p>
        </LearningSection>

        <LearningSection type="performance" title="Nearest Neighbor for Pixel Art">
          <p>For pixel art, diagrams, or barcodes, that smoothing algorithm completely ruins the image by adding fuzzy gray pixels to sharp black edges.</p>
          <p className="mt-2">In those cases, developers instruct the canvas to use <em>Nearest Neighbor</em> interpolation (<code>imageSmoothingEnabled = false</code>), which skips the averaging math entirely. It simply duplicates the exact color of the closest original pixel, keeping edges perfectly sharp blocky.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you enlarge an image, where do the new pixels come from?",
                options: [
                  "They are downloaded from the internet.",
                  "They are mathematically guessed by the computer using interpolation algorithms.",
                  "They are hidden inside the JPEG file.",
                  "The pixels just stretch like rubber, no new pixels are created."
                ],
                correctIndex: 1,
                explanation: "The computer must calculate and invent the new pixels by averaging the colors of the surrounding original pixels."
              },
              {
                question: "Which interpolation method should you use if you want to enlarge tiny 8-bit Pixel Art without it becoming blurry?",
                options: [
                  "Bicubic Interpolation",
                  "Lanczos Resampling",
                  "Nearest Neighbor",
                  "Gaussian Blur"
                ],
                correctIndex: 2,
                explanation: "Nearest neighbor doesn't blend or smooth colors; it just copies the exact color of the nearest pixel, keeping the sharp blocky look of pixel art intact."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
