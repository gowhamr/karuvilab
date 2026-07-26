import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import BgRemoverClientWrapper from './BgRemoverClientWrapper';

const toolId = 'bg-remover';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Background Remover"
      description="Remove solid or near-solid backgrounds from images using color threshold matching."
      category={cat}
      toolId={toolId}
    >
      <BgRemoverClientWrapper />

      <LearningHub title="Understanding Color Math and Background Removal">
        
        <LearningSection type="algorithm" title="The Flood-Fill Algorithm">
          <p>Unlike massive cloud-based AI neural networks, this tool uses a classic computer vision algorithm called <strong>Flood-Fill</strong> (often known as the "Magic Wand" tool in graphic design software).</p>
          <p className="mt-2">When you click on a background color to remove, the algorithm looks at the RGB values of that specific pixel. It then searches all neighboring pixels. If the neighbor's color matches the selected color within a certain threshold, the algorithm turns that pixel transparent.</p>
        </LearningSection>
        
        <LearningSection type="architecture" title="Calculating Color Distance">
          <p>How does the computer know if a color is "similar enough"? It treats Red, Green, and Blue as X, Y, and Z coordinates in a 3D space.</p>
          <p className="mt-2">The <em>Tolerance</em> setting dictates the acceptable 3D Euclidean distance between the target color and the neighboring color. A low tolerance means the colors must be nearly identical. A high tolerance casts a wider net, removing shadows and gradients.</p>
        </LearningSection>

        <LearningSection type="performance" title="Why it is so Fast">
          <p>This method works instantly and entirely inside your browser. Because it executes simple mathematical distance checks on an HTML5 Canvas array, it completely avoids downloading 100MB+ AI models or uploading your private photos to a cloud server.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How does the Flood-Fill algorithm decide which pixels to remove?",
                options: [
                  "It sends the image to an AI server to detect the foreground object.",
                  "It looks for a specific file format tag.",
                  "It measures the 3D distance between pixel colors and removes connected pixels that fall within the tolerance.",
                  "It deletes all pixels that are perfectly white."
                ],
                correctIndex: 2,
                explanation: "The magic wand effect calculates 3D Euclidean distance between RGB values to group 'similar' colors together dynamically."
              },
              {
                question: "Why might a high 'Tolerance' setting accidentally delete parts of the foreground object?",
                options: [
                  "Because it runs out of memory.",
                  "Because the color of the foreground is mathematically 'close' to the background color in 3D RGB space.",
                  "Because AI models often make mistakes.",
                  "Because it forces the browser to compress the image."
                ],
                correctIndex: 1,
                explanation: "A wide tolerance increases the acceptable mathematical distance, causing the algorithm to sweep up colors that were meant to be preserved."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
