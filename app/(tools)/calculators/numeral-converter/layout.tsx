import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Numeral & Encoding Converter | KV",
  description: "Universal encoding converter. Paste hex, binary, Base64, URL-encoded, HTML entities, Unicode escapes, or plain text. Auto-detect format and convert to all others instantly.",
  keywords: ["numeral converter", "encoding converter", "hex to text", "binary to text", "base64 decode", "percent encoding"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
