import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Robots.txt Generator | KV",
  description: "Generate a robots.txt file to control which pages search engine crawlers can access.",
  keywords: ["robots.txt generator", "robots txt", "crawl rules", "seo robots", "disallow crawl"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
