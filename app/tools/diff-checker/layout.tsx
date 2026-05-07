import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diff Checker | KaruviLab",
  description: "Compare two text snippets side by side and instantly highlight added, removed, and changed lines.",
  keywords: ["diff checker", "text compare", "text diff", "compare text", "code diff"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
