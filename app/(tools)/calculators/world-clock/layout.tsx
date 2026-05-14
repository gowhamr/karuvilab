import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "World Clock | KV",
  description: "View current time across multiple time zones worldwide. Compare times across cities instantly.",
  keywords: ["world clock", "time zones", "international time", "timezone converter", "city time"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
