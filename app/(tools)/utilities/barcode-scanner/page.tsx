import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import BarcodeScannerClientWrapper from "./BarcodeScannerClientWrapper";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

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

      <LearningHub title="Understanding Browser Hardware APIs">
        
        <LearningSection type="architecture" title="The Legacy WASM Approach">
          <p>In the past, scanning a QR code in a web application required downloading a massive WebAssembly (WASM) payload that ran a slow JavaScript port of a C++ image processing library (like ZXing).</p>
          <p className="mt-2">This approach drained the device's battery rapidly, caused UI stuttering by blocking the main thread, and was often too slow to use comfortably on low-end mobile devices.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Shape Detection API">
          <p>This tool utilizes the modern <strong>Barcode Detection API</strong> (part of the experimental Web Shape Detection API).</p>
          <p className="mt-2">Instead of trying to run complex image processing algorithms in Javascript, the browser passes the raw video frame directly down to the underlying operating system (like the iOS Vision framework or Android ML Kit).</p>
        </LearningSection>

        <LearningSection type="performance" title="Hardware Acceleration">
          <p>By utilizing the OS-level APIs, the browser can tap into the device's native hardware acceleration and Neural Processing Units (NPUs). This allows the device to instantly identify and decode 1D (UPC/EAN) and 2D (QR) barcodes with near-zero performance overhead, drawing almost no extra battery power.</p>
        </LearningSection>

        <LearningSection type="security" title="Privacy by Design">
          <p>Because the decoding happens directly via native APIs inside your browser, the video stream from your camera is <strong>never</strong> sent over the network.</p>
          <p className="mt-2">This is critical for enterprise security. If a user scans a QR code containing an auth token or Wi-Fi password, they are guaranteed that the payload stays entirely on their physical device.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is the modern Barcode Detection API significantly faster than older JavaScript libraries?",
                options: [
                  "Because it compresses the image before sending it to the server.",
                  "Because it offloads the image processing to the underlying operating system (like iOS Vision or Android ML Kit), utilizing native hardware acceleration.",
                  "Because JavaScript is faster than C++.",
                  "Because it only scans in black and white."
                ],
                correctIndex: 1,
                explanation: "The Shape Detection API acts as a bridge. The browser doesn't do the math; it simply hands the image to the OS, which uses dedicated hardware to find the barcode instantly."
              },
              {
                question: "Where is the video stream sent to be processed?",
                options: [
                  "To KaruviLab's backend servers.",
                  "To Google's Cloud Vision API.",
                  "Nowhere. The stream never leaves the device.",
                  "To a decentralized peer-to-peer network."
                ],
                correctIndex: 2,
                explanation: "Privacy is a core feature of the Web Shape Detection API. All processing happens locally on the user's silicon."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
