import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import ImageCropClientWrapper from "./ImageCropClientWrapper";

export const metadata: Metadata = generateToolMetadata("image-crop");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Image Crop"
      description="Crop images to exact dimensions or preset aspect ratios."
      category={cat}
    >
      <ImageCropClientWrapper />
    </ToolShell>
  );
}
