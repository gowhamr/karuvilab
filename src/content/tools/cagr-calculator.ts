import { ToolContent } from '../../registry/types';

export const cagrCalculator: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: CAGR & The "Average Return" Lie

Welcome to the engineering guide to Compound Annual Growth Rate (CAGR). This handbook explains how financial marketers use bad math to lie about returns, and how CAGR forces truth into the equation.

---

## 1. Prerequisites: The Flaw of "Average" Returns

Imagine a mutual fund salesman tells you: *"Our fund averaged a 25% return over the last two years!"* 
You invest $100.

- **Year 1:** The fund drops by 50%. Your $100 becomes $50.
- **Year 2:** The fund grows by 100%. Your $50 doubles back to $100.

The salesman wasn't technically lying: $(-50\\% + 100\\%) / 2 \\text{ years} = +25\\% \\text{ Average Return}$.
But you didn't make 25% profit! You started with $100 and you ended with $100. Your *actual* return was 0%.

**The Problem:** Simple arithmetic averages completely ignore volatility and compounding. They are mathematically useless for measuring long-term wealth.

---

## 2. Mathematical Foundations: How CAGR Fixes the Lie

**CAGR (Compound Annual Growth Rate)** is the mathematical rate at which an investment would have grown if it grew at a perfectly steady rate every single year, compounding smoothly.

**The Formula:**
$$ CAGR = \\left( \\frac{EV}{BV} \\right)^{\\frac{1}{n}} - 1 $$

- **EV:** Ending Value (e.g., $100)
- **BV:** Beginning Value (e.g., $100)
- **n:** Number of Years (e.g., 2)

Using our example: $(100 / 100)^{1/2} - 1 = 1^0.5 - 1 = 1 - 1 = 0\\%$.
The CAGR exposes the truth: Your actual compounded return was 0%.

---

## 3. The Power of Smoothing Volatility

Real-world investments (Stocks, Crypto, Real Estate) are jagged. They jump up 20% one year and crash 10% the next. 

CAGR acts as a geometric smoothing function. It draws a perfect exponential curve from your starting value to your ending value, completely ignoring the wild rollercoaster rides that happened in the middle. 
This is why CAGR is the absolute gold standard for comparing two different investments (e.g., comparing your Stock Portfolio against your Real Estate properties).

---

## 4. Threat Model: The Limitations of CAGR

While CAGR prevents the "average return" lie, it has its own mathematical blind spots.

| Blind Spot | Explanation |
|------------|-------------|
| **Ignores Intra-year Volatility** | CAGR only looks at the start and end dates. If your portfolio grew smoothly at 10% a year, or crashed 99% before rocketing 10,000% on the final day, the CAGR is identical. It hides the extreme emotional risk you took. |
| **Assumes Reinvestment** | CAGR mathematically assumes that any dividends or rent you received were instantly reinvested back into the asset. If you spent the dividends, the actual return of the asset is lower than the CAGR suggests. |
| **Not for SIPs** | CAGR only works for a single **Lumpsum** investment. If you add money every month (like a SIP), the math breaks. You must use XIRR (Extended Internal Rate of Return) instead. |

---

## 5. Production Workflows

- **Venture Capital:** VC firms use CAGR to report fund performance to their institutional investors (LPs) because it is strictly regulated by financial bodies to prevent deceptive arithmetic averages.
- **Corporate Valuations:** When a company like Apple acquires a startup, they calculate the startup's historical Revenue CAGR over the last 5 years to predict their future trajectory before making an offer.

---

## 6. Interactive Quiz

**Beginner:**
1. If you lose 50% in Year 1, and gain 50% in Year 2, did you make your money back? *(Answer: No. A 50% drop requires a 100% gain to break even. This is why minimizing losses is critical in investing).*

**Intermediate:**
2. Why is CAGR better than a simple Average Return? *(Answer: An arithmetic average ignores the effects of compounding and volatility, making it wildly inaccurate for measuring real wealth. CAGR calculates the exact, smoothed exponential growth rate).*

**Advanced:**
3. If you invest $1,000 every month into an account, can you use CAGR to calculate your returns? *(Answer: No. CAGR only calculates the growth of a single, upfront Lumpsum. For multiple investments over time, you must use XIRR).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Enter your Initial Investment Value (e.g., $10,000).",
    "**Step 2:** Enter your Final Investment Value (e.g., $25,000).",
    "**Step 3:** Enter the Duration (in years).",
    "**Step 4:** The tool calculates the exact smoothed exponential growth rate (CAGR) required to reach that final value."
  ],
  faq: [
    {
      question: "Can CAGR be negative?",
      answer: "Yes. If your Final Value is lower than your Initial Value, the CAGR will perfectly calculate your annualized rate of loss."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["SIP Calculator", "Lumpsum Calculator"]
};
