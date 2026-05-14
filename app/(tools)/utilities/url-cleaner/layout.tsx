import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Cleaner | KV",
  description: "Remove UTM tracking parameters and other clutter from URLs for clean, shareable links.",
  keywords: ["url cleaner", "remove utm", "clean url", "url tracker remover", "url shortener"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
