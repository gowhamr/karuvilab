import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import LumpsumCalculatorClientWrapper from './LumpsumCalculatorClientWrapper';

const toolId = 'lumpsum-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Lumpsum Calculator"
      description="Calculate the future value of a one-time investment with compounding."
      category={cat}
      toolId={toolId}
    >
      <LumpsumCalculatorClientWrapper />

      <LearningHub title="Understanding Investment Math">
        
        <LearningSection type="architecture" title="The Exponential Curve">
          <p>While a SIP (Systematic Investment Plan) requires you to add money every month, a Lumpsum investment relies entirely on the pure exponential curve of a single initial deposit.</p>
          <p className="mt-2">This calculator uses the standard future value formula: <code>FV = P(1+r)^t</code> to show you exact, penny-perfect results over any time period.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Rule of 72">
          <p>While calculators are great, there is a legendary mental math shortcut you can use when you're away from a computer. It's called the <strong>Rule of 72</strong>.</p>
          <p className="mt-2">If you want to know exactly how many years it will take to double a lumpsum investment, simply divide the number 72 by your expected annual interest rate.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>If your mutual fund returns <strong>12%</strong>: <code>72 / 12 = 6 years</code> to double.</li>
            <li>If your Fixed Deposit returns <strong>6%</strong>: <code>72 / 6 = 12 years</code> to double.</li>
            <li>If your savings account returns <strong>4%</strong>: <code>72 / 4 = 18 years</code> to double.</li>
          </ul>
        </LearningSection>

        <LearningSection type="standards" title="Why 72?">
          <p>This isn't just a random guess; it is a mathematically proven approximation derived from natural logarithms. Specifically, it comes from the Taylor Series expansion of <code>ln(1+r)</code>.</p>
          <p className="mt-2">Try entering a 12% return into the calculator above and look at the chart at Year 6—you will see your initial investment has exactly doubled!</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "According to the Rule of 72, if you invest ₹1 Lakh in an index fund returning 9% annually, approximately how many years will it take to reach ₹2 Lakhs?",
                options: [
                  "9 years",
                  "8 years",
                  "7.2 years",
                  "12 years"
                ],
                correctIndex: 1,
                explanation: "72 divided by 9 equals exactly 8 years."
              },
              {
                question: "Why does a lumpsum investment grow exponentially even if you never add another dollar to it?",
                options: [
                  "Because inflation pushes the value up.",
                  "Because the interest you earn in Year 1 generates its own interest in Year 2, creating a snowball effect.",
                  "Because banks increase the interest rate automatically over time.",
                  "Because it uses Simple Interest."
                ],
                correctIndex: 1,
                explanation: "This is the definition of compound interest. Earning interest on your previous interest causes the growth curve to bend upwards exponentially."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
