import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discount Calculator | KaruviLab",
  description: "Find the sale price, discount amount, and actual savings for any percentage off deal.",
  keywords: ["discount calculator", "sale price", "percentage off", "savings calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
