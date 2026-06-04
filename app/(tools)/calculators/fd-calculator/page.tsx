import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
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
    </ToolShell>
  );
}
