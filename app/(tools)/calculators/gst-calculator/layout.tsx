import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GST Calculator | KV",
  description: "Add or remove GST from any amount instantly. Supports all GST slabs: 5%, 12%, 18%, and 28%.",
  keywords: ["gst calculator", "goods and services tax", "gst india", "tax calculator", "inclusive exclusive gst"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
