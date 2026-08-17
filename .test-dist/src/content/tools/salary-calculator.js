export const salaryCalculator = {
    detailedDescription: "Break down an Indian CTC (Cost to Company) package into its take-home components: basic salary, HRA, PF, professional tax, income tax (new regime), and net monthly in-hand salary. Uses standard Indian payroll formulas. All calculations are local — no data is sent anywhere.",
    howTo: [
        "Enter your annual CTC in the input field.",
        "Optionally enter your city type (metro/non-metro) for the HRA calculation.",
        "Select the tax regime (old or new) if applicable.",
        "Click 'Calculate' to see the full salary breakdown.",
        "Download or share the breakdown if needed.",
    ],
    faq: [
        {
            question: "Is this calculation accurate for all employers?",
            answer: "The tool uses typical CTC structures. Actual figures may vary by company HR policy, state-specific professional tax rates, and benefits structure.",
        },
        {
            question: "What is included in CTC?",
            answer: "CTC includes basic salary, HRA, special allowances, and employer PF contribution. Actual take-home excludes the employer PF and deducts employee PF, professional tax, and income tax.",
        },
        {
            question: "Which tax regime is used by default?",
            answer: "The new tax regime (introduced under Finance Act 2020, updated in 2023 Budget) is often used as the default. You can switch to the old regime to compare.",
        },
    ],
    useCases: [
        "Understanding your take-home from a job offer",
        "Comparing two job offers with different CTC structures",
        "Estimating income tax liability before filing a return",
        "Explaining salary components to a new employee",
    ],
    commonErrors: [
        {
            error: "Calculated in-hand is much lower than expected",
            fix: "Verify that your CTC input is the annual figure, not the monthly figure. Also check that the PF and PT deductions are correctly set.",
        },
        {
            error: "Tax deduction seems too high",
            fix: "The old tax regime applies deductions and exemptions. Switch to the new regime or add exemptions (80C, HRA) to reduce taxable income.",
        },
    ],
    alternatives: ["ET Money Salary Calculator", "ClearTax Salary Calculator", "AmbitionBox CTC Calculator"],
};
