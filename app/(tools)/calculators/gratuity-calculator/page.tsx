import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import GratuityCalculatorWrapper from './GratuityCalculatorWrapper';

const toolId = 'gratuity-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Gratuity Calculator"
      description="Calculate Gratuity amount."
      category={cat}
      toolId={toolId}
    >
      <GratuityCalculatorWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-gratuity"
          title="How it Works: The Gratuity Formula"
          preview="Learn how the Payment of Gratuity Act calculates your lump sum reward."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              In India, Gratuity is a statutory benefit paid by an employer to an employee for rendering continuous service for at least 5 years. It is governed by the <strong>Payment of Gratuity Act, 1972</strong>.
            </p>
            <h3>The Formula</h3>
            <p>
              If your company is covered under the Act, the formula is strictly defined by law:
            </p>
            <p>
              <code>Gratuity = (15 / 26) * Last Drawn Salary * Years of Service</code>
            </p>
            <ul>
              <li><strong>Last Drawn Salary:</strong> This only includes your Basic Salary plus Dearness Allowance (DA). It does not include HRA, bonuses, or other allowances.</li>
              <li><strong>15 / 26:</strong> You are paid for 15 days of wages for every year of service. The law considers a working month to be 26 days (excluding 4 Sundays).</li>
              <li><strong>Years of Service:</strong> If you work for more than 6 months in your final year, it is rounded up to the next full year.</li>
            </ul>
            <h3>The Tax Limit</h3>
            <p>
              As per current tax laws, Gratuity received up to ₹20 Lakhs is completely tax-free under Section 10(10) of the Income Tax Act. Any amount exceeding this limit is taxable as per your standard income slab.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}