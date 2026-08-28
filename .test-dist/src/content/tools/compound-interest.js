export const compoundInterest = {
    detailedDescription: `
<p>The KaruviLab Compound Interest Calculator is a high-precision, client-side wealth modeling engine designed to calculate exponential investment growth, effective annual yields, and inflation-adjusted future purchasing power. Operating 100% locally in your browser with zero telemetry and zero server round-trips, it provides full mathematical transparency with annual breakdowns, periodic contribution simulation, and shareable financial parameter contracts.</p>

<p>Unlike simple interest (which earns returns strictly on the original principal), compound interest calculates interest on both the initial principal and the accumulated interest from preceding periods ($A = P(1 + r/n)^{nt}$). Over multi-year time horizons, this exponential feedback loop generates wealth disproportionately faster—a phenomenon often described as the single most powerful force in personal finance.</p>

<p>KaruviLab's calculation engine incorporates essential financial dimensions:</p>
<ul>
  <li><strong>Compounding Frequencies:</strong> Compare Annual ($n=1$), Semi-Annual ($n=2$), Quarterly ($n=4$), Monthly ($n=12$), and Daily ($n=365$) compounding intervals.</li>
  <li><strong>Recurring Periodic Contributions (SIP):</strong> Model regular monthly deposits alongside your initial principal to simulate Systematic Investment Plans and employer 401(k)/PF matches.</li>
  <li><strong>Effective Annual Rate (EAR / APY):</strong> Derives the true annual yield ($EAR = (1 + r/n)^n - 1$) to compare financial instruments across different compounding structures.</li>
  <li><strong>Inflation-Adjusted Real Value:</strong> Discounts nominal future wealth by expected inflation rates to calculate real future purchasing power.</li>
  <li><strong>Rule of 72 Doubling Time:</strong> Estimates how many years it will take your investment to double at your designated rate ($\approx 72 / r$).</li>
</ul>

<p>All computations execute deterministically in your browser memory. Your portfolio numbers, salary contributions, and savings balances are never collected, logged, or transmitted across the network.</p>
`,
    howTo: [
        "<strong>Enter Principal & Contributions:</strong> Input your initial investment amount and optional recurring monthly deposit.",
        "<strong>Set Annual Return Rate & Duration:</strong> Specify the nominal annual interest rate (e.g. 10%) and investment horizon in years.",
        "<strong>Select Compounding Frequency:</strong> Choose between Annually, Semi-Annually, Quarterly, Monthly, or Daily.",
        "<strong>Analyze Breakdown & Real Value:</strong> Review the primary metric cards, year-by-year schedule, APY rate, and inflation-discounted real wealth.",
    ],
    faq: [
        {
            question: "What is the compound interest formula with monthly contributions?",
            answer: "The formula combines principal compounding and future value of an annuity: A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)] × (1 + r/n).",
        },
        {
            question: "What is the difference between APR and APY / EAR?",
            answer: "APR (Annual Percentage Rate) is the nominal interest rate without considering compounding within the year. APY (Annual Percentage Yield) or EAR (Effective Annual Rate) includes intra-year compounding, reflecting the true annualized return.",
        },
        {
            question: "What is the Rule of 72?",
            answer: "The Rule of 72 is a mental math shortcut that estimates the number of years needed to double your money. Divide 72 by the annual interest rate (e.g., at 8% interest, 72 / 8 = 9 years to double).",
        },
        {
            question: "How does inflation impact compounded investment returns?",
            answer: "Inflation erodes the purchasing power of future cash flows. An investment yielding 10% nominal returns in an economy with 6% inflation delivers an effective real return of approximately 4% in purchasing power.",
        },
        {
            question: "Are my financial figures stored or sent to a server?",
            answer: "No. KaruviLab operates with a strict offline-first architecture. All calculations and charts run locally on your device.",
        },
    ],
    useCases: [
        "Projecting mutual fund, ETF, and stock market portfolio growth over 10 to 30 years.",
        "Evaluating fixed deposit (FD), certificate of deposit (CD), and high-yield savings account returns.",
        "Planning retirement savings with ongoing monthly SIP contributions.",
        "Comparing loan or bond yields with varying compounding intervals.",
    ],
    examples: [
        {
            input: "Principal: ₹1,00,000 | Rate: 10% | Duration: 10 Years | Frequency: Annual",
            output: "Future Value: ₹2,59,374 (Total Interest: ₹1,59,374 | Return: 159.4%)",
            description: "Standard 10-year lump-sum compound growth."
        },
        {
            input: "Principal: ₹50,000 | Monthly Contribution: ₹5,000 | Rate: 12% | Duration: 5 Years",
            output: "Future Value: ₹4,96,000+ (Total Invested: ₹3,50,000 | Interest: ₹1,46,000+)",
            description: "Systematic monthly investment compounding over 5 years."
        },
        {
            input: "Principal: ₹2,00,000 | Rate: 12% | Frequency: Monthly vs Annual",
            output: "Monthly APY: 12.68% vs Annual APY: 12.00%",
            description: "Effective Annual Rate comparison showing compounding advantage."
        }
    ],
    commonErrors: [
        {
            error: "Entering Interest Rate as Decimal Instead of Percentage",
            fix: "Enter 8 for 8%, not 0.08. The tool expects standard percentage notation.",
        },
        {
            error: "Zero Investment Duration",
            fix: "Ensure investment duration is at least 1 year to calculate compounding growth.",
        },
    ],
    alternatives: ["Investor.gov Compound Interest Calculator", "Excel FV Function", "Calculator.net Financial"],
};
