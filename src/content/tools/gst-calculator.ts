import { ToolContent } from '../../registry/types';

export const gstCalculator: ToolContent = {
  detailedDescription:
    "Add GST to a base price or extract (remove) GST from an inclusive price for any Indian GST slab (5%, 12%, 18%, 28%). Shows CGST, SGST, and IGST breakdowns. Useful for invoicing and tax reconciliation. All calculations are local.",
  howTo: [
    "Enter the amount (base price or GST-inclusive price).",
    "Select the GST rate from the dropdown (5%, 12%, 18%, 28%).",
    "Choose 'Add GST' or 'Remove GST'.",
    "View the breakdown: base amount, CGST, SGST (or IGST), and total.",
  ],
  faq: [
    {
      question: "What is the difference between CGST/SGST and IGST?",
      answer:
        "For intrastate transactions (within the same state), GST is split into CGST (central) and SGST (state) at half the rate each. For interstate transactions, the full GST is charged as IGST.",
    },
    {
      question: "How do I reverse-calculate GST from an inclusive price?",
      answer:
        "Select 'Remove GST'. For example, a ₹118 inclusive amount at 18% GST has a base price of ₹100 (₹118 / 1.18).",
    },
    {
      question: "Is cess included in the calculation?",
      answer:
        "No. Cess (e.g., compensation cess on luxury goods) is not included. Add it manually on top of the calculated GST.",
    },
  ],
  useCases: [
    "Calculating the GST amount to add on a client invoice",
    "Finding the pre-GST price from a GST-inclusive bill",
    "Verifying the GST breakdown on a purchase receipt",
    "Computing CGST and SGST split for state-level filings",
  ],
  commonErrors: [
    {
      error: "GST amount seems too high",
      fix: "Ensure you selected the correct GST slab. Common slabs are 5% for essentials, 12%/18% for goods and services, and 28% for luxury items.",
    },
    {
      error: "Result differs slightly from the invoice",
      fix: "Invoices may round amounts differently. The tool uses standard rounding — minor differences of ₹0.01 are normal.",
    },
  ],
  alternatives: ["GST.gov.in calculator", "ClearTax GST Calculator", "Zoho GST Calculator"],
};
