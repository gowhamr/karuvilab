import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import FDCalculatorClientWrapper from "./FDCalculatorClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("fd-calculator");

export default function FDCalculatorPage() {
  return (
    <ToolShell
      title="Fixed Deposit (FD) Calculator"
      description="Calculate FD maturity amount and interest earned with flexible compounding options."
      category={cat}
      toolId="fd-calculator"
      content={{
        detailedDescription: "Fixed Deposits (FD) offer guaranteed returns over a set period. This calculator computes the maturity amount and interest earned for your FD, supporting different compounding frequencies like monthly, quarterly, semi-annual, or annual. It helps you compare different bank FD rates and tenures.",
        howTo: [
          "Enter the FD principal amount.",
          "Enter the annual interest rate.",
          "Select the tenure in days, months, or years.",
          "Choose the compounding frequency (Quarterly is most common).",
          "The tool calculates the maturity amount instantly."
        ],
        faq: [
          { question: "How does compounding frequency affect my returns?", answer: "More frequent compounding (like monthly vs. annual) results in slightly higher total interest because interest is earned on interest more often." },
          { question: "Is FD interest taxable?", answer: "Yes, FD interest is taxable as per your income tax slab, and TDS may be deducted by the bank." }
        ],
        relatedTools: ["sip-calculator", "rd-calculator", "ppf-calculator"]
      }}
    >
      <FDCalculatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-fd-compounding"
          title="How it Works: Quarterly Compounding"
          preview="Learn why banks usually quote FD rates with 'Quarterly Compounding' and what it means."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When a bank advertises a Fixed Deposit (FD) at 7% p.a., the actual return you get is often slightly higher than 7%. This is due to the magic of <strong>compounding frequency</strong>.
            </p>
            <h3>The Quarterly Standard</h3>
            <p>
              In countries like India, the RBI mandates that banks calculate and credit interest to your FD account every quarter (every 3 months), rather than just once at the end of the year.
            </p>
            <p>
              Because the interest is credited quarterly, that credited interest <em>also</em> starts earning interest for the remaining quarters of the year.
            </p>
            <h3>Effective vs Nominal Rate</h3>
            <p>
              This creates a difference between the <em>Nominal Rate</em> (the advertised 7%) and the <em>Effective Annualized Rate (EAR)</em>.
            </p>
            <p>
              <code>EAR = (1 + r/n)^n - 1</code>
            </p>
            <p>
              For a 7% FD compounded quarterly (n=4):<br/>
              <code>EAR = (1 + 0.07/4)^4 - 1 = 7.18%</code>
            </p>
            <p>
              Your actual yield over a year is 7.18%, not 7.00%. Over a 5-year or 10-year period, this tiny quarterly boost snowballs into thousands of extra rupees.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
