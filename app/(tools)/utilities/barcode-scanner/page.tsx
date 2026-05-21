import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import BarcodeScannerClient from "./BarcodeScannerClient";

const toolId = "barcode-scanner";
const category = CATEGORIES.find(c => c.id === "utilities")!;

export const metadata: Metadata = {
  title: "Barcode & QR Scanner — KaruviLab",
  description: "Scan barcodes and QR codes directly from your browser. Secure, private, and fast.",
};

export default function BarcodeScannerPage() {
  return (
    <ToolShell
      title="Barcode & QR Scanner"
      description="Instantly read QR codes, UPC, EAN, and other barcodes using your device's camera or by uploading an image. No data is ever sent to a server."
      category={category}
      toolId={toolId}
    >
      <BarcodeScannerClient />
    </ToolShell>
  );
}
