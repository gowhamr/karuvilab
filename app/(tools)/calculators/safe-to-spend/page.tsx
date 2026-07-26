import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import SafeToSpendClientWrapper from './SafeToSpendClientWrapper';

const toolId = 'safe-to-spend';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Safe-to-Spend"
      description="Plan your monthly budget and find your daily/weekly spending limit."
      category={cat}
      toolId={toolId}
    >
      <SafeToSpendClientWrapper />

      <LearningHub title="Understanding Zero-Based Budgeting">
        
        <LearningSection type="architecture" title="Hopeful Budgeting">
          <p>Most people practice "Hopeful Budgeting." They get their salary, spend money throughout the month on whatever comes up, and <em>hope</em> there is some money left over at the end to save.</p>
          <p className="mt-2">This tool is built around the inverse concept: <strong>Zero-Based Budgeting (ZBB)</strong> combined with the "Pay Yourself First" principle.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The ZBB Formula">
          <p>In Zero-Based Budgeting, your income minus your expenses should exactly equal zero. Every single rupee is given a specific "job" the moment you receive it.</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Job 1 (Savings):</strong> The very first deduction is your savings target. You move this money to a different investment account immediately on payday.</li>
            <li><strong>Job 2 (Fixed Expenses):</strong> Next, you deduct all non-negotiable bills (rent, EMIs, utilities, groceries).</li>
            <li><strong>Job 3 (Guilt-Free Spending):</strong> Whatever is left over is your "Safe to Spend" number.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="The Psychological Benefit">
          <p>By calculating your Safe to Spend limit up front, you completely remove financial guilt from your daily life.</p>
          <p className="mt-2">If your daily safe-to-spend limit is ₹1,000, and you decide to buy a ₹500 coffee, you can drink it knowing with 100% certainty that your rent is paid and your long-term savings goals are already met. You don't have to track every penny or feel guilty about discretionary purchases, because you already did the math.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Under the 'Pay Yourself First' principle, when should you transfer money into your savings account?",
                options: [
                  "At the end of the month, using whatever money is left.",
                  "Whenever the stock market dips.",
                  "Immediately on payday, before paying any bills or making any purchases.",
                  "Once a year when you get a bonus."
                ],
                correctIndex: 2,
                explanation: "Paying yourself first means treating your savings target as the most important, non-negotiable 'bill' you pay each month."
              },
              {
                question: "What is the core idea of Zero-Based Budgeting?",
                options: [
                  "You must reduce your spending to zero.",
                  "You assign every single dollar a job (saving, bills, or spending) until Income minus Outgoings equals exactly zero.",
                  "You only use cash, carrying zero credit card debt.",
                  "You aim for zero inflation."
                ],
                correctIndex: 1,
                explanation: "ZBB forces you to allocate 100% of your income to a specific category upfront, preventing money from 'disappearing' on untracked expenses."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
