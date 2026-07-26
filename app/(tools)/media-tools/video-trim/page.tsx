import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

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

      <LearningHub title="Understanding Video Compression">
        
        <LearningSection type="architecture" title="The Size Problem">
          <p>If a video is 60 frames per second, and lasts for just 10 minutes, that's 36,000 individual images. If we stored every single image as a full JPEG, the file size would be hundreds of gigabytes. To solve this, video codecs use <strong>Inter-frame Compression</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="I-Frames (Keyframes)">
          <p>An <strong>I-Frame</strong> (Intra-coded frame) is a complete, standalone image. It contains all the data needed to display that specific frame, independent of any other data. Because they contain so much data, they are placed sparingly by the encoder, usually once every 2 to 10 seconds.</p>
        </LearningSection>

        <LearningSection type="performance" title="P-Frames & B-Frames">
          <p>The vast majority of frames in between the I-Frames are called <strong>P-Frames</strong> (Predicted frames) and <strong>B-Frames</strong> (Bi-directional predicted frames).</p>
          <p className="mt-2">Instead of storing a full image, they only store the <em>mathematical differences</em> from the previous or next I-Frame. If the camera is still and a person is talking, the P-Frame only records the movement of their mouth, while the background data is completely omitted to save space.</p>
        </LearningSection>

        <LearningSection type="security" title="The Trimming Problem">
          <p>If you try to cut a video exactly at a P-Frame using a lossless cutter (without re-encoding), the video player will crash or show a severely glitched, grey screen. This happens because that frame doesn't contain a full image—it relies on the data from the I-Frame that you just chopped off.</p>
          <p className="mt-2">This is why "lossless" cutting tools will sometimes snap your trim markers slightly forward or backward: they <strong>must</strong> snap to the nearest I-Frame to ensure the resulting file starts with a complete image.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is an I-Frame in video compression?",
                options: [
                  "An Internet Frame designed for streaming.",
                  "A complete, standalone image frame that doesn't rely on data from any other frame.",
                  "A frame that only stores the differences from the previous frame.",
                  "A frame format created by Apple."
                ],
                correctIndex: 1,
                explanation: "I-Frames (Intra-coded frames) act as the anchor points of video compression. They are full images that P-frames and B-frames base their predictions on."
              },
              {
                question: "Why do lossless video trimmers sometimes refuse to cut a video at the exact millisecond you requested?",
                options: [
                  "Because they are trying to sync with the audio track.",
                  "Because the requested cut point is a P-Frame, which requires the missing I-Frame data to render properly.",
                  "Because browsers limit the precision of video cutting to whole seconds.",
                  "Because the file size would be too small."
                ],
                correctIndex: 1,
                explanation: "You cannot start a video file with a P-Frame, because it only contains 'difference' data. A video must always start with an I-Frame."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
