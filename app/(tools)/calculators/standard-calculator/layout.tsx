import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standard Calculator | KaruviLab",
  description: "A fast, clean calculator for quick arithmetic — addition, subtraction, multiplication, and division.",
  keywords: ["calculator", "online calculator", "standard calculator", "arithmetic calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
