import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Title & Description Checker | KV",
  description: "Preview and optimize your page title and meta description in a Google SERP simulation.",
  keywords: ["seo title checker", "meta description checker", "serp preview", "title tag optimizer"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
