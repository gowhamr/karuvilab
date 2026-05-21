import { ToolContent } from '../../registry/types';

export const invoiceGenerator: ToolContent = {
  detailedDescription: "Invoice Generator is a privacy-focused tool to create professional invoices without any server-side storage. All your business and client data stays in your browser.",
  howTo: [
    "Fill in your business details (name, address).",
    "Enter your client's information.",
    "Add line items for services or products, including quantity and price.",
    "Set the tax percentage if applicable.",
    "Preview the invoice and click 'Download PDF' to save it."
  ],
  faq: [
    {
      question: "Is my business data secure?",
      answer: "Yes, 100% secure. We do not store any invoice data. All calculations and PDF generation happen in your browser."
    },
    {
      question: "Can I add my logo?",
      answer: "Currently, this version supports text-based details. Logo support is planned for future updates."
    }
  ]
};
