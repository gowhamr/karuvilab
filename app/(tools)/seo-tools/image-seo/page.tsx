import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const ImageSeoClient = dynamic(() => import("./ImageSeoClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("image-seo");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="Image SEO Tool"
      description="Generate SEO-friendly alt text and filenames for your images."
      category={cat}
    >
      <ImageSeoClient />
    </ToolShell>
  );
}
