import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import IncomeTaxWrapper from './IncomeTaxWrapper';

const toolId = 'income-tax';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Income Tax Calculator"
      description="Calculate income tax for FY 2025-26."
      category={cat}
      toolId={toolId}
    >
      <IncomeTaxWrapper />

      <LearningHub title="Understanding Progressive Taxation">
        
        <LearningSection type="architecture" title="The 30% Bracket Myth">
          <p>A very common, yet mathematically false myth is: <em>"If I get a raise and move into the 30% tax bracket, my entire income will be taxed at 30%, so I'll actually take home less money than before the raise!"</em></p>
          <p className="mt-2">This is fundamentally impossible because almost all modern economies (including India) use a <strong>Marginal Tax System</strong>, not a flat tax system.</p>
        </LearningSection>
        
        <LearningSection type="api" title="How Tax Slabs Actually Work">
          <p>When you move into a higher tax bracket, the higher percentage <strong>only applies to the money earned above that threshold.</strong></p>
          <p className="mt-2">Imagine buckets filling with water. Your first ₹3 Lakhs fills the 0% bucket. Once that bucket overflows, the next ₹4 Lakhs falls into the 5% bucket. When that overflows, the next amount falls into the 10% bucket.</p>
          <p className="mt-2">Even if you earn ₹20 Lakhs and hit the top 30% tax bracket, your first ₹3 Lakhs is still completely tax-free, and your next ₹4 Lakhs is still only taxed at 5%. Therefore, your <em>Effective Tax Rate</em> (Total Tax / Total Income) is always significantly lower than your highest marginal bracket.</p>
        </LearningSection>

        <LearningSection type="failures" title="The Section 87A Rebate Trap">
          <p>There is one bizarre exception to the "getting a raise always means more take-home pay" rule: The Section 87A rebate.</p>
          <p className="mt-2">In the New Tax Regime, if your taxable income is exactly ₹12,00,000, your calculated tax is completely wiped out by the rebate (you pay ₹0). But if you earn exactly ₹12,00,100, you legally lose the entire rebate, and suddenly owe over ₹1 Lakh in tax for earning an extra ₹100!</p>
          <p className="mt-2">To prevent this mathematical unfairness, the government introduced <strong>Marginal Relief</strong>. If your income slightly exceeds the rebate limit, the extra tax you are forced to pay is strictly capped at the extra income you earned over the limit.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you get a raise that pushes you into the 30% tax bracket, how much of your total income is taxed at 30%?",
                options: [
                  "100% of your total income.",
                  "Only the portion of your income that falls above the 30% threshold.",
                  "30% of your basic salary, but not your allowances.",
                  "It depends on whether you choose the old or new regime."
                ],
                correctIndex: 1,
                explanation: "Under a marginal tax system, you only pay the higher rate on the specific dollars/rupees that overflow into that higher bracket."
              },
              {
                question: "What is the purpose of 'Marginal Relief' in Indian tax law?",
                options: [
                  "To lower the tax burden for senior citizens.",
                  "To prevent a scenario where earning a tiny bit more income causes you to lose a rebate and pay more in taxes than the raise itself.",
                  "To allow businesses to carry forward losses.",
                  "To provide a tax break for charitable donations."
                ],
                correctIndex: 1,
                explanation: "Marginal Relief ensures that if you cross a rebate threshold (like ₹12 Lakhs) by ₹100, your tax penalty is capped at ₹100, so you are never worse off for earning more."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
