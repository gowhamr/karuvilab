import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Currency Converter | KaruviLab",
  description: "Convert between world currencies with real-time exchange rates. Supports USD, EUR, INR, GBP, and 150+ currencies.",
  keywords: ["currency converter", "exchange rate", "forex", "usd to inr", "currency exchange"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
