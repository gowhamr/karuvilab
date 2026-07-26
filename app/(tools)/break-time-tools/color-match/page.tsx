import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import ColorMatchClientWrapper from './ColorMatchClientWrapper';

const toolId = 'color-match';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Color Match"
      description="Pick the exact matching color swatch from similar options under time pressure. Test and train your visual acuity and color sensitivity."
      category={cat}
      toolId={toolId}
    >
      <ColorMatchClientWrapper />

      <LearningHub title="Understanding Color Space Math">
        
        <LearningSection type="architecture" title="RGB Color Math">
          <p>When this game asks you to find the "different" square, it doesn't just pick two random colors out of a hat. It mathematically calculates a color that is exactly a certain "distance" away from the base color in the RGB color space.</p>
          <p className="mt-2">In digital screens, a color is represented as an array of three numbers from 0 to 255. For example, pure red is <code>[255, 0, 0]</code>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Applying a Delta">
          <p>To create the "odd one out", the game applies a <strong>Delta (Δ)</strong> to these values.</p>
          <p className="mt-2">At Level 1, the delta might be 30. So if the base color is <code>[100, 100, 100]</code> (gray), the odd color might be generated as <code>[130, 130, 130]</code> (a lighter gray). As your score increases, the delta shrinks.</p>
        </LearningSection>

        <LearningSection type="performance" title="Human Perception Flaws">
          <p>By Level 20, the difference between the base color and the odd color might only be 3 points on the RGB scale. However, this reveals a massive flaw in the RGB color space: it is not perceptually uniform.</p>
          <p className="mt-2">Because human eyes are highly sensitive to green light but poor at distinguishing blues, a delta of 5 in the green channel is obvious to the human eye, while a delta of 5 in the blue channel is nearly imperceptible.</p>
          <p className="mt-2">This is why professional designers use advanced color spaces like <strong>CIELAB</strong> or <strong>OKLCH</strong> to generate palettes, as they mathematically map to how humans actually perceive color rather than how screens emit light.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is the RGB color space considered 'perceptually non-uniform'?",
                options: [
                  "Because it uses hexadecimal values.",
                  "Because a mathematical difference of 10 points in green looks much more obvious to a human than a 10 point difference in blue.",
                  "Because RGB only supports 256 colors.",
                  "Because it can't render white."
                ],
                correctIndex: 1,
                explanation: "Human evolution made us highly sensitive to green/yellow light. RGB math doesn't account for this biological bias."
              },
              {
                question: "If a base color is [50, 50, 50] and the game applies a Delta of 15, which of these could be the odd color?",
                options: [
                  "[0, 0, 0]",
                  "[255, 255, 255]",
                  "[65, 65, 65]",
                  "[50, 50, 50]"
                ],
                correctIndex: 2,
                explanation: "Applying the delta of 15 to the base values results in 65 (50 + 15)."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
