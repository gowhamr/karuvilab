import ImageConverterClientWrapper from "./ImageConverterClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("image-converter");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Image Converter"
      description="Convert images between JPG, PNG, WebP, and BMP formats in your browser."
      category={cat}
    >
      <ImageConverterClientWrapper />
    </ToolShell>
  );
}
