export const rdCalculator = {
    detailedDescription: `
<p>The KaruviLab Recurring Deposit (RD) Calculator is a high-precision, client-side financial engine designed to accurately model the maturity value, cumulative interest earnings, quarterly compounding mechanics, senior citizen rate boosts, and TDS tax liabilities for recurring deposit accounts. Operating 100% locally in your browser with zero server latency, zero tracking telemetry, and zero data transmission, this tool provides deterministic financial projections for disciplined monthly savers, retail depositors, and personal finance planners.</p>

<p>A Recurring Deposit (RD) is a premier fixed-income savings instrument offered by Indian public sector banks, private commercial banks, regional rural banks, and India Post Office. Unlike a Fixed Deposit (FD) which requires a large upfront lump-sum deposit, an RD enables individuals to invest a fixed sum of money at regular monthly intervals over a predetermined tenure—ranging from 6 months to 10 years (120 months). In return, the financial institution guarantees a fixed, predictable rate of interest that remains locked throughout the entire duration of the deposit, insulating savers against macroeconomic interest rate cuts and financial market volatility.</p>

<h3>Indian Banking Quarterly Compounding Mechanics</h3>
<p>In accordance with Reserve Bank of India (RBI) and Indian Banks' Association (IBA) guidelines, interest on recurring deposits is compounded on a <strong>quarterly basis</strong> (four times per financial year), even though deposits are collected monthly. Because every monthly installment stays invested in the bank for a different duration of time, the total maturity corpus is computed using the summation of a geometric progression of quarterly compound interest:</p>

<p>The standard closed-form formula for Indian quarterly compounding RD maturity is:</p>
<p>$$M = P \\times \\frac{(1 + i)^{n/3} - 1}{1 - (1 + i)^{-1/3}}$$</p>
<p>Where:</p>
<ul>
  <li><strong>M</strong> = Maturity amount payable at the conclusion of the deposit term.</li>
  <li><strong>P</strong> = Fixed monthly deposit installment (e.g. ₹5,000).</li>
  <li><strong>r</strong> = Annual nominal interest rate in percent (e.g. 7.0%).</li>
  <li><strong>i</strong> = Quarterly interest rate, defined as $i = \\frac{r}{400}$.</li>
  <li><strong>n</strong> = Total tenure in months (e.g. 60 months for 5 years).</li>
  <li><strong>n/3</strong> = Total number of compounding quarters.</li>
</ul>

<h3>Key Features Modeled in the KaruviLab RD Engine</h3>
<ul>
  <li><strong>Senior Citizen Interest Rate Boost:</strong> Indian banks offer a preferential rate increase—typically an extra +0.50% (50 basis points)—to senior citizens aged 60 and above. The calculator dynamically recalculates the effective rate and APY when toggled.</li>
  <li><strong>Effective Annual Percentage Yield (APY):</strong> Due to quarterly compounding, the actual annualized return is higher than the stated nominal interest rate. For example, a 7.00% nominal rate compounded quarterly yields an effective APY of approximately 7.19% per year ($APY = (1 + r/400)^4 - 1$).</li>
  <li><strong>TDS (Tax Deducted at Source) Modeling:</strong> Under Section 194A of the Income Tax Act, banks deduct 10% TDS if total interest earned across all bank deposits in a financial year exceeds ₹40,000 for regular depositors or ₹50,000 for senior citizens (under Section 80TTB). The engine highlights when TDS thresholds are breached and calculates estimated net take-home maturity proceeds.</li>
  <li><strong>Flexible Compounding Options:</strong> While quarterly compounding is the default standard for Indian banks and Post Office RDs, the calculator also supports monthly, half-yearly, and annual compounding for international fixed-term deposit products.</li>
  <li><strong>Year-by-Year Amortization Schedule:</strong> Complete yearly breakdown mapping opening balances, new annual deposits, year-specific interest accruals, cumulative interest, and net maturity values.</li>
</ul>

<p>All calculations execute deterministically in client-side Web Worker memory. Your private financial planning data never leaves your device.</p>
`,
    howTo: [
        "<strong>Enter Monthly Deposit:</strong> Input your intended monthly installment amount (e.g. ₹5,000) using the slider or precise numeric input.",
        "<strong>Set Annual Interest Rate:</strong> Enter the nominal annual interest rate offered by your bank or Post Office (e.g. 7.0% p.a.).",
        "<strong>Choose Deposit Tenure:</strong> Select the duration of your recurring deposit in years or months (e.g. 5 years / 60 months).",
        "<strong>Configure Senior Citizen & TDS Options:</strong> Toggle the senior citizen boost (+0.50%) or enable TDS tax modeling to inspect post-tax maturity proceeds and export the yearly schedule.",
    ],
    faq: [
        {
            question: "How is interest calculated on a Recurring Deposit in India?",
            answer: "In India, RD interest is compounded quarterly according to Reserve Bank of India (RBI) rules. Each monthly installment earns interest from the date of deposit until the date of maturity. The closed-form formula is M = P * ((1+i)^(n/3) - 1) / (1 - (1+i)^(-1/3)), where i = r/400 and n is the total number of months.",
        },
        {
            question: "What is the Senior Citizen interest rate benefit on RD?",
            answer: "Most Indian banks (such as SBI, HDFC, ICICI, and PNB) offer a 0.50% (50 basis points) higher interest rate on recurring deposits for senior citizens aged 60 years and above. In addition, senior citizens enjoy a higher TDS exemption threshold of ₹50,000 under Section 80TTB of the Income Tax Act.",
        },
        {
            question: "Is TDS applicable on Recurring Deposit interest earnings?",
            answer: "Yes. Under Section 194A of the Indian Income Tax Act, banks deduct 10% TDS if the cumulative interest earned across all deposits (FDs and RDs) exceeds ₹40,000 in a financial year for regular individuals (₹50,000 for senior citizens). If PAN is not provided, TDS is deducted at 20%. Depositors with zero taxable income can submit Form 15G (or Form 15H for senior citizens) to avoid TDS deductions.",
        },
        {
            question: "What happens if I withdraw my RD before the maturity date?",
            answer: "Most banks permit premature withdrawal of recurring deposits, but apply a premature penalty—typically deducting 0.5% to 1.0% from the applicable interest rate for the period the deposit was actually held. Some Post Office RD schemes may require a minimum lock-in period (e.g. 3 years) before allowing premature closure.",
        },
        {
            question: "How does an RD differ from an SIP in Mutual Funds?",
            answer: "A Recurring Deposit offers guaranteed, capital-protected returns with zero market risk and fixed quarterly compounding. A Systematic Investment Plan (SIP) in mutual funds invests in equities or debt instruments where returns fluctuate with market performance, offering higher long-term wealth potential but without capital guarantees.",
        },
    ],
    useCases: [
        "Disciplined monthly savings to build an emergency fund or accumulate a down payment for a house or vehicle.",
        "Planning for predictable recurring annual expenditures like children's school tuition fees or life insurance premiums.",
        "Conservative capital preservation for senior citizens seeking safe, guaranteed returns with preferential interest rate boosts.",
        "Evaluating post-tax net maturity corpus after applying Section 194A / Section 80TTB TDS deductions.",
    ],
    examples: [
        {
            label: "Standard 5-Year Bank RD (₹5,000/mo @ 7.0%)",
            input: "Monthly Deposit: ₹5,000 | Interest Rate: 7.0% p.a. | Tenure: 5 Years (60 Months) | Compounding: Quarterly",
            output: "Total Invested: ₹3,00,000 | Interest Earned: ₹59,664 | Maturity Amount: ₹3,59,664 | Effective APY: 7.19%",
            description: "Standard Indian bank recurring deposit with quarterly compounding over a 5-year investment horizon.",
        },
        {
            label: "Senior Citizen 5-Year Deposit with Rate Boost",
            input: "Monthly Deposit: ₹5,000 | Base Rate: 7.0% (+0.50% Boost = 7.50%) | Tenure: 5 Years | Senior Citizen: Yes",
            output: "Total Invested: ₹3,00,000 | Interest Earned: ₹64,449 | Maturity Amount: ₹3,64,449 | Effective APY: 7.71%",
            description: "Senior citizen deposit earning a preferential 7.50% interest rate with higher quarterly compounding yield.",
        },
        {
            label: "Short-Term 2-Year Recurring Deposit (₹10,000/mo @ 6.8%)",
            input: "Monthly Deposit: ₹10,000 | Interest Rate: 6.8% p.a. | Tenure: 2 Years (24 Months) | Compounding: Quarterly",
            output: "Total Invested: ₹2,40,000 | Interest Earned: ₹17,658 | Maturity Amount: ₹2,57,658 | Effective APY: 6.98%",
            description: "Short-term savings strategy for accumulating capital for an annual milestone or scheduled major expense.",
        },
    ],
    commonErrors: [
        {
            error: "Assuming Simple Interest or Monthly Compounding Formula",
            fix: "Indian banks calculate RD interest via quarterly compounding rather than monthly or simple interest; use the quarterly formula M = P * ((1+i)^(n/3) - 1) / (1 - (1+i)^(-1/3)).",
        },
        {
            error: "Overlooking Section 194A TDS on Interest Exceeding ₹40,000",
            fix: "If cumulative annual interest across deposits exceeds ₹40,000 (₹50,000 for seniors), factor in 10% TDS or submit Form 15G/15H if your total income is below the taxable threshold.",
        },
    ],
    alternatives: [
        "Fixed Deposit (FD) Calculator",
        "SIP Calculator",
        "PPF Calculator",
        "Compound Interest Calculator",
    ],
};
