import { ToolContent } from '../../registry/types';

export const salaryCalculator: ToolContent = {
  detailedDescription: `
<p>The KaruviLab Indian Salary & Take-Home Pay Calculator is a high-precision, client-side payroll modeling engine built to deconstruct Indian Cost to Company (CTC) packages into exact monthly and annual in-hand earnings. Operating 100% locally in your browser with zero telemetry and zero server transmission, it accurately resolves the complex interplay between gross earnings, statutory deductions, and tax liabilities under both the New Tax Regime (FY 2024-25 / FY 2025-26 Budget updates) and the Old Tax Regime.</p>

<p>When an Indian employer presents an offer letter with an annual CTC figure (e.g., ₹12,00,000 or ₹25,00,000), employees frequently overestimate their actual bank deposits. CTC represents the total monetary expense incurred by the company to employ an individual—not the liquid cash transferred on payday. KaruviLab mathematically disassembles this package across key statutory and payroll dimensions:</p>

<ul>
  <li><strong>Salary Component Distribution:</strong> Computes the standard corporate structure including Basic Salary (typically 40% to 50% of CTC), House Rent Allowance (HRA at 50% of Basic), and balancing Special Allowances.</li>
  <li><strong>Employee Provident Fund (EPF):</strong> Evaluates both the Employer EPF (12% of Basic, included within CTC) and Employee EPF (12% of Basic, deducted from Gross Salary) to prevent double-counting illusions.</li>
  <li><strong>Professional Tax (PT):</strong> Enforces the statutory state-level professional tax deduction (standardized at ₹200 per month / ₹2,400 annually, deductible under Section 16(iii) in the Old Regime).</li>
  <li><strong>New Tax Regime (FY 2024-25 / 2025-26):</strong> Implements the revised slab structure with an enhanced Standard Deduction of ₹75,000 for salaried employees, Section 87A tax rebate up to ₹25,000 for taxable income up to ₹7,00,000 (making income up to ₹7.75 Lakh completely tax-free), marginal relief, and 4% Health & Education Cess.</li>
  <li><strong>Old Tax Regime Support:</strong> Evaluates the legacy tax slab architecture with the ₹50,000 Standard Deduction, Section 80C deductions (up to ₹1.5 Lakh including EPF, PPF, ELSS, life insurance), Section 80D medical insurance, and Section 10(13A) HRA exemption.</li>
  <li><strong>Direct Comparative Transparency:</strong> Gives engineers, managers, and prospective job candidates clear visibility into their exact net take-home pay before and after signing an employment contract.</li>
</ul>

<p>All payroll computations execute instantly in your browser's local sandbox memory. Your sensitive compensation figures, employer details, and personal deductions remain strictly confidential on your machine.</p>
`,
  howTo: [
    "<strong>Enter Annual CTC:</strong> Type or slide your total Cost-to-Company compensation figure (e.g., ₹12,00,000).",
    "<strong>Select Tax Regime:</strong> Toggle between the New Tax Regime (default with ₹75,000 standard deduction) or Old Tax Regime.",
    "<strong>Adjust Component Percentages (Optional):</strong> Customize your Basic Salary ratio or provide additional tax-saving deductions under Section 80C/80D/HRA exemption.",
    "<strong>Inspect Paycheck Breakdown:</strong> Review your Net Monthly In-Hand Pay, Gross Pay, Total Deductions, Income Tax TDS, and full Tax Slab Distribution.",
  ],
  faq: [
    {
      question: "What is the difference between CTC, Gross Salary, and In-Hand Salary?",
      answer: "Cost to Company (CTC) is the total annual expense incurred by the employer, including employer EPF and non-cash provisions. Gross Salary is your total earnings before employee deductions (Gross = CTC − Employer EPF). In-Hand (Take-Home) Salary is what you actually receive in your bank account after subtracting Employee EPF, Professional Tax, and Income Tax TDS.",
    },
    {
      question: "What are the New Tax Regime slabs for salaried employees in FY 2024-25?",
      answer: "Under the New Tax Regime (FY 2024-25 / FY 2025-26), salaried individuals receive a Standard Deduction of ₹75,000. The income tax slabs on taxable income are: ₹0–₹3L (0%), ₹3L–₹7L (5%), ₹7L–₹10L (10%), ₹10L–₹12L (15%), ₹12L–₹15L (20%), and Above ₹15L (30%). With Section 87A rebate, annual income up to ₹7.75 Lakh has zero tax liability.",
    },
    {
      question: "How is EPF (Provident Fund) calculated on salary?",
      answer: "EPF is calculated at 12% of Basic Salary. The employer pays 12% (counted within your CTC) and the employee contributes 12% (deducted directly from your monthly gross pay). This means 24% of your Basic Salary is routed into your EPFO retirement account.",
    },
    {
      question: "Is Professional Tax deductible from income tax?",
      answer: "Yes, under Section 16(iii) of the Income Tax Act, Professional Tax (typically ₹2,400 per year) is deductible from gross income under the Old Tax Regime. Under the New Tax Regime, no Chapter VI-A or Section 16(iii) deductions apply beyond the standard ₹75,000 deduction.",
    },
    {
      question: "Which tax regime is better for salaried individuals?",
      answer: "The New Tax Regime is typically more beneficial for individuals with fewer tax-saving investments or deductions below ₹3.75 Lakh. The Old Tax Regime may yield higher savings if you claim significant deductions under Section 80C (₹1.5L), Section 80D (health insurance), HRA exemption, and home loan interest (Section 24b).",
    },
  ],
  useCases: [
    "Evaluating new job offers and comparing net take-home pay between differing CTC structures.",
    "Deciding whether to opt for the New or Old Tax Regime during company annual tax declarations.",
    "Budgeting monthly household expenses and calculating exact monthly bank deposits.",
    "Understanding corporate payroll deductions, statutory EPF contributions, and TDS liabilities.",
  ],
  examples: [
    {
      label: "₹12 LPA Package (New Tax Regime)",
      input: "Annual CTC: ₹12,00,000 | Regime: New | Basic: 40% (₹4,80,000)",
      output: "Gross Salary: ₹11,42,400 | Income Tax: ₹64,896 | Total Deductions: ₹1,24,896 | In-Hand: ₹10,17,504/yr (₹84,792/mo)",
      description: "Typical ₹12 LPA Indian corporate salary breakdown under the updated New Regime.",
    },
    {
      label: "₹7.5 LPA Package (Zero Tax via Section 87A)",
      input: "Annual CTC: ₹7,50,000 | Regime: New | Basic: 40% (₹3,00,000)",
      output: "Gross Salary: ₹7,14,000 | Taxable Income: ₹6,39,000 | Income Tax: ₹0 (Rebate u/s 87A) | In-Hand: ₹6,75,600/yr (₹56,300/mo)",
      description: "Salaried compensation under ₹7.75L eligible for complete tax rebate.",
    },
    {
      label: "₹25 LPA Package (High Earner Slabs)",
      input: "Annual CTC: ₹25,00,000 | Regime: New | Basic: 40% (₹10,00,000)",
      output: "Gross Salary: ₹23,80,000 | Income Tax: ₹3,66,600 | In-Hand: ₹18,90,400/yr (₹1,57,533/mo)",
      description: "Senior engineering salary breakdown with 30% top tax bracket application.",
    },
  ],
  commonErrors: [
    {
      error: "Dividing Annual CTC by 12 to Estimate Monthly Pay",
      fix: "CTC includes employer EPF and non-cash provisions. Always subtract Employer PF, Employee PF, Professional Tax, and Income Tax TDS to derive true net in-hand pay.",
    },
    {
      error: "Assuming Section 80C Deductions Apply in the New Tax Regime",
      fix: "The New Tax Regime simplifies tax slabs but disallows Chapter VI-A deductions like 80C, 80D, and HRA exemption. Salaried employees only receive the standard ₹75,000 deduction.",
    },
  ],
  alternatives: ["ClearTax In-Hand Salary Calculator", "ET Money Salary Calculator", "AmbitionBox CTC Calculator"],
};
