import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import ImageResizerClientWrapper from "./ImageResizerClientWrapper";

export const metadata: Metadata = generateToolMetadata("image-resizer");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Image Resizer"
      description="Resize images to exact dimensions with aspect ratio lock."
      category={cat}
    >
      <ImageResizerClientWrapper />
    </ToolShell>
  );
}
