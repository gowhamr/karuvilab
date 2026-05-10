import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Percentage Calculator | KaruviLab",
  description: "Calculate percentages, percentage change, and what percent one number is of another.",
  keywords: ["percentage calculator", "percent calculator", "percentage change", "percent of number"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
