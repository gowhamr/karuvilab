import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import GSTCalculatorClientWrapper from './GSTCalculatorClientWrapper';

const toolId = 'gst-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="GST Calculator"
      description="Add or remove GST from any amount. View all GST slab breakdowns."
      category={cat}
      toolId={toolId}
    >
      <GSTCalculatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-reverse-gst"
          title="How it Works: Reverse Calculating Tax"
          preview="Learn why subtracting 18% from a GST-inclusive price doesn't give you the original base price."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Adding GST is easy. If the base price is ₹100 and GST is 18%, you just calculate 18% of 100 (₹18) and add it to get ₹118.
            </p>
            <p>
              However, <em>removing</em> GST from an inclusive price is where many people make a mathematical error. If you have an invoice for ₹118 (which includes 18% GST), you cannot just subtract 18% to find the base price.
            </p>
            <h3>The Mathematical Error</h3>
            <p>
              If you subtract 18% from ₹118:<br/>
              <code>118 - (118 * 0.18) = 118 - 21.24 = ₹96.76</code>
            </p>
            <p>
              You ended up with ₹96.76, not the original ₹100! Why? Because 18% of 118 is a larger number than 18% of 100.
            </p>
            <h3>The Correct Formula</h3>
            <p>
              To correctly extract the base price from a GST-inclusive amount, you have to divide the total by <code>1 + the tax rate</code>:
            </p>
            <p>
              <code>Base Price = Total Amount / (1 + [GST% / 100])</code>
            </p>
            <p>
              Using our ₹118 example:<br/>
              <code>Base Price = 118 / (1 + 0.18) = 118 / 1.18 = ₹100</code>
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
