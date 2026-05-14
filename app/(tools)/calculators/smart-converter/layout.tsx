import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Unit Converter | KV",
  description: "Convert units using natural language. Type '5 miles in km' or '100 USD in INR' for instant results.",
  keywords: ["smart converter", "unit converter", "natural language converter", "unit conversion"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
