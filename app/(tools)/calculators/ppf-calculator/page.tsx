import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import PPFCalculatorClientWrapper from './PPFCalculatorClientWrapper';

const toolId = 'ppf-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="PPF Calculator"
      description="Calculate PPF maturity amount and interest earned with annual compounding."
      category={cat}
      toolId={toolId}
    >
      <PPFCalculatorClientWrapper />

      <LearningHub title="Understanding Public Provident Fund Rules">
        
        <LearningSection type="architecture" title="The EEE Advantage">
          <p>The Public Provident Fund (PPF) is famous for its "EEE" tax status—exempt on investment (via Section 80C), exempt on interest accrual, and exempt on final maturity. It is one of the only completely tax-free debt instruments in India.</p>
          <p className="mt-2">However, its specific interest calculation method hides a massive mathematical trap for uninformed investors.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The 5th of the Month Rule">
          <p>Unlike a standard savings account which calculates interest based on your daily closing balance, PPF calculates interest based on the <strong>minimum balance in your account between the 5th and the last day of the month</strong>.</p>
          <p className="mt-2">This means if you deposit ₹1.5 Lakhs on the 6th of April, that money earns <strong>zero interest</strong> for the entire month of April! The government treats your balance as if the deposit never happened until May 1st.</p>
        </LearningSection>

        <LearningSection type="standards" title="How to Maximize Returns">
          <p>Because interest is calculated monthly but compounded annually (credited at the end of the financial year), the absolute best mathematical way to invest in PPF is to deposit your entire yearly amount (up to the ₹1.5 Lakhs limit) <strong>between April 1st and April 5th</strong>.</p>
          <p className="mt-2">By doing this, your entire deposit earns interest for all 12 months of the year. Over a 15-year lock-in period, this simple timing trick results in lakhs of extra rupees compared to someone who deposits their money in March at the end of the financial year.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you deposit ₹1 Lakh into your PPF account on the 10th of July, how much interest will that deposit earn for the month of July?",
                options: [
                  "Interest for the full month.",
                  "Interest for 21 days (from the 10th to the 31st).",
                  "Zero interest.",
                  "Half a month's interest."
                ],
                correctIndex: 2,
                explanation: "Because the deposit was made after the 5th of the month, it does not count towards the minimum balance between the 5th and the last day of July. It earns zero interest until August."
              },
              {
                question: "Mathematically, what is the optimal way to invest in a PPF account to maximize compounding?",
                options: [
                  "Invest a small amount every month via SIP.",
                  "Deposit the full ₹1.5 Lakh maximum limit between April 1st and April 5th every year.",
                  "Deposit the full amount in March just before the financial year ends.",
                  "Wait until the interest rate changes before investing."
                ],
                correctIndex: 1,
                explanation: "Depositing before April 5th ensures your entire capital earns interest for the maximum possible 12 months of that financial year."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
