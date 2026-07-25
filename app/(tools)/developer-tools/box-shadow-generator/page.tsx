import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import BoxShadowGeneratorWrapper from './BoxShadowGeneratorWrapper';

const toolId = 'box-shadow-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Box Shadow Generator"
      description="Visual box shadow generator."
      category={cat}
      toolId={toolId}
    >
      <BoxShadowGeneratorWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-shadows"
          title="How it Works: Hardware Accelerated Blurring"
          preview="Learn why CSS shadows are expensive to render and how to optimize them."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A CSS <code>box-shadow</code> might seem like a simple visual effect, but underneath it requires the browser to execute a Gaussian blur algorithm.
            </p>
            <h3>The Gaussian Math</h3>
            <p>
              When you specify a blur radius of 10px, the browser cannot just draw a solid color. It has to take the shadow color, look at every single pixel in a 10px radius, and calculate a weighted average based on a bell curve (the Gaussian function). The further a pixel is from the center, the less weight it gets.
            </p>
            <p>
              Doing this in real-time on a 4K monitor requires millions of calculations per frame. This is why animating <code>box-shadow</code> on hover can cause lag on mobile devices.
            </p>
            <h3>Optimization Tip</h3>
            <p>
              Instead of animating the <code>box-shadow</code> property directly, modern frontend engineers apply the shadow to a pseudo-element (like <code>::after</code>) and animate its <code>opacity</code> using the GPU. Fading a pre-blurred box is infinitely faster than asking the CPU to recalculate the Gaussian math on every single frame of an animation!
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
