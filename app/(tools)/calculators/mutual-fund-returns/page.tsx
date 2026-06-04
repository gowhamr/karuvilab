import MutualFundReturnsClientWrapper from "./MutualFundReturnsClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("mutual-fund-returns");

export default function MutualFundReturnsPage() {
  return (
    <ToolShell
      title="Mutual Fund Returns Calculator"
      description="Calculate absolute and annualized returns for your mutual fund investments."
      category={cat}
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
    </ToolShell>
  );
}
