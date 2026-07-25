import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-barcode"
          title="How it Works: Hardware Accelerated Scanning"
          preview="Learn how modern browsers use native OS APIs to instantly decode QR codes."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              In the past, scanning a QR code in a web application meant loading a massive WebAssembly (WASM) library that ran a slow JavaScript port of a C++ image processing library. It drained the battery and was often too slow to use on mobile devices.
            </p>
            <h3>The Shape Detection API</h3>
            <p>
              This tool utilizes the modern <strong>Barcode Detection API</strong> (part of the experimental Web Shape Detection API). Instead of running image processing in Javascript, the browser passes the video frame directly to the underlying operating system (like iOS Vision framework or Android ML Kit).
            </p>
            <p>
              By utilizing the device's native hardware acceleration and Neural Processing Units (NPUs), the API can instantly identify and decode 1D and 2D barcodes with zero performance overhead.
            </p>
            <h3>Privacy First</h3>
            <p>
              Because the decoding happens directly via native APIs in your browser, the video stream is never sent over the network. Your camera data stays entirely on your device.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
