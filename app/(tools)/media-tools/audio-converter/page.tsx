import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "audio-converter";

const AudioConverterClient = dynamic(() => import("@/src/features/audio-converter/components/AudioConverterClient"), { ssr: false, loading: () => <ToolSkeleton /> });

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
      <AudioConverterClient />
    </ToolShell>
  );
}
