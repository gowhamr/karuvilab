import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import PPFCalculatorClientWrapper from './PPFCalculatorClientWrapper';

const toolId = 'ppf-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="PPF Calculator"
      description="Calculate PPF maturity amount and interest earned with annual compounding."
      category={cat}
      toolId={toolId}
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
      <PPFCalculatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-ppf-rule"
          title="How it Works: The April 5th Rule"
          preview="Learn the secret timing rule of PPF that can cost you thousands of rupees in lost interest if you ignore it."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              The Public Provident Fund (PPF) is famous for its "EEE" tax status—exempt on investment, exempt on interest, and exempt on maturity. But its interest calculation method hides a massive trap for uninformed investors.
            </p>
            <h3>The 5th of the Month Rule</h3>
            <p>
              Unlike a savings account which calculates interest based on your daily balance, PPF calculates interest based on the <strong>minimum balance in your account between the 5th and the last day of the month</strong>.
            </p>
            <p>
              This means if you deposit ₹1.5 Lakhs on the 6th of April, that money earns <strong>zero interest</strong> for the entire month of April! The government treats your balance as if the deposit never happened until May.
            </p>
            <h3>How to Maximize PPF Returns</h3>
            <p>
              Because interest is compounded annually (credited at the end of the financial year), the absolute best mathematical way to invest in PPF is to deposit your entire yearly amount (up to ₹1.5 Lakhs) <strong>between April 1st and April 5th</strong>.
            </p>
            <p>
              By doing this, your entire deposit earns interest for all 12 months of the year. Over a 15-year period, this simple timing trick results in lakhs of extra rupees compared to someone who deposits their money in March at the end of the financial year.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
