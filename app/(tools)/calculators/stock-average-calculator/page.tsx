import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import StockAverageCalculatorClientWrapper from './StockAverageCalculatorClientWrapper';

const toolId = 'stock-average-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Stock Average Calculator"
      description="Calculate the weighted average buy price of your stock holdings."
      category={cat}
      toolId={toolId}
    >
      <StockAverageCalculatorClientWrapper />

      <LearningHub title="Understanding Portfolio Averages">
        
        <LearningSection type="architecture" title="The Math of Averaging">
          <p>When you buy a stock at multiple different prices over time, your broker displays a single "Average Buy Price." But this is not a simple arithmetic mean. It is a <strong>Weighted Average</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Weighted vs Simple Average">
          <p>If you buy 10 shares at ₹100, and later buy 1000 shares at ₹50, your average price is not ₹75. Because you bought so many more shares at ₹50, the average price is pulled heavily down towards ₹50.</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>Weighted Average = Total Cost of All Shares / Total Number of Shares</code></pre>
        </LearningSection>

        <LearningSection type="failures" title="Averaging Down: A Double-Edged Sword">
          <p>When a stock you own crashes, you might be tempted to buy more at the lower price to lower your average cost. This is called "Averaging Down."</p>
          <p className="mt-2"><strong>The Mathematical Benefit:</strong> If you bought at ₹100, and it drops to ₹50, you need the stock to rally 100% just to break even. If you buy enough shares at ₹50 to bring your average down to ₹60, you now only need a 20% rally from the bottom to break even.</p>
          <p className="mt-2"><strong>The Real-World Trap:</strong> The math works perfectly, but the reality is dangerous. If the stock drops because the underlying company is fundamentally failing (a "value trap"), averaging down just means you are throwing good money after bad money. Never average down just to fix the math—only do it if the business fundamentals are still strong.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you buy 100 shares at ₹100, and later buy 100 shares at ₹50, what is your average buy price?",
                options: [
                  "₹150",
                  "₹50",
                  "₹75",
                  "₹100"
                ],
                correctIndex: 2,
                explanation: "Because you bought the exact same number of shares, the weighted average is perfectly in the middle (₹15,000 total cost / 200 shares)."
              },
              {
                question: "Why is 'Averaging Down' considered dangerous for retail investors?",
                options: [
                  "Because it is illegal.",
                  "Because if the company is actually failing, buying more shares to lower your average just increases your total losses when it hits zero.",
                  "Because brokers charge higher fees for it.",
                  "Because it increases your taxes."
                ],
                correctIndex: 1,
                explanation: "Averaging down on a bad company is known as catching a falling knife. You fix the math, but lose more capital."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
