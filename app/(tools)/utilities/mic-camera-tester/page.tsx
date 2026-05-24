import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import MicCameraTesterClient from "./MicCameraTesterClient";

import { generateToolMetadata } from "@/src/lib/seo";

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
      <MicCameraTesterClient />
    </ToolShell>
  );
}
