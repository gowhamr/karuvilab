import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding WCAG Contrast and Accessibility">
        
        <LearningSection type="architecture" title="Relative Luminance">
          <p>The WCAG (Web Content Accessibility Guidelines) define specific contrast ratios to ensure text is readable for users with visual impairments. But how do you mathematically calculate the "contrast" between two HEX colors?</p>
          <p className="mt-2">Human eyes do not perceive all colors equally. We are highly sensitive to Green light, moderately sensitive to Red, and poorly sensitive to Blue.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Math Formula">
          <p>To calculate contrast, the algorithm first calculates the <strong>Relative Luminance (L)</strong> of both colors using a heavily weighted formula:</p>
          <pre className="bg-kv-surface-2 p-2 rounded-md mt-2 text-sm overflow-x-auto"><code>L = 0.2126 * Red + 0.7152 * Green + 0.0722 * Blue</code></pre>
          <p className="mt-2">Notice how Green represents 71% of the luminance calculation, while Blue is only 7%! This perfectly models human eye cones. Once the Luminance of the lighter color (L1) and darker color (L2) are found, the final contrast ratio is: <code>(L1 + 0.05) / (L2 + 0.05)</code>.</p>
        </LearningSection>

        <LearningSection type="standards" title="WCAG Standards (AA vs AAA)">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>AA Level:</strong> Requires a contrast ratio of at least <strong>4.5:1</strong> for normal text and <strong>3.0:1</strong> for large text (18pt+ or 14pt+ bold).</li>
            <li><strong>AAA Level:</strong> The strictest standard, requiring a contrast ratio of at least <strong>7.0:1</strong> for normal text and <strong>4.5:1</strong> for large text.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Common UI Failures">
          <p>The most frequent accessibility failure on modern websites is low contrast on disabled buttons (light grey text on a lighter grey button) and placeholder text in input fields. While designers do this to indicate an inactive state, it often renders the element completely invisible to users with low vision.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "In the WCAG Relative Luminance formula, which color carries the most mathematical weight?",
                options: [
                  "Red",
                  "Green",
                  "Blue",
                  "Yellow"
                ],
                correctIndex: 1,
                explanation: "Green carries 71.52% of the weight because human eyes are most sensitive to green wavelengths."
              },
              {
                question: "What is the minimum WCAG AA contrast ratio required for standard body text?",
                options: [
                  "3.0:1",
                  "4.5:1",
                  "7.0:1",
                  "21.0:1"
                ],
                correctIndex: 1,
                explanation: "WCAG AA requires a 4.5:1 ratio for normal text. 3.0:1 is only acceptable for large text or UI components, and 7.0:1 is the stricter AAA standard."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
