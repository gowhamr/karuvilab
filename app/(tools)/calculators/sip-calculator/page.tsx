import { Metadata } from 'next';
import { CATEGORIES, ALL_TOOLS } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata, StructuredData } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import SIPCalculatorClientWrapper from './SIPCalculatorClientWrapper';

const toolId = 'sip-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');
const toolEntry = ALL_TOOLS.find((t) => t.id === toolId);

export const metadata: Metadata = generateToolMetadata(toolId);

const seoContent = {
  detailedDescription: "The KaruviLab SIP (Systematic Investment Plan) Calculator is an advanced wealth-building tool designed to project mutual fund returns. It goes beyond simple flat calculations by supporting annual Step-Up (increasing investments), lump sum additions, and inflation-adjusted real returns. Whether you are planning for retirement, a child's education, or financial independence, this calculator provides detailed year-by-year growth trajectories, visual compounding graphs, and actionable insights. Built with privacy-first architecture, it processes all financial projections completely offline in your browser, ensuring your data never touches a server.",
  faq: [
    { question: "What is a Systematic Investment Plan (SIP)?", answer: "An SIP is a method of investing a fixed amount of money at regular intervals (usually monthly) into a mutual fund. It allows investors to build wealth predictably over time and take advantage of rupee-cost averaging." },
    { question: "What is a Step-Up SIP?", answer: "A Step-Up SIP allows you to automatically increase your monthly investment amount by a specific percentage every year. This aligns your investments with your annual salary increments, drastically compounding your final corpus." },
    { question: "How does inflation affect my SIP returns?", answer: "Inflation reduces the purchasing power of your money over time. If your SIP grows to ₹1 Crore in 20 years, inflation means that ₹1 Crore will buy significantly less than it does today. Our calculator can adjust your final corpus for inflation to show its 'real' value in today's terms." },
    { question: "Is my investment data uploaded to KaruviLab?", answer: "No. KaruviLab is a privacy-first platform. All calculations are executed securely on your device. Your financial goals and inputs are never uploaded or tracked." },
    { question: "What return rate should I expect?", answer: "Historically, equity mutual funds in India have delivered around 10-12% annualized returns over long periods (10+ years). However, returns are never guaranteed and fluctuate based on market conditions." }
  ],
  howTo: [
    "Enter your starting monthly investment amount.",
    "Input your expected annual rate of return (e.g., 12% for aggressive equity, 8% for balanced funds).",
    "Specify the investment duration in years.",
    "Optionally, enable the 'Step-Up' feature to increase your SIP amount yearly as your income grows.",
    "Review the projected maturity amount, total wealth gained, and year-by-year compounding chart."
  ],
  useCases: [
    "Planning for early retirement using equity mutual funds.",
    "Calculating the future value of a child's education fund.",
    "Understanding the mathematical impact of increasing your SIP by just 10% annually."
  ]
};

export default function Page() {
  return (
    <>
      <StructuredData tool={toolEntry} category={cat} content={seoContent} />
      <ToolShell 
        title="SIP Calculator"
        description="Project your mutual fund SIP returns with step-up, lumpsum, and custom adjustments."
        category={cat}
        toolId={toolId}
      >
        <SIPCalculatorClientWrapper />

        <div className="mt-8 space-y-6">
          <ToolInfoSection id="sip-guide" title="Complete Guide to Systematic Investment Plans" isOpen={false} preview="Learn how SIPs compound wealth, the power of Step-Up investing, and our privacy policy.">
            <div className="space-y-6 text-text-muted prose dark:prose-invert max-w-none">
              <section>
                <h3 className="text-xl font-bold text-text-primary">Introduction to SIP Compounding</h3>
                <p>
                  A Systematic Investment Plan (SIP) is arguably the most powerful wealth-creation tool available to the retail investor. By investing a fixed amount of money every month into mutual funds or index funds, you automatically buy more units when markets are low and fewer units when markets are high (rupee-cost averaging). Over long periods—typically 10 to 20 years—the magic of compound interest takes over. Our SIP Calculator is designed to visualize this compounding curve. We support advanced features like "Step-Up SIPs," which allow you to model what happens if you increase your investment amount every year in line with your salary raises.
                </p>
                <p className="mt-4">
                  ✓ <strong>No Uploads:</strong> Your investment plans remain securely on your device. <br/>
                  ✓ <strong>Browser Processing:</strong> All heavy calculations run instantly in your browser.<br/>
                  ✓ <strong>Offline Capable:</strong> Works without an active internet connection once loaded.<br/>
                  ✓ <strong>No Account Required:</strong> Free for everyone with zero telemetry.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-text-primary">How to Use the SIP Calculator</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong>Basic Inputs:</strong> Enter your monthly investment amount, the expected annual return rate, and how many years you plan to invest.</li>
                  <li><strong>Enable Step-Up (Highly Recommended):</strong> Toggle the Step-Up option and set an annual increase percentage (e.g., 10%). This models your investments growing alongside your career.</li>
                  <li><strong>Review the Chart:</strong> Watch the graph to see exactly when the "hockey stick" compounding effect kicks in—usually after year 7 or 8.</li>
                  <li><strong>Factor in Inflation:</strong> Use the advanced settings to adjust your final corpus for inflation, giving you a realistic picture of your future purchasing power.</li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-bold text-text-primary">Practical Examples</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>The Cost of Delay:</strong> Compare starting a ₹10,000 SIP at age 25 vs age 35 to see how a 10-year delay can cost you over ₹1 Crore in final wealth.</li>
                  <li><strong>The Power of Step-Up:</strong> Compare a flat ₹20,000 SIP for 20 years against a ₹20,000 SIP that increases by 10% annually. The Step-Up method often doubles the final corpus.</li>
                  <li><strong>Retirement Planning:</strong> Calculate exactly how much you need to invest monthly to reach a ₹5 Crore target by age 50.</li>
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
                  Your financial roadmap is strictly confidential. This SIP Calculator operates entirely as a local web application. When you input your savings rate, expected returns, and target corpus, all computations happen directly on your own device's processor. KaruviLab does not upload, log, or track your inputs. There are no tracking cookies profiling your wealth bracket. When you close the tab, the numbers disappear. We guarantee absolute data privacy because the data never reaches our servers in the first place.
                </p>
              </section>
            </div>
          </ToolInfoSection>
        </div>

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
    </>
  );
}
