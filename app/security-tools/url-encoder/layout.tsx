import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder | KaruviLab",
  description: "Percent-encode and decode URLs and query string parameters for safe use in web requests.",
  keywords: ["url encoder", "url decoder", "percent encode", "url encode decode", "query string encoder"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
