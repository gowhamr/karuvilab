import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import GlassmorphismGeneratorWrapper from './GlassmorphismGeneratorWrapper';

const toolId = 'glassmorphism-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Glassmorphism Generator"
      description="Glassmorphism CSS generator."
      category={cat}
      toolId={toolId}
    >
      <GlassmorphismGeneratorWrapper />

      <LearningHub title="Understanding Glassmorphism and Backdrop Filters">
        
        <LearningSection type="architecture" title="Filter vs Backdrop-Filter">
          <p>The defining characteristic of "Glassmorphism" is the frosted-glass effect, where whatever is <em>behind</em> the element appears blurred and desaturated.</p>
          <p className="mt-2">In CSS, the standard <code>filter: blur(10px)</code> property blurs the element itself (and its text/children). To achieve glassmorphism, we must use <code>backdrop-filter: blur(10px)</code>. This instructs the browser to apply the blur only to the visual layers logically underneath the element.</p>
        </LearningSection>
        
        <LearningSection type="performance" title="The Rendering Cost">
          <p><code>backdrop-filter</code> is notoriously expensive for a computer's GPU.</p>
          <p className="mt-2">When rendering a frame, the browser must take a "screenshot" of everything structurally beneath the element, apply a mathematically heavy Gaussian blur algorithm to that screenshot, and then composite it back as the background for the current element. Because this requires the browser to constantly recalculate the blur whenever a background element moves or scrolls, overusing it on large areas can cause severe battery drain and dropped frames on mobile devices.</p>
        </LearningSection>

        <LearningSection type="failures" title="Stacking Contexts">
          <p>A common bug occurs when a <code>backdrop-filter</code> mysteriously stops working.</p>
          <p className="mt-2">This usually happens because a parent element created a new <strong>Stacking Context</strong> (e.g., by having <code>opacity: 0.99</code> or <code>transform: scale(1)</code>). The backdrop filter can only blur elements within its current stacking context; it cannot "see" elements further down the DOM tree if an impenetrable stacking layer isolates them.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the CSS difference between 'filter' and 'backdrop-filter'?",
                options: [
                  "'filter' only applies to images, 'backdrop-filter' applies to divs.",
                  "'filter' blurs the element itself and its children, while 'backdrop-filter' blurs the visual elements positioned behind the element.",
                  "'filter' is hardware accelerated, 'backdrop-filter' uses the CPU.",
                  "There is no difference, one is just an older standard."
                ],
                correctIndex: 1,
                explanation: "Backdrop-filter acts like a pane of frosted glass, blurring the background while keeping the element's own content (like text) sharp."
              },
              {
                question: "Why should you avoid animating large areas of 'backdrop-filter: blur()' on mobile devices?",
                options: [
                  "Because mobile browsers do not support CSS animations.",
                  "Because it forces the GPU to recalculate a heavy Gaussian blur on thousands of pixels every single frame (60 times a second).",
                  "Because it drains the user's data plan.",
                  "Because iOS completely disables backdrop filters."
                ],
                correctIndex: 1,
                explanation: "Gaussian blurs are mathematically intensive. Recalculating them on every frame of a scrolling animation will cause layout thrashing and severe lag."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
