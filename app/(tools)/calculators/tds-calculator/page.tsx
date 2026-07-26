import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import TdsCalculatorWrapper from './TdsCalculatorWrapper';

const toolId = 'tds-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="TDS Calculator"
      description="Calculate Tax Deducted at Source."
      category={cat}
      toolId={toolId}
    >
      <TdsCalculatorWrapper />

      <LearningHub title="Understanding Tax Deducted at Source">
        
        <LearningSection type="architecture" title="The Collection Mechanism">
          <p>Tax Deducted at Source (TDS) is a system introduced by the Income Tax Department of India to collect tax at the very source of income generation.</p>
          <p className="mt-2">The rationale is simple: If the government waited until the end of the year and asked citizens to calculate and pay their total tax bill all at once, many people would either forget, spend the money beforehand, or deliberately evade paying. By enforcing TDS, the government ensures a steady stream of revenue throughout the year and drastically reduces tax evasion.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Is TDS my final tax?">
          <p><strong>No.</strong> This is a very common misconception. TDS is merely an <em>advance</em> payment of tax made on your behalf by the person paying you (e.g., your employer, your bank paying FD interest, or your client paying a freelancer invoice).</p>
          <p className="mt-2">When you file your Income Tax Return (ITR) at the end of the year, you calculate your <em>actual</em> total tax liability for the year based on your tax slab.</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>If your Actual Total Tax is <strong>less</strong> than the TDS Deducted: The government gives you a <strong>Refund</strong> for the excess.</li>
            <li>If your Actual Total Tax is <strong>greater</strong> than the TDS Deducted: You must pay the difference as <strong>Self-Assessment Tax</strong> before filing.</li>
          </ul>
        </LearningSection>

        <LearningSection type="standards" title="Form 26AS">
          <p>You do not need to manually keep track of every TDS deduction made by every client or bank. All TDS deducted against your PAN is officially recorded by the government in a master ledger called <strong>Form 26AS</strong>. When you file your taxes, this data is automatically imported into your return.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If a company deducts 10% TDS from your freelancer invoice, does that mean your total tax liability on that income is exactly 10%?",
                options: [
                  "Yes, TDS is a final flat tax.",
                  "No, the 10% is just an advance deposit. Your actual tax depends on your final yearly income bracket.",
                  "Yes, but only if you have GST registration.",
                  "No, the 10% goes to the company, not the government."
                ],
                correctIndex: 1,
                explanation: "TDS rates (like 10% for professional services) are arbitrary deposits set by the government. Your real tax rate is determined by your total annual income when you file your ITR."
              },
              {
                question: "What happens if the total TDS deducted from you during the year is ₹50,000, but your final tax liability calculated in your ITR is only ₹20,000?",
                options: [
                  "The government keeps the extra ₹30,000 as a penalty.",
                  "You must pay another ₹20,000.",
                  "You will receive a refund of ₹30,000 from the Income Tax Department.",
                  "You can carry the ₹30,000 forward to pay for your property tax."
                ],
                correctIndex: 2,
                explanation: "Because TDS is just an advance deposit, any amount deposited in excess of your actual tax liability is legally required to be refunded to your bank account."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
