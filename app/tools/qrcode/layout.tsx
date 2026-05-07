import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator | KaruviLab",
  description: "Create QR codes for URLs, plain text, and Wi-Fi credentials. Download as PNG instantly.",
  keywords: ["qr code generator", "qrcode", "qr code maker", "url qr code", "wifi qr code"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
