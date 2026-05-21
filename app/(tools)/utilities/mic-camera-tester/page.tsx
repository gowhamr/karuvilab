import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import MicCameraTesterClient from "./MicCameraTesterClient";

const toolId = "mic-camera-tester";
const category = CATEGORIES.find(c => c.id === "utilities")!;

export const metadata: Metadata = {
  title: "Mic & Camera Tester — KaruviLab",
  description: "Securely test your microphone and webcam privately in your browser. No data leaves your device.",
};

export default function MicCameraTesterPage() {
  return (
    <ToolShell
      title="Mic & Camera Tester"
      description="Check your video and audio quality before your next meeting. High-performance, low-latency, and 100% private."
      category={category}
      toolId={toolId}
    >
      <MicCameraTesterClient />
    </ToolShell>
  );
}
