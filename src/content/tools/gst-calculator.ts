import { ToolContent } from '../../registry/types';

export const gstCalculator: ToolContent = {
  detailedDescription: `
    <p>The GST (Goods and Services Tax) Calculator is an essential financial tool for business owners, accountants, and consumers in India. It simplifies the complex process of calculating tax breakdowns for various tax slabs, including 5%, 12%, 18%, and 28%. Whether you need to find the base price of an item or calculate the final invoice amount with tax included, this tool provides instant and accurate results.</p>
    
    <p>Understanding the difference between 'Inclusive' and 'Exclusive' GST is crucial for accurate bookkeeping. When you have a base price, our tool adds the tax (Exclusive). If you have the total price and need to find the original amount, our tool extracts the tax (Inclusive). This dual functionality ensures that you can verify bills or create accurate price lists without manual mathematical errors.</p>

    <p>Privacy is a key feature of KaruviLab. Financial data is sensitive, and by using our local-first calculator, you ensure that your pricing strategies and transaction amounts never leave your device. The tool also provides a clear split of CGST, SGST, and IGST, making it perfect for preparing GST-compliant invoices for both intra-state and inter-state transactions.</p>
  `,
  howTo: [
    "<strong>Enter Amount:</strong> Type the numerical value you want to calculate in the 'Amount' field.",
    "<strong>Select Slab:</strong> Choose the applicable GST rate (5%, 12%, 18%, or 28%) from the dropdown.",
    "<strong>Choose Type:</strong> Select 'Add GST' for exclusive amounts or 'Remove GST' for inclusive amounts.",
    "<strong>Review Split:</strong> Observe the breakdown of Net Amount, CGST, SGST, and the Total Amount.",
    "<strong>Copy Results:</strong> Use the results to populate your invoices or verify your purchase bills.",
  ],
  faq: [
    { question: "What is CGST and SGST?", answer: "For intra-state transactions, GST is split equally into Central GST (CGST) and State GST (SGST)." },
    { question: "When should I use IGST?", answer: "Integrated GST (IGST) is applied to inter-state transactions and is equal to the total GST rate." },
    { question: "Is this calculator updated for 2026?", answer: "Yes, it uses the standard tax slabs and formulas applicable for the current fiscal year." },
    { question: "Does it work for service taxes?", answer: "Yes, it works for any good or service covered under the GST regime." },
    { question: "Is my data stored?", answer: "No. Like all KaruviLab tools, all calculations are performed locally and no data is saved on our servers." }
  ],
  examples: [
    { label: "Tax Addition", input: "Amount: 1000, Slab: 18%, Mode: Add", output: "Net: 1000, GST: 180, Total: 1180", description: "Calculating the final price for a service with 18% GST added." },
    { label: "Tax Removal", input: "Amount: 1180, Slab: 18%, Mode: Remove", output: "Net: 1000, GST: 180, Total: 1180", description: "Extracting the original price from a GST-inclusive MRP." },
    { label: "Food Bill", input: "Amount: 500, Slab: 5%, Mode: Add", output: "Net: 500, GST: 25, Total: 525", description: "Verifying a restaurant bill with the standard 5% tax rate." }
  ]
};
