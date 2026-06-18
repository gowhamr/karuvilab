import QRCodeGeneratorClientWrapper from "./QRCodeGeneratorClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("qrcode");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "utilities")!;
  return (
    <ToolShell
      title="QR Code Generator"
      description="Generate QR codes from any URL or text. Processing is 100% local — no internet access required."
      category={cat}
    >
      <QRCodeGeneratorClientWrapper />
    </ToolShell>
  );
}
