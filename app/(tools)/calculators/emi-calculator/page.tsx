import { Metadata } from "next";
import Script from "next/script";
import EmiCalculatorClientWrapper from "./EmiCalculatorClientWrapper";

export const metadata: Metadata = {
  title: "Advanced EMI Calculator – Home, Car, Personal Loan | Free & Offline | KV",
  description: "Calculate loan EMIs, generate amortization schedules, compare scenarios, and test floating rate impact. Includes prepayment simulator & PDF export. Fully offline, zero data upload. Privacy-first.",
  keywords: ["emi calculator", "loan calculator", "amortization schedule", "prepayment simulator", "home loan emi", "car loan emi"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Advanced EMI Calculator",
  "description": "Free offline EMI calculator with prepayment, comparison, amortization schedule, and PDF export.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0" },
  "featureList": [
    "Prepayment Simulator",
    "Amortisation Schedule",
    "PDF Export",
    "Side-by-Side Comparison",
    "Floating Rate Stress Test",
    "Moratorium Support"
  ]
};

export default function EmiCalculator() {
  return (
    <>
      <Script
        id="emi-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <EmiCalculatorClientWrapper />

      {/* SEO Content Section (Server Rendered) */}
      <section className="mt-20 max-w-4xl mx-auto px-6 space-y-12 pb-20">
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight">Understanding Your Loan with KaruviLab</h2>
          <p className="text-text-3 leading-relaxed">
            Our Advanced EMI Calculator is designed to give you total control over your financial planning. Unlike basic calculators, KaruviLab allows you to simulate real-world scenarios like interest rate fluctuations, recurring prepayments, and affordability assessments—all while keeping your data 100% private in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-black">What is an EMI?</h3>
            <p className="text-sm text-text-3 leading-relaxed">
              EMI stands for Equated Monthly Installment. It is the fixed amount you pay to your lender every month. Each payment consists of two parts: the interest on the outstanding loan amount and a portion of the principal. Over time, the interest component decreases while the principal component increases.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-black">The Power of Prepayment</h3>
            <p className="text-sm text-text-3 leading-relaxed">
              Making even small prepayments can dramatically reduce your total interest burden and tenure. For example, paying just 5% extra every month can often reduce a 20-year home loan by 3-4 years. Use our Prepayment Simulator to see your exact savings.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-black">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 gap-6">
            <FAQItem 
              q="How does interest rate delta work?"
              a="The Interest Rate Delta (Floating Rate Stress Test) allows you to simulate what happens if the market interest rates go up or down. Since most home loans are floating rate, this helps you understand the impact on your monthly budget before it happens."
            />
            <FAQItem 
              q="Is my financial data shared?"
              a="No. KaruviLab operates on a 'Zero-Upload' philosophy. All calculations, comparisons, and saved scenarios are stored locally in your browser's IndexedDB. We never see your data."
            />
            <FAQItem 
              q="What is the Moratorium period?"
              a="A moratorium is a period during which you don't have to make repayments. However, interest usually continues to accrue and is added to your principal balance. Our calculator supports both 'Interest Only' and 'Full Moratorium' modes."
            />
            <FAQItem 
              q="Can I export my amortization schedule?"
              a="Yes. You can download the full month-by-month breakdown as a CSV file for Excel or use the 'Print to PDF' feature for a professional financial report."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="p-6 bg-surface border border-border rounded-2xl space-y-3">
      <h4 className="font-black text-text">{q}</h4>
      <p className="text-sm text-text-3 leading-relaxed">{a}</p>
    </div>
  );
}

