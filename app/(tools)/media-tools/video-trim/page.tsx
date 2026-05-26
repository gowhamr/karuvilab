import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import VideoTrimClientWrapper from "./VideoTrimClientWrapper";

const toolId = "video-trim";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function VideoTrimPage() {
  const cat = CATEGORIES.find(c => c.id === "media")!;
  return (
    <ToolShell
      title="Video Trimmer"
      description="Cut and trim MP4, WebM, or MOV videos locally in your browser. Fast, private, and zero quality loss."
      category={cat}
      toolId={toolId}
    >
      <VideoTrimClientWrapper />
    </ToolShell>
  );
}
