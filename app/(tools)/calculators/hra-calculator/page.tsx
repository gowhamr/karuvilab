import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import HraCalculatorWrapper from './HraCalculatorWrapper';

const toolId = 'hra-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="HRA Calculator"
      description="Calculate HRA exemption limit."
      category={cat}
      toolId={toolId}
    >
      <HraCalculatorWrapper />

      <LearningHub title="Understanding Tax Laws for Rent">
        
        <LearningSection type="architecture" title="Section 10(13A)">
          <p>House Rent Allowance (HRA) is a common component of a salary package in India. Under Section 10(13A) of the Income Tax Act, you can claim a tax exemption on your HRA if you live in a rented house.</p>
          <p className="mt-2">However, you don't just get to arbitrarily deduct your entire rent from your taxes. The law sets strict mathematical rules to prevent abuse.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Exemption Rule">
          <p>The law states that your tax-exempt HRA is strictly the <strong>lowest</strong> of the following three calculated amounts:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-2">
            <li>The actual HRA received from your employer.</li>
            <li>Actual rent paid <em>minus</em> 10% of your Basic Salary (plus DA).</li>
            <li>50% of your Basic Salary (if you live in a Metro city: Delhi, Mumbai, Chennai, Kolkata) OR 40% of your Basic Salary (for non-metro cities).</li>
          </ol>
          <p className="mt-2">If your actual rent is less than 10% of your basic salary, Condition #2 evaluates to zero or negative, which means your total allowable HRA exemption is exactly ₹0.</p>
        </LearningSection>

        <LearningSection type="failures" title="The New Tax Regime">
          <p><strong>Important Note:</strong> The HRA exemption is only available if you opt for the <em>Old Tax Regime</em> when filing your returns.</p>
          <p className="mt-2">If you file your taxes under the New Tax Regime, you are legally prohibited from claiming an HRA exemption. In that scenario, the entire HRA amount you receive from your employer is fully taxable alongside your basic salary.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "According to the Income Tax Act, how much of your rent can you claim as an HRA exemption?",
                options: [
                  "100% of the rent you pay.",
                  "Exactly 50% of your basic salary.",
                  "The lowest amount resulting from three specific legal conditions.",
                  "Whatever amount your employer lists as HRA on your payslip."
                ],
                correctIndex: 2,
                explanation: "The exemption is strictly capped at the lowest of: actual HRA, rent minus 10% of basic, or 40/50% of basic salary."
              },
              {
                question: "What happens to your HRA exemption if you opt for the New Tax Regime?",
                options: [
                  "It increases by 10%.",
                  "It remains exactly the same.",
                  "You can only claim it for metro cities.",
                  "You lose the exemption entirely, and the HRA becomes fully taxable."
                ],
                correctIndex: 3,
                explanation: "The New Tax Regime offers lower base tax rates but eliminates almost all deductions, including the HRA exemption under Section 10(13A)."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
