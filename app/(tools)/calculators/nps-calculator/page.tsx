import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import NpsCalculatorWrapper from './NpsCalculatorWrapper';

const toolId = 'nps-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="NPS Calculator"
      description="Calculate National Pension System returns."
      category={cat}
      toolId={toolId}
    >
      <NpsCalculatorWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-nps"
          title="How it Works: The Annuity Catch"
          preview="Learn the withdrawal rules of the National Pension System and why it locks your money."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              The National Pension System (NPS) is a voluntary retirement scheme regulated by the PFRDA in India. It offers excellent tax benefits under Section 80C and Section 80CCD(1B), but it comes with strict liquidity constraints.
            </p>
            <h3>The 60/40 Rule at Maturity</h3>
            <p>
              When you reach age 60, your NPS account matures. However, you <strong>cannot</strong> withdraw your entire accumulated corpus as a lump sum.
            </p>
            <ul>
              <li><strong>60% Lump Sum:</strong> You are allowed to withdraw up to 60% of your total corpus completely tax-free.</li>
              <li><strong>40% Annuity:</strong> You are legally mandated to use the remaining 40% (minimum) to purchase an Annuity plan from a PFRDA-registered life insurance company.</li>
            </ul>
            <h3>What is an Annuity?</h3>
            <p>
              An annuity is a financial product that pays you a fixed, regular pension for the rest of your life. When you purchase the annuity with 40% of your NPS corpus, that money is effectively gone—you hand it over to the insurance company, and in return, they guarantee you a monthly payout. 
            </p>
            <p>
              The pension you receive from this annuity is treated as regular income and is <strong>fully taxable</strong> according to your income tax slab in retirement.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
