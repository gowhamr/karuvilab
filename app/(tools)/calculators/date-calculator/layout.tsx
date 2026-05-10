import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Date Calculator | KaruviLab",
  description: "Add or subtract days from any date, or find the exact number of days between two dates.",
  keywords: ["date calculator", "days between dates", "date difference", "add days to date"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
