import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import PPFCalculatorClient from "./PPFCalculatorClient";
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("ppf-calculator");

export default function PPFCalculatorPage() {
  return (
    <ToolShell
      title="PPF Calculator"
      description="Calculate PPF maturity amount and interest earned with annual compounding."
      category={cat}
      content={{
        detailedDescription: "The Public Provident Fund (PPF) is one of India's most popular long-term tax-saving investments. This calculator helps you estimate the maturity amount after the mandatory 15-year tenure, accounting for annual interest and maximum investment limits. It handles the specific PPF rules like annual compounding.",
        howTo: [
          "Enter your annual investment amount (Max ₹1.5 Lakh).",
          "The current PPF interest rate is usually pre-filled but can be adjusted.",
          "The tenure is fixed at 15 years by default but can be extended in blocks of 5 years.",
          "View the year-by-year balance and total interest earned."
        ],
        faq: [
          { question: "What is the maximum I can invest in PPF?", answer: "As per current Indian law, you can invest a maximum of ₹1,50,000 per financial year." },
          { question: "Is PPF interest tax-free?", answer: "Yes, PPF follows the EEE (Exempt-Exempt-Exempt) tax status, meaning the investment, interest, and maturity are all tax-exempt." }
        ],
        relatedTools: ["sip-calculator", "fd-calculator", "rd-calculator"]
      }}
    >
      <PPFCalculatorClient />
    </ToolShell>
  );
}
