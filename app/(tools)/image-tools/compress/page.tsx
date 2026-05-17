import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import ImageCompressorClientWrapper from "../image-compressor/ImageCompressorClientWrapper";

export const metadata: Metadata = generateToolMetadata("image-compress");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Image Compressor"
      description="Professional image optimization tool. 100% private, browser-based compression."
      category={cat}
    >
      <ImageCompressorClientWrapper />
    </ToolShell>
  );
}
