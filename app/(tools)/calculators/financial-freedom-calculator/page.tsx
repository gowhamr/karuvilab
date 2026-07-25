import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import FinancialFreedomCalculatorClientWrapper from "./FinancialFreedomCalculatorClientWrapper";
import { financialFreedomCalculator } from "@/src/content/tools/financial-freedom-calculator";

const toolId = "financial-freedom-calculator";
const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function FinancialFreedomCalculator() {
  return (
    <ToolShell
      title="Financial Freedom Calculator"
      description="Calculate your path to FIRE and plan your retirement. Project your net worth, determine your required corpus, and find out exactly when you can safely retire."
      category={cat}
      toolId={toolId}
      content={financialFreedomCalculator}
    >
      <FinancialFreedomCalculatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-4-percent-rule"
          title="How it Works: The 4% Rule"
          preview="Learn the math behind the famous FIRE movement's retirement threshold."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              How do you know when you have enough money to stop working forever? The most famous benchmark in the Financial Independence, Retire Early (FIRE) movement is the <strong>4% Rule</strong>.
            </p>
            <h3>The Trinity Study</h3>
            <p>
              In 1998, three professors at Trinity University published a study looking at historical stock and bond returns. They wanted to find a "Safe Withdrawal Rate"—the maximum percentage of a portfolio you could withdraw in Year 1 (and adjust for inflation every subsequent year) without running out of money over a 30-year retirement.
            </p>
            <p>
              They found that a portfolio invested heavily in equities had a near 100% success rate if the retiree withdrew exactly 4% in the first year.
            </p>
            <h3>Calculating Your Target Number</h3>
            <p>
              Because of the 4% rule, finding your required retirement corpus is incredibly simple. You just multiply your annual expenses by 25.
            </p>
            <ul>
              <li>If you need ₹12 Lakhs per year to live comfortably:</li>
              <li><code>₹12,00,000 * 25 = ₹3,00,00,000 (3 Crores)</code></li>
            </ul>
            <p>
              Why 25? Because <code>100 / 4 = 25</code>. If you have 25 times your annual expenses invested, you can safely withdraw 4% of that total amount every year.
            </p>
            <h3>Is it safe?</h3>
            <p>
              The 4% rule assumes a 30-year retirement and historical US market data. For a much longer early retirement (e.g., 50 years), many modern financial advisors recommend a more conservative 3% to 3.5% withdrawal rate (which means multiplying your expenses by 30 to 33 instead of 25).
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
