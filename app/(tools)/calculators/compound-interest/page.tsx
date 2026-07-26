import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import CompoundInterestClientWrapper from "./CompoundInterestClientWrapper";

export const metadata: Metadata = generateToolMetadata("compound-interest");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  
  return (
    <ToolShell
      title="Compound Interest Calculator"
      description="Calculate compounded growth on your principal investment over time."
      category={cat}
      toolId="compound-interest"
    >
      <CompoundInterestClientWrapper />

      <LearningHub title="Understanding The Magic of Compounding">
        
        <LearningSection type="architecture" title="Simple vs Compound">
          <p>Albert Einstein famously (and apocryphally) called compound interest the "Eighth Wonder of the World."</p>
          <p className="mt-2">Unlike <strong>Simple Interest</strong>, where you only earn money on your initial deposit, <strong>Compound Interest</strong> means you earn money on your initial deposit <em>and</em> on the interest you have already earned. Over long periods, this creates an exponential growth curve.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Formula">
          <p>The standard mathematical formula used in finance is:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>A = P(1 + r/n)^(nt)</code></pre>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>A:</strong> Final Amount</li>
            <li><strong>P:</strong> Principal (initial investment)</li>
            <li><strong>r:</strong> Annual interest rate (decimal)</li>
            <li><strong>n:</strong> Number of times interest is compounded per year</li>
            <li><strong>t:</strong> Time (in years)</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="The Impact of Frequency">
          <p>The variable <code>n</code> (compounding frequency) is highly critical. If your bank compounds <em>Annually</em>, they calculate your interest once at the very end of the year.</p>
          <p className="mt-2">If they compound <em>Daily</em> (n = 365), they calculate a tiny fraction of your interest every single day, and immediately add it to your balance. Because your balance is technically slightly higher every single day, you earn slightly more money tomorrow than you did today. Over 30 years, the difference between Annual compounding and Daily compounding can result in thousands of dollars in extra returns for the exact same interest rate.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary difference between Simple Interest and Compound Interest?",
                options: [
                  "Simple interest is used by banks, while compound interest is used by the stock market.",
                  "Simple interest only pays on the initial principal. Compound interest pays on the principal AND the previously accumulated interest.",
                  "Simple interest is taxed at a lower rate.",
                  "Compound interest always uses a daily compounding frequency."
                ],
                correctIndex: 1,
                explanation: "Compound interest creates exponential growth because the interest you earn in Year 1 generates its own interest in Year 2."
              },
              {
                question: "Assuming the interest rate is identical, which compounding frequency will result in the most money over 10 years?",
                options: [
                  "Annually",
                  "Quarterly",
                  "Monthly",
                  "Daily"
                ],
                correctIndex: 3,
                explanation: "The more frequently interest is added to your balance, the faster that new interest can start generating its own interest."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
