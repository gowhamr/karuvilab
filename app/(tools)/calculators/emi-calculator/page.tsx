import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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
    >
      <EmiCalculatorClientWrapper />

      <LearningHub title="Understanding Bank Loans & Amortization">
        
        <LearningSection type="architecture" title="The Illusion of Fixed Payments">
          <p>When you take out a 20-year home loan, you might notice something shocking: for the first few years, your monthly payment barely reduces your principal at all. Almost the entire payment goes directly into the bank's pocket as interest.</p>
          <p className="mt-2">Banks use a mathematical formula called <strong>Equated Monthly Installment (EMI)</strong> based on a "Reducing Balance." This ensures your monthly payment amount never changes, even as the underlying math between interest and principal shifts radically over time.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Mathematics">
          <p>The standard formula for calculating a fixed EMI is:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]</code></pre>
          <p className="mt-2">Every single month, the bank calculates interest strictly on the <em>remaining principal</em>. In Month 1, your principal is at its absolute maximum, so the interest charge is massive. Because your total EMI is capped, very little money is left over from that payment to pay down the actual principal.</p>
        </LearningSection>

        <LearningSection type="performance" title="The Prepayment Hack">
          <p>Understanding this math reveals a powerful financial hack. If you make a lump sum prepayment (an extra payment outside your EMI) in Year 1, <strong>100% of that money goes directly to the principal.</strong></p>
          <p className="mt-2">By lowering the principal early, the bank's interest calculation for every subsequent month is permanently lowered. This forces a larger portion of your regular EMI to go toward the principal, creating a snowball effect that can save you massive amounts of money and cut years off your loan tenure.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "In the first year of a 20-year home loan, where does the majority of your monthly EMI payment go?",
                options: [
                  "Equally split between principal and interest.",
                  "Mostly toward paying down the principal balance.",
                  "Mostly toward paying the interest charges to the bank.",
                  "Toward property taxes."
                ],
                correctIndex: 2,
                explanation: "Because interest is calculated on the remaining balance (which is highest in Year 1), almost all of your early payments go toward interest."
              },
              {
                question: "Why is making an extra 'prepayment' early in a loan so financially powerful?",
                options: [
                  "Because it forces the bank to lower your interest rate.",
                  "Because 100% of a prepayment reduces the principal directly, which permanently lowers the interest calculated for every subsequent month.",
                  "Because prepayments are tax deductible.",
                  "It isn't powerful; banks penalize you for it."
                ],
                correctIndex: 1,
                explanation: "Prepayments bypass the interest calculation. Lowering the principal early starves the bank of the large balance they need to charge high interest in the following months."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
