import SlugGeneratorClientWrapper from "./SlugGeneratorClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("slug-generator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="Slug Generator"
      description="Convert any text to URL-safe slugs with customizable options."
      category={cat}
    >
      <SlugGeneratorClientWrapper />
    </ToolShell>
  );
}
