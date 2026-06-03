import { generateToolMetadata } from "@/src/lib/seo";
import dynamic from "next/dynamic";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import { Metadata } from "next";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const toolId = "color-palette-extractor";

export const metadata: Metadata = generateToolMetadata(toolId);

const ColorPaletteExtractorClient = dynamic(() => import("./ColorPaletteExtractorClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function ColorPaletteExtractorPage() {
  const cat = CATEGORIES.find(c => c.id === "image")!;

  return (
    <ToolShell
      toolId={toolId}
      title="Color Palette Extractor"
      description="Extract dominant colors from any image."
      category={cat}
    >
      <ColorPaletteExtractorClient />
    </ToolShell>
  );
}
