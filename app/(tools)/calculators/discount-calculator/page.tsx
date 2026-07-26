import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import DiscountCalculatorClientWrapper from "./DiscountCalculatorClientWrapper";

export const metadata: Metadata = generateToolMetadata("discount-calculator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Discount Calculator"
      description="Find discounted prices, savings, and what % off to reach your target price."
      category={cat}
      toolId="discount-calculator"
    >
      <DiscountCalculatorClientWrapper />

      <LearningHub title="Understanding Retail Mathematics">
        
        <LearningSection type="architecture" title="The Trap of Stacked Discounts">
          <p>Retailers often advertise massive sales with phrasing like: <em>"Take 50% off, plus an additional 20% off at checkout!"</em></p>
          <p className="mt-2">It is incredibly easy for consumers to assume this means they are getting a 70% discount total. But this is a mathematical illusion intentionally designed to sound better than it actually is.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Multiplicative vs Additive">
          <p>Discounts are almost never additive (<code>50% + 20% = 70%</code>). They are multiplicative. The second discount only applies to the <em>already reduced price</em>.</p>
          <p className="mt-2">Let's look at a $100 item:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>First discount (50%): The price drops to $50.</li>
            <li>Second discount (20%): This takes 20% off the $50 (which is only $10), bringing the final price to $40.</li>
          </ol>
          <p className="mt-2">Your final price is $40, which means your total effective discount is <strong>60%, not 70%</strong>. This trick allows retailers to advertise massive sounding percentages while protecting their profit margins.</p>
        </LearningSection>

        <LearningSection type="performance" title="The Universal Formula">
          <p>To calculate the true discount of any stacked sale without doing step-by-step math, you can simply multiply the <em>remaining</em> percentages together:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>Final Price = Original Price * (1 - Discount 1) * (1 - Discount 2)</code></pre>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>$100 * (0.50) * (0.80) = $40</code></pre>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If a store offers '40% off, plus an extra 10% off', what is your actual total discount?",
                options: [
                  "50%",
                  "46%",
                  "44%",
                  "40%"
                ],
                correctIndex: 1,
                explanation: "The first discount leaves 60% of the price. The second discount takes 10% off that 60% (which is 6%). So 40% + 6% = 46% total discount."
              },
              {
                question: "Why do retailers use stacked discounts (like 50% + 20%) instead of just offering a flat 60% off?",
                options: [
                  "Because their computer systems cannot process numbers larger than 50.",
                  "Because it mathematically results in a higher final price than an additive discount, protecting margins while sounding impressive to consumers.",
                  "Because it is required by advertising laws.",
                  "Because it makes calculating taxes easier."
                ],
                correctIndex: 1,
                explanation: "It's a psychological pricing strategy. 50+20 sounds like 70 to a quick buyer, driving sales without actually sacrificing 70% of the revenue."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
