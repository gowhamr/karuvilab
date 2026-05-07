import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slug Generator | KaruviLab",
  description: "Convert titles and phrases into URL-friendly slugs for cleaner, SEO-optimized URLs.",
  keywords: ["slug generator", "url slug", "seo url", "permalink generator", "url friendly"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
