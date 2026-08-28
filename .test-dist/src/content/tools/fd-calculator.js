export const fdCalculator = {
    detailedDescription: `
<p>The KaruviLab Fixed Deposit (FD) Calculator is a high-precision, client-side financial computation engine engineered to calculate deterministic maturity amounts, periodic interest payouts, Effective Annual Yield (APY), senior citizen rate enhancements, and Tax Deducted at Source (TDS) liabilities. Executing 100% locally in your browser with zero server latency, zero telemetry, and zero data transmission, this tool gives depositors, retirees, and corporate treasurers full transparency into their fixed-income cashflows across custom tenures specified in days, months, or years.</p>

<p>Fixed Deposits represent one of the safest and most popular fixed-income investment instruments globally. An investor commits a lump-sum principal amount to a banking institution or non-banking financial company (NBFC) for a pre-agreed duration at a guaranteed nominal interest rate. Unlike market-linked products like equities or mutual funds, fixed deposit principal and returns are shielded from market volatility, offering predictable wealth preservation and scheduled income generation.</p>

<p>The KaruviLab FD Engine models the complete mathematical framework governing modern banking fixed deposits:</p>
<ul>
  <li><strong>Cumulative Reinvestment Deposits:</strong> Computes compound growth where accrued interest is reinvested at each compounding cycle using the closed-form compounding equation $A = P \times \left(1 + \frac{r}{100 \times n}\right)^{n \times t}$. The Reserve Bank of India (RBI) mandates quarterly compounding ($n = 4$) for all term deposits exceeding six months, resulting in an Effective Annual Yield (APY) that significantly outpaces the nominal advertised rate.</li>
  <li><strong>Non-Cumulative Regular Income Deposits:</strong> Calculates periodic interest disbursements for individuals seeking regular cashflow (e.g. monthly pensions, quarterly rent substitutes, or half-yearly tuition fees). The principal remains intact throughout the deposit tenure, and interest is credited directly to the depositor's savings account at the chosen frequency ($\text{Payout} = P \times \frac{r}{100 \times m}$).</li>
  <li><strong>Senior Citizen Interest Rate Premium:</strong> Banks and financial institutions routinely provide a preferential interest rate boost (typically $+0.50\%$ to $+0.75\%$) for senior citizens aged 60 and above. Our engine instantly models this enhanced yield across all compounding regimes.</li>
  <li><strong>Tax Deducted at Source (TDS) Modeling:</strong> Under Indian Income Tax Section 194A, banks deduct 10% TDS when total annual interest income across all FD accounts exceeds ₹40,000 for regular individuals or ₹50,000 for senior citizens (Section 80TTB). The calculator flags threshold breaches and provides net post-tax maturity figures.</li>
  <li><strong>Flexible Tenure Handling:</strong> Supports precise calculation across arbitrary durations in days (7 to 3,650 days), months (1 to 120 months), or years (1 to 30 years), accounting for leap years and exact daily fractions.</li>
</ul>

<p>All calculations, trajectory models, and year-by-year amortization schedules run deterministically in browser memory. Your financial deposits, income details, and tax planning strategies remain strictly confidential on your local device at all times.</p>
`,
    howTo: [
        "<strong>Enter Principal Deposit Amount:</strong> Specify the total lump-sum capital you plan to deposit in the bank or financial institution (e.g., ₹1,00,000 or ₹10,00,000).",
        "<strong>Set Annual Interest Rate & Senior Citizen Status:</strong> Enter the bank's nominal interest rate per annum and toggle senior citizen status if applicable (+0.50% preferential rate boost).",
        "<strong>Select Tenure & Deposit Type:</strong> Choose your investment duration in days, months, or years, and select between Cumulative (reinvestment until maturity) or Non-Cumulative (periodic payouts).",
        "<strong>Analyze Maturity, Yield & Tax Deductions:</strong> Review total interest earned, effective APY, TDS deductions under Section 194A, copy formatted summaries, or export the year-by-year schedule.",
    ],
    faq: [
        {
            question: "What is the mathematical difference between Cumulative and Non-Cumulative FDs?",
            answer: "In a Cumulative FD, the interest earned at each interval (usually quarterly) is reinvested and added back to the principal, earning interest upon interest until maturity. In a Non-Cumulative FD, the earned interest is paid out periodically (monthly, quarterly, half-yearly, or annually) to your bank account, while the principal remains flat.",
        },
        {
            question: "Why is the Effective Annual Yield (APY) higher than the advertised interest rate?",
            answer: "When interest is compounded more frequently than once a year (e.g. quarterly compounding, n=4), interest earned in earlier quarters begins earning its own interest in subsequent quarters. For example, an advertised 7.00% nominal rate compounded quarterly yields an Effective Annual Rate of 7.185% per annum.",
        },
        {
            question: "What is the TDS threshold on Fixed Deposit interest in India?",
            answer: "Under Section 194A of the Indian Income Tax Act, banks deduct 10% TDS if your total FD interest income exceeds ₹40,000 in a financial year for regular individuals (below 60 years) or ₹50,000 for senior citizens under Section 80TTB. Submitting Form 15G or Form 15H can prevent TDS if your total taxable income is below the exemption limit.",
        },
        {
            question: "How do banks calculate interest for FDs with tenures in days?",
            answer: "For short-term FDs or tenures specified in days (e.g., 400 days or 730 days), interest is calculated on a standard 365-day year basis using the exact daily fraction t = days / 365. For tenures of less than 180 days, simple interest is typically applied, while longer tenures receive quarterly compounding.",
        },
        {
            question: "Are bank Fixed Deposits insured against institutional failure?",
            answer: "In India, each depositor in a scheduled commercial bank is insured up to ₹5,00,000 (inclusive of both principal and accumulated interest) by the Deposit Insurance and Credit Guarantee Corporation (DICGC), a wholly-owned subsidiary of the Reserve Bank of India.",
        },
    ],
    useCases: [
        "Retirement income planning by calculating quarterly or monthly non-cumulative interest payouts.",
        "Evaluating guaranteed returns on emergency funds and short-term capital parked in bank term deposits.",
        "Comparing maturity values and effective APY across various commercial banks, small finance banks, and NBFCs.",
        "Tax planning by forecasting potential TDS deductions and assessing Form 15G/15H eligibility.",
    ],
    examples: [
        {
            label: "Standard 5-Year Cumulative Bank FD",
            input: "Principal: ₹1,00,000 | Rate: 7.0% | Tenure: 5 Years | Compounding: Quarterly | Senior: No",
            output: "Maturity Amount: ₹1,41,478 | Total Interest: ₹41,478 | APY: 7.19% | TDS Deducted: ₹4,148 | Net Payout: ₹1,37,330",
            description: "Standard quarterly compounding reinvestment scenario over 5 years exceeding the ₹40,000 TDS threshold.",
        },
        {
            label: "Senior Citizen Monthly Income FD",
            input: "Principal: ₹10,00,000 | Rate: 7.5% (+0.50% boost = 8.0%) | Tenure: 3 Years | Type: Non-Cumulative (Monthly)",
            output: "Monthly Payout: ₹6,667 / month | Total Interest: ₹2,40,000 | Principal Returned: ₹10,00,000",
            description: "Monthly interest payout generation for senior citizen retirement cashflow.",
        },
        {
            label: "Short-Term 400-Day Special Deposit",
            input: "Principal: ₹5,00,000 | Rate: 7.25% | Tenure: 400 Days | Compounding: Quarterly | Senior: No",
            output: "Maturity Amount: ₹5,40,789 | Total Interest: ₹40,789 | Effective Yield: 7.45%",
            description: "Special high-yield 400-day term deposit commonly offered by public and private commercial banks.",
        },
    ],
    commonErrors: [
        {
            error: "Confusing Nominal Interest Rate with Effective Annual Yield (APY)",
            fix: "The nominal rate is the headline rate; always look at APY to determine the true annual return with compounding.",
        },
        {
            error: "Assuming TDS Deduction Means Zero Remaining Tax Liability",
            fix: "TDS is merely an advance withholding tax (10%). If your total income falls into the 20% or 30% tax brackets, you must pay the differential tax when filing your ITR.",
        },
    ],
    alternatives: [
        "Recurring Deposit (RD) Calculator",
        "Public Provident Fund (PPF) Calculator",
        "Compound Interest Calculator",
        "Systematic Investment Plan (SIP) Calculator",
    ],
};
