import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import GradientGeneratorWrapper from './GradientGeneratorWrapper';

const toolId = 'gradient-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="CSS Gradient Generator"
      description="Visual CSS gradient builder."
      category={cat}
      toolId={toolId}
    >
      <GradientGeneratorWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-interpolation"
          title="How it Works: Color Interpolation"
          preview="Learn why gradients sometimes look muddy and how color spaces fix it."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you ask the browser to transition from Red (<code>#FF0000</code>) to Green (<code>#00FF00</code>), it doesn't just guess. It mathematically calculates the steps between those two points using <strong>Interpolation</strong>.
            </p>
            <h3>The Muddy Middle</h3>
            <p>
              Historically, browsers interpolated colors in the RGB color space. If you transition from Blue to Yellow in RGB, the halfway point is roughly <code>#808080</code> (Gray). This creates a very ugly, muddy "dead zone" in the middle of your beautiful gradient.
            </p>
            <h3>Modern Color Spaces</h3>
            <p>
              Modern CSS allows you to specify the color space for interpolation. If you interpolate in the <code>oklch</code> or <code>hsl</code> color space instead of <code>rgb</code>, the browser will transition across the color wheel rather than cutting straight through the muddy gray center. This results in incredibly vibrant, professional-looking gradients that were previously impossible on the web without images.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
