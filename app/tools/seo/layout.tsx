import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Analyzer | KaruviLab",
  description: "Analyze on-page SEO factors including title length, meta description, headings, and keywords.",
  keywords: ["seo analyzer", "on-page seo", "seo checker", "seo audit", "website seo"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
