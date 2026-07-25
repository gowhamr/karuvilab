import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import ContrastCheckerWrapper from './ContrastCheckerWrapper';

const toolId = 'contrast-checker';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Contrast Checker"
      description="WCAG contrast ratio checker."
      category={cat}
      toolId={toolId}
    >
      <ContrastCheckerWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-wcag"
          title="How it Works: Relative Luminance"
          preview="Learn the math behind how accessibility contrast is calculated."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              The WCAG (Web Content Accessibility Guidelines) define specific contrast ratios to ensure text is readable for users with visual impairments. But how do you mathematically calculate the "contrast" between two HEX colors?
            </p>
            <h3>Relative Luminance</h3>
            <p>
              Human eyes do not perceive all colors equally. We are highly sensitive to Green light, moderately sensitive to Red, and poorly sensitive to Blue. 
            </p>
            <p>
              To calculate contrast, the algorithm first calculates the <strong>Relative Luminance (L)</strong> of both colors using this weighted formula:
            </p>
            <pre><code>L = 0.2126 * Red + 0.7152 * Green + 0.0722 * Blue</code></pre>
            <p>
              Notice how Green represents 71% of the luminance, while Blue is only 7%! Once the Luminance of the lighter color (L1) and darker color (L2) are found, the final contrast ratio is calculated as: <code>(L1 + 0.05) / (L2 + 0.05)</code>.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
