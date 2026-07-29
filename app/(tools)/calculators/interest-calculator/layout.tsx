import type { Metadata } from "next";

// STD-04: layout.tsx required per route segment — consistent with compound-interest sibling
export const metadata: Metadata = {
  title: "Interest Calculator | KV",
  description: "Calculate simple interest on any principal amount. Enter principal, rate, and duration to instantly see total interest earned and final amount.",
  keywords: ["simple interest", "interest calculator", "investment calculator", "savings interest"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
