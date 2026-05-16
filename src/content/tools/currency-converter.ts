import { ToolContent } from '../../registry/types';

export const currencyConverter: ToolContent = {
  detailedDescription:
    "Convert between world currencies using live exchange rates fetched from a public API. Supports 150+ currencies including INR, USD, EUR, GBP, JPY, and AED. The rates are updated periodically and the conversion itself runs in your browser.",
  howTo: [
    "Select the source currency from the 'From' dropdown.",
    "Select the target currency from the 'To' dropdown.",
    "Enter the amount to convert.",
    "The converted amount and the current exchange rate are displayed instantly.",
    "Click the swap icon to reverse the conversion.",
  ],
  faq: [
    {
      question: "How current are the exchange rates?",
      answer:
        "Rates are fetched from a live API and are typically updated every few hours. For financial transactions, always verify with your bank or broker.",
    },
    {
      question: "Are mid-market rates used?",
      answer:
        "Yes. The tool uses mid-market (interbank) rates. Actual conversion rates at banks or money exchanges include a margin.",
    },
    {
      question: "Does it work offline?",
      answer:
        "No. The tool requires an internet connection to fetch current rates. Cached rates may be shown if the API is unreachable.",
    },
  ],
  useCases: [
    "Checking the equivalent cost of a foreign product in INR",
    "Converting travel expenses for reimbursement reports",
    "Comparing prices across countries for international purchases",
    "Quick reference during international money transfers",
  ],
  commonErrors: [
    {
      error: "Rate differs from the bank or money exchange",
      fix: "Banks add a spread of 1–3% to the mid-market rate. This tool shows the mid-market rate only.",
    },
    {
      error: "Currency not found in the list",
      fix: "Some exotic or restricted currencies may not be available. Use the search in the dropdown to verify the currency code.",
    },
  ],
  alternatives: ["XE.com", "Google currency conversion", "OANDA"],
};
