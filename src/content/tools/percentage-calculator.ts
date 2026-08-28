import { ToolContent } from '../../registry/types';

export const percentageCalculator: ToolContent = {
  detailedDescription: `
<p>The KaruviLab Percentage Calculator is a high-precision, browser-native mathematical tool designed to evaluate common and advanced percentage problems instantly. Operating entirely offline in your browser with zero telemetry and zero server round-trips, it provides transparent formulas, step-by-step arithmetic breakdowns, and shareable parameter contracts for engineering, commerce, finance, and educational applications.</p>

<p>Percentages represent proportions expressed as fractions of 100 (from the Latin <em>per centum</em>). While standard calculations (such as finding 20% of 500) are straightforward, real-world analytical tasks often require reverse operations—such as deducing an original price before a tax markup or discount, computing multi-period percentage changes without direction bias, or expressing small fractions with floating-point precision.</p>

<p>KaruviLab's calculation engine supports four deterministic computation modes:</p>
<ul>
  <li><strong>Percentage of a Value (X% of Y):</strong> Evaluates the direct proportional value using the exact formula <code>(X / 100) × Y</code>.</li>
  <li><strong>What Percentage (X is what % of Y):</strong> Calculates the ratio of a part to the whole using <code>(X / Y) × 100</code> with division-by-zero safeguards.</li>
  <li><strong>Percentage Change (% Increase or Decrease):</strong> Quantifies relative growth or reduction between two values using <code>((Y - X) / |X|) × 100</code> along with absolute difference and multiplier factors.</li>
  <li><strong>Reverse Percentage (Original Value Calculation):</strong> Reverses a known percentage markup or discount to compute the baseline original number before adjustments were applied.</li>
</ul>

<p>All calculations execute locally using pure deterministic algorithms. No financial numbers, student grades, or proprietary pricing data are ever transmitted or saved outside your local browser environment.</p>
`,
  howTo: [
    "<strong>Select Calculation Mode:</strong> Choose from 'Percentage of Value', 'What Percentage', 'Percentage Change', or 'Reverse Percentage'.",
    "<strong>Enter Values:</strong> Input your numbers (supports positive, negative, and decimal inputs).",
    "<strong>View Breakdown:</strong> Review the primary metric card, formula expansion, multiplier factor, and fractional equivalents.",
    "<strong>Copy or Share:</strong> Use the Copy Summary button or generate a shareable URL that encodes your exact parameters.",
  ],
  faq: [
    {
      question: "How do I calculate the original price before a discount?",
      answer: "Use the 'Reverse Percentage' mode, select 'Decrease (Discount)', and enter the final discounted price alongside the discount rate (e.g. $80 after 20% discount = $100 original price).",
    },
    {
      question: "What is the difference between percentage change and percentage points?",
      answer: "Percentage change measures relative change compared to the original base value (((new - old) / old) × 100), whereas percentage points represent the simple arithmetic difference between two percentages (e.g. an increase from 10% to 15% is a 5 percentage point increase, but a 50% relative increase).",
    },
    {
      question: "Can percentage change be negative?",
      answer: "Yes. When the new value is less than the original value, the calculation yields a negative percentage indicating a percentage decrease (e.g. from 200 to 150 is a -25% decrease).",
    },
    {
      question: "Why does the tool reject division by zero?",
      answer: "In mathematics, dividing by zero is undefined. If the base or total value is zero, no meaningful percentage or percentage change can be calculated, and the engine displays a structured alert banner.",
    },
    {
      question: "Are my financial or grading calculations kept private?",
      answer: "Yes. KaruviLab processes all math entirely client-side. Zero data leaves your device.",
    },
  ],
  useCases: [
    "Calculating discounts, sales tax, VAT, and GST on retail purchases.",
    "Analyzing year-over-year revenue, profit margins, and quarterly business growth.",
    "Computing academic test scores, weighted GPAs, and grading curves.",
    "Calculating tips and splitting restaurant bills proportionally.",
    "Measuring athletic progress, weight loss percentages, and fitness improvements.",
  ],
  examples: [
    {
      input: "Percentage: 20% | Total: 500",
      output: "Result: 100 (Formula: (20 / 100) × 500 = 100)",
      description: "Direct percentage of a number."
    },
    {
      input: "From: 200 | To: 250",
      output: "+25% Increase (Absolute Change: 50, Multiplier: 1.25)",
      description: "Percentage increase between two values."
    },
    {
      input: "Final Value: $120 | Percentage: 20% Increase",
      output: "Original Value: $100 (Formula: 120 / 1.2 = 100)",
      description: "Reverse percentage calculation to find pre-markup price."
    }
  ],
  commonErrors: [
    {
      error: "Division by Zero Error",
      fix: "Ensure the total or original base value is not zero when calculating ratios or percentage changes.",
    },
    {
      error: "100% or Greater Reverse Decrease",
      fix: "In reverse calculations, a percentage decrease of 100% or more implies a non-positive or negative zero baseline, which is invalid.",
    },
  ],
  alternatives: ["Calculator.net Percent Calculator", "RapidTables.com", "Wolfram Alpha"],
};
