import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import ExtractImagesClientWrapper from "./ExtractImagesClientWrapper";

export const metadata: Metadata = generateToolMetadata("extract-images");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="Extract Images"
      description="Extract all embedded images from a PDF file."
      category={cat}
    >
      <ExtractImagesClientWrapper />
    </ToolShell>
  );
}
