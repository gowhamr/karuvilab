import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

export const metadata: Metadata = generateToolMetadata("image-compress");

const ImageCompressorClient = dynamic(
  () => import("@/src/features/image-compressor/components/ImageCompressorClient"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Image Compressor"
      description="Professional image optimization tool. 100% private, browser-based compression."
      category={cat}
    >
      <ImageCompressorClient />
    </ToolShell>
  );
}
