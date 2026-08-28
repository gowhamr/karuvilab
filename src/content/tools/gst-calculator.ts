import { ToolContent } from '../../registry/types';

export const gstCalculator: ToolContent = {
  detailedDescription: `
<p>The KaruviLab GST Calculator is a high-precision, browser-native tax arithmetic engine engineered for business owners, freelance professionals, chartered accountants, and consumers navigating the Indian Goods and Services Tax (GST) framework. Operating entirely client-side with zero network latency and zero server-side telemetry, this calculator delivers deterministic computations for forward tax addition (exclusive), reverse tax extraction (inclusive), and statutory tax-component splits (CGST, SGST, and IGST).</p>

<p>India's Goods and Services Tax operates on a dual transaction architecture designed to maintain fiscal balance between the Union Government and individual State Governments. Depending on the supply origin and destination, every commercial invoice is classified under one of two transactional paradigms:</p>
<ul>
  <li><strong>Intrastate Transactions (Within the Same State or Union Territory):</strong> Tax liability is divided equally into two components: <strong>Central GST (CGST)</strong> collected by the Central Government, and <strong>State GST (SGST)</strong> or Union Territory GST (UTGST) collected by the local State Government. For example, on an 18% slab, 9% is allocated to CGST and 9% to SGST.</li>
  <li><strong>Interstate Transactions (Between Two Different States/UTs):</strong> The entire tax liability is levied as <strong>Integrated GST (IGST)</strong> collected by the Central Government, which subsequently apportions the destination state's share. On an 18% slab, the entire 18% is billed as IGST.</li>
</ul>

<p>The standard tax rate slabs established by the GST Council include <strong>0%</strong> (essential food items, fresh agricultural produce), <strong>3%</strong> (precious metals including gold and silver), <strong>5%</strong> (household necessities, packaged food, economy transport), <strong>12%</strong> (processed foods, business software, standard apparel), <strong>18%</strong> (IT services, consulting, banking, consumer electronics, standard industrial goods), and <strong>28%</strong> (luxury automobiles, sin goods, aerated beverages, high-end hospitality).</p>

<p><strong>The Mathematical Difference: Exclusive vs. Inclusive Tax Computation:</strong></p>
<p>Accurate accounting requires distinguishing between tax-exclusive (cost before tax) and tax-inclusive (MRP or final checkout value) pricing:</p>
<ul>
  <li><strong>Exclusive (Add GST):</strong> When billing a client or pricing a service with a base net quote $P_{\\text{base}}$ at tax rate $r\\%$, the tax amount is $T = (P_{\\text{base}} \\times r) / 100$, and the final gross invoice payable is $P_{\\text{gross}} = P_{\\text{base}} + T$.</li>
  <li><strong>Inclusive (Remove GST / Reverse Extraction):</strong> When you have a gross retail price or maximum retail price (MRP) that already includes GST and need to isolate the underlying taxable base value, applying a direct percentage subtraction ($P_{\\text{gross}} - r\\%$) is mathematically incorrect. Because the tax percentage was originally calculated on the smaller base figure, extracting tax requires division by the tax multiplier: $P_{\\text{base}} = P_{\\text{gross}} / (1 + r / 100)$, and the extracted tax component is $T = P_{\\text{gross}} - P_{\\text{base}}$.</li>
</ul>

<p>All arithmetic operations occur locally inside your device's JavaScript runtime. No invoice figures, client quotes, or commercial turnover numbers are ever transmitted, stored, or processed externally.</p>
`,
  howTo: [
    "<strong>Select Calculation Mode:</strong> Choose 'Add GST (Exclusive)' to calculate tax on a net base quote, or 'Remove GST (Inclusive)' to extract the underlying taxable amount from an MRP or gross bill.",
    "<strong>Enter Monetary Amount:</strong> Input your base invoice value or gross inclusive amount in Indian Rupees (INR).",
    "<strong>Select GST Rate Slab:</strong> Click any standard tax slab preset (3%, 5%, 12%, 18%, 28%) or input a customized rate percentage.",
    "<strong>Set Transaction Jurisdiction:</strong> Toggle 'Interstate Sale' on if the transaction spans across different states (levying IGST), or leave it off for intrastate sales (splitting equally into CGST and SGST).",
    "<strong>Copy or Share Breakdown:</strong> Review your Net Amount, Tax Total, Gross Total, and statutory tax breakdown, then copy the summary for your books or invoices.",
  ],
  faq: [
    {
      question: "What is the difference between GST Inclusive and GST Exclusive amounts?",
      answer: "A GST Exclusive amount represents the net price of goods or services before tax is added. A GST Inclusive amount represents the final gross total (such as an MRP or checkout price) that already includes the applicable GST component.",
    },
    {
      question: "Why can't I just subtract 18% from a GST-inclusive price of ₹118 to get ₹100?",
      answer: "Subtracting 18% from ₹118 gives ₹118 - ₹21.24 = ₹96.76, which is incorrect because 18% was calculated on ₹100, not ₹118. To extract the base price accurately from an inclusive amount, you must divide by (1 + rate/100), i.e., ₹118 / 1.18 = ₹100.",
    },
    {
      question: "How is GST split between CGST, SGST, and IGST?",
      answer: "For sales within the same state (intrastate), GST is split equally into Central GST (50%) and State GST (50%). For sales between different states (interstate), 100% of the tax is billed as Integrated GST (IGST).",
    },
    {
      question: "What are the standard GST rate slabs in India?",
      answer: "The primary GST tax rate slabs in India are 0% (essential food/grains), 3% (gold, silver, and precious stones), 5% (basic necessities), 12% (processed foods and standard goods), 18% (services, electronics, consulting), and 28% (luxury and sin goods).",
    },
    {
      question: "Is any financial or pricing data uploaded to a server?",
      answer: "No. KaruviLab operates with a strict offline-first, client-side execution model. All calculations run strictly in your browser memory with zero tracking, logging, or server round-trips.",
    },
  ],
  useCases: [
    "Generating B2B invoices with accurate CGST and SGST or IGST line items.",
    "Extracting net taxable base amounts and tax components from consumer MRP receipts.",
    "Verifying restaurant and retail billing receipts to ensure accurate tax computation.",
    "Calculating quarterly GST liabilities and reconciling Input Tax Credit (ITC) ledgers.",
  ],
  examples: [
    {
      input: "Amount: ₹50,000 | Slab: 18% | Type: Exclusive (Add GST) | Supply: Intrastate",
      output: "Net Base: ₹50,000 | CGST (9%): ₹4,500 | SGST (9%): ₹4,500 | Total Gross: ₹59,000",
      description: "Standard B2B consulting invoice with intrastate CGST and SGST split.",
    },
    {
      input: "Amount: ₹23,600 | Slab: 18% | Type: Inclusive (Remove GST) | Supply: Interstate",
      output: "Net Base: ₹20,000 | IGST (18%): ₹3,600 | Total Gross: ₹23,600",
      description: "Extracting net price and IGST component from an electronics retail MRP.",
    },
    {
      input: "Amount: ₹10,000 | Slab: 5% | Type: Exclusive (Add GST) | Supply: Intrastate",
      output: "Net Base: ₹10,000 | CGST (2.5%): ₹250 | SGST (2.5%): ₹250 | Total Gross: ₹10,500",
      description: "Essential goods invoice calculation with 5% tax slab.",
    },
  ],
  commonErrors: [
    {
      error: "Direct Percentage Subtraction on Inclusive Prices",
      fix: "Never compute base price as Gross - (Gross × Rate). Always divide gross by (1 + Rate / 100) to account for asymmetric percentage scaling.",
    },
    {
      error: "Incorrect Tax Split for Interstate Sales",
      fix: "Do not charge CGST and SGST for interstate shipments. Interstate transactions require 100% IGST allocation.",
    },
  ],
  alternatives: [
    "ClearTax GST Calculator",
    "India Filings GST Calculator",
    "MasterGST Tax Portal",
  ],
};
