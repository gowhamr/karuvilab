import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import PercentageCalculatorClientWrapper from './PercentageCalculatorClientWrapper';

const toolId = 'percentage-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Percentage Calculator"
      description="Three modes: find a percentage, find what percent X is of Y, and calculate percentage change."
      category={cat}
      toolId={toolId}
    >
      <PercentageCalculatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-percentages"
          title="How it Works: The Reversibility Trick"
          preview="Learn the mathematical shortcut that makes calculating complex percentages in your head surprisingly easy."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Percentages are just fractions out of 100. The word literally translates to "per cent" (for every hundred).
            </p>
            <h3>The Reversibility Rule</h3>
            <p>
              There is a fundamental algebraic property of multiplication: <code>A × B = B × A</code>.
            </p>
            <p>
              Because percentages are just multiplication, this means that <strong>x% of y is always exactly equal to y% of x</strong>.
            </p>
            <p>
              Imagine someone asks you to calculate <strong>4% of 75</strong> in your head. For most people, that is very difficult math.
            </p>
            <p>
              But if you use the reversibility trick, you just flip the numbers: What is <strong>75% of 4</strong>?
            </p>
            <p>
              Suddenly, the math is trivial. 75% is just three-quarters. Three-quarters of 4 is <strong>3</strong>. Therefore, 4% of 75 is also 3.
            </p>
            <h3>Percentage Change</h3>
            <p>
              When calculating Percentage Change, always remember that the formula divides the difference by the <em>original</em> number, not the new number. A stock dropping from ₹100 to ₹50 is a 50% loss. But for that same stock to go from ₹50 back to ₹100, it requires a 100% gain!
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
