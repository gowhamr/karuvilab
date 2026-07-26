import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
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

      <LearningHub title="Understanding Goods & Services Tax Mathematics">
        
        <LearningSection type="architecture" title="Adding vs Removing Tax">
          <p>Adding GST to a base price is mathematically straightforward. If the base price is ₹100 and GST is 18%, you just calculate 18% of 100 (which is ₹18) and add it to get ₹118.</p>
          <p className="mt-2">However, <em>removing</em> GST from an inclusive price is where many people make a critical mathematical error. If you have an invoice for ₹118 (which includes 18% GST), you cannot simply subtract 18% to find the base price.</p>
        </LearningSection>
        
        <LearningSection type="failures" title="The Subtraction Error">
          <p>Let's look at what happens if you subtract 18% from ₹118:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>118 - (118 * 0.18) = 118 - 21.24 = ₹96.76</code></pre>
          <p className="mt-2">You ended up with ₹96.76, not the original ₹100! Why? Because 18% of 118 is a larger number than 18% of 100. Percentage changes are not symmetrical.</p>
        </LearningSection>

        <LearningSection type="api" title="The Correct Formula">
          <p>To correctly extract the base price from a GST-inclusive amount, you have to divide the total by <code>1 + the tax rate</code>:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>Base Price = Total Amount / (1 + [GST% / 100])</code></pre>
          <p className="mt-2">Using our ₹118 example:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>Base Price = 118 / (1 + 0.18) = 118 / 1.18 = ₹100</code></pre>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why can't you find the base price by subtracting 18% from a GST-inclusive price of ₹118?",
                options: [
                  "Because 18% of the inclusive total (118) is a larger number than 18% of the base price (100).",
                  "Because GST is a flat tax, not a percentage tax.",
                  "Because GST rates change based on the state.",
                  "You can; subtracting 18% works perfectly."
                ],
                correctIndex: 0,
                explanation: "Percentages are relative to the number they are applied to. 18% of a larger number is larger than 18% of a smaller number."
              },
              {
                question: "What is the mathematically correct way to remove a 12% GST from a total bill of ₹1120?",
                options: [
                  "Divide ₹1120 by 0.12",
                  "Multiply ₹1120 by 0.88",
                  "Divide ₹1120 by 1.12",
                  "Subtract 120 from 1120"
                ],
                correctIndex: 2,
                explanation: "You must divide by (1 + the tax rate). In this case, 1 + 0.12 = 1.12. And 1120 / 1.12 exactly equals the base price of ₹1000."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
