import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-video-compression"
          title="How it Works: I-Frames vs P-Frames"
          preview="Learn how video compression actually works and why you can't always cut a video exactly where you want."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              If a video is 60 frames per second, and lasts for 10 minutes, that's 36,000 individual images. If we stored every single image, the file size would be hundreds of gigabytes. To solve this, video codecs use <strong>Inter-frame Compression</strong>.
            </p>
            <h3>I-Frames (Keyframes)</h3>
            <p>
              An <strong>I-Frame</strong> (Intra-coded frame) is a complete image. It contains all the data needed to display that specific frame, just like a JPEG. Because they contain so much data, they are placed sparingly, usually once every few seconds.
            </p>
            <h3>P-Frames & B-Frames</h3>
            <p>
              The frames in between the I-Frames are called <strong>P-Frames</strong> (Predicted frames) and <strong>B-Frames</strong> (Bi-directional predicted frames). Instead of storing a full image, they only store the <em>differences</em> from the previous or next I-Frame. If the camera is still and a person is talking, the P-Frame only records the movement of their mouth, while the background is completely omitted to save space.
            </p>
            <h3>The Trimming Problem</h3>
            <p>
              If you try to cut a video at a P-Frame, the video player will crash or show a glitched screen, because that frame doesn't contain a full image—it relies on an I-Frame that you just deleted. This is why "lossless" cutting tools will sometimes snap your trim markers slightly forward or backward: they must snap to the nearest I-Frame.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
