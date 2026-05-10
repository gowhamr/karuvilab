import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester | KaruviLab",
  description: "Test and debug regular expressions with live match highlighting and capture group details.",
  keywords: ["regex tester", "regular expression tester", "regex debugger", "regex match", "regexp"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
