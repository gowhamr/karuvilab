export const sipCalculator = {
    detailedDescription: `
# KaruviLab Elite Learning Hub: Systematic Investment Plans (SIP) & Compounding

Welcome to the engineering guide to SIPs. This handbook explains the exponential mathematics of compound interest and the psychological superpower of Dollar-Cost Averaging.

---

## 1. Prerequisites: The "Market Timing" Fallacy

Human psychology is terrible at investing. When the stock market is booming, humans feel safe and buy at the peak. When the market crashes, humans panic and sell at the absolute bottom. 
Trying to guess exactly when the market is at its lowest point is mathematically proven to fail for 99% of professional fund managers.

**The Solution:** The Systematic Investment Plan (SIP).
Instead of investing $12,000 once a year, you automate the system to invest exactly $1,000 on the 1st of every single month, regardless of whether the market is booming or crashing.

---

## 2. Core Concepts: Dollar/Rupee Cost Averaging

A SIP fundamentally changes the math of a market crash.
- If the market is **up**, your $1,000 buys 10 shares ($100 each).
- If the market **crashes by 50%**, your $1,000 automatically buys 20 shares ($50 each).

You are mathematically forcing yourself to buy *more* assets when they are cheap, and *fewer* assets when they are expensive. Over 10 years, this smooths out volatility and lowers your average cost per share, completely removing the emotional panic of market crashes.

---

## 3. Mathematical Foundations: The Future Value of an Annuity

A SIP is technically an "Annuity Due" (regular payments making compound interest).

**The Formula:**
$$ FV = P \\times \\frac{(1 + r)^n - 1}{r} \\times (1 + r) $$

- **FV:** Future Value of your portfolio
- **P:** Monthly SIP Amount
- **r:** Expected Monthly Return Rate (Annual % / 12 / 100)
- **n:** Total number of months

Because $n$ is an exponent, the graph of a SIP looks like a hockey stick. For the first 10 years, it looks like a straight line of slow growth. In years 20 to 30, the line explodes upward vertically.

**The Rule of 72:** To estimate compounding in your head, divide 72 by the annual interest rate. That is how many years it takes for your money to double. (e.g., at 12% returns, your portfolio doubles every 6 years).

---

## 4. The Inflation Threat (Real vs Nominal Returns)

If a SIP calculator says you will have $5 Million in 30 years, you feel rich. But this is the **Nominal Value**. 

Due to Inflation, $5 Million in 2055 will not buy the same amount of goods as $5 Million today.
If the stock market returns 12% a year, but inflation is 6% a year, your **Real Rate of Return** is only ~6%. 

*Professional Advice:* Always use an inflation-adjusted calculator, or subtract the inflation rate from your expected return rate before running the math, so you know the true purchasing power of your future wealth.

---

## 5. Production Workflows

- **Robo-Advisors:** Platforms like Wealthfront or Zerodha built their entire business models around automating SIPs. Backend Node.js schedulers automatically trigger direct-debit API calls to your bank on the 1st of every month, converting your fiat into index funds without human intervention.
- **Index Funds:** SIPs are almost exclusively paired with broad-market Index Funds (like the S&P 500 or Nifty 50), ensuring the math relies on the macroeconomic growth of human civilization rather than gambling on a single company.

---

## 6. Interactive Quiz

**Beginner:**
1. Should you stop your SIP when the stock market crashes? *(Answer: No! A crash is mathematically the best time for a SIP, because your fixed monthly payment automatically buys twice as many shares when prices drop).*

**Intermediate:**
2. What is Dollar-Cost Averaging? *(Answer: The strategy of investing a fixed amount of money at regular intervals, which mathematically lowers the average cost of your shares over time and removes emotional market-timing).*

**Advanced:**
3. Why does the compounding curve look like a hockey stick? *(Answer: Because it is an exponential mathematical function. In the later decades, your generated interest starts generating its own interest, causing the portfolio value to explode vertically).*

---

`,
    howTo: [
        "**Step 1:** Enter your Monthly Investment amount.",
        "**Step 2:** Enter your Expected Annual Return (Historical index funds average 10-12%).",
        "**Step 3:** Enter your Time Period (in years).",
        "**Step 4:** The tool calculates the massive difference between your invested amount and your final wealth (the magic of compounding)."
    ],
    faq: [
        {
            question: "Are these returns guaranteed?",
            answer: "No. The stock market is volatile in the short term. However, over a 15-20 year horizon, broad-market index funds have historically trended upward to match the expected average returns."
        }
    ],
    useCases: [],
    examples: [],
    commonErrors: [],
    alternatives: ["Lumpsum Calculator", "CAGR Calculator"]
};
