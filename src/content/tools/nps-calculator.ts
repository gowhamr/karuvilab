import { ToolContent } from '../../registry/types';

export const npsCalculator: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: The National Pension System (NPS) & Taxation Math

Welcome to the engineering guide to the NPS. This handbook breaks down the government’s complex macroeconomic strategy to shift retirement risk from the State onto the Citizen, and the tax loopholes embedded to incentivize it.

---

## 1. Prerequisites: Defined Benefit vs Defined Contribution

Historically, governments and corporations offered **Pensions (Defined Benefit)**. If you worked for 30 years, they guaranteed you a specific monthly payout until you died. 
**The Problem:** People started living to 90 years old. The mathematical liabilities bankrupted cities and corporations. 

**The Solution:** The shift to **Defined Contribution** systems (like the NPS in India, or the 401k in the USA).
Under NPS, the government guarantees absolutely nothing. You contribute your own money, it is invested in the stock market (Equities/Bonds), and whatever amount it grows to is what you get. The risk is 100% transferred to you.

---

## 2. Core Concepts: The Tier System

NPS operates on a strict two-tier architecture:

### Tier-I (The Lockdown)
- **Rules:** The money is mathematically locked. You cannot withdraw the principal until you are 60 years old.
- **Incentive:** To force you into this lockdown, the government offers massive tax deductions (up to ₹2 Lakhs under Section 80C + 80CCD(1B)).
- **The Catch:** When you turn 60, you are legally forbidden from withdrawing 100% of your money. You **must** use at least 40% of the corpus to purchase a commercial Annuity (a monthly pension).

### Tier-II (The Liquid Account)
- **Rules:** Operates exactly like a standard mutual fund. You can withdraw anytime without penalties.
- **Incentive:** None. You receive absolutely zero tax benefits for investing in Tier-II.

---

## 3. Mathematical Foundations: The EEE vs EET Taxation Model

When evaluating retirement instruments, financial engineers classify them by when they are taxed:
- **E (Exempt):** Your initial contribution is tax-free.
- **E (Exempt):** Your interest/growth is tax-free.
- **E (Exempt):** Your final withdrawal at age 60 is tax-free.

The Public Provident Fund (PPF) is an **EEE** instrument (perfectly tax-free). 
For years, the NPS was an **EET (Taxable at withdrawal)** instrument, which made it terrible. However, recent legal amendments have transformed NPS into a quasi-EEE instrument: the 60% lumpsum withdrawal at age 60 is now entirely tax-free. 
*(Note: The 40% annuity generates a monthly pension, which is added to your income and taxed at your marginal rate in retirement).*

---

## 4. Engineering Challenge: The Auto-Choice Algorithm

NPS requires your money to be split between Equity (Stocks) and Debt (Bonds).

If a user selects the **Auto-Choice Lifecycle Fund**, the NPS backend executes a deterministic rebalancing algorithm on the user's birthday every year.
- **Age 30:** 75% Equity (High Risk, Maximum Growth).
- **Age 35+:** The algorithm automatically sells 2.5% of the Equity every year and buys safe Debt bonds.
- **Age 55:** The portfolio has been aggressively shifted to 15% Equity and 85% Debt to protect the corpus from a sudden stock market crash right before retirement.

---

## 5. Production Workflows

- **Corporate Payroll APIs:** Modern HR platforms integrate directly with the central NPS infrastructure (CRA). When an employee opts for Corporate NPS, the payroll backend automatically diverts up to 10% of the Basic Salary directly to the NPS Trust *before* calculating taxes, bypassing the standard tax brackets entirely.

---

## 6. Interactive Quiz

**Beginner:**
1. Can I withdraw all my money from my primary NPS account (Tier-I) whenever I want? *(Answer: No. The money is strictly locked until age 60, with only rare exceptions for medical emergencies).*

**Intermediate:**
2. At age 60, what happens to your massive NPS corpus? *(Answer: You are allowed to withdraw a maximum of 60% as a tax-free lumpsum. The government legally forces you to use the remaining 40% to purchase a lifelong monthly annuity).*

**Advanced:**
3. Why did governments abandon traditional Pensions in favor of systems like NPS? *(Answer: Traditional defined-benefit pensions became mathematical liabilities as lifespans increased, threatening state bankruptcy. Systems like NPS shift 100% of the investment and longevity risk onto the individual citizen).*

---

`,
  howTo: [
    "**Step 1:** Enter your Current Age.",
    "**Step 2:** Enter your Monthly Contribution amount.",
    "**Step 3:** Estimate your Annual Return (NPS historically averages 9-11% depending on your Equity/Debt split).",
    "**Step 4:** The tool calculates your total corpus at age 60, mathematically splits the 60% Lumpsum, and projects your estimated Monthly Pension based on the 40% mandatory annuity."
  ],
  faq: [
    {
      question: "How is the monthly pension calculated?",
      answer: "The tool assumes a standard 6% annuity rate on the mandatory 40% corpus you lock in at age 60. The actual rate will depend on the insurance provider you select when you retire."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Retirement Calculator", "SIP Calculator"]
};
