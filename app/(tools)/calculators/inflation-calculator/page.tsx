import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import InflationCalculatorClientWrapper from './InflationCalculatorClientWrapper';

const toolId = 'inflation-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Inflation Calculator"
      description="Calculate the effect of inflation on your money's purchasing power over time."
      category={cat}
      toolId={toolId}
    >
      <InflationCalculatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-inflation"
          title="How it Works: The Time Value of Money"
          preview="Learn why ₹100 today is fundamentally worth more than ₹100 tomorrow."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Inflation is often described as the "invisible tax." It is the rate at which the general level of prices for goods and services rises, causing purchasing power to fall.
            </p>
            <h3>Forward vs Backward Calculation</h3>
            <p>
              This tool performs two different types of mathematical calculations depending on what you want to know:
            </p>
            <ul>
              <li><strong>Future Cost (Forward):</strong> If a car costs ₹10 Lakhs today, what will it cost in 10 years at 6% inflation? This uses the standard compound interest formula: <code>FV = PV * (1 + r)^n</code></li>
              <li><strong>Purchasing Power (Backward):</strong> If I save ₹10 Lakhs in cash under my mattress for 10 years, how much will it actually be "worth" in today's money when I finally spend it? This uses the present value formula: <code>PV = FV / (1 + r)^n</code></li>
            </ul>
            <h3>The Danger of Cash</h3>
            <p>
              If inflation is 6%, and you keep your money in a savings account earning 3%, your <strong>Real Return</strong> is negative (-3%). Even though your bank balance is going up, you are getting poorer every single day because the cost of goods is rising faster than your wealth.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
