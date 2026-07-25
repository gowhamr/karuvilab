import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-discounts"
          title="How it Works: The Trap of Stacked Discounts"
          preview="Learn why 50% off + an extra 20% off does NOT equal 70% off."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Retailers often advertise sales like "Take 50% off, plus an additional 20% off at checkout!" It's easy to assume this means you get a 70% discount. 
            </p>
            <h3>Multiplicative vs Additive</h3>
            <p>
              Discounts are almost never additive (<code>50% + 20% = 70%</code>). They are multiplicative. The second discount only applies to the <em>already reduced price</em>.
            </p>
            <p>
              Let's look at a $100 item:
            </p>
            <ol>
              <li>First discount (50%): The price drops to $50.</li>
              <li>Second discount (20%): This takes 20% off the $50 (which is $10), bringing the final price to $40.</li>
            </ol>
            <p>
              Your final price is $40, which means your total effective discount is <strong>60%, not 70%</strong>. This mathematical trick allows retailers to advertise massive sounding numbers while maintaining higher profit margins.
            </p>
            <h3>The Formula</h3>
            <p>
              To calculate the true discount of any stacked sale without doing step-by-step math, multiply the <em>remaining</em> percentages together:
            </p>
            <p>
              <code>Final Price = Original Price * (1 - Discount 1) * (1 - Discount 2)</code><br/>
              <code>$100 * (0.50) * (0.80) = $40</code>
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
