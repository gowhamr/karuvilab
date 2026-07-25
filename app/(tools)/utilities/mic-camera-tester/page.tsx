import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import MicCameraTesterClientWrapper from "./MicCameraTesterClientWrapper";

const toolId = "mic-camera-tester";
const category = CATEGORIES.find(c => c.id === "utilities")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function MicCameraTesterPage() {
  return (
    <ToolShell
      title="Mic & Camera Tester"
      description="Check your video and audio quality before your next meeting. High-performance, low-latency, and 100% private."
      category={category}
      toolId={toolId}
    >
      <MicCameraTesterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-webrtc"
          title="How it Works: The MediaDevices API"
          preview="Learn how your browser accesses your hardware without sending your video to a server."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you join a Zoom or Google Meet call, the application needs to capture your raw camera and microphone data. On the web, this is done using the <code>navigator.mediaDevices.getUserMedia()</code> API.
            </p>
            <h3>Permissions and Privacy</h3>
            <p>
              This API is strictly gated by the browser. A website can never turn on your camera without explicit permission. Furthermore, the browser requires the website to be served over <strong>HTTPS</strong>; if it's not encrypted, the API is completely disabled to prevent attackers on public Wi-Fi from intercepting the stream.
            </p>
            <h3>Local vs Remote Streams</h3>
            <p>
              This tool requests access to your devices, but it never attaches the resulting MediaStream to a WebRTC Peer Connection (which would send it over the internet). Instead, it simply routes the stream directly to an HTML <code>&lt;video&gt;</code> element on your screen.
            </p>
            <p>
              Because the stream never leaves your device, there is zero latency, and your privacy is 100% guaranteed. When you close the tab, the hardware is instantly released by the browser.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
