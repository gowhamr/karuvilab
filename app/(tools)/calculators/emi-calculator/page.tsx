import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import EmiCalculatorClientWrapper from "./EmiCalculatorClientWrapper";

const toolId = "emi-calculator";
const cat = CATEGORIES.find((c) => c.id === "calculators")!;

const EmiCalculatorClient = dynamic(() => import("@/components/tools/emi/EMICalculatorClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function EmiCalculator() {
  return (
    <ToolShell
      title="Advanced EMI Calculator"
      description="Professional loan planning suite with prepayment simulators, amortization schedules, and side-by-side comparisons."
      category={cat}
      toolId={toolId}
      content={{
        detailedDescription: "Our Advanced EMI Calculator is designed to give you total control over your financial planning. Unlike basic calculators, KaruviLab allows you to simulate real-world scenarios like interest rate fluctuations, recurring prepayments, and affordability assessments—all while keeping your data 100% private in your browser.",
        useCases: [
          "Home loan planning with prepayment simulation",
          "Car loan comparison and budget assessment",
          "Personal loan interest impact analysis",
          "Floating rate stress testing for market fluctuations",
          "Amortization schedule generation for tax planning"
        ],
        howTo: [
          "Enter your primary loan amount and preferred interest rate.",
          "Set the loan tenure (months or years).",
          "Switch to 'Comparison' mode to evaluate different lenders side-by-side.",
          "Use the 'Prepayment' tab to see how extra payments reduce your tenure.",
          "Download the full amortization schedule as CSV or PDF."
        ],
        faq: [
          {
            question: "How does interest rate delta work?",
            answer: "The Interest Rate Delta allows you to simulate what happens if the market interest rates go up or down. Since most home loans are floating rate, this helps you understand the impact on your monthly budget before it happens."
          },
          {
            question: "Is my financial data shared?",
            answer: "No. KaruviLab operates on a 'Zero-Upload' philosophy. All calculations, comparisons, and saved scenarios are stored locally in your browser's IndexedDB. We never see your data."
          },
          {
            question: "What is the Moratorium period?",
            answer: "A moratorium is a period during which you don't have to make repayments. However, interest usually continues to accrue and is added to your principal balance."
          },
          {
            question: "Can I export my amortization schedule?",
            answer: "Yes. You can download the full month-by-month breakdown as a CSV file or use the 'Print to PDF' feature for a professional report."
          }
        ],
        relatedTools: ["sip-calculator", "compound-interest", "fd-calculator"]
      }}
    >
      <EmiCalculatorClient />
    </ToolShell>
  );
}

