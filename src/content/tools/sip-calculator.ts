import { ToolContent } from '../../registry/types';

export const sipCalculator: ToolContent = {
  detailedDescription: `
    <p>A Systematic Investment Plan (SIP) is one of the most effective ways to build long-term wealth through the power of compounding. The KaruviLab SIP Calculator is a financial planning tool designed to help you project the future value of your monthly investments. By understanding how small, consistent contributions can grow over decades, you can better plan for your financial goals, whether it is for retirement, a child's education, or purchasing a home.</p>
    
    <p>Compounding is often called the 'eighth wonder of the world,' and this calculator helps you visualize that process. Our tool allows you to simulate not just simple monthly investments, but also 'Step-Up' SIPs, where you increase your monthly contributions annually as your income grows. This feature provides a more realistic financial forecast, as most investors find they can save more as their career progresses.</p>

    <p>Privacy is paramount. Like all our financial tools, the SIP Calculator runs entirely on your local machine. Your investment goals, return expectations, and resulting corpus estimates are never transmitted. This allows you to explore different 'what-if' scenarios with complete financial confidentiality, ensuring your investment strategy remains your private affair.</p>
  `,
  howTo: [
    "<strong>Monthly Investment:</strong> Enter the amount you plan to invest every month.",
    "<strong>Expected Return:</strong> Input the estimated annual return rate. While market returns fluctuate, many long-term equity investors use a 10–12% average for planning.",
    "<strong>Duration:</strong> Set the total number of years you plan to continue your investment.",
    "<strong>Step-Up SIP (Optional):</strong> If you plan to increase your investment amount each year, toggle the 'Step-up' option and input the percentage increase.",
    "<strong>Review:</strong> Click 'Calculate' to view your total investment, the estimated wealth gain, and the final projected corpus.",
  ],
  faq: [
    {
      question: "Are these returns guaranteed?",
      answer: "No. All return projections are estimates based on your input. Mutual funds are subject to market risks, and actual performance may vary significantly over the years.",
    },
    {
      question: "What is a 'Step-up' SIP?",
      answer: "A Step-up SIP allows you to increase your monthly contribution by a percentage each year. This is a highly recommended strategy to beat inflation and accelerate wealth accumulation as your salary grows.",
    },
    {
      question: "Should I account for inflation?",
      answer: "While this tool shows the nominal future value, remember that inflation reduces purchasing power. You may want to lower the 'expected return' rate to simulate real-world value adjusted for inflation.",
    },
    {
      question: "Is this tool secure?",
      answer: "Yes. All computations are performed locally in your browser. No financial data is ever shared or stored on a server.",
    },
  ],
  useCases: [
    "Planning for long-term retirement goals with modest monthly savings.",
    "Simulating how a 10% annual salary increase impacts long-term investment growth (Step-up SIP).",
    "Comparing the impact of different return expectations on your final wealth corpus.",
    "Teaching the fundamentals of compounding to family and friends.",
  ],
  examples: [
    {
      input: "5,000 INR/month | 12% Return | 20 Years",
      output: "Total Invested: 1,200,000 | Estimated Gain: 3,795,000 | Final Corpus: 4,995,000",
      description: "Shows how small, consistent investments turn into a substantial corpus over two decades."
    }
  ],
  commonErrors: [
    {
      error: "Results seem too high",
      fix: "Double-check the interest rate. Rates above 15% are rarely sustainable over long periods. 10–12% is a more standard, conservative projection.",
    },
    {
      error: "Step-up SIP impact is unclear",
      fix: "The Step-up effect compounds significantly over time. Try a small step-up percentage, like 5% or 10%, to see how much it accelerates your final goal.",
    },
  ],
  alternatives: ["Groww SIP Calculator", "ET Money SIP Calculator", "Zerodha Varsity"],
};
