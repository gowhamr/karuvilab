import { ToolContent } from '../../registry/types';

export const sipCalculator: ToolContent = {
  detailedDescription: `
<p>The SIP (Systematic Investment Plan) Calculator is a powerful wealth-planning tool designed to help you estimate the future value of your mutual fund investments. SIPs are one of the most effective ways to build a large corpus over time by investing small, regular amounts. This calculator provides the clarity you need to set realistic financial goals and understand the impact of long-term compounding.</p>

<p>By inputting your monthly investment amount, expected annual return rate, and the duration of your investment, you can instantly see how much your wealth could grow. The tool also visualizes the total amount invested versus the estimated capital gains, giving you a clear picture of how much 'extra' money you are earning through disciplined investing and market growth.</p>

<p>One of the core benefits of using KaruviLab's SIP Calculator is privacy. Planning your financial future is a private matter. Because our tool runs entirely in your browser, your investment amounts, goals, and return expectations are never uploaded or shared. It is a secure environment for sensitive financial simulations, available whenever you need it, even without an internet connection.</p>
`,
  howTo: [
    "<strong>Monthly Investment:</strong> Enter the amount you plan to invest every month.",
    "<strong>Return Rate:</strong> Input the expected annual rate of return (e.g., 12 for 12%).",
    "<strong>Investment Period:</strong> Set the number of years you intend to stay invested.",
    "<strong>Calculate:</strong> Click 'Calculate' to see the projected maturity value and total gains.",
    "<strong>Adjust Goals:</strong> Modify the values to see how increasing your SIP or tenure impacts the final corpus.",
  ],
  faq: [
    { question: "What is an SIP?", answer: "SIP is a method of investing a fixed amount regularly in mutual funds, benefiting from Rupee Cost Averaging." },
    { question: "Are these returns guaranteed?", answer: "No, mutual fund investments are subject to market risks. This calculator provides estimates based on your input rate." },
    { question: "Does it account for inflation?", answer: "This is a basic growth calculator. To account for inflation, you may want to use a higher return rate or adjust your final expectations." },
    { question: "Can I use it for one-time investments?", answer: "For one-time investments, we recommend using our Lumpsum Calculator instead." },
    { question: "Is my financial data private?", answer: "Absolutely. All calculations happen locally on your device; KaruviLab never sees your data." }
  ],
  examples: [
    { label: "Wealth Builder", input: "Monthly: 5000, Rate: 12%, Tenure: 20 yrs", output: "Invested: 12L, Gains: 37.9L, Total: 49.9L", description: "Demonstrating the massive power of compounding over two decades." },
    { label: "Short Term Goal", input: "Monthly: 10000, Rate: 10%, Tenure: 5 yrs", output: "Invested: 6L, Gains: 1.7L, Total: 7.7L", description: "Planning for a down payment or major purchase in 5 years." },
    { label: "Retirement Plan", input: "Monthly: 20000, Rate: 15%, Tenure: 25 yrs", output: "Invested: 60L, Gains: 5.9Cr, Total: 6.5Cr", description: "High-growth scenario showing significant wealth creation over a long career." }
  ]
};
