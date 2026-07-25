import { ToolContent } from '../../registry/types';

export const emiCalculator: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: EMI & Amortization Mathematics

Welcome to the engineering guide to Equated Monthly Installments (EMI). This handbook explains the mathematics banks use to front-load interest, and why extending the tenure of a loan is a massive financial trap.

---

## 1. Prerequisites: The Illusion of "Flat" Payments

When you take out a 30-year mortgage for $300,000 at 7% interest, the bank offers you a flat, consistent Equated Monthly Installment (e.g., $1,995/month). 

**The Illusion:** Many borrowers assume that every month, half their payment goes to the house (Principal) and half goes to the bank (Interest). 
**The Reality:** In the first month, $1,750 goes directly to the bank's profit (Interest), and only $245 actually goes toward owning your house! 

This system is called **Amortization**. Banks mathematically structure the loan so they collect almost all of their profit in the first few years.

---

## 2. Mathematical Foundations: The Amortization Formula

How does the bank calculate exactly $1,995 so that the loan perfectly hits $0 after exactly 360 months?

**The Formula:**
$$ E = P \\times r \\times \\frac{(1 + r)^n}{(1 + r)^n - 1} $$

- **E:** Equated Monthly Installment
- **P:** Principal Loan Amount
- **r:** Monthly Interest Rate (Annual Rate / 12 / 100)
- **n:** Total number of months (Tenure)

Because $n$ is an exponent in the numerator and denominator, the relationship between time and interest is non-linear.

---

## 3. The "Tenure Trap"

Car dealerships and banks often use a psychological trick to sell expensive assets: they focus entirely on the EMI, not the total cost.

*"You can't afford $1,000 a month for 3 years? No problem, we can extend the loan to 7 years, and your EMI drops to just $500!"*

**The Trap:** By stretching $n$ to 84 months, the exponential math in the denominator causes the total interest paid to skyrocket. A $30,000 car might end up costing you $45,000 over 7 years. You didn't get a cheaper car; you just bought a massively expensive loan.

---

## 4. Advanced Concepts: Prepayment Magic

Because of how amortization front-loads interest, making extra payments early in the loan has a mathematically explosive effect on your savings.

If you pay an extra $1,000 toward the Principal in Month 1 of a 30-year mortgage, you instantly reduce the Principal that generates interest for the next 359 months. That single $1,000 extra payment might save you $7,000 in total interest over the life of the loan. 
*(Note: This is why many predatory lenders explicitly include "Prepayment Penalties" in their contracts—they don't want you disrupting their exponential interest curve).*

---

## 5. Floating vs Fixed Rates

- **Fixed Rate:** The \`r\` in the equation never changes. Your EMI is locked for 30 years. This protects you from inflation, but banks charge a premium for this security.
- **Floating Rate:** The \`r\` is tied to the Central Bank's repo rate. If inflation rises, the Central Bank raises rates, your \`r\` increases, and the bank either increases your monthly EMI or secretly extends your tenure (\`n\`).

---

## 6. Interactive Quiz

**Beginner:**
1. In the first year of a 30-year mortgage, where does most of your monthly payment go? *(Answer: To the bank as Interest. Very little goes toward paying down the Principal).*

**Intermediate:**
2. Why is it dangerous to focus only on a "low monthly EMI" when buying a car? *(Answer: Because lenders achieve low EMIs by extending the tenure of the loan, which mathematically causes the total interest you pay to skyrocket, making the car significantly more expensive overall).*

**Advanced:**
3. Why does making a small extra principal payment in Year 1 save exponentially more money than making it in Year 29? *(Answer: Because Amortization calculates interest based on the remaining principal balance. Reducing the principal in Year 1 permanently stops that money from compounding interest over the next 29 years).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Enter the total Loan Amount (Principal).",
    "**Step 2:** Enter the Annual Interest Rate.",
    "**Step 3:** Enter the Loan Tenure (in years or months).",
    "**Step 4:** The tool instantly calculates the EMI and generates the Amortization Schedule, showing exactly how much interest you pay every single month."
  ],
  faq: [
    {
      question: "Why is the total amount paid so much higher than my loan?",
      answer: "That difference is the total interest. Over a 30-year mortgage, it is extremely common to pay back double or even triple the original amount you borrowed."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["SIP Calculator", "CAGR Calculator"]
};
