import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import CAGRCalculatorClientWrapper from "./CAGRCalculatorClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

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

      <LearningHub title="Understanding the Mathematics of Returns">
        
        <LearningSection type="architecture" title="The Problem with Averages">
          <p>Imagine you invest ₹100. In Year 1, the market booms and your investment goes up 50% (to ₹150). In Year 2, the market crashes and goes down 50% (to ₹75).</p>
          <p className="mt-2">What was your average return? If you simply average the percentages: <code>(+50% + -50%) / 2 = 0%</code>. But a 0% return implies you should still have ₹100! Instead, you have ₹75, which means you've actually lost 25% of your money. This mathematical illusion is why simple averages are useless for evaluating volatile investments.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The CAGR Solution">
          <p>To find the true return, finance professionals use the <strong>Compound Annual Growth Rate (CAGR)</strong>. CAGR measures the smooth, annualized rate of return as if the investment had grown at a perfectly steady rate every single year, compounding upon itself.</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>CAGR = [(Final Value / Initial Value) ^ (1 / Years)] - 1</code></pre>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Final / Initial Value:</strong> The total growth multiplier.</li>
            <li><strong>Exponent (1 / Years):</strong> This calculates the <em>nth root</em>, which perfectly reverses the geometric effect of compounding over the time period.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="When to Use It">
          <p>CAGR is the only accurate way to compare the performance of two entirely different assets—like a Real Estate property you held for 10 years versus a Mutual Fund you held for 3 years. By converting chaotic, multi-year price swings into a single annualized metric, you can make apples-to-apples comparisons of capital efficiency.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is a simple average of annual returns misleading for investments?",
                options: [
                  "Because it does not account for inflation.",
                  "Because it ignores the effect of compounding, making losses appear less severe than they mathematically are.",
                  "Because tax rates change every year.",
                  "Because stock markets only trade on weekdays."
                ],
                correctIndex: 1,
                explanation: "A 50% loss requires a 100% gain just to break even. Simple arithmetic averages ignore this geometric reality, whereas CAGR calculates the true compound effect."
              },
              {
                question: "If an investment grows from ₹100 to ₹200 over 5 years, how does the CAGR formula isolate the annual growth?",
                options: [
                  "By dividing the ₹100 profit by 5.",
                  "By taking the 5th root (exponent 1/5) of the total growth multiplier to reverse the compounding effect.",
                  "By adding the interest rates published by the central bank.",
                  "By multiplying the initial value by the number of years."
                ],
                correctIndex: 1,
                explanation: "Because compounding works by multiplying (x^5), we must use the nth root (x^(1/5)) to find the underlying annual rate that caused the growth."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
