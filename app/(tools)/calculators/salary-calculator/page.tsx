import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import SalaryCalculatorClientWrapper from './SalaryCalculatorClientWrapper';

const toolId = 'salary-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Indian Salary Calculator"
      description="Break down your CTC into take-home pay under the new tax regime (FY 2024-25)."
      category={cat}
      toolId={toolId}
    >
      <SalaryCalculatorClientWrapper />

      <LearningHub title="Understanding CTC vs. In-Hand Salary">
        
        <LearningSection type="architecture" title="The CTC Illusion">
          <p>When a company in India extends a job offer, they almost always state the salary in terms of <strong>Cost to Company (CTC)</strong>.</p>
          <p className="mt-2">Many new graduates simply divide their CTC by 12 and expect that exact number to hit their bank account every month. They are usually shocked on their first payday.</p>
        </LearningSection>
        
        <LearningSection type="api" title="What is CTC?">
          <p>CTC is literally the total amount of money the company spends to keep you employed. It includes things that you never actually see in your bank account:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Employer's EPF Contribution:</strong> By law, your company must deposit 12% of your basic salary into your Provident Fund. This is money <em>they</em> pay on your behalf, so they add it to your CTC.</li>
            <li><strong>Gratuity:</strong> A statutory lump sum you only receive if you work at the company for 5 continuous years. Companies often add 4.81% of your basic salary to your CTC for this, even though you might leave after 2 years and never get it.</li>
            <li><strong>Insurance Premiums:</strong> The cost of the corporate health and life insurance policies they buy for you.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="The Double Deduction (EPF)">
          <p>The biggest shock comes from EPF (Employee Provident Fund). The rules require a 12% contribution from the <em>employer</em> (which is in your CTC) AND a matching 12% contribution from the <em>employee</em> (which is deducted directly from your Gross Salary).</p>
          <p className="mt-2">This means a total of 24% of your basic salary is locked away in a retirement account before it ever reaches your pocket. After accounting for EPF, Professional Tax, and Income Tax (TDS), your actual Take-Home Pay is often only 70% to 80% of your advertised CTC.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is Gratuity included in your CTC even if you might not receive it?",
                options: [
                  "Because it is paid out every month as a bonus.",
                  "It represents a cost provision the company must account for, even if the employee leaves before the 5-year vesting period.",
                  "It is a mandatory tax paid to the government.",
                  "Because the company assumes everyone works there until retirement."
                ],
                correctIndex: 1,
                explanation: "CTC measures the company's expenses, not your income. The company must provision funds for Gratuity on their balance sheet, so it is counted as part of their cost to employ you."
              },
              {
                question: "How much total money goes into an employee's EPF account each month?",
                options: [
                  "12% of their basic salary, deducted from their paycheck.",
                  "12% of their CTC, paid by the employer.",
                  "24% of their basic salary (12% employer contribution + 12% employee deduction).",
                  "A fixed flat rate set by the government."
                ],
                correctIndex: 2,
                explanation: "The EPF structure mandates matching contributions: 12% from the employer (part of CTC) and 12% from the employee (deducted from gross pay)."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
