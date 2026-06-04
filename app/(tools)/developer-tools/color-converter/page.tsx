import ColorConverterClientWrapper from "./ColorConverterClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import { Metadata } from "next";

const toolId = "color-converter";


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
      <ColorConverterClientWrapper />
    </ToolShell>
  );
}
