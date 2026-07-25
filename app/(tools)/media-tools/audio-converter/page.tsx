import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import AudioConverterClientWrapper from "./AudioConverterClientWrapper";

const toolId = "audio-converter";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function AudioConverterPage() {
  const cat = CATEGORIES.find(c => c.id === "media")!;
  return (
    <ToolShell
      title="Audio Converter"
      description="Convert audio files between WAV, MP3, and more locally in your browser. Fast, private, and secure."
      category={cat}
      toolId={toolId}
    >
      <AudioConverterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-audio"
          title="How it Works: Offline Audio Contexts"
          preview="Learn how your browser can process audio without an external server."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              In the past, converting audio required uploading a file to a remote server, where a tool like FFmpeg would transcode it, and then you would download the result. This tool performs the conversion entirely within your browser using the <strong>Web Audio API</strong>.
            </p>
            <h3>OfflineAudioContext</h3>
            <p>
              When you play a sound in the browser, it uses a standard <code>AudioContext</code>, which processes audio in real-time synced to your computer's audio hardware.
            </p>
            <p>
              For converting files, we use an <code>OfflineAudioContext</code>. Instead of sending the audio to your speakers, it renders the audio graph as fast as your CPU can handle and outputs it directly into a raw <code>AudioBuffer</code> in memory.
            </p>
            <p>
              Once we have this raw, uncompressed PCM buffer, we pass it to an encoder (like LAME for MP3) compiled to WebAssembly. The encoder compresses the raw data back down into the requested format, all happening at native speeds directly on your device.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
