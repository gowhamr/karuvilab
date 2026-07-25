import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import LumpsumCalculatorClientWrapper from './LumpsumCalculatorClientWrapper';

const toolId = 'lumpsum-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Lumpsum Calculator"
      description="Calculate the future value of a one-time investment with compounding."
      category={cat}
      toolId={toolId}
      content={{
        detailedDescription: "Calculate the future value of a one-time investment using the power of compounding. This tool is perfect for seeing how a single deposit grows over several years at a fixed interest rate. It's ideal for planning fixed deposits or one-time mutual fund investments.",
        howTo: [
          "Enter the one-time investment amount.",
          "Enter the expected annual interest/return rate.",
          "Enter the number of years you plan to stay invested.",
          "The tool displays the total maturity value and total interest earned."
        ],
        faq: [
          { question: "What formula is used for lumpsum calculations?", answer: "FV = PV × (1 + r)^n, where FV is future value, PV is principal, r is annual interest rate, and n is number of years." },
          { question: "Is compounding annual?", answer: "Yes, this standard lumpsum calculator assumes annual compounding." }
        ],
        relatedTools: ["sip-calculator", "mutual-fund-returns", "compound-interest"]
      }}
    >
      <LumpsumCalculatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-rule-72"
          title="How it Works: The Rule of 72"
          preview="Learn a famous mental math shortcut to calculate exactly how long it takes to double your money."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              While this calculator gives you exact, penny-perfect results using the exponential compounding formula <code>FV = P(1+r)^t</code>, there is a legendary mental math shortcut you can use when you're away from a computer.
            </p>
            <h3>The Rule of 72</h3>
            <p>
              If you want to know exactly how many years it will take to <strong>double</strong> a lumpsum investment, simply divide 72 by your expected interest rate.
            </p>
            <ul>
              <li>If your mutual fund returns <strong>12%</strong>: <code>72 / 12 = 6 years</code> to double.</li>
              <li>If your Fixed Deposit returns <strong>6%</strong>: <code>72 / 6 = 12 years</code> to double.</li>
              <li>If your savings account returns <strong>4%</strong>: <code>72 / 4 = 18 years</code> to double.</li>
            </ul>
            <p>
              This is a mathematically proven approximation derived from natural logarithms, specifically the Taylor Series expansion of <code>ln(1+r)</code>. Try entering those exact numbers into the calculator above and look at the chart at the expected year!
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
