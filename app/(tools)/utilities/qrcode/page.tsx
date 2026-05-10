import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const QRCodeGeneratorClient = dynamic(() => import("./QRCodeGeneratorClient"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("qrcode");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "utilities")!;
  return (
    <ToolShell
      title="QR Code Generator"
      description="Generate QR codes from any URL or text. Uses a public API — requires internet access."
      category={cat}
    >
      <QRCodeGeneratorClient />
    </ToolShell>
  );
}
