import { ToolContent } from '../../registry/types';

export const mutualFundReturns: ToolContent = {
  detailedDescription: "Estimate the growth of your mutual fund investments based on past performance or expected returns. This tool calculates both absolute returns (total gain/loss) and CAGR (annualized returns), helping you understand how your wealth might grow over time. It supports both SIP and lumpsum inputs.",
  howTo: [
    "Enter the initial investment amount or monthly SIP.",
    "Set the expected annual return rate based on historical data.",
    "Select the investment duration in years.",
    "The tool will instantly show the estimated future value and total gains."
  ],
  faq: [
    { question: "What is the difference between absolute and annualized returns?", answer: "Absolute return is the total percentage gain over the entire period, while annualized return (CAGR) is the geometric mean of the return per year." },
    { question: "Does this tool use real-time market data?", answer: "No, it uses assumed return rates for projections. Actual mutual fund performance depends on market conditions." }
  ],
  useCases: [
    "Projecting long-term wealth creation through mutual funds",
    "Comparing different fund categories (Equity vs Debt) based on assumed returns",
    "Planning for financial goals like a house or education"
  ],
  alternatives: ["Groww", "Value Research", "Morningstar"]
};
