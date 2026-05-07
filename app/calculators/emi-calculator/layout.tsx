import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI Calculator | KaruviLab",
  description: "Calculate your monthly loan EMI, total interest payable, and view a full amortization schedule. Works for home, car, and personal loans.",
  keywords: ["emi calculator", "loan emi", "equated monthly installment", "home loan", "car loan", "amortization"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
