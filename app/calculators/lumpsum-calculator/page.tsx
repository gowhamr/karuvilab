import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import LumpsumCalculatorClient from "./LumpsumCalculatorClient";
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("lumpsum-calculator");

export default function LumpsumCalculatorPage() {
  return (
    <ToolShell
      title="Lumpsum Calculator"
      description="Calculate the future value of a one-time investment with compounding."
      category={cat}
      content={{
        detailedDescription: "Calculate the future value of a one-time investment using the power of compounding. This tool is perfect for seeing how a single deposit grows over several years at a fixed interest rate. It's ideal for planning fixed deposits or one-time mutual fund investments.",
        howTo: [
          "Enter the one-time investment amount.",
          "Enter the expected annual interest/return rate.",
          "Enter the number of years you plan to stay invested.",
          "The tool displays the total maturity value and total interest earned."
        ],
        faq: [
          { question: "What formula is used for lumpsum calculations?", answer: "FV = PV × (1 + r)^n, where FV is future value, PV is principal, r is annual interest rate, and n is number of years." },
          { question: "Is compounding annual?", answer: "Yes, this standard lumpsum calculator assumes annual compounding." }
        ],
        relatedTools: ["sip-calculator", "mutual-fund-returns", "compound-interest"]
      }}
    >
      <LumpsumCalculatorClient />
    </ToolShell>
  );
}
