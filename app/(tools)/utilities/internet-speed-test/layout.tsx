import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internet Speed Tester | KaruviLab",
  description: "Measure your internet connection speed — download, upload, and ping latency. 100% browser-side measurement.",
  keywords: ["speed test", "internet speed", "wifi speed", "ping", "latency", "network test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
