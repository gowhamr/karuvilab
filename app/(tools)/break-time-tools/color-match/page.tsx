import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-color-space"
          title="How it Works: RGB Color Space & Math"
          preview="Learn how algorithms generate colors that are 'slightly different' using math."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When this game asks you to find the "different" square, it doesn't just pick two random colors. It mathematically calculates a color that is exactly a certain "distance" away from the base color in the RGB (Red, Green, Blue) color space.
            </p>
            <h3>Color Math</h3>
            <p>
              In digital screens, a color is represented as an array of three numbers from 0 to 255. For example, pure red is <code>[255, 0, 0]</code>.
            </p>
            <p>
              To create the "odd one out", the game applies a <strong>Delta (Δ)</strong> to these values. At Level 1, the delta might be 30. So if the base color is <code>[100, 100, 100]</code>, the odd color might be generated as <code>[130, 130, 130]</code>.
            </p>
            <h3>Increasing Difficulty</h3>
            <p>
              As your score increases, the delta shrinks. By Level 20, the difference between the base color and the odd color might only be 3 points on the RGB scale. Because human eyes are more sensitive to certain wavelengths (like green) than others (like blue), a delta of 5 in the blue channel might be nearly imperceptible, while a delta of 5 in the green channel is obvious.
            </p>
            <p>
              Professional designers often use more complex color spaces like <strong>HSL</strong> (Hue, Saturation, Lightness) or <strong>CIELAB</strong> (which models human perception) to generate visually uniform color palettes, rather than relying on raw RGB math.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
