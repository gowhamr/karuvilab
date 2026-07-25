import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-rd-math"
          title="How it Works: The Math Behind RDs"
          preview="Learn why a 7% RD pays less total interest than a 7% FD of the same amount."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A common point of confusion is comparing a Fixed Deposit (FD) to a Recurring Deposit (RD). If you invest ₹1.2 Lakhs as a lumpsum in an FD at 7% for one year, you will earn significantly more interest than if you invest ₹10,000 per month in an RD at 7% for one year.
            </p>
            <h3>Why? Time in the Market</h3>
            <p>
              In an FD, your entire ₹1.2 Lakhs is sitting in the bank earning interest for all 12 months.
            </p>
            <p>
              In an RD, only your first ₹10,000 earns interest for 12 months. Your second ₹10,000 only earns interest for 11 months. Your final ₹10,000 deposit only earns interest for a single month!
            </p>
            <h3>The RD Formula</h3>
            <p>
              Because of this stepped timeline, banks calculate RD interest using a specialized formula based on the sum of an arithmetic progression of months:
            </p>
            <p>
              <code>Maturity = P × [ (1 + r/n)^(n×t) - 1 ] / [ 1 - (1 + r/n)^(-1/3) ]</code>
            </p>
            <p>
              <em>(Note: This formula varies slightly depending on if the bank compounds quarterly, as is standard in India, or monthly.)</em>
            </p>
            <p>
              RDs are not designed to beat lumpsum returns; they are a forced saving mechanism designed to build discipline for people who earn monthly salaries.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
