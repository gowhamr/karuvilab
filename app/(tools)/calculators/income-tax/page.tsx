import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-marginal-tax"
          title="How it Works: Marginal Tax Rates"
          preview="Learn the biggest misconception about tax brackets and why getting a raise never results in less take-home pay."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A common myth is: "If I get a raise and move into the 30% tax bracket, my entire income will be taxed at 30%, so I'll actually take home less money!"
            </p>
            <p>
              This is mathematically false because India uses a <strong>Marginal Tax System</strong>.
            </p>
            <h3>How Slabs Actually Work</h3>
            <p>
              When you move into a higher tax bracket, the higher percentage <em>only applies to the money earned above that threshold</em>. 
            </p>
            <p>
              Imagine buckets filling with water. Your first ₹3 Lakhs fills the 0% bucket. Once that bucket overflows, the next ₹4 Lakhs falls into the 5% bucket. When that overflows, the next amount falls into the 10% bucket.
            </p>
            <p>
              Even if you earn ₹20 Lakhs and hit the 30% tax bracket, your first ₹3 Lakhs is still completely tax-free, and your next ₹4 Lakhs is still only taxed at 5%. Therefore, your <em>Effective Tax Rate</em> (Total Tax / Total Income) is always significantly lower than your highest marginal bracket.
            </p>
            <h3>The Section 87A Rebate Trap</h3>
            <p>
              There is one exception: The Section 87A rebate. In the New Regime, if your taxable income is exactly ₹12,00,000, your tax is completely wiped out by the rebate (you pay ₹0). But if you earn ₹12,00,100, you lose the entire rebate, and suddenly owe over ₹1 Lakh in tax!
            </p>
            <p>
              To prevent this unfairness, the government introduced <strong>Marginal Relief</strong>. If your income slightly exceeds the rebate limit, the extra tax you pay is capped at the extra income you earned.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
