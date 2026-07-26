import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import GratuityCalculatorWrapper from './GratuityCalculatorWrapper';

const toolId = 'gratuity-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Gratuity Calculator"
      description="Calculate Gratuity amount."
      category={cat}
      toolId={toolId}
    >
      <GratuityCalculatorWrapper />

      <LearningHub title="Understanding Gratuity Law">
        
        <LearningSection type="architecture" title="The Payment of Gratuity Act">
          <p>In India, Gratuity is a statutory monetary benefit paid by an employer to an employee for rendering continuous service for at least 5 years. It is strictly governed by the <strong>Payment of Gratuity Act, 1972</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Official Formula">
          <p>If your company is covered under the Act, the formula is legally defined as:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>Gratuity = (15 / 26) * Last Drawn Salary * Years of Service</code></pre>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Last Drawn Salary:</strong> This only includes your Basic Salary plus Dearness Allowance (DA). It legally cannot include HRA, bonuses, or other special allowances.</li>
            <li><strong>15 / 26:</strong> You are paid for 15 days of wages for every year of service. The law specifically considers a working month to be 26 days (excluding 4 Sundays), not 30 days.</li>
            <li><strong>Years of Service:</strong> If you work for more than 6 months in your final year, the law mandates it is rounded up to the next full year.</li>
          </ul>
        </LearningSection>

        <LearningSection type="security" title="The Tax Limit">
          <p>As per current tax laws, Gratuity received up to a maximum limit of ₹20 Lakhs is completely tax-free under Section 10(10) of the Income Tax Act.</p>
          <p className="mt-2">Any gratuity amount exceeding this 20 Lakh limit is fully taxable as per your standard income slab rate.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "According to the Gratuity Act formula, why is the last drawn salary multiplied by (15 / 26)?",
                options: [
                  "Because 15% is the standard tax rate for gratuity.",
                  "Because the law rewards you with 15 days of wages for every year of service, and legally defines a working month as exactly 26 days.",
                  "Because 26 is the average number of years a person works.",
                  "Because 15/26 is the inflation adjustment ratio."
                ],
                correctIndex: 1,
                explanation: "The law assumes a month has 4 Sundays (30 - 4 = 26 working days), and awards you 15 days of pay out of those 26 days for every year you worked."
              },
              {
                question: "Which components of your salary are used to calculate the 'Last Drawn Salary' for gratuity?",
                options: [
                  "Your entire Gross Salary including all allowances.",
                  "Only your Basic Salary and Dearness Allowance (DA).",
                  "Only your Take Home / Net Salary after taxes.",
                  "Only your Basic Salary and House Rent Allowance (HRA)."
                ],
                correctIndex: 1,
                explanation: "The Gratuity Act strictly limits the calculation to Basic Salary + DA. Allowances like HRA, LTA, and bonuses are completely excluded."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}