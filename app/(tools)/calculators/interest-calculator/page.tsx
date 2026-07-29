import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import InterestCalculatorClientWrapper from "./InterestCalculatorClientWrapper";

export const metadata: Metadata = generateToolMetadata("interest-calculator");

// BUG-05: PascalCase — React component naming convention
export default function Page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  
  return (
    <ToolShell
      title="Interest Calculator"
      description="Calculate simple interest and total final amount on your principal investment."
      category={cat}
      toolId="interest-calculator"
    >
      <InterestCalculatorClientWrapper />

      <LearningHub title="Understanding Simple Interest">
        
        <LearningSection type="architecture" title="What is Simple Interest?">
          <p>Simple interest is calculated only on the principal amount, or on that portion of the principal amount which remains unpaid.</p>
          <p className="mt-2">Unlike <strong>Compound Interest</strong>, where you earn interest on previously accumulated interest, simple interest only pays on the original amount you deposited or borrowed.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Formula">
          <p>The standard mathematical formula for simple interest is:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>I = P * R * T / 100</code></pre>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>I:</strong> Total Interest</li>
            <li><strong>P:</strong> Principal (initial investment)</li>
            <li><strong>R:</strong> Annual interest rate (percentage)</li>
            <li><strong>T:</strong> Time (in years)</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="When is Simple Interest used?">
          <p>Simple interest is commonly used for auto loans or short-term personal loans.</p>
          <p className="mt-2">While most deposit accounts (like savings accounts) use compound interest to help your money grow faster, simple interest is simpler to calculate and understand.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary characteristic of Simple Interest compared to Compound Interest?",
                options: [
                  "Simple interest is calculated on both principal and accumulated interest.",
                  "Simple interest is calculated only on the principal amount.",
                  "Simple interest always results in a higher final amount.",
                  "Simple interest is only used for mortgages."
                ],
                correctIndex: 1,
                explanation: "Simple interest only calculates interest based on the initial deposit or loan amount."
              },
              {
                question: "If you invest ₹1000 at 5% simple interest for 2 years, what is the total interest?",
                options: [
                  "₹50",
                  "₹100",
                  "₹105",
                  "₹200"
                ],
                correctIndex: 1,
                explanation: "I = (1000 * 5 * 2) / 100 = 100"
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
