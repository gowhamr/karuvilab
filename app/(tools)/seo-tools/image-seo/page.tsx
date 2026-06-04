import ImageSeoClientWrapper from "./ImageSeoClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("image-seo");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="Image SEO Tool"
      description="Generate SEO-friendly alt text and filenames for your images."
      category={cat}
    >
      <ImageSeoClientWrapper />
    </ToolShell>
  );
}
