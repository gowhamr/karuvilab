export const discountCalculator = {
    detailedDescription: `
<p>The KaruviLab Discount Calculator is a precision, browser-native retail arithmetic tool designed to compute sale prices, multi-tier stacked promotional discounts, and localized sales tax impact. Executing 100% locally on your device with zero telemetry and zero server round-trips, it provides clear mathematical step-by-step breakdowns, effective discount percentage derivations, and deep-linkable pricing contracts.</p>

<p>Discounting is fundamental to commercial trade, e-commerce promotions, and clearance sales. While a single flat percentage markdown (e.g. 20% off $1,000) is straightforward, real-world retail transactions frequently introduce complexities:</p>
<ul>
  <li><strong>Double Stacking Discounts:</strong> Combining a storewide clearance sale (e.g. 30% off) with an additional coupon or member discount (e.g. extra 10% off). Rather than simply adding percentages (which would incorrectly yield 40%), secondary discounts apply to the intermediate discounted price, resulting in an effective combined discount of $1 - (0.70 \times 0.90) = 37\%$.</li>
  <li><strong>Post-Discount Sales Tax & VAT:</strong> Calculating sales tax on the net discounted subtotal rather than the full manufacturer suggested retail price (MSRP).</li>
  <li><strong>Target Markdown Optimization:</strong> Determining the exact discount percentage required to clear inventory down to a specific target cash price.</li>
  <li><strong>Reverse Original MSRP Recovery:</strong> Back-calculating pre-sale sticker prices from final discounted receipts ($P_{\\text{original}} = P_{\\text{sale}} / (1 - d)$).</li>
</ul>

<p>All calculations run locally in your browser memory. No shopping carts, product prices, or merchant margins are ever uploaded or tracked.</p>
`,
    howTo: [
        "<strong>Select Calculation Mode:</strong> Choose 'Calculate Discount & Tax', 'Find Required Discount %', or 'Find Original MSRP'.",
        "<strong>Enter Item Price:</strong> Input the original price or final receipt total.",
        "<strong>Set Discount & Stacking Rates:</strong> Enter your primary discount percentage, optional secondary coupon rate, and local sales tax rate.",
        "<strong>Review Net Savings:</strong> View your final payable price, total savings breakdown, effective discount rate, and tax total.",
    ],
    faq: [
        {
            question: "How does stacked (double) discounting work?",
            answer: "Stacked discounts apply sequentially. The first discount reduces the original price to an intermediate subtotal, and the second discount is calculated on that lower subtotal. For example, ₹1,000 with 20% off is ₹800, and an extra 10% off ₹800 saves an additional ₹80, yielding a final price of ₹720 (28% total discount, not 30%).",
        },
        {
            question: "Is sales tax applied before or after discounts?",
            answer: "In most tax jurisdictions (such as US State Sales Tax, European VAT, and Indian GST), tax is legally assessed on the actual discounted transaction value (the net sale price), not the original list price.",
        },
        {
            question: "How do I calculate the original price before a discount?",
            answer: "Use the 'Find Original MSRP' mode, enter the final price you paid and the discount percentage. The formula is: Original Price = Sale Price / (1 - Discount/100).",
        },
        {
            question: "Can I use this for clearance sales and coupons?",
            answer: "Yes. You can enter the primary clearance markdown in the primary discount field and your promo coupon code in the extra discount field to calculate your exact checkout total.",
        },
        {
            question: "Is my pricing or shopping data stored?",
            answer: "No. KaruviLab operates with a strict offline-first architecture. All calculations and formulas run entirely in your local browser memory.",
        },
    ],
    useCases: [
        "Checking checkout totals during Black Friday, festive clearance, and promotional retail sales.",
        "Evaluating stacked discount promotions with member loyalty coupons.",
        "Back-calculating original pre-discount sticker prices for expense reporting.",
        "Calculating merchant profit margins and clearance markdown thresholds.",
    ],
    examples: [
        {
            input: "Original: ₹1,000 | Primary Discount: 20% | Extra Discount: 10% | Tax: 5%",
            output: "Final Payable: ₹756 (Total Savings: ₹280 | Effective Discount: 28% | Tax: ₹36)",
            description: "Comprehensive stacked discount with sales tax."
        },
        {
            input: "Original: ₹2,500 | Target Price: ₹1,875",
            output: "Required Discount: 25% (Total Savings: ₹625)",
            description: "Finding required markdown percentage to reach target clearance price."
        },
        {
            input: "Sale Price: ₹800 | Discount: 20%",
            output: "Original Price: ₹1,000 (You saved: ₹200)",
            description: "Reverse original price calculation."
        }
    ],
    commonErrors: [
        {
            error: "Adding Stacked Discount Percentages Directly",
            fix: "Do not add 20% + 10% to get 30%. Stacked discounts are multiplicative and yield an effective 28% discount.",
        },
        {
            error: "Target Price Exceeding Original Price",
            fix: "In discount calculations, target price must be less than or equal to the original price.",
        },
    ],
    alternatives: ["Calculator.net Discount Calculator", "Omni Calculator Discount", "Google Search ('X% off Y')"],
};
