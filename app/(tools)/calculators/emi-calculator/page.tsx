import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import EmiCalculatorClientWrapper from "./EmiCalculatorClientWrapper";

export const dynamic = 'force-static';

const toolId = "emi-calculator";
const cat = CATEGORIES.find((c) => c.id === "calculators")!;

const staticMeta = generateToolMetadata(toolId);

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const p = params['p'];
  const r = params['r'];
  const n = params['n'];

  const hasSharedResult = p !== undefined || r !== undefined;

  if (hasSharedResult) {
    const principal = Array.isArray(p) ? p[0] : p;
    const rate = Array.isArray(r) ? r[0] : r;
    const months = Array.isArray(n) ? n[0] : n;

    const dynamicTitle = `EMI for ₹${Number(principal).toLocaleString('en-IN')} @ ${rate}% — KV`;
    const dynamicDesc = `Shared EMI calculation: Loan ₹${Number(principal).toLocaleString('en-IN')} at ${rate}% p.a. for ${months} months. View the full amortization on KaruviLab.`;

    return {
      ...staticMeta,
      title: dynamicTitle,
      description: dynamicDesc,
      openGraph: {
        ...(typeof staticMeta.openGraph === 'object' && !Array.isArray(staticMeta.openGraph) ? staticMeta.openGraph : {}),
        title: dynamicTitle,
        description: dynamicDesc,
      },
      twitter: {
        ...(typeof staticMeta.twitter === 'object' ? staticMeta.twitter : {}),
        title: dynamicTitle,
        description: dynamicDesc,
      },
    };
  }

  return staticMeta;
}

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
      <EmiCalculatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-amortization"
          title="How it Works: The Reducing Balance Method"
          preview="Learn why banks take most of their interest in the first few years of your loan."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you take out a 20-year home loan, you might notice something shocking: for the first few years, your monthly payment barely reduces your principal at all. Almost the entire payment goes toward interest. Why?
            </p>
            <h3>The Mathematics of EMI</h3>
            <p>
              Banks use a formula called <strong>Equated Monthly Installment (EMI)</strong> based on a "Reducing Balance." This ensures your monthly payment amount never changes, even as the underlying math shifts radically.
            </p>
            <p>
              <code>EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]</code>
            </p>
            <p>
              Every month, the bank calculates interest strictly on the <em>remaining principal</em>. In Month 1, your principal is at its maximum, so the interest charge is massive. Because your total EMI is fixed, very little money is left over to pay down the actual principal.
            </p>
            <h3>The Prepayment Hack</h3>
            <p>
              Understanding this reveals a powerful financial hack. If you make a lump sum prepayment in Year 1, 100% of that money goes directly to the principal. By lowering the principal early, the bank's interest calculation for every subsequent month is permanently lowered, saving you massive amounts of money and cutting years off your loan tenure.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
