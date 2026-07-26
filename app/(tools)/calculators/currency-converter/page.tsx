import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
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

      <LearningHub title="Understanding Foreign Exchange">
        
        <LearningSection type="architecture" title="Floating Exchange Rates">
          <p>Before 1971, the value of the US Dollar was fixed to the physical price of gold, and many global currencies were fixed to the US Dollar. Today, almost all major fiat currencies operate on a <strong>Floating Exchange Rate</strong>.</p>
          <p className="mt-2">The value of a currency (like the Euro) is determined entirely by real-time supply and demand in the global Foreign Exchange (Forex) market. If international investors want to buy European stocks, they must first buy Euros, driving the price of the Euro up relative to their home currency.</p>
        </LearningSection>
        
        <LearningSection type="api" title="API Integrations">
          <p>Because currency rates change every second during market hours, it is impossible to hardcode them into an application. Instead, this tool performs an <strong>API Fetch</strong>.</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>The tool sends an HTTP request to a financial data provider.</li>
            <li>The provider responds with a JSON payload containing the current exchange rates (usually pegged against a base currency like USD).</li>
            <li>The tool uses simple cross-multiplication to convert your requested amount between any two currencies in the payload.</li>
          </ol>
        </LearningSection>

        <LearningSection type="performance" title="Offline Capabilities & Caching">
          <p>To respect API rate limits and to ensure the tool remains usable even if you lose your internet connection (e.g., while traveling internationally), the tool aggressively <strong>caches</strong> the API response in your browser's LocalStorage.</p>
          <p className="mt-2">If the network request fails, the tool falls back to the last known good rates and explicitly displays the timestamp of when those rates were fetched, allowing you to estimate conversions while completely offline.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How is the exchange rate between the US Dollar and the Euro determined today?",
                options: [
                  "By the amount of gold held in the Federal Reserve.",
                  "By real-time supply and demand in the global Foreign Exchange (Forex) market.",
                  "By an annual treaty signed by the United Nations.",
                  "By the World Bank setting a fixed daily price."
                ],
                correctIndex: 1,
                explanation: "Most major currencies float freely against one another based purely on market demand."
              },
              {
                question: "Why does this tool cache the exchange rates in LocalStorage?",
                options: [
                  "To track which currencies you convert most often.",
                  "Because it is required by the HTTP standard.",
                  "To allow the tool to function when you are offline (like on an airplane or traveling without cell service) by using the most recent data.",
                  "To make the application bundle size smaller."
                ],
                correctIndex: 2,
                explanation: "Caching the last fetched JSON payload allows the client to perform the cross-multiplication math locally even without a network connection."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
