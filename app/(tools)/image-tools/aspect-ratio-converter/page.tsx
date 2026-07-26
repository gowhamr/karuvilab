import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import AspectRatioConverterClientWrapper from './AspectRatioConverterClientWrapper';

const toolId = 'aspect-ratio-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Aspect Ratio Converter"
      description="Convert images to standard aspect ratios like 1:1, 16:9, 4:3"
      category={cat}
      toolId={toolId}
    >
      <AspectRatioConverterClientWrapper />

      <LearningHub title="Understanding Object-Fit Mathematics">
        
        <LearningSection type="architecture" title="The Ratio Dilemma">
          <p>When forcing an image into a new aspect ratio (e.g., forcing a vertical 9:16 phone photo into a horizontal 16:9 TV frame), you have two mathematical choices: lose content or gain empty space. This is governed by the principles of CSS <code>object-fit</code>.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Cover (Crop to Fill)">
          <p>To "cover" the new ratio without squishing or stretching the image, the algorithm calculates two scale factors: <code>WidthScale</code> and <code>HeightScale</code>, and takes the <strong>maximum</strong> of the two.</p>
          <p className="mt-2">This ensures the new canvas is completely filled edge-to-edge. However, the overflow—the parts of the image that stick out of the new bounding box—is permanently clipped off.</p>
        </LearningSection>

        <LearningSection type="api" title="Contain (Pad to Fit)">
          <p>Conversely, to "contain" the image, the algorithm takes the <strong>minimum</strong> of the two scale factors.</p>
          <p className="mt-2">This ensures the entire original image fits inside the new bounds without any clipping. However, because the ratios don't match, this creates "letterboxing" or "pillarboxing"—empty padding on the sides or top/bottom that must be filled with a solid color, blur, or transparency.</p>
        </LearningSection>

        <LearningSection type="performance" title="Preserving Original Resolution">
          <p>Unlike basic CSS resizing, this tool performs the crop or pad operation directly on the raw image pixel data using the HTML5 Canvas API. This allows it to output a new, fully self-contained file at the highest possible resolution, processing everything offline in milliseconds.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What happens when you force a vertical photo (9:16) into a square (1:1) aspect ratio using the 'Cover / Fill' method?",
                options: [
                  "The photo is squished vertically to look short and fat.",
                  "The top and bottom of the photo are cut off so the middle fits perfectly into the square.",
                  "Black bars are added to the left and right of the photo.",
                  "The photo rotates sideways."
                ],
                correctIndex: 1,
                explanation: "'Cover' fills the target shape entirely by zooming in, meaning the longest edges of the original image will overflow and be clipped."
              },
              {
                question: "Which CSS property is the mathematical equivalent to the 'Pad to Fit' method?",
                options: [
                  "object-fit: cover",
                  "object-fit: fill",
                  "object-fit: contain",
                  "object-fit: scale-down"
                ],
                correctIndex: 2,
                explanation: "'contain' guarantees the whole image is visible, creating empty padding if the aspect ratios do not match perfectly."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
