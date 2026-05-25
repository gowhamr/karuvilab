import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import { Metadata } from "next";
import ColorPaletteExtractorClientWrapper from "./ColorPaletteExtractorClientWrapper";

const toolId = "color-palette-extractor";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ColorPaletteExtractorPage() {
  const cat = CATEGORIES.find(c => c.id === "image")!;

  return (
    <ToolShell
      toolId={toolId}
      title="Color Palette Extractor"
      description="Extract dominant colors from any image."
      category={cat}
    >
      <ColorPaletteExtractorClientWrapper />
    </ToolShell>
  );
}
