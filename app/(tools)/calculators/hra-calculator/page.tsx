import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-hra"
          title="How it Works: Section 10(13A)"
          preview="Learn the three conditions that determine exactly how much tax you can save on rent."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              House Rent Allowance (HRA) is a common component of a salary package in India. Under Section 10(13A) of the Income Tax Act, you can claim a tax exemption on your HRA if you live in a rented house.
            </p>
            <h3>The Exemption Rule</h3>
            <p>
              You don't just get to deduct your entire rent from your taxes. The law states that your tax-exempt HRA is the <strong>lowest</strong> of the following three amounts:
            </p>
            <ol>
              <li>The actual HRA received from your employer.</li>
              <li>Actual rent paid <em>minus</em> 10% of your Basic Salary (plus DA).</li>
              <li>50% of your Basic Salary (if you live in a Metro city: Delhi, Mumbai, Chennai, Kolkata) OR 40% of your Basic Salary (for non-metro cities).</li>
            </ol>
            <p>
              If your actual rent is less than 10% of your basic salary, Condition 2 evaluates to zero or negative, which means your HRA exemption is ₹0.
            </p>
            <h3>The Old vs New Regime</h3>
            <p>
              <strong>Important Note:</strong> The HRA exemption is only available if you opt for the <em>Old Tax Regime</em>. If you file your taxes under the New Tax Regime, you cannot claim an HRA exemption, and the entire HRA amount received from your employer is fully taxable.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
