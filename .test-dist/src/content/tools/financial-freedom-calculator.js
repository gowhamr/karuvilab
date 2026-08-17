export const financialFreedomCalculator = {
    detailedDescription: `
The **Financial Freedom Calculator** (often associated with the FIRE movement—Financial Independence, Retire Early) is a comprehensive planning tool designed to help you determine exactly when you can safely stop working for money. It calculates your required retirement corpus, estimates the years remaining until you reach financial independence, and projects your net worth over your lifetime.

Achieving financial independence requires careful planning and a clear understanding of the math behind your savings, investments, and expenses. This calculator takes the guesswork out of the equation by using standard FIRE principles, including the Safe Withdrawal Rate (SWR) and inflation-adjusted projections, to provide a clear roadmap to your financial goals.

### Why You Need a Financial Freedom Calculator
Many people dream of retiring early or reaching a point where work is optional, but they don't know how much money they actually need. A common misconception is that you need an arbitrary large sum (like ₹10 Crore or $1 Million) to retire. In reality, your required corpus depends entirely on your annual expenses and your expected investment returns.

Our **Financial Freedom Calculator** helps you understand the direct relationship between your current savings rate, your lifestyle expenses, and your retirement timeline. By adjusting variables like your monthly savings or your expected return rate, you can immediately see how small changes today impact your financial future.

### Core Concepts of Financial Independence
- **The Safe Withdrawal Rate (SWR):** Often referred to as the "4% Rule," this is the percentage of your total corpus you can withdraw annually in retirement without running out of money. If your SWR is 4%, your required corpus is 25 times your annual expenses.
- **Required Corpus:** The total amount of invested money you need to generate enough passive income to cover your living expenses forever.
- **Savings Rate:** The percentage of your income that you save and invest. A higher savings rate is the most powerful lever you have for reducing your time to financial independence.
- **Inflation:** The rate at which the cost of living increases. Your investments must grow faster than inflation to maintain their purchasing power.

In alignment with KaruviLab's strict privacy standards, this calculator processes all complex projections and data handling entirely within your browser. It operates **100% offline-capable** after the first load, ensuring your personal financial numbers remain securely on your device.
`,
    howTo: [
        "**Step 1:** Enter your **Current Age** and your **Target Retirement Age**.",
        "**Step 2:** Input your **Current Savings** (invested assets) and your post-tax **Monthly Income** and **Monthly Expenses**.",
        "**Step 3:** Set your expectations for the market with **Expected Annual Return**.",
        "**Step 4:** Review the results panel to see your **Required Corpus** and the exact **Years to FI**.",
        "**Step 5:** Open the Advanced Settings to fine-tune inflation, income growth, and withdrawal rates.",
        "**Step 6:** Save different scenarios (e.g., 'Aggressive Savings' vs 'Normal') and compare them side-by-side using the Compare feature."
    ],
    faq: [
        {
            question: "What is the 4% Rule?",
            answer: "The 4% rule is a rule of thumb used to determine a safe withdrawal rate for retirement. It suggests that if you withdraw 4% of your total retirement portfolio in your first year of retirement, and adjust that amount for inflation in subsequent years, your money should last at least 30 years."
        },
        {
            question: "Does this calculator account for inflation?",
            answer: "Yes. The calculator uses the inflation rate you provide to adjust your future required expenses, meaning the 'Required Corpus' displayed is the actual inflated amount you will need at your target retirement age."
        },
        {
            question: "What should I enter for 'Expected Annual Return'?",
            answer: "This depends on your investment portfolio. Historically, a diversified equity portfolio might return 10-12% nominally in India (or 7-10% globally). For conservative estimates, you might use 8-10% for equity-heavy portfolios, or lower if you hold more debt."
        },
        {
            question: "Why does it say 'Savings Shortfall'?",
            answer: "If your projected net worth at your target retirement age is less than your required corpus, the calculator determines how much extra you need to save per month right now to close that gap."
        },
        {
            question: "Is my financial data safe?",
            answer: "Absolutely. All calculations are performed locally in your browser. No data is sent to our servers. If you use the 'Save Scenario' feature, it is stored in your browser's local IndexedDB and can be deleted at any time."
        }
    ],
    useCases: [
        "Planning for Early Retirement (FIRE) to determine the exact age you can quit your job.",
        "Standard Retirement Planning to ensure you have enough corpus at age 60.",
        "Scenario Analysis to see how a salary increase or lifestyle inflation impacts your financial timeline.",
        "Visualizing compound interest over long periods using the net worth projection chart."
    ],
    examples: [
        {
            label: "Aggressive FIRE",
            input: "Age: 30, Target: 50, Income: ₹1,50,000, Expenses: ₹60,000, Return: 10%, Inflation: 6%",
            output: "Required Corpus: ₹5.77 Crore | Years to FI: 16 Years",
            description: "A standard FIRE path where a high savings rate (60%) allows for retirement 4 years before the target age."
        },
        {
            label: "Standard Retirement",
            input: "Age: 25, Target: 55, Income: ₹80,000, Expenses: ₹50,000, Return: 12%, Inflation: 5%",
            output: "Required Corpus: ₹5.18 Crore | Years to FI: 25 Years",
            description: "A young professional starting out. Thanks to 30 years of compound interest, they can easily reach their goal."
        }
    ],
    commonErrors: [
        {
            error: "Using Nominal Returns vs Real Returns",
            fix: "Ensure you are entering your nominal expected return (e.g., 12%) and the expected inflation rate (e.g., 6%). The calculator handles the math to find your 'real' return. Do not subtract inflation from your return rate manually."
        },
        {
            error: "Including Illiquid Assets in Current Savings",
            fix: "Only include assets that can be used to generate income in retirement (e.g., Stocks, Mutual Funds, FDs, EPF). Do not include the primary house you live in, as it won't generate cash flow to cover expenses."
        }
    ]
};
