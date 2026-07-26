import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import FinancialFreedomCalculatorClientWrapper from "./FinancialFreedomCalculatorClientWrapper";

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
    >
      <FinancialFreedomCalculatorClientWrapper />

      <LearningHub title="Understanding The FIRE Movement">
        
        <LearningSection type="architecture" title="The 4% Rule">
          <p>How do you know when you have enough money to stop working forever? The most famous mathematical benchmark in the Financial Independence, Retire Early (FIRE) movement is the <strong>4% Rule</strong>.</p>
        </LearningSection>
        
        <LearningSection type="standards" title="The Trinity Study">
          <p>In 1998, three professors at Trinity University published a study looking at historical stock and bond returns. They wanted to find a "Safe Withdrawal Rate"—the maximum percentage of a portfolio you could withdraw in Year 1 (and adjust for inflation every subsequent year) without running out of money over a 30-year retirement.</p>
          <p className="mt-2">They found that a portfolio invested heavily in equities had a near 100% success rate if the retiree withdrew exactly 4% in the first year.</p>
        </LearningSection>

        <LearningSection type="api" title="Calculating Your Target">
          <p>Because of the 4% rule, finding your required retirement corpus is incredibly simple. You just multiply your annual expenses by 25.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>If you need ₹12 Lakhs per year to live comfortably:</li>
            <li><code>₹12,00,000 * 25 = ₹3,00,00,000 (3 Crores)</code></li>
          </ul>
          <p className="mt-2">Why 25? Because <code>100 / 4 = 25</code>. If you have 25 times your annual expenses invested, you can safely withdraw 4% of that total amount every single year.</p>
        </LearningSection>

        <LearningSection type="failures" title="Is it 100% Safe?">
          <p>The original 4% rule assumes a 30-year retirement and historical US market data. For a much longer early retirement (e.g., a 50-year retirement starting at age 35), many modern financial advisors recommend a more conservative 3% to 3.5% withdrawal rate.</p>
          <p className="mt-2">A 3% safe withdrawal rate means multiplying your annual expenses by 33.3 instead of 25 to find your target corpus.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "According to the Trinity Study (4% Rule), how do you calculate your target retirement corpus?",
                options: [
                  "Multiply your annual salary by 10.",
                  "Multiply your annual living expenses by 25.",
                  "Save exactly $1 Million.",
                  "Save until you reach age 65."
                ],
                correctIndex: 1,
                explanation: "Because 100 / 4 = 25, saving 25 times your annual expenses allows you to withdraw 4% of that total amount every year."
              },
              {
                question: "Why might an early retiree want to use a 3% rule instead of the traditional 4% rule?",
                options: [
                  "Because taxes are higher for early retirees.",
                  "Because they will need their money to last much longer than the 30-year period assumed in the original Trinity Study.",
                  "Because the stock market no longer returns 4%.",
                  "Because Social Security pays less if you retire early."
                ],
                correctIndex: 1,
                explanation: "The Trinity Study defined success as not running out of money over 30 years. If you retire at 35, your money might need to last 55 years, requiring a more conservative withdrawal rate."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
