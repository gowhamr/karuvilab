import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "mic-camera-tester";
const category = CATEGORIES.find(c => c.id === "utilities")!;

const MicCameraTesterClient = dynamic(() => import("./MicCameraTesterClient"), { ssr: false, loading: () => <ToolSkeleton /> });

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
