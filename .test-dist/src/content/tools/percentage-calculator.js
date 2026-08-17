export const percentageCalculator = {
    detailedDescription: "A versatile percentage calculator covering the most common percentage operations: percentage of a number, percentage change between two values, and finding what percentage one number is of another. Results are instant and displayed with working steps for clarity.",
    howTo: [
        "Select the type of calculation from the tabs.",
        "Enter the required values in the input fields.",
        "The result is calculated and displayed instantly.",
        "Use the 'Show steps' toggle to see the formula and working.",
    ],
    faq: [
        {
            question: "How do I calculate a percentage increase?",
            answer: "Use the 'Percentage Change' tab. Enter the original value and the new value. The tool calculates ((new - original) / original) × 100.",
        },
        {
            question: "What is 'X is what % of Y'?",
            answer: "This answers questions like 'What percentage of 200 is 50?' The answer is (50 / 200) × 100 = 25%.",
        },
        {
            question: "How do I find Y% of X?",
            answer: "Use the 'Percentage Of' tab. Enter X as the base and Y as the percentage. The result is (Y / 100) × X.",
        },
    ],
    useCases: [
        "Calculating a percentage discount on a purchase",
        "Finding the percentage increase in monthly sales",
        "Computing the percentage of marks scored in an exam",
        "Splitting a tip as a percentage of a restaurant bill",
    ],
    commonErrors: [
        {
            error: "Result is multiplied by 100 when it shouldn't be",
            fix: "Ensure you're using the correct tab. 'Percentage of' gives the raw number; 'What percent is X of Y' gives the percentage figure.",
        },
    ],
    alternatives: ["Calculator.net Percent Calculator", "RapidTables.com", "Wolfram Alpha"],
};
