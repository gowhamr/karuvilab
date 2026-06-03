import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "gif-creator";

const GifCreatorClient = dynamic(() => import("@/src/features/gif-creator/components/GifCreatorClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function GifCreatorPage() {
  const cat = CATEGORIES.find(c => c.id === "media")!;
  return (
    <ToolShell
      title="GIF Creator"
      description="Create high-quality animated GIFs from images locally in your browser. Fast, private, and customizable."
      category={cat}
      toolId={toolId}
    >
      <GifCreatorClient />
    </ToolShell>
  );
}
