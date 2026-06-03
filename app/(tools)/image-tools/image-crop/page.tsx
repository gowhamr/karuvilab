import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

export const metadata: Metadata = generateToolMetadata("image-crop");

const ImageCropClient = dynamic(() => import("./ImageCropClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Image Crop"
      description="Crop images to exact dimensions or preset aspect ratios."
      category={cat}
    >
      <ImageCropClient />
    </ToolShell>
  );
}
