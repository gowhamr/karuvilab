import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grammar Checker | KaruviLab",
  description: "Spot common grammatical errors, spelling mistakes, and writing issues instantly.",
  keywords: ["grammar checker", "spell checker", "writing checker", "grammar tool", "proofreading"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
