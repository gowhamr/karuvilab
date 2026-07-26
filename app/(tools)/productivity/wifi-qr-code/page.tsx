import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
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

      <LearningHub title="Understanding Wi-Fi QR Codes">
        
        <LearningSection type="architecture" title="The Wi-Fi String Standard">
          <p>A QR code is just a visual representation of text. When your phone scans a Wi-Fi QR code, it doesn't do anything magical—it simply reads a hidden text string formatted according to a specific standard established by ZXing.</p>
          <p className="mt-2">The format looks like this: <code>WIFI:S:MyNetworkName;T:WPA;P:MyPassword;;</code></p>
          <p className="mt-2">Your phone's camera app detects the <code>WIFI:</code> prefix and immediately knows to hand the data over to the operating system's Wi-Fi manager instead of opening a web browser.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Error Correction (Reed-Solomon)">
          <p>QR codes use an advanced mathematical concept called <strong>Reed-Solomon Error Correction</strong>. This allows a QR code to be scanned successfully even if it is partially damaged, dirty, or if you place a custom logo right in the middle of it.</p>
          <p className="mt-2">When generating a code, you can select the Error Correction Level (L, M, Q, H). Level L allows ~7% damage recovery but keeps the code small and simple. Level H allows up to ~30% damage recovery, but the resulting QR code will be very dense and complex.</p>
        </LearningSection>

        <LearningSection type="failures" title="The Hidden Network Trap">
          <p>If your router is configured to "hide" its SSID (network name), phones will not connect to it even if they scan the correct QR code. To fix this, the QR code standard includes a hidden flag: <code>H:true;</code>. If this flag isn't appended to the string, the phone's OS will assume the network is broadcasting and fail to find it.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What does the raw text inside a standard Wi-Fi QR code actually look like?",
                options: [
                  "https://wifi.com/connect?ssid=MyNetwork",
                  "{ ssid: 'MyNetwork', password: 'pass' }",
                  "WIFI:S:MyNetwork;T:WPA;P:MyPassword;;",
                  "It is a proprietary encrypted binary file."
                ],
                correctIndex: 2,
                explanation: "The QR code simply encodes a plain text string following the WIFI: prefix standard."
              },
              {
                question: "How can a QR code still work perfectly even if you put a logo right in the middle of it?",
                options: [
                  "Because the logo is transparent to lasers.",
                  "Because of Reed-Solomon Error Correction, which adds mathematical redundancy to the data.",
                  "Because phones download the missing data from the internet.",
                  "Because the middle of a QR code doesn't store any data."
                ],
                correctIndex: 1,
                explanation: "Error correction algorithms deliberately encode redundant data so that the original message can be mathematically reconstructed even if large parts of the code are obscured."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
