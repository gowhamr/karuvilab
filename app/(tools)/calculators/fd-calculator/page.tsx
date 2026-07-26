import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import FDCalculatorClientWrapper from "./FDCalculatorClientWrapper";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("fd-calculator");

export default function FDCalculatorPage() {
  return (
    <ToolShell
      title="Fixed Deposit (FD) Calculator"
      description="Calculate FD maturity amount and interest earned with flexible compounding options."
      category={cat}
      toolId="fd-calculator"
    >
      <FDCalculatorClientWrapper />

      <LearningHub title="Understanding Fixed Deposits & Compounding">
        
        <LearningSection type="architecture" title="The Compounding Magic">
          <p>When a bank advertises a Fixed Deposit (FD) at 7% p.a., the actual return you get is often slightly higher than 7%. This is due to the magic of <strong>compounding frequency</strong>.</p>
        </LearningSection>
        
        <LearningSection type="standards" title="The Quarterly Standard">
          <p>In countries like India, the RBI mandates that banks calculate and credit interest to your FD account every quarter (every 3 months), rather than just once at the absolute end of the year.</p>
          <p className="mt-2">Because the interest is credited quarterly, that credited interest <em>also</em> starts earning its own interest for the remaining quarters of the year. This snowball effect means your money grows slightly faster than simple interest.</p>
        </LearningSection>

        <LearningSection type="api" title="Effective vs Nominal Rate">
          <p>This creates a difference between the <em>Nominal Rate</em> (the advertised 7%) and the <em>Effective Annualized Rate (EAR)</em>.</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>EAR = (1 + r/n)^n - 1</code></pre>
          <p className="mt-2">For a 7% FD compounded quarterly (n=4):</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>EAR = (1 + 0.07/4)^4 - 1 = 7.18%</code></pre>
          <p className="mt-2">Your actual yield over a single year is 7.18%, not 7.00%. Over a 5-year or 10-year period, this tiny quarterly boost snowballs into thousands of extra rupees.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If a bank offers an FD at 7% 'Compounded Quarterly', what does that actually mean?",
                options: [
                  "You can only withdraw your money once a quarter.",
                  "The bank calculates and credits your interest every 3 months, allowing that new interest to earn interest of its own for the rest of the year.",
                  "You only earn interest for a quarter of the year.",
                  "The interest rate changes every quarter based on RBI guidelines."
                ],
                correctIndex: 1,
                explanation: "Quarterly compounding means interest is added to your principal four times a year, causing a snowball effect on your returns."
              },
              {
                question: "Which compounding frequency will yield the highest maturity amount for a given interest rate?",
                options: [
                  "Annual",
                  "Semi-Annual",
                  "Quarterly",
                  "Monthly"
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
