import { ToolContent } from '../../registry/types';

export const sipCalculator: ToolContent = {
  detailedDescription: `
<p>The KaruviLab SIP (Systematic Investment Plan) and Mutual Fund Calculator is a high-precision, client-side financial forecasting engine engineered to calculate deterministic compound growth, annual step-up multipliers, tax implications, and inflation-discounted purchasing power for disciplined wealth builders. Executing 100% locally in your browser with zero server latency, zero tracking telemetry, and zero data transmission, this tool models the full mathematical lifecycle of regular monthly investing across customizable multi-decade horizons.</p>

<p>A Systematic Investment Plan fundamentally transforms investment mechanics by replacing emotional market-timing attempts with automated, periodic dollar-cost averaging (DCA). Rather than trying to predict volatile market peaks and troughs—a strategy that fails for over 90% of active retail traders—an investor commits a fixed financial allocation (e.g. ₹10,000 or $500) on a set calendar day each month. When market valuations pull back, the fixed capital allocation automatically buys a larger quantity of fund units at lower net asset values (NAV). Conversely, when market valuations appreciate, fewer units are acquired. Over extended market cycles, this structural discipline systematically drives down your average acquisition cost per unit and magnifies long-term compound returns.</p>

<p>The KaruviLab SIP Engine models both classic flat annuities and advanced dynamic portfolio variables:</p>
<ul>
  <li><strong>Standard Monthly SIP Annuity Due:</strong> Computes monthly compounding using the closed-form annuity formula $FV = P \times \frac{(1 + r)^n - 1}{r} \times (1 + r)$, accounting for interest credited at the beginning of each monthly payment period.</li>
  <li><strong>Annual Step-Up Top-Up Multipliers:</strong> Simulates annual percentage increases in monthly contributions (e.g., increasing your monthly SIP by 10% each year in tandem with annual career raises or salary increments). Stepping up an SIP can double your terminal wealth over 20 years with minimal lifestyle impact.</li>
  <li><strong>Initial Lump-Sum Injection:</strong> Combines an upfront capital deposit ($L \times (1+r)^n$) with ongoing monthly contributions to accurately project hybrid investment portfolios.</li>
  <li><strong>Expense Ratio & Management Fees:</strong> Deducts fund manager expense ratios directly from gross annual yields ($r_{\text{eff}} = \max(0, r - \text{TER})$) to display realistic net portfolio performance.</li>
  <li><strong>Capital Gains Tax (LTCG) Modeling:</strong> Applies long-term capital gains taxation to net profit yields, providing a realistic assessment of post-tax take-home wealth.</li>
  <li><strong>Inflation-Adjusted Real Corpus:</strong> Discounts nominal future values against projected inflation rates ($FV_{\text{real}} = FV_{\text{net}} / (1 + i)^t$) to reveal the true future purchasing power of your retirement corpus in present-day currency.</li>
</ul>

<p>All calculations, trajectory models, and year-by-year amortization schedules run deterministically in browser memory. Your financial targets, monthly salary allocations, and personal wealth models remain strictly private on your device at all times.</p>
`,
  howTo: [
    "<strong>Enter Monthly Investment:</strong> Specify the fixed monthly amount you plan to invest into your mutual fund or index fund portfolio.",
    "<strong>Set Expected Annual Return & Duration:</strong> Enter your expected annualized rate of return (e.g. 12% for broad-market equity index funds) and your time horizon in years.",
    "<strong>Configure Step-Up & Advanced Adjustments:</strong> Expand advanced settings to configure an annual step-up percentage (e.g. 10%), initial lumpsum deposit, expense ratio, capital gains tax, and expected inflation.",
    "<strong>Analyze Projections & Export Schedule:</strong> Review the primary metric cards, year-by-year trajectory table, copy the formatted summary, or export the full projection schedule to CSV.",
  ],
  faq: [
    {
      question: "What is the formula used for calculating SIP returns?",
      answer: "SIP returns are calculated using the Future Value of an Annuity Due formula: FV = P × [((1 + i)^n - 1) / i] × (1 + i), where P is the monthly contribution, i is the monthly interest rate (Annual Return / 12 / 100), and n is the total number of months (Years × 12). For step-up SIPs, annual contributions increase exponentially each year.",
    },
    {
      question: "What is a Step-Up SIP and why is it recommended?",
      answer: "A Step-Up (or Top-Up) SIP automatically increases your monthly investment by a fixed percentage (e.g. 10%) or fixed amount each year. As your income increases with annual increments and bonuses, stepping up your SIP ensures your investment rate keeps pace with your earnings, dramatically multiplying your final maturity corpus.",
    },
    {
      question: "How does inflation affect the value of my SIP corpus?",
      answer: "While nominal returns represent the absolute balance in your account, inflation erodes purchasing power over time. For example, ₹1 Crore in 20 years at 6% annual inflation will have the purchasing power of approximately ₹31 Lakhs in today's money. Factoring in inflation helps ensure your financial goals remain realistic.",
    },
    {
      question: "What is the difference between SIP and Lumpsum investing?",
      answer: "In a Lumpsum investment, your entire capital is deployed at once in a single transaction. In an SIP, your capital is deployed in regular periodic installments. SIPs reduce timing risk through Rupee/Dollar-Cost Averaging, whereas Lumpsum investing can yield higher returns if deployed during severe market downturns.",
    },
    {
      question: "Are mutual fund SIP returns guaranteed or fixed?",
      answer: "No. Mutual fund and equity SIP returns fluctuate based on market performance and economic cycles. Historical averages (such as 11-13% for broad equity indices over 15+ years) are used as baseline projections, but actual returns vary year to year.",
    },
  ],
  useCases: [
    "Retirement corpus planning through disciplined 15 to 30 year equity index fund SIPs.",
    "Goal-based investing for children's higher education or home down payments with annual step-up contributions.",
    "Evaluating the impact of mutual fund expense ratios and capital gains taxation on long-term net wealth.",
    "Comparing nominal future value against inflation-adjusted real purchasing power.",
  ],
  examples: [
    {
      label: "Standard 15-Year Wealth Accumulation",
      input: "Monthly SIP: ₹10,000 | Annual Return: 12% | Duration: 15 Years | Step-Up: 0%",
      output: "Total Invested: ₹18,00,000 | Future Value: ₹50,45,760 | Total Gains: ₹32,45,760 (Wealth Multiplier: 2.80x)",
      description: "Baseline compounding of a flat ₹10,000 monthly investment over 15 years.",
    },
    {
      label: "10% Annual Step-Up Acceleration",
      input: "Monthly SIP: ₹10,000 | Annual Return: 12% | Duration: 15 Years | Step-Up: 10%",
      output: "Total Invested: ₹38,12,698 | Future Value: ₹86,83,849 | Total Gains: ₹48,71,151 (Wealth Multiplier: 2.28x)",
      description: "Stepping up contributions by 10% each year dramatically accelerates your final maturity corpus.",
    },
    {
      label: "Hybrid Lumpsum + SIP with Inflation & Tax",
      input: "Lumpsum: ₹2,00,000 | Monthly SIP: ₹15,000 | Return: 12% | Years: 10 | Inflation: 6% | Tax: 12.5%",
      output: "Total Invested: ₹20,00,000 | Gross Value: ₹39,78,088 | Real Post-Tax Value: ₹20,81,000+",
      description: "Realistic post-tax and inflation-discounted wealth projection.",
    },
  ],
  commonErrors: [
    {
      error: "Entering Annual Return as a Decimal (e.g. 0.12 instead of 12)",
      fix: "Enter whole percentages directly (e.g., enter 12 for 12% annual return).",
    },
    {
      error: "Ignoring Expense Ratios on Active Mutual Funds",
      fix: "Active mutual funds charge 0.5% to 2.0% in expense ratios; subtract or specify this in advanced adjustments to see true net gains.",
    },
  ],
  alternatives: [
    "Compound Interest Calculator",
    "CAGR Calculator",
    "SWP Calculator",
    "Retirement Planner",
  ],
};
