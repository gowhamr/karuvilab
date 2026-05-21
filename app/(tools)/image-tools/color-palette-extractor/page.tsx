import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const toolId = "color-palette-extractor";
const ColorPaletteClient = dynamic(() => import("./ColorPaletteExtractorClient"), {
  loading: () => <div className="w-full h-[60vh] bg-surface rounded-3xl animate-pulse" />,
});

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ColorPaletteExtractorPage() {
  const cat = CATEGORIES.find(c => c.id === 'image-tools')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Color Palette Extractor"
      description="Extract dominant colors from any image."
      category={cat}
    >
      <ColorPaletteClient />
    </ToolShell>
  );
}
