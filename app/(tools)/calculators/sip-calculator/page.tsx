import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import SIPCalculatorClientWrapper from './SIPCalculatorClientWrapper';

const toolId = 'sip-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="SIP Calculator"
      description="Project your mutual fund SIP returns with step-up, lumpsum, and custom adjustments."
      category={cat}
      toolId={toolId}
    >
      <SIPCalculatorClientWrapper />

      <LearningHub title="Understanding Systematic Investment Plans">
        
        <LearningSection type="architecture" title="The Problem with Flat SIPs">
          <p>When planning a Systematic Investment Plan (SIP), most people pick a flat number—like ₹10,000 a month—and leave it running for 20 years. While this builds wealth, it completely ignores <strong>income growth</strong>.</p>
          <p className="mt-2">If your salary increases by 10% every year, but your investments stay flat at ₹10,000, your savings rate is actually dropping in real terms. You are saving a smaller and smaller percentage of your total income each year.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Step-Up Multiplier">
          <p>A Step-Up SIP fixes this problem by automatically increasing your monthly investment by a fixed percentage (e.g., 10%) at the end of every year.</p>
          <p className="mt-2">Because compounding favors early and consistently growing capital, stepping up your SIP drastically changes the math of the future value formula:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Flat SIP:</strong> ₹10,000/month for 20 years at 12% = ~₹1 Crore.</li>
            <li><strong>10% Step-Up SIP:</strong> ₹10,000/month (increased by 10% yearly) for 20 years at 12% = ~₹2 Crores.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="The Painless Wealth Hack">
          <p>By matching your investment growth to your salary growth, you literally double your final corpus. More importantly, it is mathematically painless because you are only investing the extra money <em>after</em> you get a raise. Your take-home pay still goes up, you just ensure a portion of that raise automatically goes to your future self.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is a 'Step-Up SIP'?",
                options: [
                  "An SIP that invests in high-risk stocks.",
                  "An SIP where the monthly investment amount automatically increases by a set percentage each year.",
                  "An SIP that guarantees a higher interest rate.",
                  "An SIP where you pay all the money upfront."
                ],
                correctIndex: 1,
                explanation: "A Step-Up SIP automatically scales your investments alongside your expected salary bumps."
              },
              {
                question: "Why is a flat SIP (never increasing the amount) dangerous over a 20-year period?",
                options: [
                  "Because the bank will close the account.",
                  "Because stock markets only go down.",
                  "Because as your income and inflation grow, a flat SIP means you are actually saving a smaller percentage of your real wealth over time.",
                  "It is illegal."
                ],
                correctIndex: 2,
                explanation: "If your salary doubles but your SIP stays at ₹10,000, your effective savings rate has been cut in half."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
