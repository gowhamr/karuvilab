import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safe-to-Spend Calculator | KaruviLab",
  description: "Calculate your safe daily spending budget based on your income, bills, and savings goals.",
  keywords: ["safe to spend", "budget calculator", "daily budget", "spending budget", "personal finance"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
