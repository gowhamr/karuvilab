import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compound Interest Calculator | KaruviLab",
  description: "Calculate compound interest growth over time. Customize compounding frequency and see how your money grows.",
  keywords: ["compound interest", "compound interest calculator", "interest calculator", "savings calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
