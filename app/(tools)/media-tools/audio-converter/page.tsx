import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

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

      <LearningHub title="Understanding Offline Audio Contexts">
        
        <LearningSection type="architecture" title="The Shift to Client-Side Processing">
          <p>In the past, converting audio required uploading a file to a remote server, where a tool like FFmpeg would transcode it, and then you would download the result. This was slow, expensive to host, and terrible for privacy.</p>
          <p className="mt-2">This tool performs the conversion entirely within your browser using the <strong>Web Audio API</strong> combined with WebAssembly (WASM).</p>
        </LearningSection>
        
        <LearningSection type="api" title="AudioContext vs OfflineAudioContext">
          <p>When you play a sound in the browser, it uses a standard <code>AudioContext</code>. This processes audio in real-time, perfectly synced to your computer's audio hardware clock so you hear it smoothly.</p>
          <p className="mt-2">For converting files, we use an <code>OfflineAudioContext</code>. Instead of sending the audio to your speakers, it renders the audio graph as fast as your CPU can handle—often much faster than real-time—and outputs it directly into a raw <code>AudioBuffer</code> in memory.</p>
        </LearningSection>

        <LearningSection type="performance" title="WASM Encoding">
          <p>Once we have this raw, uncompressed PCM (Pulse-Code Modulation) buffer, we pass it to an encoder (like LAME for MP3) that has been compiled to WebAssembly.</p>
          <p className="mt-2">The WebAssembly encoder runs at near-native C++ speeds directly on your device, compressing the raw data back down into the requested format without ever sending a single byte over the network.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary difference between a standard AudioContext and an OfflineAudioContext?",
                options: [
                  "OfflineAudioContext only works without an internet connection.",
                  "OfflineAudioContext renders audio as fast as possible into memory instead of playing it in real-time to the speakers.",
                  "AudioContext requires a server backend.",
                  "OfflineAudioContext can only process mono audio."
                ],
                correctIndex: 1,
                explanation: "OfflineAudioContext is designed for processing and rendering, allowing the CPU to convert a 5-minute song in just a few seconds without playing it out loud."
              },
              {
                question: "Why is WebAssembly (WASM) heavily used in browser-based media converters?",
                options: [
                  "Because it allows running highly optimized C/C++ encoders (like LAME or FFmpeg) at near-native speeds in the browser.",
                  "Because JavaScript cannot read binary files.",
                  "Because WebAssembly reduces the file size of the MP3.",
                  "Because it bypasses CORS restrictions."
                ],
                correctIndex: 0,
                explanation: "Audio/Video encoding requires massive amounts of heavy mathematical computation. WASM allows browsers to execute pre-compiled C++ code much faster than pure JavaScript."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
