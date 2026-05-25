import { ToolContent } from '../../registry/types';

export const gstCalculator: ToolContent = {
  detailedDescription:
    "An easy-to-use Indian GST Calculator to add or remove GST from any amount. Instantly calculate CGST, SGST, and IGST for standard tax slabs (5%, 12%, 18%, 28%). Whether you are a business owner creating an invoice or a consumer verifying a bill, our tool provides precise tax breakdowns entirely in your browser.",
  howTo: [
    "Step 1: Enter the initial amount in the 'Amount' field.",
    "Step 2: Select the applicable GST rate (5%, 12%, 18%, or 28%).",
    "Step 3: Choose 'Add GST' to calculate the tax on top of the amount, or 'Remove GST' to extract tax from an inclusive price.",
    "Step 4: Instantly see the breakdown of Net Amount, GST Amount (split into CGST/SGST), and Total Amount.",
  ],
  examples: [
    {
      label: "Adding GST (Intrastate)",
      description: "If you have a service worth ₹1,000 and want to add 18% GST for a local client:",
      input: "₹1,000 + 18% GST",
      output: "Base: ₹1,000 | CGST: ₹90 | SGST: ₹90 | Total: ₹1,180"
    },
    {
      label: "Removing GST (Inclusive Price)",
      description: "If you bought a product for ₹590 (inclusive of 18% GST) and want to find the base price:",
      input: "₹590 (Remove 18%)",
      output: "Base: ₹500 | GST: ₹90 | Total: ₹590"
    }
  ],
  faq: [
    {
      question: "How is GST calculated in India?",
      answer:
        "GST is calculated by multiplying the base price by the tax rate. Formula for Adding GST: GST Amount = (Base Price × Rate) / 100. Formula for Removing GST: Base Price = Total Price / (1 + (Rate / 100)).",
    },
    {
      question: "When should I use IGST vs CGST/SGST?",
      answer:
        "Use CGST (Central) and SGST (State) for transactions within the same state (Intrastate). Use IGST (Integrated) for transactions between two different states (Interstate). The total tax amount remains the same.",
    },
    {
      question: "What are the common GST slabs?",
      answer:
        "Current standard GST slabs in India are 5% (essentials), 12% (standard items), 18% (most services and products), and 28% (luxury/sin goods). Some items like gold carry a 3% rate.",
    },
    {
      question: "Is this GST calculator free to use?",
      answer:
        "Yes, KaruviLab's GST calculator is 100% free, private, and works offline. No data is ever uploaded to a server.",
    },
  ],
  useCases: [
    "Businesses creating tax-compliant invoices",
    "Accountants reconciling monthly tax filings",
    "Consumers checking the accuracy of restaurant or shopping bills",
    "Freelancers calculating the right amount to charge local vs international clients",
  ],
  commonErrors: [
    {
      error: "Selecting the wrong slab",
      fix: "Verify the HSN/SAC code of your product or service to find the exact applicable GST rate (e.g., most IT services are 18%).",
    },
    {
      error: "Confusing inclusive and exclusive prices",
      fix: "If the price already includes tax, use the 'Remove GST' mode to find the true base price.",
    },
  ],
  alternatives: ["Official GST.gov.in Tool", "ClearTax", "Tally Solutions"],
};
