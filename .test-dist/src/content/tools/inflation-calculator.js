export const inflationCalculator = {
    detailedDescription: `
<p>The KaruviLab Inflation Calculator is a high-precision, client-side financial forecasting engine engineered to measure the compound erosion of purchasing power over time. Operating 100% locally within your browser with zero telemetry, zero cookies, and zero server round-trips, it provides complete mathematical transparency with forward cost escalation projections, reverse purchasing power devaluation, and year-by-year amortization schedules.</p>

<p>Inflation represents the annualized percentage rate at which the aggregate price level of goods and services in an economy escalates. As consumer prices compound upwards, each unit of currency buys a progressively smaller quantity of real goods and services. Often described by monetary economists as the "invisible tax," inflation directly degrades the real purchasing power of uninvested cash, fixed-income instruments, pensions, and long-term financial targets.</p>

<p>KaruviLab's pure deterministic inflation modeling engine executes multiple analytical dimensions simultaneously:</p>
<ul>
  <li><strong>Forward Cost Escalation (Future Cost):</strong> Calculates the future nominal expenditure required to acquire what today's sum currently buys, modeled via exponential compounding: <code>FV = PV × (1 + r/100)^t</code>. This reveals the actual future budget needed for groceries, housing, automobiles, or capital equipment.</li>
  <li><strong>Reverse Purchasing Power (Real Value):</strong> Computes what today's nominal cash sum will effectively feel like in future purchasing power terms: <code>PV = FV / (1 + r/100)^t</code>. This demonstrates the steep devaluation of keeping uninvested cash in standard checking accounts.</li>
  <li><strong>Loss of Purchasing Power Percentage:</strong> Determines the exact proportional degradation in value experienced by fixed capital: <code>Loss (%) = [1 - 1 / (1 + r/100)^t] × 100</code>.</li>
  <li><strong>Rule of 70 Halving Time:</strong> Accurately estimates the duration required for your currency's real purchasing power to be cut in half at a given inflation rate: <code>Halving Time ≈ 70 / r</code> years.</li>
  <li><strong>Sector-Specific Inflation Presets:</strong> Enables instant benchmarking against realistic sector-specific inflation dynamics, including General Consumer Price Index (CPI ~6%), Lifestyle & Travel (~8%), Higher Education (~10%), and Healthcare & Medical (~12%).</li>
</ul>

<p>Understanding the mathematical difference between nominal balances and inflation-adjusted real returns is fundamental to financial independence. If your investment portfolio generates an 8% nominal annual return while personal lifestyle and medical inflation run at 8%, your real wealth growth is exactly 0%. By modeling inflation deterministically across multi-decade horizons, learners and planners can size emergency funds, calibrate retirement targets, and structure asset allocations that reliably outperform monetary debasement.</p>

<p>To hedge against compound monetary debasement, financial planners model asset classes by their real after-inflation yield. Growth equities, prime real estate, and inflation-indexed government bonds have historically acted as productive hedges, whereas static cash accounts and low-yield fixed deposits suffer guaranteed purchasing power loss over ten-year horizons. KaruviLab's interactive simulator empowers you to visualize these compounding dynamics cleanly with exact mathematical formulas and granular year-by-year data tables.</p>
`,
    howTo: [
        "<strong>Input Initial Capital or Cost:</strong> Enter your current purchasing power, existing savings amount, or the present price of a target asset or goal.",
        "<strong>Set Annual Inflation Rate:</strong> Select one of the sector presets (General CPI 6%, Lifestyle 8%, Education 10%, Healthcare 12%) or input a customized inflation rate percentage.",
        "<strong>Choose Time Horizon:</strong> Adjust the duration slider from 1 to 40 years to model short, medium, or long-term compounding horizons.",
        "<strong>Analyze Dual Outcomes & Schedule:</strong> Inspect both the escalated future price of goods and the depreciated future purchasing power, alongside the full year-by-year trajectory table.",
    ],
    faq: [
        {
            question: "What is the difference between Future Cost and Purchasing Power?",
            answer: "Future Cost answers 'How much will a ₹1,00,000 item cost in 10 years at 6% inflation?' (₹1,79,085). Purchasing Power answers 'What will ₹1,00,000 in cash buy in 10 years compared to today's prices?' (₹55,839). They represent the two perspectives of compound monetary debasement.",
        },
        {
            question: "What is the Rule of 70 in inflation calculations?",
            answer: "The Rule of 70 is a mental math model for estimating how fast purchasing power halves. Divide 70 by the annual inflation rate (e.g., at 7% inflation, 70 / 7 = 10 years for money to lose 50% of its buying power; at 10% education inflation, purchasing power halves in 7 years).",
        },
        {
            question: "Why does sector inflation (education and healthcare) exceed general CPI?",
            answer: "General CPI is a broad basket dominated by food, energy, and manufactured goods where productivity gains can moderate costs. Specialized services like medical treatments, advanced hospital technology, and higher education face high labor intensity and structural demand pressures, causing historical inflation rates of 10% to 12% in emerging markets.",
        },
        {
            question: "How do I calculate real rate of return on investments?",
            answer: "The approximate real return equals nominal return minus inflation (Real Return ≈ Nominal Return - Inflation Rate). The precise Fisher equation is (1 + Nominal Rate) / (1 + Inflation Rate) - 1. For example, a 12% mutual fund return in a 6% inflation environment yields an effective real return of ~5.66%.",
        },
        {
            question: "Is any of my financial data transmitted to external servers?",
            answer: "No. KaruviLab operates with strict client-side isolation. All calculations, state synchronizations, and schedules are computed directly inside your browser memory with zero tracking.",
        },
    ],
    useCases: [
        "Retirement corpus planning to ensure pension and safe withdrawal rates maintain real purchasing power over 25 to 30 years.",
        "Child higher education funding to account for 10% compound annual fee escalations at universities.",
        "Healthcare and medical emergency fund sizing against 12% hospital and treatment cost inflation.",
        "Evaluating real yields on Fixed Deposits (FDs), government savings bonds, and debt instruments.",
    ],
    examples: [
        {
            input: "Amount: ₹1,00,000 | Rate: 6% (General CPI) | Duration: 10 Years",
            output: "Future Cost: ₹1,79,085 | Purchasing Power: ₹55,839 | Value Loss: 44.2% | Halving Time: ~11.7 yrs",
            description: "Standard 10-year retail price inflation at historical Indian CPI average.",
        },
        {
            input: "Amount: ₹5,00,000 | Rate: 10% (Education Preset) | Duration: 15 Years",
            output: "Future Cost: ₹20,88,624 | Purchasing Power: ₹1,19,696 | Value Loss: 76.1% | Halving Time: ~7.0 yrs",
            description: "Higher education cost escalation modeling for a child born today.",
        },
        {
            input: "Amount: ₹10,00,000 | Rate: 12% (Healthcare Preset) | Duration: 20 Years",
            output: "Future Cost: ₹96,46,293 | Purchasing Power: ₹1,03,667 | Value Loss: 89.6% | Halving Time: ~5.8 yrs",
            description: "Long-term healthcare treatment inflation and critical illness insurance sizing.",
        },
    ],
    commonErrors: [
        {
            error: "Using General CPI for Education or Medical Goals",
            fix: "General CPI (5-6%) severely underestimates specialized sectors like college tuition (10%) and healthcare (12%). Use the sector presets for accurate goal planning.",
        },
        {
            error: "Confusing Nominal Balances with Real Purchasing Power",
            fix: "A fixed bank balance does not decrease numerically, but its ability to buy real-world goods decreases every single year that inflation is positive.",
        },
    ],
    alternatives: ["US Bureau of Labor Statistics CPI Calculator", "Reserve Bank of India Inflation Data", "World Bank Economic Indicators"],
};
