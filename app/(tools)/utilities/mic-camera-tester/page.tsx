import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import MicCameraTesterClientWrapper from "./MicCameraTesterClientWrapper";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

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

      <LearningHub title="Understanding Media Devices and WebRTC">
        
        <LearningSection type="architecture" title="The MediaDevices API">
          <p>When you join a Zoom or Google Meet call, the web application needs to capture your raw camera and microphone data. On the web, this is accomplished using the <code>navigator.mediaDevices.getUserMedia()</code> API.</p>
        </LearningSection>
        
        <LearningSection type="security" title="Permissions and Privacy Constraints">
          <p>Because accessing a user's camera is a massive privacy risk, this API is strictly gated by the browser architecture.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Explicit Consent:</strong> A website can never turn on your hardware without presenting an OS-level permission dialog.</li>
            <li><strong>HTTPS Only:</strong> The browser requires the website to be served over an encrypted connection (HTTPS). If a site is loaded over HTTP, the API is completely disabled to prevent attackers on public Wi-Fi from intercepting the raw video stream.</li>
          </ul>
        </LearningSection>

        <LearningSection type="api" title="Local vs Remote Streams">
          <p>In a real video call, the MediaStream captured from your camera is attached to a WebRTC Peer Connection, which encodes and transmits the video over the internet to other participants.</p>
          <p className="mt-2">This testing tool <strong>does not do that</strong>. It requests access to your devices, but routes the stream directly back to the HTML <code>&lt;video&gt;</code> element on your screen. Because the stream never leaves your device's RAM, there is zero network latency, and your privacy is mathematically guaranteed.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What happens if a website tries to access your camera using 'getUserMedia()' over an unencrypted HTTP connection?",
                options: [
                  "The browser warns you but allows it.",
                  "The video is transmitted in lower quality.",
                  "The browser completely disables the API, throwing an error before the permission prompt even appears.",
                  "The camera turns on, but only in black and white."
                ],
                correctIndex: 2,
                explanation: "To protect against man-in-the-middle attacks on public networks, browsers mandate that powerful APIs (like cameras and geolocation) are only accessible in Secure Contexts (HTTPS)."
              },
              {
                question: "Why does this specific testing tool have 'zero latency'?",
                options: [
                  "Because KaruviLab servers are incredibly fast.",
                  "Because it uses 5G technology.",
                  "Because it bypasses the operating system.",
                  "Because the video stream is never sent over a network; it is routed directly from the camera hardware to the screen's memory buffer."
                ],
                correctIndex: 3,
                explanation: "By avoiding WebRTC transmission, the tool operates entirely locally, meaning the only delay is the time it takes the screen to draw the pixels."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
