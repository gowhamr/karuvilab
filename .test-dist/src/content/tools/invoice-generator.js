export const invoiceGenerator = {
    detailedDescription: "Create professional, branded invoices instantly with KaruviLab's Invoice Generator. Our tool offers multiple professional templates, logo customization, and automated tax calculations—all while keeping your business data 100% private. Since it runs entirely in your browser, your sensitive client information never touches our servers.",
    howTo: [
        "Step 1: Choose a visual style (Modern, Professional, or Classic) and upload your company logo.",
        "Step 2: Enter your business details (From) and your client's information (Bill To).",
        "Step 3: Add line items for services or products, specifying quantity and unit price.",
        "Step 4: Set the GST/Tax rate and any applicable discounts.",
        "Step 5: Review the totals, add professional terms or notes, and click 'Download PDF' to save your invoice locally."
    ],
    faq: [
        {
            question: "Is my business data secure?",
            answer: "Yes, 100%. All calculations and PDF generation happen locally in your browser. No business data, client details, or logos are ever uploaded to KaruviLab servers."
        },
        {
            question: "Can I add my company logo?",
            answer: "Yes! You can upload your logo in PNG or JPG format. It will be embedded directly into the generated PDF locally."
        },
        {
            question: "What templates are available?",
            answer: "We offer three professional styles: 'Modern' (minimalist and bold), 'Professional' (structured and formal), and 'Classic' (traditional and clean)."
        },
        {
            question: "Does it support international currencies?",
            answer: "Absolutely. You can customize the currency symbol (e.g., ₹, $, €, £) to suit your global billing requirements."
        }
    ],
    useCases: [
        "Freelancers creating professional billing for international clients",
        "Small business owners generating quick, tax-compliant invoices",
        "Agencies looking for a private, no-signup invoice creation workspace",
        "Consultants needing a simple way to track billable hours and expenses"
    ],
    examples: [
        {
            label: "Modern Service Invoice",
            input: "Logo + Consulting Line Item + 18% GST",
            output: "Minimalist PDF with bold blue accents and total breakdown."
        }
    ]
};
