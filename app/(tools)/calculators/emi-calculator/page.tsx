import { Metadata } from "next";
import { CATEGORIES, ALL_TOOLS } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata, StructuredData } from "@/src/lib/seo";
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import EmiCalculatorClientWrapper from "./EmiCalculatorClientWrapper";

export const dynamic = 'force-static';

const toolId = "emi-calculator";
const cat = CATEGORIES.find((c) => c.id === "calculators")!;
const toolEntry = ALL_TOOLS.find((t) => t.id === toolId);

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

const seoContent = {
  detailedDescription: "The KaruviLab EMI Calculator is a professional loan planning suite. It provides precise calculations for Equated Monthly Installments, complete amortization schedules, and prepayment simulations. Unlike simple calculators, it allows you to compare different loan scenarios side-by-side, understand the impact of extra payments, and visually track your principal versus interest ratio over the entire loan tenure. Designed for both personal loans and mortgages, it guarantees zero data uploads and runs entirely offline in your browser for maximum privacy.",
  faq: [
    { question: "How is EMI calculated?", answer: "EMI is calculated using the formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is the principal loan amount, R is the monthly interest rate, and N is the number of monthly installments." },
    { question: "What happens when I make a prepayment?", answer: "When you make a lump sum prepayment, 100% of that amount goes directly toward reducing your outstanding principal. This permanently lowers the interest calculated for every subsequent month, allowing you to pay off the loan faster and save significant money." },
    { question: "Is my financial data uploaded to any server?", answer: "No. KaruviLab operates on a privacy-first, offline-capable architecture. All calculations are performed locally in your browser. No financial data is ever uploaded or stored on our servers." },
    { question: "Can I use this for home loans and car loans?", answer: "Yes, this EMI calculator is versatile and can be used for any fixed-rate reducing-balance loan, including home loans, car loans, and personal loans." },
    { question: "What is an amortization schedule?", answer: "An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off at the end of its term." }
  ],
  howTo: [
    "Enter your total loan amount (principal).",
    "Enter the annual interest rate offered by your bank.",
    "Specify the loan tenure in either months or years.",
    "Review the calculated EMI, total interest, and the interactive amortization chart.",
    "Optionally, add prepayment amounts to simulate how early payments reduce your loan tenure."
  ],
  useCases: [
    "Comparing multiple home loan offers.",
    "Planning early retirement by analyzing mortgage prepayment strategies.",
    "Understanding the true cost of personal loans."
  ]
};

export default function EmiCalculator() {
  return (
    <>
      <StructuredData tool={toolEntry} category={cat} content={seoContent} />
      <ToolShell
        title="Advanced EMI Calculator"
        description="Professional loan planning suite with prepayment simulators, amortization schedules, and side-by-side comparisons."
        category={cat}
        toolId={toolId}
      >
        <EmiCalculatorClientWrapper />

        <div className="mt-8 space-y-6">
          <ToolInfoSection id="emi-guide" title="Complete Guide to EMI & Loan Planning" isOpen={false} preview="Learn how to use the EMI calculator, understand amortization, and read our privacy policy.">
            <div className="space-y-6 text-text-muted prose dark:prose-invert max-w-none">
              <section>
                <h3 className="text-xl font-bold text-text-primary">Introduction to EMI Calculation</h3>
                <p>
                  Equated Monthly Installment (EMI) is the fixed payment amount made by a borrower to a lender at a specified date each calendar month. Equated monthly installments are used to pay off both interest and principal each month so that over a specified number of years, the loan is paid off in full. Our Advanced EMI Calculator goes beyond simple calculations by offering a full suite of features including dynamic amortization schedules, graphical breakdowns of principal versus interest, and most importantly, an interactive prepayment simulator. Whether you are managing a 30-year home mortgage or a 5-year personal auto loan, understanding exactly where your money goes every month is critical to financial health.
                </p>
                <p className="mt-4">
                  ✓ <strong>No Uploads:</strong> Your financial numbers remain securely on your device. <br/>
                  ✓ <strong>Browser Processing:</strong> All heavy calculations are done instantly in your browser.<br/>
                  ✓ <strong>Offline Capable:</strong> Works without an active internet connection once loaded.<br/>
                  ✓ <strong>No Account Required:</strong> Free for everyone with zero telemetry.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-text-primary">How to Use the EMI Calculator</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong>Enter Loan Details:</strong> Input your principal loan amount, the annual interest rate, and the loan tenure (in months or years).</li>
                  <li><strong>Review the Summary:</strong> The calculator will instantly display your monthly EMI, the total interest payable over the life of the loan, and the total amount you will pay to the bank.</li>
                  <li><strong>Analyze the Amortization Schedule:</strong> Check the year-by-year or month-by-month table to see exactly how much of your payment goes to interest versus reducing the principal.</li>
                  <li><strong>Simulate Prepayments:</strong> Use the advanced section to add one-time or recurring extra payments. Watch how this drastically reduces both your tenure and total interest paid.</li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-bold text-text-primary">Practical Examples</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Home Loan Comparison:</strong> Compare a ₹50,00,000 loan at 8.5% over 20 years vs 15 years to see how much interest you save by increasing your EMI slightly.</li>
                  <li><strong>Car Loan Prepayment:</strong> See the impact of paying an extra ₹50,000 yearly on a 5-year car loan, helping you become debt-free faster.</li>
                  <li><strong>Personal Loan Consolidation:</strong> Evaluate if taking a new loan at a lower interest rate to pay off high-interest debt makes mathematical sense.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-text-primary">Frequently Asked Questions</h3>
                <div className="space-y-4 mt-4">
                  {seoContent.faq.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-text-primary">{item.question}</h4>
                      <p className="mt-1">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-text-primary">Privacy Policy & Data Security</h3>
                <p>
                  At KaruviLab, we firmly believe that your financial data is your private business. This EMI Calculator is built strictly as a client-side application. When you input your loan amounts, interest rates, or personal financial goals, that data never leaves your browser. There are no server-side analytics, no saved profiles, and absolutely no telemetry tracking your numbers. All amortization schedules and projections are generated on-the-fly using your device's CPU. If you close the tab, your data is gone. We guarantee 100% data privacy because we simply do not collect it.
                </p>
              </section>
            </div>
          </ToolInfoSection>
        </div>

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
    </>
  );
}
