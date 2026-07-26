import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import TimeCalculatorClientWrapper from './TimeCalculatorClientWrapper';

const toolId = 'time-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Time Calculator"
      description="Add multiple time durations or find the difference between two times."
      category={cat}
      toolId={toolId}
    >
      <TimeCalculatorClientWrapper />

      <LearningHub title="Understanding Sexagesimal Mathematics">
        
        <LearningSection type="architecture" title="Base-60 Math">
          <p>If you have ₹1.50 and you add ₹1.50, you get ₹3.00. But if you have 1 hour and 50 minutes, and you add 1 hour and 50 minutes, you do not get 3 hours. You get 3 hours and 40 minutes!</p>
          <p className="mt-2">This confusion happens because most human math is <strong>Base-10 (Decimal)</strong>, where a column carries over when it hits 10 or 100. But time is calculated in <strong>Base-60 (Sexagesimal)</strong>, a mathematical system inherited from the ancient Sumerians over 4,000 years ago.</p>
        </LearningSection>
        
        <LearningSection type="api" title="How Computers Calculate Time">
          <p>To do math on time, computers completely ignore the concepts of "hours" and "minutes". They convert everything down to the smallest possible uniform unit (usually milliseconds or seconds), perform standard Base-10 math on that massive number, and then parse it back into Base-60 for the human UI.</p>
          <p className="mt-2">To mathematically add <code>1h 50m</code> and <code>1h 50m</code>:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1 font-mono text-sm">
            <li>Convert to minutes: (1 * 60) + 50 = 110 minutes</li>
            <li>Add them together: 110 + 110 = 220 minutes</li>
            <li>Extract the hours: Math.floor(220 / 60) = 3 hours</li>
            <li>Extract remaining minutes: 220 % 60 = 40 minutes</li>
          </ol>
        </LearningSection>

        <LearningSection type="performance" title="The Modulo Operator">
          <p>Step 4 relies on the Modulo (<code>%</code>) operator. Instead of giving the result of division, Modulo returns the <em>remainder</em> of a division. <code>220 % 60</code> asks the computer: "If I divide 220 by 60 into whole numbers, what is left over?" The answer is 40. This is exactly how this tool flawlessly adds and subtracts hours, minutes, and seconds.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why can't you just add 1.50 (representing 1h 50m) and 1.50 on a standard desktop calculator to get time addition?",
                options: [
                  "Standard calculators are broken.",
                  "Because standard calculators use Base-10 (decimal) math where carry-over happens at 100, but time uses Base-60 where carry-over happens at 60.",
                  "Because time zones interfere with the calculation.",
                  "You can, 1.50 + 1.50 = 3.00, which means 3 hours."
                ],
                correctIndex: 1,
                explanation: "Time math requires entirely different rollover boundaries than decimal math."
              },
              {
                question: "In programming, what does the Modulo (%) operator return?",
                options: [
                  "The percentage of two numbers.",
                  "The quotient of division.",
                  "The remainder of a division.",
                  "It multiplies the numbers by 100."
                ],
                correctIndex: 2,
                explanation: "Modulo is critical for time math because it extracts the remaining minutes or seconds that couldn't fit perfectly into the next higher unit (like hours)."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
