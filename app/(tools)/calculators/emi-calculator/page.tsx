import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import dynamic from "next/dynamic";
const EMICalculatorClient = dynamic(() => import("./EMICalculatorClient"), {
  loading: () => null,
});
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("emi-calculator");

export default function EmiCalculator() {
  return (
    <ToolShell
      title="EMI Calculator"
      description="Calculate your loan EMI, total interest, and amortization schedule."
      category={cat}
      content={{
        detailedDescription: "The EMI (Equated Monthly Installment) Calculator is an essential financial tool for anyone planning to take a loan, whether it's for a home, car, or personal needs. It provides a clear breakdown of your monthly payments, helping you understand how interest rates and loan tenures impact your financial commitment. By visualizing the total interest payable over the life of the loan and providing a year-by-year amortization schedule, this tool empowers you to make informed decisions about your borrowing capacity. You can experiment with different principal amounts and interest rates to find a repayment plan that fits your budget perfectly. The amortization table further illustrates how each payment is divided between principal repayment and interest, showing you how your loan balance decreases over time.",
        howTo: [
          "Enter the total loan amount (Principal) you wish to borrow.",
          "Input the annual interest rate offered by the lender.",
          "Specify the loan tenure in years.",
          "Instantly view your monthly EMI, total interest, and total payable amount.",
          "Toggle the 'Show Schedule' button to see a detailed annual breakdown of your payments.",
          "Use the 'Copy Summary' button to save your calculation for future reference."
        ],
        faq: [
          {
            question: "What is an EMI?",
            answer: "EMI stands for Equated Monthly Installment. It is a fixed amount of money that you pay back to a lender every month until your loan is fully repaid."
          },
          {
            question: "How does loan tenure affect my EMI?",
            answer: "A longer tenure reduces your monthly EMI but increases the total interest you pay over the life of the loan. A shorter tenure increases your EMI but saves you money on interest."
          },
          {
            question: "Can I use this for any type of loan?",
            answer: "Yes, this calculator works for home loans, car loans, personal loans, and any other reducing balance loans."
          }
        ],
        relatedTools: ["sip-calculator", "compound-interest", "salary-calculator"]
      }}
    >
      <EMICalculatorClient />
    </ToolShell>
  );
}
