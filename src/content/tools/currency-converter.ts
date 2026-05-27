import { ToolContent } from '../../registry/types';

export const currencyConverter: ToolContent = {
  detailedDescription: `
    <p>The Currency Converter is a vital tool for international travelers, global business professionals, and savvy online shoppers. Whether you are planning a trip abroad, managing international investments, or comparing prices across global e-commerce platforms, this tool provides instant and accurate conversion results using real-time market data.</p>
    
    <p>Our converter supports over 150+ world currencies, ranging from major global currencies like USD, EUR, and GBP to localized currencies like INR, AED, and JPY. Because KaruviLab is a browser-first platform, our converter is incredibly fast—providing near-instant results the moment you input your values.</p>

    <div class="my-6 space-y-4">
      <p class="font-bold text-text">How it works (Implementation Example):</p>
      <pre class="bg-bg border border-border p-4 rounded-xl overflow-x-auto text-[13px]">
<code class="text-blue">
// Basic currency conversion logic in JavaScript
function convertCurrency(amount, fromRate, toRate) {
  // 1. Convert source amount to base (usually USD)
  const amountInBase = amount / fromRate;
  
  // 2. Convert base amount to target currency
  const result = amountInBase * toRate;
  
  return result.toFixed(2);
}

// Example: 100 USD to INR (assuming 1 USD = 83.00 INR)
console.log(convertCurrency(100, 1.0, 83.00)); // "8300.00"
</code>
      </pre>
    </div>

    <p>We prioritize privacy and efficiency. Unlike many banking apps that track your financial activities, this tool is purely functional. It fetches the latest mid-market exchange rates and performs all conversion math locally within your browser. You can use it as a quick reference guide whenever you need to understand the relative value of one currency against another, ensuring you stay empowered in the global marketplace.</p>
  `,
  howTo: [
    "<strong>Choose Currencies:</strong> Select your 'From' (source) and 'To' (target) currencies using the intuitive dropdown menus.",
    "<strong>Input Amount:</strong> Enter the numerical amount you wish to convert.",
    "<strong>Instantly Convert:</strong> The platform will display the converted value based on the latest mid-market exchange rate immediately.",
    "<strong>Swap Quickly:</strong> Use the convenient swap icon to toggle between your chosen source and target currencies with a single click.",
  ],
  faq: [
    {
      question: "How current are the exchange rates?",
      answer: "Rates are fetched from a trusted, live financial API and are updated periodically throughout the day. However, market rates are highly volatile.",
    },
    {
      question: "Can I use this for real banking transactions?",
      answer: "No. This tool is for informational and planning purposes only. Financial institutions often include hidden margins and fees in their rates that are not reflected in mid-market figures.",
    },
    {
      question: "Does it work if I am offline?",
      answer: "If you have an internet connection, the tool will fetch the latest rates. If you are offline, it will use the last cached rates available in your browser memory for your convenience.",
    },
    {
      question: "Why do bank rates differ from these results?",
      answer: "Banks and money transfer services typically charge a spread (a markup) on the mid-market rate. Always check your bank's specific exchange rate page for the exact cost of a transaction.",
    },
  ],
  useCases: [
    "Planning travel budgets by converting local currency to your home currency.",
    "Comparing the cost of international goods on global e-commerce websites.",
    "Quickly checking currency values for international freelance invoice preparation.",
    "Calculating real-time value of international investments or savings.",
  ],
  examples: [
    {
      input: "1,000 USD to INR",
      output: "Approximately 83,000 INR (varies by market)",
      description: "A common conversion for travelers or those tracking international remittances."
    },
    {
      input: "500 EUR to GBP",
      output: "Approximately 425 GBP",
      description: "Quick calculation for intra-European or UK-based travel planning."
    }
  ],
  commonErrors: [
    {
      error: "The rate is slightly different from what I see on Google",
      fix: "Exchange rates are constantly fluctuating. Even a one-minute difference in data fetch times can cause minor variations between different providers.",
    },
    {
      error: "Specific exotic currency not found",
      fix: "While we support over 150 currencies, very rare or local-only currencies might not be included in our primary feed. Check the search box in the dropdown for the specific currency code.",
    },
  ],
  alternatives: ["XE.com", "Google Currency Converter", "OANDA Converter"],
};
