import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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
      content={{
        detailedDescription: "Estimate the growth of your mutual fund investments based on past performance or expected returns. This tool calculates both absolute returns (total gain/loss) and CAGR (annualized returns), helping you understand how your wealth might grow over time. It supports both SIP and lumpsum inputs.",
        howTo: [
          "Enter the initial investment amount or monthly SIP.",
          "Set the expected annual return rate based on historical data.",
          "Select the investment duration in years.",
          "The tool will instantly show the estimated future value and total gains."
        ],
        faq: [
          { question: "What is the difference between absolute and annualized returns?", answer: "Absolute return is the total percentage gain over the entire period, while annualized return (CAGR) is the geometric mean of the return per year." },
          { question: "Does this tool use real-time market data?", answer: "No, it uses assumed return rates for projections. Actual mutual fund performance depends on market conditions." }
        ],
        relatedTools: ["sip-calculator", "lumpsum-calculator", "cagr-calculator"]
      }}
    >
      <MutualFundReturnsClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-fund-returns"
          title="How it Works: Absolute vs. Annualized Returns"
          preview="Learn why brokers sometimes advertise massive returns that are actually mathematically tiny."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When a Mutual Fund house advertises that a fund has returned "150%", you need to look at the fine print to see <em>how</em> they calculated that number. Are they talking about Absolute Return or Annualized Return (CAGR)?
            </p>
            <h3>Absolute Returns</h3>
            <p>
              Absolute return is simply how much money you made relative to your initial deposit, entirely ignoring time.
            </p>
            <p>
              If you invest ₹100, and it grows to ₹250, your Absolute Return is 150%.
            </p>
            <p>
              But did it take 2 years to hit ₹250? Or did it take 20 years? An absolute return of 150% sounds amazing until you realize it took 20 years to achieve, which means it actually performed worse than a standard Fixed Deposit.
            </p>
            <h3>Annualized Returns (CAGR)</h3>
            <p>
              This is why the financial industry uses Compound Annual Growth Rate (CAGR). It takes that 150% absolute return and asks, "If this had grown at a perfectly steady pace every single year, what would that yearly interest rate be?"
            </p>
            <ul>
              <li>150% Absolute over <strong>5 years</strong> = ~20% CAGR (Excellent)</li>
              <li>150% Absolute over <strong>20 years</strong> = ~4.7% CAGR (Terrible)</li>
            </ul>
            <p>
              Never evaluate a long-term investment based on Absolute Returns. Always look for the CAGR.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
