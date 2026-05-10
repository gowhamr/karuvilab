import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const ImageCompressorClient = dynamic(() => import("./ImageCompressorClient"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("compress");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Image Compressor"
      description="Compress images in your browser using canvas — no upload needed."
      category={cat}
    >
      <ImageCompressorClient />
    </ToolShell>
  );
}
