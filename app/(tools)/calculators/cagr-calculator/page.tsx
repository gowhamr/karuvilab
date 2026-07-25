import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import CAGRCalculatorClientWrapper from "./CAGRCalculatorClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("cagr-calculator");

export default function CAGRCalculator() {
  return (
    <ToolShell
      title="CAGR Calculator"
      description="Calculate Compound Annual Growth Rate (CAGR) for your investments."
      category={cat}
      toolId="cagr-calculator"
    >
      <CAGRCalculatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-cagr"
          title="How it Works: The Mathematics of CAGR"
          preview="Learn the formula that smooths out the volatile returns of the stock market."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              If your investment goes up 50% one year, and down 50% the next year, you aren't back where you started. You have actually lost 25% of your money. (e.g., ₹100 &rarr; ₹150 &rarr; ₹75).
            </p>
            <p>
              This is why simply averaging the annual returns of an investment is deeply misleading. To find the true return, finance professionals use the <strong>Compound Annual Growth Rate (CAGR)</strong>.
            </p>
            <h3>The Formula</h3>
            <p>
              CAGR measures the smooth, annualized rate of return if the investment had grown at a perfectly steady rate every single year, compounding upon itself.
            </p>
            <p>
              <code>CAGR = [(Final Value / Initial Value) ^ (1 / Years)] - 1</code>
            </p>
            <ul>
              <li><strong>Final Value:</strong> The current balance of the portfolio.</li>
              <li><strong>Initial Value:</strong> The amount originally invested.</li>
              <li><strong>Exponent (1 / Years):</strong> This calculates the <em>nth root</em>, which reverses the effect of compounding over the time period.</li>
            </ul>
            <h3>Why it Matters</h3>
            <p>
              CAGR is the only accurate way to compare the performance of two different assets (like Real Estate vs a Mutual Fund) over a multi-year period because it strips out the noise of volatility.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
