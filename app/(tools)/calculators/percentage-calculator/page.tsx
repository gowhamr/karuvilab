import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
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

      <LearningHub title="Understanding Percentage Mathematics">
        
        <LearningSection type="architecture" title="The Reversibility Rule">
          <p>Percentages are just fractions out of 100. The word literally translates to "per cent" (for every hundred).</p>
          <p className="mt-2">There is a fundamental algebraic property of multiplication: <code>A × B = B × A</code>.</p>
          <p className="mt-2">Because calculating a percentage is just multiplication, this means that <strong>x% of y is always exactly equal to y% of x</strong>. This is a legendary mental math trick.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Mental Math Trick">
          <p>Imagine someone asks you to calculate <strong>4% of 75</strong> in your head. For most people, that is very difficult math.</p>
          <p className="mt-2">But if you use the reversibility trick, you just flip the numbers: What is <strong>75% of 4</strong>?</p>
          <p className="mt-2">Suddenly, the math is trivial. 75% is just three-quarters. Three-quarters of 4 is <strong>3</strong>. Therefore, 4% of 75 is also exactly 3.</p>
        </LearningSection>

        <LearningSection type="failures" title="Percentage Change Trap">
          <p>When calculating Percentage Change (like a stock going up or down), always remember that the formula divides the absolute difference by the <em>original</em> number, not the new number.</p>
          <p className="mt-2">This creates an asymmetrical trap: A stock dropping from ₹100 to ₹50 is a <strong>50% loss</strong>. But for that same stock to go from ₹50 back up to ₹100, it requires a <strong>100% gain</strong>! Losing money requires much higher percentage gains just to break even.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Using the reversibility trick, what is the easiest way to calculate 18% of 50 in your head?",
                options: [
                  "Divide 50 by 18.",
                  "Multiply 18 by 5.",
                  "Flip it to 50% of 18, which is just half of 18 (so the answer is 9).",
                  "Use the formula (18*50)/1000."
                ],
                correctIndex: 2,
                explanation: "Because x% of y = y% of x, flipping a hard percentage into an easy one (like 50%, which just means 'half') makes mental math trivial."
              },
              {
                question: "If an investment loses 50% of its value, what percentage gain is required just to get back to the original break-even amount?",
                options: [
                  "50%",
                  "75%",
                  "100%",
                  "It's impossible."
                ],
                correctIndex: 2,
                explanation: "If ₹100 drops 50%, you have ₹50. To get back to ₹100, you need to gain ₹50. Since ₹50 is 100% of your current ₹50 balance, you need a 100% gain."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
