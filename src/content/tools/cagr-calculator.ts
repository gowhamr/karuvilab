import { ToolContent } from '../../registry/types';

export const cagrCalculator: ToolContent = {
  detailedDescription: "Compound Annual Growth Rate (CAGR) is the best way to measure the mean annual growth of an investment over time, smoothing out volatility. This tool calculates the annualized return given the starting value, ending value, and the time period. It's essential for comparing different investment assets.",
  howTo: [
    "Enter the initial investment value.",
    "Enter the final (current) investment value.",
    "Enter the duration in years.",
    "The tool calculates the CAGR percentage instantly."
  ],
  faq: [
    { question: "Why use CAGR instead of absolute return?", answer: "Absolute return doesn't account for the time it took to get those returns. CAGR allows you to compare a 50% return over 5 years vs. a 20% return over 2 years." },
    { question: "Does CAGR account for mid-term additions?", answer: "No, standard CAGR assumes a single investment at the start and a single exit value." }
  ],
  useCases: [
    "Evaluating the performance of a stock or mutual fund portfolio",
    "Comparing business growth over several years",
    "Determining the annualized yield of real estate investments"
  ],
  alternatives: ["Investopedia", "Morningstar"]
};
