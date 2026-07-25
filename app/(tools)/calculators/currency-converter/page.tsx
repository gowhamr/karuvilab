import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import CurrencyConverterClientWrapper from "./CurrencyConverterClientWrapper";

export const metadata: Metadata = generateToolMetadata("currency-converter");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Currency Converter"
      description="Convert between major world currencies with live market rates and offline support."
      category={cat}
      toolId="currency-converter"
    >
      <CurrencyConverterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-fiat"
          title="How it Works: Floating Exchange Rates"
          preview="Learn why currency values fluctuate constantly and how this tool fetches them."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Before 1971, the value of the US Dollar was fixed to the price of gold, and many global currencies were fixed to the US Dollar. Today, almost all major currencies operate on a <strong>Floating Exchange Rate</strong>.
            </p>
            <h3>Market Dynamics</h3>
            <p>
              The value of a currency (like the Euro) is determined entirely by supply and demand in the Foreign Exchange (Forex) market. If international investors want to buy European stocks, they must first buy Euros, driving the price of the Euro up relative to their home currency.
            </p>
            <h3>How this Tool Works</h3>
            <p>
              Because rates change every second, it is impossible to hardcode them into the application. Instead, this tool performs an <strong>API Fetch</strong>.
            </p>
            <ol>
              <li>The tool sends an HTTP request to a financial data provider.</li>
              <li>The provider responds with a JSON payload containing the current exchange rates (usually pegged against a base currency like USD).</li>
              <li>The tool uses simple cross-multiplication to convert your requested amount.</li>
            </ol>
            <p>
              To respect API rate limits (and to allow the tool to work if you lose internet connection), the tool aggressively <strong>caches</strong> the results in your browser's LocalStorage for a set period. If you go offline, it will use the last known good rates and clearly display when they were fetched.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
