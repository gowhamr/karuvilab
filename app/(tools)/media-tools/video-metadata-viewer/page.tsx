import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

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

      <LearningHub title="Understanding Video Containers vs Codecs">
        
        <LearningSection type="architecture" title="The Common Confusion">
          <p>When a video fails to play, the first thing to check is its metadata. People often confuse the file extension with the actual video format. In reality, a video file is composed of two distinct parts: a <strong>Container</strong> and a <strong>Codec</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Container (MP4, MKV, MOV)">
          <p>Extensions like <code>.mp4</code>, <code>.mkv</code>, and <code>.mov</code> represent the container. Think of a container as a ZIP archive.</p>
          <p className="mt-2">It holds multiple streams of data together (a video stream, an audio stream, and sometimes subtitle streams) and keeps them perfectly synchronized during playback. The container format does <strong>not</strong> dictate how the video itself is compressed.</p>
        </LearningSection>

        <LearningSection type="performance" title="The Codec (H.264, VP9, HEVC)">
          <p>The <strong>Codec</strong> (Coder/Decoder) is the algorithm used to actually compress the massive amounts of video data. Common codecs include:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>H.264 (AVC):</strong> The gold standard. Widely supported on nearly every device built in the last 15 years.</li>
            <li><strong>H.265 (HEVC):</strong> High efficiency, creates much smaller files than H.264, but has heavy licensing restrictions causing poor browser support.</li>
            <li><strong>VP9 / AV1:</strong> Open-source, royalty-free codecs used heavily by Google and YouTube.</li>
          </ul>
        </LearningSection>

        <LearningSection type="security" title="Why Playback Fails">
          <p>If a browser can read an MP4 container, but the video inside is encoded with H.265, the browser may play the audio but show a black screen because it lacks the license or hardware to decode the H.265 video stream.</p>
          <p className="mt-2">This tool uses a WASM build of FFprobe to parse the container headers locally and instantly tell you exactly which codec is inside, helping you debug playback issues.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary role of a video 'Container' (like .mp4 or .mkv)?",
                options: [
                  "To compress the video data into a smaller file size.",
                  "To bundle and synchronize different streams (video, audio, subtitles) into a single file.",
                  "To increase the resolution to 4K.",
                  "To add DRM protection."
                ],
                correctIndex: 1,
                explanation: "A container is just a wrapper. It multiplexes the compressed audio and video streams together so the player knows how to keep lip-sync accurate."
              },
              {
                question: "Why might a .mp4 video play perfectly on an iPhone but show a black screen (with audio) on a Windows desktop browser?",
                options: [
                  "The file is corrupted.",
                  "Windows doesn't support .mp4 files.",
                  "The container is MP4, but the internal video Codec (e.g., HEVC) is not supported or licensed by the desktop browser.",
                  "The video is too large."
                ],
                correctIndex: 2,
                explanation: "Browsers often support the MP4 container format, but they might legally or technically lack the decoder for the specific compression algorithm (codec) used inside it."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
