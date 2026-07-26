import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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

      <LearningHub title="Understanding Box Shadows and Performance">
        
        <LearningSection type="architecture" title="Hardware Accelerated Blurring">
          <p>A CSS <code>box-shadow</code> might seem like a simple visual effect, but underneath it requires the browser to execute a Gaussian blur algorithm.</p>
          <p className="mt-2">When you specify a blur radius of 10px, the browser cannot just draw a solid color. It has to take the shadow color, look at every single pixel in a 10px radius, and calculate a weighted average based on a bell curve (the Gaussian function). The further a pixel is from the center, the less weight it gets.</p>
        </LearningSection>
        
        <LearningSection type="performance" title="Performance Bottlenecks">
          <p>Doing this in real-time on a 4K monitor requires millions of calculations per frame. This is why animating the <code>box-shadow</code> property directly on hover can cause severe lag, jitter, and dropped frames, especially on mobile devices.</p>
          <p className="mt-2">Instead of animating the <code>box-shadow</code> directly, modern frontend engineers apply the shadow to a pseudo-element (like <code>::after</code>) and animate its <code>opacity</code> using the GPU. Fading a pre-blurred box is infinitely faster than asking the CPU to recalculate the Gaussian math on every single frame!</p>
        </LearningSection>

        <LearningSection type="standards" title="Multiple Shadows">
          <p>The CSS <code>box-shadow</code> property accepts a comma-separated list of shadows. This is a common technique used to create ultra-smooth, realistic shadows (often called "Layered Shadows" or "Smooth Shadows").</p>
          <p className="mt-2">By combining 5 or 6 subtle shadows with varying opacities and offsets, you can simulate realistic ambient light diffusion.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is animating a CSS box-shadow's blur radius directly considered bad for performance?",
                options: [
                  "Because it forces the browser to recalculate a Gaussian blur over thousands of pixels on every single frame, taxing the CPU/GPU.",
                  "Because CSS shadows cannot be rendered on mobile devices.",
                  "Because it causes a network request to load the blur filter.",
                  "Because the blur radius is limited to 5px in WebKit browsers."
                ],
                correctIndex: 0,
                explanation: "Gaussian blurs are mathematically heavy. Re-rendering the blur 60 times a second will cause layout thrashing and dropped frames."
              },
              {
                question: "What is the recommended best practice for smoothly animating a box-shadow on hover?",
                options: [
                  "Use JavaScript requestAnimationFrame instead of CSS transitions.",
                  "Animate the box-shadow property using a linear easing curve.",
                  "Render the shadow on a pseudo-element (::after) and animate its opacity.",
                  "Use a static image of a shadow instead of CSS."
                ],
                correctIndex: 2,
                explanation: "Animating opacity is hardware-accelerated and virtually free. Fading in a pre-rendered ::after element creates the illusion of the shadow growing without triggering heavy repaints."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
