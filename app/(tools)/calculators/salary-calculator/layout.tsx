import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indian Salary Calculator | KV",
  description: "Calculate Indian CTC take-home salary with HRA, PF, income tax, and all deductions broken down clearly.",
  keywords: ["salary calculator", "ctc calculator", "take home salary", "india salary", "income tax calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
