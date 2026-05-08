import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Generator | KaruviLab",
  description: "Generate strong, random passwords with custom length, uppercase, numbers, and symbols.",
  keywords: ["password generator", "random password", "strong password", "secure password", "password maker"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
