import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import RDCalculatorClientWrapper from './RDCalculatorClientWrapper';

const toolId = 'rd-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="RD Calculator"
      description="Calculate maturity amount and interest earned on your Recurring Deposit (RD)."
      category={cat}
      toolId={toolId}
    >
      <RDCalculatorClientWrapper />

      <LearningHub title="Understanding Recurring Deposits">
        
        <LearningSection type="architecture" title="RD vs FD: Time in the Market">
          <p>A common point of confusion is comparing a Fixed Deposit (FD) to a Recurring Deposit (RD). If you invest ₹1.2 Lakhs as a lumpsum in an FD at 7% for one year, you will earn significantly more interest than if you invest ₹10,000 per month in an RD at 7% for one year.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Why is the interest lower?">
          <p>In an FD, your entire ₹1.2 Lakhs is sitting in the bank earning interest for all 12 months.</p>
          <p className="mt-2">In an RD, only your <em>first</em> ₹10,000 earns interest for 12 months. Your second ₹10,000 only earns interest for 11 months. Your final ₹10,000 deposit only earns interest for a single month!</p>
          <p className="mt-2">Because capital is drip-fed into the account, the "average time in the market" for your money is roughly half that of a lumpsum FD.</p>
        </LearningSection>

        <LearningSection type="standards" title="The RD Formula">
          <p>Because of this stepped timeline, banks calculate RD interest using a specialized formula based on the sum of an arithmetic progression of months:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>Maturity = P × [ (1 + r/n)^(n×t) - 1 ] / [ 1 - (1 + r/n)^(-1/3) ]</code></pre>
          <p className="mt-2 text-sm text-kv-text-muted">Note: This specific mathematical formula varies slightly depending on if the bank compounds quarterly (as is standard in India) or monthly.</p>
          <p className="mt-4">RDs are not mathematically designed to beat lumpsum returns; they are a behavioral forced-saving mechanism designed to build discipline for people who earn monthly salaries.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If an FD and an RD both offer a 7% interest rate for 1 year, and you invest a total of ₹1,20,000 in both, which one pays more total interest?",
                options: [
                  "The RD pays more.",
                  "They pay exactly the same amount of interest.",
                  "The FD pays significantly more.",
                  "It depends on the inflation rate."
                ],
                correctIndex: 2,
                explanation: "The FD pays more because the entire ₹1,20,000 earns interest for 12 months. In the RD, the final installment of ₹10,000 only earns interest for 1 month."
              },
              {
                question: "What is the primary benefit of a Recurring Deposit over a Fixed Deposit?",
                options: [
                  "Higher interest rates.",
                  "Tax-free returns.",
                  "It allows salaried individuals to build a corpus gradually out of monthly income instead of needing a large lump sum upfront.",
                  "It is immune to stock market crashes."
                ],
                correctIndex: 2,
                explanation: "RDs are a behavioral tool. They enforce saving discipline by automatically moving a portion of a monthly salary into a locked, interest-bearing account."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
