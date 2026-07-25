import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import VideoMetadataViewerClientWrapper from "./VideoMetadataViewerClientWrapper";

const toolId = "video-metadata-viewer";

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
      <VideoMetadataViewerClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-video"
          title="How it Works: Containers vs Codecs"
          preview="Learn the difference between MP4, H.264, and why your video might not play."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When a video fails to play, the first thing to check is its metadata. People often confuse the file extension with the actual video format. In reality, a video file is composed of two distinct parts: a <strong>Container</strong> and a <strong>Codec</strong>.
            </p>
            <h3>The Container</h3>
            <p>
              Extensions like <code>.mp4</code>, <code>.mkv</code>, and <code>.mov</code> represent the container. Think of a container as a ZIP file. It holds multiple streams of data together (a video stream, an audio stream, and sometimes subtitle streams) and keeps them synchronized. It does not dictate how the video itself is compressed.
            </p>
            <h3>The Codec</h3>
            <p>
              The <strong>Codec</strong> (Coder/Decoder) is the algorithm used to actually compress the video data. Common codecs include <strong>H.264</strong> (widely supported), <strong>H.265 / HEVC</strong> (high efficiency, but limited browser support), and <strong>VP9</strong> (used heavily by YouTube). 
            </p>
            <p>
              If a browser can read an MP4 container, but the video inside is encoded with H.265, the browser may play the audio but show a black screen because it lacks the license or hardware to decode the H.265 video stream. This tool parses the container headers locally to instantly tell you exactly which codec is inside.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
