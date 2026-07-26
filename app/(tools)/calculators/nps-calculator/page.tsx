import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import NpsCalculatorWrapper from './NpsCalculatorWrapper';

const toolId = 'nps-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="NPS Calculator"
      description="Calculate National Pension System returns."
      category={cat}
      toolId={toolId}
    >
      <NpsCalculatorWrapper />

      <LearningHub title="Understanding The National Pension System">
        
        <LearningSection type="architecture" title="The Liquidity Tradeoff">
          <p>The National Pension System (NPS) is a voluntary retirement scheme regulated by the PFRDA in India. It offers excellent, exclusive tax benefits under Section 80C and Section 80CCD(1B), but these benefits come with strict liquidity constraints.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The 60/40 Rule at Maturity">
          <p>When you reach age 60, your NPS account finally matures. However, you <strong>cannot</strong> withdraw your entire accumulated corpus as a lump sum to use however you want.</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>60% Lump Sum:</strong> You are legally allowed to withdraw up to 60% of your total corpus completely tax-free.</li>
            <li><strong>40% Annuity:</strong> You are legally mandated to use the remaining 40% (minimum) to purchase an Annuity plan from a PFRDA-registered life insurance company.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="What is an Annuity?">
          <p>An annuity is a financial product that pays you a fixed, regular pension for the rest of your life. When you purchase the annuity with 40% of your NPS corpus, that lump sum money is effectively gone—you hand it over to the insurance company forever, and in return, they guarantee you a monthly payout.</p>
          <p className="mt-2">It is critical to note that the pension you receive from this annuity is treated as regular income and is <strong>fully taxable</strong> according to your applicable income tax slab in retirement.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the maximum percentage of your NPS corpus you can withdraw as a tax-free lump sum at age 60?",
                options: [
                  "100%",
                  "80%",
                  "60%",
                  "40%"
                ],
                correctIndex: 2,
                explanation: "The PFRDA rules allow a maximum 60% tax-free lump sum withdrawal at age 60."
              },
              {
                question: "What happens to the remaining 40% of your NPS corpus?",
                options: [
                  "It is kept in the stock market to grow tax-free.",
                  "It is given to the government as a maturity tax.",
                  "You must use it to buy a house.",
                  "You are forced to buy an Annuity, which pays you a taxable monthly pension."
                ],
                correctIndex: 3,
                explanation: "The core purpose of the NPS is to provide a pension, so the law forces you to convert at least 40% of your savings into a lifetime annuity."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
