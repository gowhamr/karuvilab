export const rdCalculator = {
    detailedDescription: "A Recurring Deposit (RD) allows you to save a fixed amount every month and earn interest similar to an FD. This calculator helps you find the maturity value of your monthly savings, accounting for quarterly compounding which is standard for most Indian banks.",
    howTo: [
        "Enter your monthly deposit amount.",
        "Enter the annual interest rate.",
        "Enter the deposit tenure in months or years.",
        "The tool calculates the total maturity amount and interest earned."
    ],
    faq: [
        { question: "How is RD interest calculated?", answer: "RD interest is usually compounded quarterly. The formula is complex because each monthly installment earns interest for a different duration." },
        { question: "Can I withdraw my RD early?", answer: "Most banks allow premature withdrawal but may charge a small penalty on the interest rate." }
    ],
    useCases: [
        "Disciplined monthly savings for a specific goal",
        "Building a corpus for annual expenses like insurance or school fees",
        "Low-risk monthly investment strategy"
    ],
    alternatives: ["Post Office RD Calculator", "BankBazaar"]
};
