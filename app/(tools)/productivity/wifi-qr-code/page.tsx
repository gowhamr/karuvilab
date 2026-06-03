import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import WifiQrCodeClient from "./WifiQrCodeClient";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "wifi-qr-code";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = generateToolMetadata(toolId);

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
