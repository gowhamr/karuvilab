import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import InflationCalculatorClientWrapper from './InflationCalculatorClientWrapper';

const toolId = 'inflation-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Inflation Calculator"
      description="Calculate the effect of inflation on your money's purchasing power over time."
      category={cat}
      toolId={toolId}
    >
      <InflationCalculatorClientWrapper />

      <LearningHub title="Understanding The Time Value of Money">
        
        <LearningSection type="architecture" title="The Invisible Tax">
          <p>Inflation is often described by economists as the "invisible tax." It is the rate at which the general level of prices for goods and services in an economy rises, causing the purchasing power of your money to fall.</p>
          <p className="mt-2">Because of inflation, ₹100 today is fundamentally worth more than ₹100 tomorrow, because today's ₹100 can buy more goods.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Forward vs Backward Calculation">
          <p>This tool performs two different types of mathematical calculations depending on what you want to know:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Future Cost (Forward):</strong> If a car costs ₹10 Lakhs today, what will it cost in 10 years at 6% inflation? This uses the standard compound interest formula: <code>FV = PV * (1 + r)^n</code></li>
            <li><strong>Purchasing Power (Backward):</strong> If I save ₹10 Lakhs in cash under my mattress for 10 years, how much will it actually be "worth" in today's money when I finally spend it? This uses the present value formula: <code>PV = FV / (1 + r)^n</code></li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="The Danger of Cash">
          <p>The math reveals why hoarding physical cash is financially dangerous. If inflation is running at 6% annually, and you keep your money in a standard savings account earning only 3% interest, your <strong>Real Return</strong> is negative (-3%).</p>
          <p className="mt-2">Even though the absolute number in your bank balance is going up every month, you are quietly getting poorer every single day because the cost of goods in the real world is rising much faster than your wealth.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If inflation is 5% and your savings account pays 2% interest, what is happening to your wealth?",
                options: [
                  "Your wealth is growing by 2% a year.",
                  "Your wealth is growing by 7% a year.",
                  "Your purchasing power is decreasing by roughly 3% a year.",
                  "Your wealth is perfectly preserved."
                ],
                correctIndex: 2,
                explanation: "Your 'Real Return' is your interest rate minus the inflation rate (2% - 5% = -3%). Your money buys 3% less stuff than it did last year."
              },
              {
                question: "What mathematical formula is used to calculate what an item will cost in the future due to inflation?",
                options: [
                  "Simple Interest",
                  "The Compound Interest formula (FV = PV * (1 + r)^n)",
                  "Division by the inflation rate",
                  "Subtraction of the CPI"
                ],
                correctIndex: 1,
                explanation: "Inflation compounds just like investment returns do. A 6% price increase next year is calculated on top of the 6% price increase from this year."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
