import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import BarcodeScannerClientWrapper from "./BarcodeScannerClientWrapper";

const toolId = "barcode-scanner";
const category = CATEGORIES.find(c => c.id === "utilities")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function BarcodeScannerPage() {
  return (
    <ToolShell
      title="Barcode & QR Scanner"
      description="Instantly read QR codes, UPC, EAN, and other barcodes using your device's camera or by uploading an image. No data is ever sent to a server."
      category={category}
      toolId={toolId}
    >
      <BarcodeScannerClientWrapper />
    </ToolShell>
  );
}
