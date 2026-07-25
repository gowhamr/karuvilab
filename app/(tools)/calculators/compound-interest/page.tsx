import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import CompoundInterestClientWrapper from "./CompoundInterestClientWrapper";

export const metadata: Metadata = generateToolMetadata("compound-interest");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  
  return (
    <ToolShell
      title="Compound Interest Calculator"
      description="Calculate compounded growth on your principal investment over time."
      category={cat}
      toolId="compound-interest"
    >
      <CompoundInterestClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-compound"
          title="How it Works: The Magic of Compounding"
          preview="Learn the math behind how your money makes money on its own money."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Albert Einstein famously (and apocryphally) called compound interest the "Eighth Wonder of the World." Unlike Simple Interest, where you only earn money on your initial deposit, Compound Interest means you earn money on your deposit <em>and</em> on the interest you've already earned.
            </p>
            <h3>The Formula</h3>
            <p>
              The standard mathematical formula used in finance is:
            </p>
            <p>
              <code>A = P(1 + r/n)^(nt)</code>
            </p>
            <ul>
              <li><strong>A:</strong> Final Amount</li>
              <li><strong>P:</strong> Principal (initial investment)</li>
              <li><strong>r:</strong> Annual interest rate (decimal)</li>
              <li><strong>n:</strong> Number of times interest is compounded per year</li>
              <li><strong>t:</strong> Time (in years)</li>
            </ul>
            <h3>The Impact of Frequency</h3>
            <p>
              The variable <code>n</code> is critical. If your bank compounds <em>Annually</em>, they calculate your interest once at the end of the year. If they compound <em>Daily</em> (n = 365), they calculate a tiny fraction of your interest every single day, and add it to your balance.
            </p>
            <p>
              Because your balance is technically slightly higher every single day, you earn slightly more money tomorrow than you did today. Over 30 years, the difference between Annual compounding and Daily compounding can result in thousands of dollars in extra returns.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
