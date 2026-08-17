export const discountCalculator = {
    detailedDescription: "Calculate the sale price after applying a percentage discount, the percentage discount from original and sale prices, or the original price from a sale price and discount percentage. Also shows total savings. All calculations run instantly in the browser.",
    howTo: [
        "Select the calculation mode: 'Final Price', 'Discount %', or 'Original Price'.",
        "Enter the known values.",
        "The missing value and total savings are displayed immediately.",
    ],
    faq: [
        {
            question: "Can I apply multiple discounts?",
            answer: "Apply them sequentially: calculate the price after the first discount, then apply the second discount to that result. The total is not the sum of both percentages.",
        },
        {
            question: "How do I find the original price from a sale price?",
            answer: "Use the 'Original Price' mode. Enter the sale price and the discount percentage and the tool back-calculates: Original = Sale / (1 - Discount/100).",
        },
    ],
    useCases: [
        "Checking the final price of a product during a sale",
        "Calculating how much you save with a coupon code",
        "Finding the original price of a clearance item",
        "Comparing two sales offers to find the better deal",
    ],
    examples: [
        {
            label: "30% off ₹2,500",
            input: "Original: ₹2500, Discount: 30%",
            output: "Sale price: ₹1750, Savings: ₹750",
        },
    ],
    commonErrors: [
        {
            error: "Combined discounts don't add up to the sum of percentages",
            fix: "Stacked discounts are multiplicative, not additive. A 20% then 10% discount is equivalent to a 28% total discount, not 30%.",
        },
        {
            error: "Result is the discount amount, not the final price",
            fix: "Ensure you are viewing the 'Final Price' field, not the 'Savings' field.",
        },
    ],
    alternatives: ["Calculator.net Discount Calculator", "Omni Calculator", "Google search ('X% of Y')"],
};
