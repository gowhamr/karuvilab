import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import MutualFundReturnsClientWrapper from './MutualFundReturnsClientWrapper';

const toolId = 'mutual-fund-returns';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Mutual Fund Returns Calculator"
      description="Calculate absolute and annualized returns for your mutual fund investments."
      category={cat}
      toolId={toolId}
    >
      <MutualFundReturnsClientWrapper />

      <LearningHub title="Understanding Investment Metrics">
        
        <LearningSection type="architecture" title="The Marketing Trick">
          <p>When a Mutual Fund house advertises that a fund has returned "150%", you need to look very closely at the fine print to see <em>how</em> they calculated that number. Are they talking about Absolute Return or Annualized Return (CAGR)?</p>
        </LearningSection>
        
        <LearningSection type="api" title="Absolute Returns">
          <p>Absolute return is simply how much money you made relative to your initial deposit, entirely ignoring the time it took to make it.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>If you invest ₹100, and it grows to ₹250, your Absolute Return is 150%.</li>
          </ul>
          <p className="mt-2">But did it take 2 years to hit ₹250? Or did it take 20 years? An absolute return of 150% sounds amazing until you realize it took 20 years to achieve, which means it actually performed worse than a standard, risk-free Fixed Deposit.</p>
        </LearningSection>

        <LearningSection type="standards" title="Annualized Returns (CAGR)">
          <p>This is why the financial industry uses Compound Annual Growth Rate (CAGR). It takes that 150% absolute return and asks, "If this had grown at a perfectly steady pace every single year, what would that yearly interest rate be?"</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>150% Absolute over <strong>5 years</strong> = ~20% CAGR (Excellent)</li>
            <li>150% Absolute over <strong>20 years</strong> = ~4.7% CAGR (Terrible)</li>
          </ul>
          <p className="mt-2">Never evaluate a long-term investment based on Absolute Returns. Always look for the CAGR to compare it fairly against other investments like FDs or Bonds.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If Fund A has an Absolute Return of 100% and Fund B has an Absolute Return of 50%, which fund is the better investment?",
                options: [
                  "Fund A is definitely better because 100% > 50%.",
                  "Fund B is definitely better.",
                  "It is impossible to know without knowing the time period over which the returns were generated.",
                  "They are mathematically the same."
                ],
                correctIndex: 2,
                explanation: "Absolute returns ignore time. If Fund A took 20 years to double and Fund B took 2 years to grow 50%, Fund B is vastly superior."
              },
              {
                question: "What does CAGR (Compound Annual Growth Rate) tell you?",
                options: [
                  "The exact amount of dividend paid each year.",
                  "The smoothed-out, theoretical annual interest rate that would take your initial deposit to your final amount.",
                  "The highest point the stock market reached during that period.",
                  "The tax rate on your mutual fund."
                ],
                correctIndex: 1,
                explanation: "CAGR smooths out volatility and gives you a single, annual percentage rate, making it easy to compare against fixed-rate investments like FDs."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
