import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-backdrop"
          title="How it Works: The Backdrop Filter"
          preview="Learn the expensive CSS property that makes frosted glass possible."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              The defining characteristic of "Glassmorphism" is the frosted-glass effect, where whatever is <em>behind</em> the element appears blurred.
            </p>
            <h3>Filter vs Backdrop-Filter</h3>
            <p>
              In CSS, the standard <code>filter: blur(10px)</code> property blurs the element itself (and its children). To achieve glassmorphism, we must use <code>backdrop-filter: blur(10px)</code>. This instructs the browser rendering engine to take a screenshot of everything structurally beneath the element, apply a Gaussian blur to that screenshot, and then use it as the background for the current element.
            </p>
            <p>
              Because this requires the browser to constantly recalculate the blur whenever an element behind the glass moves, it is notoriously expensive for the GPU. Overusing <code>backdrop-filter</code> on large areas (or animating it) can cause severe frame drops on lower-end devices.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
