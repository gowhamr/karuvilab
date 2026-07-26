import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import RetirementCalculatorClientWrapper from './RetirementCalculatorClientWrapper';

const toolId = 'retirement-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Retirement Planner"
      description="Estimate the corpus required to maintain your lifestyle after retirement."
      category={cat}
      toolId={toolId}
    >
      <RetirementCalculatorClientWrapper />

      <LearningHub title="Understanding Retirement Mathematics">
        
        <LearningSection type="architecture" title="The Two Phases">
          <p>Retirement planning is mathematically fascinating because it requires you to balance two opposing forces over extremely long time horizons: Wealth Accumulation vs. Wealth Depletion.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Phase 1: Accumulation">
          <p>During your working years, you are fighting to outpace inflation. If your expenses are ₹50,000/month today, and inflation is 6%, those exact same expenses will cost over ₹1.6 Lakhs/month in 20 years. Your investments must grow significantly faster than this inflation rate to actually build a surplus corpus.</p>
        </LearningSection>

        <LearningSection type="failures" title="Phase 2: Depletion (The Real Challenge)">
          <p>The hardest math in retirement isn't hitting your target number; it's surviving Phase 2. Once you retire, you stop adding new money to the pile, but inflation <em>keeps going</em>.</p>
          <p className="mt-2">This creates the need for <strong>Inflation-Adjusted Withdrawals</strong>. If you retire with ₹5 Crores and withdraw ₹10 Lakhs in Year 1, you cannot just withdraw ₹10 Lakhs in Year 2. Because of 6% inflation, you must withdraw ₹10.6 Lakhs in Year 2, and ₹11.2 Lakhs in Year 3 just to buy the exact same amount of groceries.</p>
          <p className="mt-2">If your retirement corpus is invested entirely in safe, low-yielding assets (like a 6% FD) while inflation is also 6%, your <strong>Real Return</strong> is exactly 0%. Because your withdrawals keep increasing every year while your real return is 0%, you will drain your corpus dangerously fast. This is why modern financial advisors recommend keeping a portion of your retirement corpus in growth assets (like equities) even <em>after</em> you retire.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is an inflation rate of 6% particularly dangerous during the 'Depletion Phase' of retirement?",
                options: [
                  "Because it forces you to increase your withdrawal amount every single year just to maintain your standard of living, accelerating the drain on your corpus.",
                  "Because the bank will charge you 6% more for keeping the money.",
                  "Because stock market returns are capped at 6% during retirement.",
                  "It isn't dangerous if you have a Fixed Deposit."
                ],
                correctIndex: 0,
                explanation: "Even if you retire with a massive corpus, compounding inflation means your yearly expenses will skyrocket in the later years of your retirement."
              },
              {
                question: "If inflation is 7% and your retirement corpus is invested in a bond yielding 7%, what is your 'Real Return'?",
                options: [
                  "14%",
                  "7%",
                  "0%",
                  "It depends on your tax bracket."
                ],
                correctIndex: 2,
                explanation: "Real Return is your Nominal Return minus Inflation (7% - 7% = 0%). Your money is not growing in purchasing power; it is merely treading water."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
