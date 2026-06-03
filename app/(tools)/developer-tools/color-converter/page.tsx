import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const toolId = "color-converter";
const ColorConverterClient = dynamic(() => import("./ColorConverterClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ColorConverterPage() {
  const cat = CATEGORIES.find(c => c.id === 'developer')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Color Converter & Picker"
      description="Convert colors between HEX, RGB, HSL, HSV, and CMYK formats. Includes a color picker and live preview."
      category={cat}
    >
      <ColorConverterClient />
    </ToolShell>
  );
}
