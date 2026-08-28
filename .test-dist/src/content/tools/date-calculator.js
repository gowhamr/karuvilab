export const dateCalculator = {
    detailedDescription: `
<p>The KaruviLab Date Calculator provides a deterministic, high-precision calendar math engine to calculate the exact difference between two dates or add/subtract time units (days, business days, weeks, months, years) from any reference date. Whether you are scheduling project milestones, determining contractual notice periods, or measuring calendar intervals, this tool delivers instant, reproducible results with zero server communication.</p>

<p>Accurate date arithmetic requires solving the complexities of the Gregorian calendar: variable month lengths (28, 29, 30, and 31 days), quadrennial and centurial leap-year rules, and weekend boundaries. Unlike naive Unix timestamp subtraction that introduces discrepancies due to local timezone offsets or Daylight Saving Time (DST) transitions, KaruviLab uses Howard Hinnant's pure civil integer algorithm. Every calculation steps through exact civil day counts and forward calendar milestones.</p>

<p>The tool includes two core calculation modes: <strong>Date Difference</strong> (calculating years, months, days, total elapsed days, weeks, hours, business days, and weekend days between any two dates) and <strong>Add / Subtract Time</strong> (projecting arrival dates with automatic month-end clamping and business day skipping).</p>

<p>All calculations run 100% locally on your device within the browser JavaScript runtime. KaruviLab operates on a zero-upload principle: your dates, project schedules, and calculation parameters never leave your browser.</p>
`,
    howTo: [
        "<strong>Choose Calculation Mode:</strong> Select the 'Difference' tab to measure the interval between two dates, or the 'Add / Subtract' tab to project a past or future date.",
        "<strong>Configure Dates:</strong> In Difference mode, enter the Start Date and End Date. In Add/Subtract mode, enter the Base Date.",
        "<strong>Set Operation & Units:</strong> When adding or subtracting, choose the operation (Add or Subtract), specify the numerical amount, and select the unit (Days, Business Days, Weeks, Months, or Years).",
        "<strong>Inspect Results & Share:</strong> View exact calendar breakdowns (years, months, days), total days, business days, and resulting dates. Use the Share button to generate a canonical URL that reproduces the exact calculation for others.",
    ],
    faq: [
        {
            question: "How does the date calculator handle leap years and February 29?",
            answer: "The engine implements the full Gregorian calendar rule: years divisible by 4 are leap years, except centuries unless divisible by 400. Leap days (February 29) are correctly evaluated in all distance, month, and year additions.",
        },
        {
            question: "How are business days calculated?",
            answer: "Business day calculations consider Mondays through Fridays as working days and exclude Saturdays and Sundays. When adding business days, the engine steps forward across weekends to compute the exact business delivery date.",
        },
        {
            question: "What is month-end clamping when adding months?",
            answer: "When adding months to dates at the end of a month (e.g. January 31 + 1 month), the engine clamps the target date to the last valid day of the target month (February 28 in common years, February 29 in leap years) rather than overflowing into March.",
        },
        {
            question: "Why is pure civil integer arithmetic better than timestamp subtraction?",
            answer: "Timestamp subtraction can suffer from 1-hour errors during Daylight Saving Time (DST) clock changes or timezone offsets. Pure civil date math operates strictly on integer calendar days, guaranteeing 100% mathematical precision.",
        },
        {
            question: "Is any date data uploaded to external servers?",
            answer: "No. KaruviLab operates entirely client-side. No inputs, calculations, or timestamps are sent across the network or stored in remote databases.",
        },
    ],
    useCases: [
        "Determining project delivery dates, sprint intervals, and sprint end dates in business days.",
        "Calculating exact notice periods, lease durations, and contract renewal deadlines.",
        "Computing elapsed time between historical events or personal milestones.",
        "Tracking age in total days, weeks, and hours.",
        "Calculating warranty expiry dates and financial maturity periods.",
    ],
    examples: [
        {
            input: "Start Date: 2024-01-01 | End Date: 2024-06-15",
            output: "5 Months, 14 Days (Total Days: 166, Business Days: 119)",
            description: "Standard interval calculation spanning the leap year month of February 2024."
        },
        {
            input: "Base Date: 2024-05-10 (Friday) | Operation: Add 5 Business Days",
            output: "Resulting Date: 2024-05-17 (Friday)",
            description: "Business day calculation skipping Saturday May 11 and Sunday May 12."
        },
        {
            input: "Base Date: 2024-01-31 | Operation: Add 1 Month",
            output: "Resulting Date: 2024-02-29 (Thursday)",
            description: "Month addition with leap year month-end clamping."
        }
    ],
    commonErrors: [
        {
            error: "Invalid Date Format",
            fix: "Ensure date inputs use a valid calendar date in DD / MM / YYYY or YYYY-MM-DD format with valid month (1-12) and day (1-31) values.",
        },
        {
            error: "Missing Date Value",
            fix: "Provide both start and end dates for difference mode, or a valid base date for add/subtract operations.",
        },
    ],
    alternatives: ["timeanddate.com Date Calculator", "Calculator.net", "Wolfram Alpha"],
};
