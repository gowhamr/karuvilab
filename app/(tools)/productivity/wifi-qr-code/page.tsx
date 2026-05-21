import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import WifiQrCodeClient from "./WifiQrCodeClient";

const toolId = "wifi-qr-code";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = {
  title: "WiFi QR Code Generator — KaruviLab",
  description: "Share your WiFi network securely with a QR code. Fast, private, and works on all devices.",
};

export default function WifiQrCodePage() {
  return (
    <ToolShell
      title="WiFi QR Code Generator"
      description="Create a QR code that anyone can scan to connect to your WiFi network instantly. No manual typing required."
      category={category}
      toolId={toolId}
    >
      <WifiQrCodeClient />
    </ToolShell>
  );
}
