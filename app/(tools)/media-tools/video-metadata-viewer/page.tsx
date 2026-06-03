import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "video-metadata-viewer";

const VideoMetadataViewerClient = dynamic(() => import("@/src/features/video-metadata-viewer/components/VideoMetadataViewerClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function VideoMetadataViewerPage() {
  const cat = CATEGORIES.find(c => c.id === "media")!;
  return (
    <ToolShell
      title="Video Metadata Viewer"
      description="Inspect video resolution, codec, bitrate, and duration instantly without uploading. 100% private and local."
      category={cat}
      toolId={toolId}
    >
      <VideoMetadataViewerClient />
    </ToolShell>
  );
}
