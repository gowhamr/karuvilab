import { ToolContent } from '../../registry/types';

export const financialFreedomCalculator: ToolContent = {
  detailedDescription: `
<p>The KaruviLab Financial Freedom (FIRE) Calculator is a deterministic wealth projection model designed to compute your financial independence number, required monthly Systematic Investment Plan (SIP), and portfolio accumulation trajectory. Executing entirely client-side with zero telemetry, it accounts for safe withdrawal rates (such as the 4% Trinity Study rule) and compounded inflation.</p>

<p>Achieving financial independence requires balancing several dynamic economic parameters:</p>
<ul>
  <li><strong>Inflation-Adjusted Living Expenses:</strong> Projects your current monthly expenditure to your target retirement age using compounding annual inflation.</li>
  <li><strong>Target FIRE Corpus:</strong> Computes the total required nest egg based on your chosen safe withdrawal rate ($\text{Target Corpus} = \text{Annual Future Expenses} / \text{Withdrawal Rate}$).</li>
  <li><strong>Required Monthly SIP:</strong> Derives the exact monthly savings necessary using future-value annuity formulas to bridge the gap between your existing portfolio and target corpus.</li>
  <li><strong>Projected Freedom Age:</strong> Identifies the exact chronological age when your compounded portfolio will surpass your inflation-adjusted FIRE requirement under your current monthly savings rate.</li>
</ul>

<p>All calculations are performed locally in your browser memory. Your personal financial numbers, incomes, and savings balances never leave your device.</p>
`,
  howTo: [
    "<strong>Enter Current & Target Age:</strong> Specify your current age and desired retirement milestone.",
    "<strong>Input Income & Expenses:</strong> Enter your monthly living expenses and current discretionary income.",
    "<strong>Specify Existing Corpus & SIP:</strong> Input your current accumulated portfolio balance and ongoing monthly investments.",
    "<strong>Adjust Returns & Inflation:</strong> Fine-tune your expected portfolio CAGR (e.g. 12%), inflation rate (e.g. 6%), and safe withdrawal rate (e.g. 4%).",
  ],
  faq: [
    {
      question: "What is the 4% Safe Withdrawal Rule?",
      answer: "Originating from the Trinity Study, the 4% rule suggests that withdrawing 4% of your initial retirement portfolio (adjusted annually for inflation) historically maintains portfolio longevity over a 30-year retirement.",
    },
    {
      question: "How does inflation affect the target corpus?",
      answer: "As living costs increase with inflation, the future purchasing power of money decreases. The calculator compounds your monthly expenses at your designated inflation rate until your retirement age, ensuring your FIRE target reflects real future costs.",
    },
    {
      question: "What is the difference between Lean FIRE and Fat FIRE?",
      answer: "Lean FIRE focuses on covering essential living expenses with minimal budget headroom, while Fat FIRE targets an abundant retirement lifestyle accommodating higher discretionary spending and luxury travel.",
    },
    {
      question: "How is the required monthly SIP calculated?",
      answer: "The required SIP uses the Future Value of Annuity formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r), accounting for monthly compounding and current initial principal growth.",
    },
    {
      question: "Are my income and investment inputs stored anywhere?",
      answer: "No. All computations occur client-side in the browser. Zero financial data is ever stored, tracked, or sent across the network.",
    },
  ],
  useCases: [
    "Planning early retirement and financial independence (FIRE) milestones.",
    "Determining monthly mutual fund or ETF SIP targets for retirement.",
    "Stress-testing retirement plans against high-inflation scenarios.",
    "Comparing career growth scenarios with increased monthly savings rates.",
  ],
  examples: [
    {
      input: "Age: 25 -> 45 | Monthly Expenses: ₹50,000 | Returns: 12% | Inflation: 6%",
      output: "Target Corpus: ₹4.8 Cr | Required Monthly SIP: ₹29,200",
      description: "Standard 20-year wealth accumulation scenario."
    },
    {
      input: "Age: 30 -> 40 | Monthly Expenses: ₹30,000 | Returns: 12% | Inflation: 5%",
      output: "Target Corpus: ₹1.47 Cr | Required Monthly SIP: ₹47,800",
      description: "Aggressive 10-year Lean FIRE plan."
    },
    {
      input: "Age: 28 -> 50 | Monthly Expenses: ₹80,000 | Returns: 11% | Inflation: 7%",
      output: "Target Corpus: ₹10.6 Cr | Required Monthly SIP: ₹54,500",
      description: "Long-horizon comprehensive retirement plan."
    }
  ],
  commonErrors: [
    {
      error: "Zero or Negative Return Rates",
      fix: "Expected investment returns should reflect historical market equity/debt benchmarks (typically 8% - 14%).",
    },
    {
      error: "Target Age Lower than Current Age",
      fix: "Ensure your target retirement age is greater than your current chronological age.",
    }
  ],
  alternatives: ["Personal Capital Retirement Planner", "Vanguard Retirement Nest Egg Calculator"],
};
